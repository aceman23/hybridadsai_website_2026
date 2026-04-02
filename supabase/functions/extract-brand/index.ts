import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateSecondaryColor(primaryHex: string): string {
  try {
    const [h, s, l] = hexToHsl(primaryHex);
    const newH = (h + 40) % 360;
    const newS = Math.min(100, s + 10);
    const newL = Math.min(70, Math.max(30, l));
    return hslToHex(newH, newS, newL);
  } catch {
    return "#06b6d4";
  }
}

function normalizeHex(color: string): string | null {
  color = color.trim().toLowerCase();
  if (color.startsWith("rgb")) {
    const m = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!m) return null;
    const r = parseInt(m[1]).toString(16).padStart(2, "0");
    const g = parseInt(m[2]).toString(16).padStart(2, "0");
    const b = parseInt(m[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  if (color.startsWith("hsl")) {
    const m = color.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (!m) return null;
    return hslToHex(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }
  if (color.startsWith("#")) {
    if (color.length === 4) {
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }
    if (color.length === 7 || color.length === 9) {
      return color.slice(0, 7);
    }
  }
  return null;
}

function isNeutral(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const [, s, l] = hexToHsl(hex);
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  if (maxDiff < 20 && (l > 85 || l < 15)) return true;
  if (s < 10) return true;
  if (l > 92 || l < 8) return true;
  return false;
}

interface ScoredColor {
  hex: string;
  score: number;
  source: string;
}

function extractColors(html: string): ScoredColor[] {
  const scored: ScoredColor[] = [];

  function addColor(raw: string, weight: number, source: string) {
    const hex = normalizeHex(raw);
    if (hex && !isNeutral(hex)) {
      scored.push({ hex, score: weight, source });
    }
  }

  const themeColor =
    html.match(/name=["']theme-color["']\s+content=["']([^"']+)["']/i) ||
    html.match(/content=["']([^"']+)["']\s+name=["']theme-color["']/i);
  if (themeColor) addColor(themeColor[1], 100, "theme-color");

  const tileColor =
    html.match(/name=["']msapplication-TileColor["']\s+content=["']([^"']+)["']/i) ||
    html.match(/content=["']([^"']+)["']\s+name=["']msapplication-TileColor["']/i);
  if (tileColor) addColor(tileColor[1], 90, "tile-color");

  const maskIcon = html.match(/rel=["']mask-icon["'][^>]+color=["']([^"']+)["']/i);
  if (maskIcon) addColor(maskIcon[1], 85, "mask-icon");

  const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const allCss = styleBlocks.map((b) => b.replace(/<\/?style[^>]*>/gi, "")).join("\n");

  const cssVarPatterns = [
    /--(?:primary|brand|main|accent|theme)[-_]?(?:color)?:\s*([^;}\n]+)/gi,
    /--color[-_]?(?:primary|brand|main|accent|theme):\s*([^;}\n]+)/gi,
    /--(?:bs-)?primary:\s*([^;}\n]+)/gi,
    /--(?:wp--preset--color--primary|global--color-primary):\s*([^;}\n]+)/gi,
  ];
  for (const pattern of cssVarPatterns) {
    let m;
    while ((m = pattern.exec(allCss)) !== null) {
      addColor(m[1].trim(), 80, "css-var");
    }
  }

  const inlineVarPatterns = [
    /--(?:primary|brand|main|accent|theme)[-_]?(?:color)?:\s*([^;"\n]+)/gi,
    /--color[-_]?(?:primary|brand|main|accent|theme):\s*([^;"\n]+)/gi,
  ];
  for (const pattern of inlineVarPatterns) {
    let m;
    while ((m = pattern.exec(html)) !== null) {
      addColor(m[1].trim(), 80, "inline-css-var");
    }
  }

  const linkColorMatch = allCss.match(/\ba\s*\{[^}]*color:\s*([^;}\n]+)/i);
  if (linkColorMatch) addColor(linkColorMatch[1].trim(), 60, "link-color");

  const btnBgMatch =
    allCss.match(/\.btn-primary[^{]*\{[^}]*background(?:-color)?:\s*([^;}\n]+)/i) ||
    allCss.match(/\.btn[^{]*\{[^}]*background(?:-color)?:\s*([^;}\n]+)/i) ||
    allCss.match(/button[^{]*\{[^}]*background(?:-color)?:\s*([^;}\n]+)/i);
  if (btnBgMatch) addColor(btnBgMatch[1].trim(), 70, "button-bg");

  const headerBg =
    allCss.match(/(?:header|\.header|\.navbar|nav|\.nav)[^{]*\{[^}]*background(?:-color)?:\s*([^;}\n]+)/i);
  if (headerBg) addColor(headerBg[1].trim(), 65, "header-bg");

  const colorHexPattern = /#[0-9a-fA-F]{3,8}/g;
  const allHexColors = allCss.match(colorHexPattern) || [];
  const hexFrequency = new Map<string, number>();
  for (const raw of allHexColors) {
    const hex = normalizeHex(raw);
    if (hex && !isNeutral(hex)) {
      hexFrequency.set(hex, (hexFrequency.get(hex) || 0) + 1);
    }
  }
  for (const [hex, count] of hexFrequency) {
    addColor(hex, Math.min(50, 10 + count * 5), "css-frequency");
  }

  const rgbPattern = /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g;
  const allRgbColors = allCss.match(rgbPattern) || [];
  const rgbFrequency = new Map<string, number>();
  for (const raw of allRgbColors) {
    const hex = normalizeHex(raw);
    if (hex && !isNeutral(hex)) {
      rgbFrequency.set(hex, (rgbFrequency.get(hex) || 0) + 1);
    }
  }
  for (const [hex, count] of rgbFrequency) {
    addColor(hex, Math.min(45, 8 + count * 4), "rgb-frequency");
  }

  const svgColors = html.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi) || [];
  for (const svg of svgColors.slice(0, 5)) {
    const fills = svg.match(/fill=["']([^"']+)["']/gi) || [];
    for (const fill of fills) {
      const val = fill.match(/fill=["']([^"']+)["']/i);
      if (val && val[1] !== "none" && val[1] !== "currentColor") {
        addColor(val[1], 55, "svg-fill");
      }
    }
  }

  const combined = new Map<string, ScoredColor>();
  for (const item of scored) {
    const existing = combined.get(item.hex);
    if (existing) {
      existing.score = Math.max(existing.score, item.score) + 5;
    } else {
      combined.set(item.hex, { ...item });
    }
  }

  return Array.from(combined.values()).sort((a, b) => b.score - a.score);
}

function pickPrimaryAndSecondary(
  candidates: ScoredColor[]
): [string, string] {
  if (candidates.length === 0) {
    return ["#2563eb", "#06b6d4"];
  }

  const primary = candidates[0].hex;

  const [pH] = hexToHsl(primary);
  for (let i = 1; i < candidates.length; i++) {
    const [cH] = hexToHsl(candidates[i].hex);
    const hueDiff = Math.min(Math.abs(pH - cH), 360 - Math.abs(pH - cH));
    if (hueDiff > 25) {
      return [primary, candidates[i].hex];
    }
  }

  return [primary, generateSecondaryColor(primary)];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "A valid URL is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch(parsedUrl.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Could not reach the website (status ${response.status})`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const html = await response.text();

    const nameMatch =
      html.match(/property=["']og:site_name["']\s+content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:site_name["']/i) ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let name = nameMatch ? nameMatch[1].trim() : parsedUrl.hostname;
    name = name.replace(/\s*[|\-–—].*$/, "").trim() || name;

    const descMatch =
      html.match(/property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:description["']/i) ||
      html.match(/name=["']description["']\s+content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["']\s+name=["']description["']/i);
    const tagline = descMatch ? descMatch[1].trim() : "";

    const logoMatch =
      html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i) ||
      html.match(/rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i) ||
      html.match(/href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon["']/i) ||
      html.match(/rel=["']icon["'][^>]+href=["']([^"']+\.(?:png|svg|ico))["']/i) ||
      html.match(/href=["']([^"']+\.(?:png|svg|ico))["'][^>]+rel=["']icon["']/i);
    let logoUrl = logoMatch ? logoMatch[1] : "/favicon.ico";
    if (logoUrl.startsWith("/")) {
      logoUrl = new URL(logoUrl, parsedUrl.origin).href;
    } else if (!logoUrl.startsWith("http")) {
      logoUrl = new URL(logoUrl, parsedUrl.origin).href;
    }

    const colorCandidates = extractColors(html);
    const [primaryColor, secondaryColor] = pickPrimaryAndSecondary(colorCandidates);

    const domain = parsedUrl.hostname.replace(/^www\./, "");

    return new Response(
      JSON.stringify({
        name,
        logoUrl,
        primaryColor,
        secondaryColor,
        tagline,
        domain,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to extract brand data";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
