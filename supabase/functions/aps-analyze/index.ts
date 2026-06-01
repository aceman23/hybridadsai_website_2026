import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const NOT_AVAILABLE = "Not Available";

const FIELDS = ["name", "address", "phone", "primary_category", "secondary_category", "website"] as const;
type Field = typeof FIELDS[number];
type FieldStatus = "consistent" | "inconsistent" | "not_available";
type Platform = "openai" | "gemini" | "copilot" | "grok" | "perplexity";

interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  primary_category: string;
  secondary_category: string;
  website: string;
}

interface PlatformResult {
  platform: Platform;
  data: BusinessInfo;
  scores: Record<Field, FieldStatus>;
  percentage: number;
}

interface AnalysisReport {
  url: string;
  groundTruth: BusinessInfo;
  results: PlatformResult[];
  overallScore: number;
  generatedAt: string;
  isDemo: boolean;
}

const DEMO_GROUND_TRUTH: BusinessInfo = {
  name: "Hybrid Ads",
  address: "1234 Wilshire Blvd, Los Angeles, CA 90025",
  phone: "(485) 555-0192",
  primary_category: "Digital Marketing Agency",
  secondary_category: "AI Advertising Technology",
  website: "hybridads.ai",
};

const DEMO_AI_RESPONSES: Record<Platform, BusinessInfo> = {
  openai: { name: NOT_AVAILABLE, address: NOT_AVAILABLE, phone: NOT_AVAILABLE, primary_category: NOT_AVAILABLE, secondary_category: NOT_AVAILABLE, website: NOT_AVAILABLE },
  gemini: { name: NOT_AVAILABLE, address: NOT_AVAILABLE, phone: NOT_AVAILABLE, primary_category: NOT_AVAILABLE, secondary_category: NOT_AVAILABLE, website: NOT_AVAILABLE },
  copilot: { name: NOT_AVAILABLE, address: NOT_AVAILABLE, phone: NOT_AVAILABLE, primary_category: NOT_AVAILABLE, secondary_category: NOT_AVAILABLE, website: NOT_AVAILABLE },
  grok: { name: "Hybrid Ads", address: "1234 Wilshire Blvd, Los Angeles, CA 90025", phone: NOT_AVAILABLE, primary_category: "Digital Marketing Agency", secondary_category: NOT_AVAILABLE, website: "hybridads.ai" },
  perplexity: { name: NOT_AVAILABLE, address: NOT_AVAILABLE, phone: NOT_AVAILABLE, primary_category: NOT_AVAILABLE, secondary_category: NOT_AVAILABLE, website: NOT_AVAILABLE },
};

function scoreField(aiVal: string, gtVal: string): FieldStatus {
  const ai = (aiVal || "").trim().toLowerCase();
  const gt = (gtVal || "").trim().toLowerCase();
  const aiNA = ai === "not available" || ai === "";
  const gtNA = gt === "not available" || gt === "";
  if (aiNA && gtNA) return "consistent";
  if (aiNA && !gtNA) return "not_available";
  if (!aiNA && !gtNA && ai === gt) return "consistent";
  return "inconsistent";
}

function buildResult(platform: Platform, data: BusinessInfo, ground: BusinessInfo): PlatformResult {
  const scores = {} as Record<Field, FieldStatus>;
  for (const f of FIELDS) scores[f] = scoreField(data[f], ground[f]);
  const consistent = FIELDS.filter(f => scores[f] === "consistent").length;
  return { platform, data, scores, percentage: Math.round((consistent / FIELDS.length) * 100) };
}

function buildDemoReport(url: string): AnalysisReport {
  const platforms: Platform[] = ["openai", "gemini", "copilot", "grok", "perplexity"];
  const results = platforms.map(p => buildResult(p, DEMO_AI_RESPONSES[p], DEMO_GROUND_TRUTH));
  const overallScore = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);
  return { url, groundTruth: DEMO_GROUND_TRUTH, results, overallScore, generatedAt: new Date().toISOString(), isDemo: true };
}

function parseJSON(text: string): BusinessInfo {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return { ...NA_BUSINESS };
    const p = JSON.parse(match[0]);
    return {
      name: p.name || NOT_AVAILABLE,
      address: p.address || NOT_AVAILABLE,
      phone: p.phone || NOT_AVAILABLE,
      primary_category: p.primary_category || NOT_AVAILABLE,
      secondary_category: p.secondary_category || NOT_AVAILABLE,
      website: p.website || NOT_AVAILABLE,
    };
  } catch {
    return { ...NA_BUSINESS };
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function retryFetch(fn: () => Promise<BusinessInfo>, retries = 2): Promise<BusinessInfo> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch {
      if (i === retries) return { ...NA_BUSINESS };
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
  return { ...NA_BUSINESS };
}

async function fetchSiteHTML(url: string): Promise<string> {
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  const res = await fetchWithTimeout(normalized, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; HybridAdsBot/1.0)" },
  }, 15000);
  return (await res.text()).slice(0, 15000);
}

async function extractGroundTruth(html: string, url: string, key: string): Promise<BusinessInfo> {
  const res = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `From this website HTML, extract ONLY JSON with keys: name, address, phone, primary_category, secondary_category, website. Use "Not Available" for missing fields. Prioritize schema.org/LocalBusiness JSON-LD. Respond ONLY with valid JSON.\n\nURL: ${url}\nHTML:\n${html.slice(0, 6000)}` }],
      temperature: 0,
      max_tokens: 350,
    }),
  }, 20000);
  const d = await res.json();
  return parseJSON(d.choices?.[0]?.message?.content || "{}");
}

async function queryOpenAI(url: string, key: string): Promise<BusinessInfo> {
  const prompt = `A user asked about the business at: ${url}. Based on your training data, respond ONLY with valid JSON (no markdown): {"name":"","address":"","phone":"","primary_category":"","secondary_category":"","website":""}. Use "Not Available" for unknown fields.`;
  const res = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0, max_tokens: 300 }),
  }, 20000);
  return parseJSON((await res.json()).choices?.[0]?.message?.content || "{}");
}

async function queryGemini(url: string, key: string): Promise<BusinessInfo> {
  const prompt = `A user asked about the business at: ${url}. Based on your knowledge, respond ONLY with valid JSON (no markdown): {"name":"","address":"","phone":"","primary_category":"","secondary_category":"","website":""}. Use "Not Available" for unknown fields.`;
  const res = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0, maxOutputTokens: 300 } }),
  }, 20000);
  return parseJSON((await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || "{}");
}

async function queryCopilot(url: string, key: string): Promise<BusinessInfo> {
  const prompt = `A user asked about the business at: ${url}. Based on your knowledge, respond ONLY with valid JSON (no markdown): {"name":"","address":"","phone":"","primary_category":"","secondary_category":"","website":""}. Use "Not Available" for unknown fields.`;
  const res = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "system", content: "You are Microsoft Copilot." }, { role: "user", content: prompt }], temperature: 0, max_tokens: 300 }),
  }, 20000);
  return parseJSON((await res.json()).choices?.[0]?.message?.content || "{}");
}

async function queryGrok(url: string, key: string): Promise<BusinessInfo> {
  const prompt = `A user asked about the business at: ${url}. Based on your knowledge, respond ONLY with valid JSON (no markdown): {"name":"","address":"","phone":"","primary_category":"","secondary_category":"","website":""}. Use "Not Available" for unknown fields.`;
  const res = await fetchWithTimeout("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "grok-beta", messages: [{ role: "user", content: prompt }], temperature: 0, max_tokens: 300 }),
  }, 20000);
  return parseJSON((await res.json()).choices?.[0]?.message?.content || "{}");
}

async function queryPerplexity(url: string, key: string): Promise<BusinessInfo> {
  const prompt = `A user asked about the business at: ${url}. Based on your knowledge, respond ONLY with valid JSON (no markdown): {"name":"","address":"","phone":"","primary_category":"","secondary_category":"","website":""}. Use "Not Available" for unknown fields.`;
  const res = await fetchWithTimeout("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "llama-3.1-sonar-small-128k-online", messages: [{ role: "user", content: prompt }], temperature: 0, max_tokens: 300 }),
  }, 20000);
  return parseJSON((await res.json()).choices?.[0]?.message?.content || "{}");
}

const NA_BUSINESS: BusinessInfo = { name: NOT_AVAILABLE, address: NOT_AVAILABLE, phone: NOT_AVAILABLE, primary_category: NOT_AVAILABLE, secondary_category: NOT_AVAILABLE, website: NOT_AVAILABLE };

async function safeQuery(fn: () => Promise<BusinessInfo>): Promise<BusinessInfo> {
  try { return await fn(); } catch { return NA_BUSINESS; }
}

async function runLiveAnalysis(url: string): Promise<AnalysisReport> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
  const geminiKey = Deno.env.get("GEMINI_API_KEY") || "";
  const xaiKey = Deno.env.get("XAI_API_KEY") || "";
  const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY") || "";

  const groundTruth = await retryFetch(async () => {
    const html = await fetchSiteHTML(url);
    return await extractGroundTruth(html, url, openaiKey);
  }, 2);
  if (groundTruth.website === NOT_AVAILABLE) groundTruth.website = url;

  const [openaiData, geminiData, copilotData, grokData, perplexityData] = await Promise.all([
    safeQuery(() => queryOpenAI(url, openaiKey)),
    geminiKey ? safeQuery(() => queryGemini(url, geminiKey)) : Promise.resolve(NA_BUSINESS),
    safeQuery(() => queryCopilot(url, openaiKey)),
    xaiKey ? safeQuery(() => queryGrok(url, xaiKey)) : Promise.resolve(NA_BUSINESS),
    perplexityKey ? safeQuery(() => queryPerplexity(url, perplexityKey)) : Promise.resolve(NA_BUSINESS),
  ]);

  const platforms: Platform[] = ["openai", "gemini", "copilot", "grok", "perplexity"];
  const datas = [openaiData, geminiData, copilotData, grokData, perplexityData];
  const results = platforms.map((p, i) => buildResult(p, datas[i], groundTruth));
  const overallScore = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);

  return { url, groundTruth, results, overallScore, generatedAt: new Date().toISOString(), isDemo: false };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
    const isDemo = !openaiKey || openaiKey === "placeholder_add_your_key";

    const report = isDemo ? buildDemoReport(url.trim()) : await runLiveAnalysis(url.trim());

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
