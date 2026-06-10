import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await anonClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let { data: customer } = await supabase
      .from("gtm_customers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // If payment is still pending, verify directly with Stripe
    if (
      customer &&
      customer.payment_status === "pending" &&
      customer.stripe_session_id
    ) {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          customer.stripe_session_id
        );
        if (session.payment_status === "paid") {
          const tier =
            session.metadata?.tier === "growth" ? "growth" : "starter";
          const credits = tier === "growth" ? 8000 : 3000;

          await supabase
            .from("gtm_customers")
            .update({
              payment_status: "paid",
              workspace_status: "active",
              stripe_customer_id: (session.customer as string) || null,
              credits_remaining: credits,
            })
            .eq("user_id", user.id);

          // Insert payment record if not already present
          const { data: existingPayment } = await supabase
            .from("gtm_payments")
            .select("id")
            .eq("stripe_session_id", session.id)
            .maybeSingle();

          if (!existingPayment) {
            await supabase.from("gtm_payments").insert({
              user_id: user.id,
              stripe_session_id: session.id,
              amount_cents:
                session.amount_total ||
                (tier === "growth" ? 29900 : 14900),
              status: "completed",
            });
          }

          // Create initial campaign if none exists
          const { data: existingCampaigns } = await supabase
            .from("gtm_campaigns")
            .select("id")
            .eq("user_id", user.id)
            .limit(1);

          if (!existingCampaigns || existingCampaigns.length === 0) {
            const campaignName =
              tier === "growth" ? "Growth Campaign" : "My First Campaign";
            await supabase.from("gtm_campaigns").insert({
              user_id: user.id,
              name: campaignName,
              status: "draft",
            });
          }

          // Re-fetch updated customer
          const { data: updated } = await supabase
            .from("gtm_customers")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          if (updated) customer = updated;
        }
      } catch (stripeErr) {
        console.error("Stripe verification fallback error:", stripeErr);
      }
    }

    const { data: campaigns } = await supabase
      .from("gtm_campaigns")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return new Response(
      JSON.stringify({ customer, campaigns: campaigns || [] }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
