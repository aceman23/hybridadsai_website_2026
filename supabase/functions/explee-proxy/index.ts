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

    // Authenticate the user
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

    // Look up the user's Explee API key and status
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: customer, error: customerError } = await supabase
      .from("gtm_customers")
      .select("explee_api_key, explee_status, credits_remaining, payment_status")
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
        JSON.stringify({ error: "Payment required" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (customer.explee_status === "suspended") {
      return new Response(
        JSON.stringify({ error: "Explee account suspended" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (customer.credits_remaining <= 0) {
      return new Response(
        JSON.stringify({ error: "Insufficient credits" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine API key: user-specific or fall back to master key for provisioning
    const apiKey = customer.explee_api_key || Deno.env.get("EXPLEE_MASTER_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Explee API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { endpoint, method, body } = await req.json();

    if (!endpoint || typeof endpoint !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'endpoint' field" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize endpoint to prevent path traversal
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const targetUrl = `${EXPLEE_BASE_URL}${cleanEndpoint}`;

    // Forward the request to Explee
    const fetchOptions: RequestInit = {
      method: (method || "GET").toUpperCase(),
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (body && fetchOptions.method !== "GET" && fetchOptions.method !== "HEAD") {
      fetchOptions.body = JSON.stringify(body);
    }

    const expleeRes = await fetch(targetUrl, fetchOptions);

    // Handle Explee-specific error codes
    if (expleeRes.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const responseBody = await expleeRes.text();
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(responseBody);
    } catch {
      parsedBody = responseBody;
    }

    return new Response(
      JSON.stringify({
        status: expleeRes.status,
        data: parsedBody,
      }),
      {
        status: expleeRes.ok ? 200 : expleeRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
