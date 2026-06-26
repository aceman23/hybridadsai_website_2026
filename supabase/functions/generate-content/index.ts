import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { prompt, max_tokens = 1500, use_web_search = false } =
      await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'prompt' field" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body: Record<string, unknown> = {
      model: "claude-sonnet-4-6",
      max_tokens,
      messages: [{ role: "user", content: prompt }],
    };

    if (use_web_search) {
      body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2025-04-15",
      },
      body: JSON.stringify(body),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      return new Response(
        JSON.stringify({
          error: `Anthropic API error: ${anthropicRes.status}`,
          details: errBody,
        }),
        {
          status: anthropicRes.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await anthropicRes.json();

    const textBlock = data.content?.find(
      (b: { type: string }) => b.type === "text"
    );
    const text = textBlock?.text?.trim() || "";

    return new Response(JSON.stringify({ text, usage: data.usage }), {
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
