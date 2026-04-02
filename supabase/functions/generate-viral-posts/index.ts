import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BrandContext {
  name: string;
  domain: string;
  tagline: string;
  voice?: string;
  recentWins?: string;
  personalStory?: string;
}

interface GenerateRequest {
  action: "generate_main" | "generate_variations" | "refine";
  brand: BrandContext;
  template?: string;
  platform?: string;
  existingPost?: string;
  customInstructions?: string;
}

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";

async function callGrok(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = Deno.env.get("XAI_API_KEY");
  if (!apiKey) {
    throw new Error("XAI_API_KEY not configured");
  }

  const res = await fetch(XAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-3-mini-fast",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Grok API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function buildBrandContextBlock(brand: BrandContext): string {
  return [
    `Brand: ${brand.name}`,
    `Domain: ${brand.domain}`,
    brand.tagline ? `Tagline: ${brand.tagline}` : "",
    brand.voice ? `Voice: ${brand.voice}` : "",
    brand.recentWins ? `Recent wins: ${brand.recentWins}` : "",
    brand.personalStory ? `Personal story seed: ${brand.personalStory}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function generateMain(
  brand: BrandContext,
  template: string,
  platform: string,
  customInstructions?: string
): Promise<object> {
  const brandBlock = buildBrandContextBlock(brand);

  const systemPrompt = `You are a world-class social media ghostwriter who creates viral ${platform} posts.
You write in an authentic founder voice — direct, human, zero corporate speak.
Every post you write follows proven viral structures and is optimized for maximum engagement.

RULES:
- Under 280 words for LinkedIn, under 280 chars for X, under 2200 chars for Instagram
- Bold hook in the first 1–2 lines (pattern interrupt)
- One idea per line break, short punchy sentences
- Include a soft CTA at the end (drive comments or DMs)
- No hashtags unless specifically for Instagram
- No emojis unless brand voice explicitly uses them
- Sound like a real human founder, not a marketing bot

Respond ONLY with valid JSON. No markdown fences, no commentary.`;

  const userPrompt = `BRAND CONTEXT:
${brandBlock}

TEMPLATE TO USE:
${template}

TARGET PLATFORM: ${platform}
${customInstructions ? `\nADDITIONAL INSTRUCTIONS: ${customInstructions}` : ""}

Generate a viral ${platform} post using the template above and the brand context.

Return JSON in this exact format:
{
  "post": "the full post text with line breaks as \\n",
  "hook_type": "question|bold_claim|story|stat|contrarian",
  "estimated_engagement": "high|medium|low",
  "engagement_score": 8,
  "reasoning": "brief explanation of why this structure works"
}`;

  const raw = await callGrok(systemPrompt, userPrompt);
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { post: raw, hook_type: "unknown", estimated_engagement: "medium", engagement_score: 7, reasoning: "Raw output" };
  }
}

async function generateVariations(
  brand: BrandContext,
  existingPost: string,
  platform: string
): Promise<object> {
  const brandBlock = buildBrandContextBlock(brand);

  const systemPrompt = `You are a world-class social media content strategist.
You take a proven post and create 7 distinct variations, each with a different angle and structure.
Every variation must maintain the same core message and brand voice but feel fresh and unique.

Respond ONLY with valid JSON. No markdown fences, no commentary.`;

  const userPrompt = `BRAND CONTEXT:
${brandBlock}

ORIGINAL POST:
${existingPost}

TARGET PLATFORM: ${platform}

Create exactly 7 variations of this post:

1. Story-first: Lead with a personal narrative
2. Stat + question hook: Open with a surprising number and a question
3. Thread format: 5-part thread (numbered 1/ through 5/)
4. Short video script: 30-second script with [VISUAL] cues
5. Carousel slides: 5 slide titles with captions
6. Repost-style: New angle on the same idea, as if resharing
7. Bold contrarian take: Challenge conventional wisdom

Return JSON:
{
  "variations": [
    {
      "type": "story_first",
      "label": "Story-First",
      "post": "full post text with \\n for line breaks",
      "engagement_score": 8
    }
  ]
}`;

  const raw = await callGrok(systemPrompt, userPrompt);
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { variations: [], error: "Failed to parse variations" };
  }
}

async function refinePost(
  brand: BrandContext,
  existingPost: string
): Promise<object> {
  const brandBlock = buildBrandContextBlock(brand);

  const systemPrompt = `You are a ruthless editor who polishes social media posts to perfection.
You apply strict quality rules and score the result honestly.

REFINEMENT RULES:
1. Remove ALL fluff and corporate speak
2. Add one bold line break every 2–3 sentences
3. Ensure hook is in first 3 lines
4. End with clear, low-friction CTA (comment/DM)
5. Read aloud test: must sound like a human founder
6. Score: Engagement Potential (1–10) with explanation

Respond ONLY with valid JSON. No markdown fences, no commentary.`;

  const userPrompt = `BRAND CONTEXT:
${brandBlock}

POST TO REFINE:
${existingPost}

Apply all refinement rules. Return JSON:
{
  "refined_post": "the polished post text with \\n for line breaks",
  "engagement_score": 9,
  "changes_made": ["removed corporate jargon", "strengthened hook", "added CTA"],
  "read_aloud_pass": true,
  "reasoning": "explanation of score"
}`;

  const raw = await callGrok(systemPrompt, userPrompt);
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { refined_post: existingPost, engagement_score: 5, changes_made: [], read_aloud_pass: false, reasoning: "Failed to parse" };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: GenerateRequest = await req.json();
    const { action, brand, template, platform = "LinkedIn", existingPost, customInstructions } = body;

    if (!brand?.name || !brand?.domain) {
      return new Response(
        JSON.stringify({ error: "Brand name and domain are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result: object;

    switch (action) {
      case "generate_main":
        result = await generateMain(brand, template || "Hook + Story + Insight + CTA", platform, customInstructions);
        break;
      case "generate_variations":
        if (!existingPost) {
          return new Response(
            JSON.stringify({ error: "existingPost is required for variations" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await generateVariations(brand, existingPost, platform);
        break;
      case "refine":
        if (!existingPost) {
          return new Response(
            JSON.stringify({ error: "existingPost is required for refinement" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await refinePost(brand, existingPost);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
