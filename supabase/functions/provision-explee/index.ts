import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const EXPLEE_BASE_URL = "https://api.explee.com/public/api/v1";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { tier, explee_api_key, icp_description } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify the user has paid
    const { data: customer, error: customerError } = await supabase
      .from("gtm_customers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (customerError || !customer) {
      return new Response(
        JSON.stringify({ error: "GTM account not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (customer.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Payment required before provisioning" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine Explee API key source
    let finalApiKey = explee_api_key || customer.explee_api_key;
    let expleeCustId = customer.explee_customer_id;
    let provisionMethod: "manual" | "master_key" = "manual";

    // If no user-provided key, attempt to provision via master key
    if (!finalApiKey) {
      const masterKey = Deno.env.get("EXPLEE_MASTER_KEY");
      if (masterKey) {
        provisionMethod = "master_key";
        try {
          const provisionRes = await fetch(`${EXPLEE_BASE_URL}/accounts`, {
            method: "POST",
            headers: {
              "X-API-Key": masterKey,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: customer.email,
              name: customer.full_name,
              plan: tier === "growth" ? "growth" : "starter",
            }),
          });

          if (provisionRes.ok) {
            const provisionData = await provisionRes.json();
            finalApiKey = provisionData.api_key || provisionData.apiKey;
            expleeCustId = provisionData.id || provisionData.customer_id;
          } else {
            const errBody = await provisionRes.text();
            console.error("Explee provisioning failed:", provisionRes.status, errBody);
            return new Response(
              JSON.stringify({
                error: "Failed to provision Explee account",
                details: `Explee responded with ${provisionRes.status}`,
                requires_manual_key: true,
              }),
              { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } catch (fetchErr) {
          console.error("Explee provisioning network error:", fetchErr);
          return new Response(
            JSON.stringify({
              error: "Could not reach Explee API",
              requires_manual_key: true,
            }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        return new Response(
          JSON.stringify({
            error: "No Explee API key provided and no master key configured",
            requires_manual_key: true,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Store the key and activate the account
    const dailyBudget = tier === "growth" ? 25 : 10;
    const updatePayload: Record<string, unknown> = {
      explee_api_key: finalApiKey,
      explee_status: "active",
      daily_budget: dailyBudget,
    };
    if (expleeCustId) updatePayload.explee_customer_id = expleeCustId;
    if (icp_description) updatePayload.icp_description = icp_description;

    const { error: updateError } = await supabase
      .from("gtm_customers")
      .update(updatePayload)
      .eq("user_id", user.id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to update customer record", details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Optionally kick off an initial search/agent run if ICP is provided
    let initialRun = null;
    const icpText = icp_description || customer.icp_description || customer.icp_definition;
    if (icpText && finalApiKey) {
      try {
        const searchRes = await fetch(`${EXPLEE_BASE_URL}/searches`, {
          method: "POST",
          headers: {
            "X-API-Key": finalApiKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: icpText,
            daily_budget: dailyBudget,
          }),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          initialRun = searchData;

          // Record as a campaign
          await supabase.from("gtm_campaigns").insert({
            user_id: user.id,
            name: "Initial Prospect Search",
            icp_definition: icpText,
            status: "active",
            explee_run_id: searchData.id || searchData.run_id || null,
            prospects_found: 0,
            emails_sent: 0,
          });

          // Update last campaign run timestamp
          await supabase
            .from("gtm_customers")
            .update({ last_campaign_run: new Date().toISOString() })
            .eq("user_id", user.id);
        }
      } catch (searchErr) {
        console.error("Initial Explee search failed:", searchErr);
        // Non-fatal: account is still provisioned
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        provision_method: provisionMethod,
        explee_status: "active",
        daily_budget: dailyBudget,
        explee_customer_id: expleeCustId || null,
        initial_run: initialRun,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
