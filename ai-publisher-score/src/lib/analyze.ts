import type { AnalysisReport, BusinessInfo, FieldStatus, PlatformResult } from './types';
import { FIELDS, PLATFORMS } from './types';

const NOT_AVAILABLE_TEXT = 'Not Available';

async function fetchWebsiteText(url: string): Promise<string> {
  const normalized = url.startsWith('http') ? url : `https://${url}`;
  const res = await fetch(normalized, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HybridAdsBot/1.0)' },
    signal: AbortSignal.timeout(10000),
  });
  const html = await res.text();
  return html.slice(0, 20000);
}

async function extractGroundTruth(html: string, url: string, openaiKey: string): Promise<BusinessInfo> {
  const prompt = `From this website HTML, extract ONLY a JSON object with these exact keys: name, address, phone, primary_category, secondary_category, website. Use "Not Available" for any field you cannot find. Prioritize schema.org/LocalBusiness JSON-LD data if present. Respond ONLY with valid JSON, no markdown, no explanation.

HTML:
${html.slice(0, 8000)}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 400,
    }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    name: parsed.name || NOT_AVAILABLE_TEXT,
    address: parsed.address || NOT_AVAILABLE_TEXT,
    phone: parsed.phone || NOT_AVAILABLE_TEXT,
    primary_category: parsed.primary_category || NOT_AVAILABLE_TEXT,
    secondary_category: parsed.secondary_category || NOT_AVAILABLE_TEXT,
    website: parsed.website || url,
  };
}

async function queryOpenAI(url: string, openaiKey: string): Promise<BusinessInfo> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. When asked about a business, respond only with JSON.' },
        { role: 'user', content: `A user is asking about the business at website: ${url}. Based on your knowledge, respond ONLY with valid JSON (no markdown): {"name": "", "address": "", "phone": "", "primary_category": "", "secondary_category": "", "website": ""}. Use "Not Available" for unknown fields.` },
      ],
      temperature: 0,
      max_tokens: 300,
    }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    name: parsed.name || NOT_AVAILABLE_TEXT,
    address: parsed.address || NOT_AVAILABLE_TEXT,
    phone: parsed.phone || NOT_AVAILABLE_TEXT,
    primary_category: parsed.primary_category || NOT_AVAILABLE_TEXT,
    secondary_category: parsed.secondary_category || NOT_AVAILABLE_TEXT,
    website: parsed.website || NOT_AVAILABLE_TEXT,
  };
}

async function queryGemini(url: string, geminiKey: string): Promise<BusinessInfo> {
  const prompt = `A user is asking about the business at website: ${url}. Based on your knowledge, respond ONLY with valid JSON (no markdown): {"name": "", "address": "", "phone": "", "primary_category": "", "secondary_category": "", "website": ""}. Use "Not Available" for unknown fields.`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0, maxOutputTokens: 300 } }),
    }
  );
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    name: parsed.name || NOT_AVAILABLE_TEXT,
    address: parsed.address || NOT_AVAILABLE_TEXT,
    phone: parsed.phone || NOT_AVAILABLE_TEXT,
    primary_category: parsed.primary_category || NOT_AVAILABLE_TEXT,
    secondary_category: parsed.secondary_category || NOT_AVAILABLE_TEXT,
    website: parsed.website || NOT_AVAILABLE_TEXT,
  };
}

async function queryCopilot(url: string, openaiKey: string): Promise<BusinessInfo> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are Microsoft Copilot. When asked about a business, respond only with JSON.' },
        { role: 'user', content: `A user is asking about the business at website: ${url}. Based on your knowledge, respond ONLY with valid JSON (no markdown): {"name": "", "address": "", "phone": "", "primary_category": "", "secondary_category": "", "website": ""}. Use "Not Available" for unknown fields.` },
      ],
      temperature: 0,
      max_tokens: 300,
    }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    name: parsed.name || NOT_AVAILABLE_TEXT,
    address: parsed.address || NOT_AVAILABLE_TEXT,
    phone: parsed.phone || NOT_AVAILABLE_TEXT,
    primary_category: parsed.primary_category || NOT_AVAILABLE_TEXT,
    secondary_category: parsed.secondary_category || NOT_AVAILABLE_TEXT,
    website: parsed.website || NOT_AVAILABLE_TEXT,
  };
}

async function queryGrok(url: string, xaiKey: string): Promise<BusinessInfo> {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${xaiKey}` },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: 'You are Grok. When asked about a business, respond only with JSON.' },
        { role: 'user', content: `A user is asking about the business at website: ${url}. Based on your knowledge, respond ONLY with valid JSON (no markdown): {"name": "", "address": "", "phone": "", "primary_category": "", "secondary_category": "", "website": ""}. Use "Not Available" for unknown fields.` },
      ],
      temperature: 0,
      max_tokens: 300,
    }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    name: parsed.name || NOT_AVAILABLE_TEXT,
    address: parsed.address || NOT_AVAILABLE_TEXT,
    phone: parsed.phone || NOT_AVAILABLE_TEXT,
    primary_category: parsed.primary_category || NOT_AVAILABLE_TEXT,
    secondary_category: parsed.secondary_category || NOT_AVAILABLE_TEXT,
    website: parsed.website || NOT_AVAILABLE_TEXT,
  };
}

async function queryPerplexity(url: string, perplexityKey: string): Promise<BusinessInfo> {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${perplexityKey}` },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Respond only with JSON when asked about a business.' },
        { role: 'user', content: `A user is asking about the business at website: ${url}. Based on your knowledge, respond ONLY with valid JSON (no markdown): {"name": "", "address": "", "phone": "", "primary_category": "", "secondary_category": "", "website": ""}. Use "Not Available" for unknown fields.` },
      ],
      temperature: 0,
      max_tokens: 300,
    }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    name: parsed.name || NOT_AVAILABLE_TEXT,
    address: parsed.address || NOT_AVAILABLE_TEXT,
    phone: parsed.phone || NOT_AVAILABLE_TEXT,
    primary_category: parsed.primary_category || NOT_AVAILABLE_TEXT,
    secondary_category: parsed.secondary_category || NOT_AVAILABLE_TEXT,
    website: parsed.website || NOT_AVAILABLE_TEXT,
  };
}

function scoreField(aiVal: string, gtVal: string): FieldStatus {
  const ai = (aiVal || '').trim().toLowerCase();
  const gt = (gtVal || '').trim().toLowerCase();
  const aiNA = ai === 'not available' || ai === '';
  const gtNA = gt === 'not available' || gt === '';
  if (aiNA && gtNA) return 'consistent';
  if (aiNA && !gtNA) return 'not_available';
  if (!aiNA && !gtNA && ai === gt) return 'consistent';
  return 'inconsistent';
}

function buildPlatformResult(platform: string, data: BusinessInfo, groundTruth: BusinessInfo): PlatformResult {
  const scores = {} as Record<keyof BusinessInfo, FieldStatus>;
  for (const field of FIELDS) {
    scores[field] = scoreField(data[field], groundTruth[field]);
  }
  const consistent = FIELDS.filter(f => scores[f] === 'consistent').length;
  const percentage = Math.round((consistent / FIELDS.length) * 100);
  return { platform: platform as any, data, scores, percentage };
}

export async function runAnalysis(url: string): Promise<AnalysisReport> {
  const openaiKey = process.env.OPENAI_API_KEY || '';
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const perplexityKey = process.env.PERPLEXITY_API_KEY || '';
  const xaiKey = process.env.XAI_API_KEY || '';

  const hasKeys = openaiKey && openaiKey !== 'placeholder_add_your_key';

  if (!hasKeys) {
    const { getDemoReport } = await import('./demo-data');
    return getDemoReport(url);
  }

  let groundTruth: BusinessInfo;
  try {
    const html = await fetchWebsiteText(url);
    groundTruth = await extractGroundTruth(html, url, openaiKey);
  } catch {
    groundTruth = {
      name: NOT_AVAILABLE_TEXT, address: NOT_AVAILABLE_TEXT, phone: NOT_AVAILABLE_TEXT,
      primary_category: NOT_AVAILABLE_TEXT, secondary_category: NOT_AVAILABLE_TEXT, website: url,
    };
  }

  const [openaiData, geminiData, copilotData, grokData, perplexityData] = await Promise.allSettled([
    queryOpenAI(url, openaiKey),
    geminiKey ? queryGemini(url, geminiKey) : Promise.resolve({ name: NOT_AVAILABLE_TEXT, address: NOT_AVAILABLE_TEXT, phone: NOT_AVAILABLE_TEXT, primary_category: NOT_AVAILABLE_TEXT, secondary_category: NOT_AVAILABLE_TEXT, website: NOT_AVAILABLE_TEXT }),
    queryCopilot(url, openaiKey),
    xaiKey ? queryGrok(url, xaiKey) : Promise.resolve({ name: NOT_AVAILABLE_TEXT, address: NOT_AVAILABLE_TEXT, phone: NOT_AVAILABLE_TEXT, primary_category: NOT_AVAILABLE_TEXT, secondary_category: NOT_AVAILABLE_TEXT, website: NOT_AVAILABLE_TEXT }),
    perplexityKey ? queryPerplexity(url, perplexityKey) : Promise.resolve({ name: NOT_AVAILABLE_TEXT, address: NOT_AVAILABLE_TEXT, phone: NOT_AVAILABLE_TEXT, primary_category: NOT_AVAILABLE_TEXT, secondary_category: NOT_AVAILABLE_TEXT, website: NOT_AVAILABLE_TEXT }),
  ]);

  const getVal = (r: PromiseSettledResult<BusinessInfo>): BusinessInfo =>
    r.status === 'fulfilled' ? r.value : { name: NOT_AVAILABLE_TEXT, address: NOT_AVAILABLE_TEXT, phone: NOT_AVAILABLE_TEXT, primary_category: NOT_AVAILABLE_TEXT, secondary_category: NOT_AVAILABLE_TEXT, website: NOT_AVAILABLE_TEXT };

  const platformData: [string, BusinessInfo][] = [
    ['openai', getVal(openaiData)],
    ['gemini', getVal(geminiData)],
    ['copilot', getVal(copilotData)],
    ['grok', getVal(grokData)],
    ['perplexity', getVal(perplexityData)],
  ];

  const results = platformData.map(([platform, data]) => buildPlatformResult(platform, data, groundTruth));
  const overallScore = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length);

  return {
    url,
    groundTruth,
    results,
    overallScore,
    generatedAt: new Date().toISOString(),
    isDemo: false,
  };
}
