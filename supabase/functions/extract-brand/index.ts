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
          "Mozilla/5.0 (compatible; BrandExtractor/1.0; +https://hybridads.ai)",
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
      html.match(/property=["']og:site_name["']\s+content=["']([^"']+)["']/) ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:site_name["']/) ||
      html.match(/<title>([^<]+)<\/title>/);
    const name = nameMatch ? nameMatch[1].trim() : parsedUrl.hostname;

    const descMatch =
      html.match(/property=["']og:description["']\s+content=["']([^"']+)["']/) ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:description["']/) ||
      html.match(/name=["']description["']\s+content=["']([^"']+)["']/) ||
      html.match(/content=["']([^"']+)["']\s+name=["']description["']/);
    const tagline = descMatch ? descMatch[1].trim() : "";

    const logoMatch =
      html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/) ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/) ||
      html.match(/rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/) ||
      html.match(/href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon["']/) ||
      html.match(/rel=["']icon["'][^>]+href=["']([^"']+)["']/) ||
      html.match(/href=["']([^"']+)["'][^>]+rel=["']icon["']/);
    let logoUrl = logoMatch ? logoMatch[1] : "/favicon.ico";
    if (logoUrl.startsWith("/")) {
      logoUrl = new URL(logoUrl, parsedUrl.origin).href;
    } else if (!logoUrl.startsWith("http")) {
      logoUrl = new URL(logoUrl, parsedUrl.origin).href;
    }

    const colorMatch =
      html.match(/name=["']theme-color["']\s+content=["']([^"']+)["']/) ||
      html.match(/content=["']([^"']+)["']\s+name=["']theme-color["']/);
    const primaryColor = colorMatch ? colorMatch[1] : "#2563eb";

    const secondaryColor = generateSecondaryColor(primaryColor);

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
