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

const PRICE_IDS: Record<string, string> = {
  starter: "price_1TgWpHDfs3f237pkJAKAacEb",
  growth:
    Deno.env.get("STRIPE_GROWTH_PRICE_ID") ||
    "price_1TgWpHDfs3f237pkGrowth299",
};

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

    let tier = "starter";
    try {
      const body = await req.json();
      if (body.tier === "growth") tier = "growth";
    } catch {
      // no body or invalid JSON — default to starter
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

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

    const { data: existing } = await supabase
      .from("gtm_customers")
      .select("id, payment_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing?.payment_status === "paid") {
      return new Response(
        JSON.stringify({ error: "Already paid", redirect: "/#gtm-workspace" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price: PRICE_IDS[tier],
          quantity: 1,
        },
      ],
      metadata: { user_id: user.id, tier },
      success_url: "https://hybridads.ai/#gtm-success",
      cancel_url: "https://hybridads.ai/#gtm-service",
    });

    const fullName =
      user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

    if (existing) {
      await supabase
        .from("gtm_customers")
        .update({
          stripe_session_id: session.id,
          payment_status: "pending",
        })
        .eq("user_id", user.id);
    } else {
      await supabase.from("gtm_customers").insert({
        user_id: user.id,
        full_name: fullName,
        email: user.email,
        stripe_session_id: session.id,
        payment_status: "pending",
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
