import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const APP_URL = "https://hybridads.ai";
const FROM_EMAIL = "Hybrid Ads Partners <partners@hybridads.ai>";
const HYBRID_ADS_EMAIL = "partners@hybridads.ai";

interface Body {
  agreement_id: string;
  signer_legal_name: string;
  esign_consent: boolean;
  signature_image?: string;
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sendResendEmail(to: string, subject: string, html: string, text: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set; skipping email to", to);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, text }),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    console.error("Resend send failed", res.status, errBody);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json(401, { error: "Missing authorization" });

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user) return json(401, { error: "Unauthorized" });

    const body = (await req.json()) as Body;
    if (!body?.agreement_id || !body?.signer_legal_name) {
      return json(400, { error: "agreement_id and signer_legal_name are required" });
    }
    if (!body.esign_consent) {
      return json(400, { error: "You must consent to electronic signature" });
    }

    const service = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: agreement, error: agrErr } = await service
      .from("partner_agreements")
      .select("*")
      .eq("id", body.agreement_id)
      .maybeSingle();
    if (agrErr || !agreement) return json(404, { error: "Agreement not found" });
    if (agreement.user_id !== user.id) return json(403, { error: "Not authorized" });
    if (agreement.status !== "sent") {
      return json(409, { error: "This agreement is no longer available for signature" });
    }

    const recomputed = await sha256Hex(agreement.rendered_body as string);
    if (recomputed !== agreement.document_sha256) {
      return json(500, { error: "Agreement integrity check failed" });
    }

    const { data: application } = await service
      .from("partner_applications")
      .select("*")
      .eq("id", agreement.application_id)
      .maybeSingle();
    if (!application) return json(404, { error: "Application not found" });

    const expectedName = (application.legal_name || application.full_name || "").trim().toLowerCase();
    if (!expectedName || body.signer_legal_name.trim().toLowerCase() !== expectedName) {
      return json(400, {
        error: "Typed legal name must match the name on your application",
      });
    }

    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const ip = forwardedFor.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || "";
    const userAgent = req.headers.get("user-agent") || "";
    const nowIso = new Date().toISOString();

    const { error: updErr } = await service
      .from("partner_agreements")
      .update({
        status: "signed",
        signer_legal_name: body.signer_legal_name.trim(),
        signature_image: body.signature_image ?? null,
        esign_consent: true,
        signed_at: nowIso,
        signer_ip: ip,
        signer_user_agent: userAgent,
      })
      .eq("id", agreement.id)
      .eq("status", "sent");
    if (updErr) return json(500, { error: updErr.message });

    await service
      .from("partner_applications")
      .update({ status: "signed", updated_at: nowIso })
      .eq("id", application.id);

    await service.from("partner_notifications").insert({
      user_id: user.id,
      type: "agreement_signed",
      title: "Agreement signed",
      body: "Your partner agreement is signed and on file. Welcome to the program.",
    });

    const partnerEmail = application.email as string;
    const partnerName = application.full_name || body.signer_legal_name;

    await sendResendEmail(
      partnerEmail,
      "Signed: Hybrid Ads Partner Agreement",
      `<p>Hi ${partnerName},</p>
       <p>Your Hybrid Ads Partner Agreement is signed and on file. A copy is available in your partner portal:</p>
       <p><a href="${APP_URL}/partner-portal">${APP_URL}/partner-portal</a></p>
       <p>Document hash (SHA-256): <code>${agreement.document_sha256}</code></p>
       <p>Welcome to the program.</p>
       <p>— The Hybrid Ads team</p>`,
      `Hi ${partnerName},\n\nYour Hybrid Ads Partner Agreement is signed and on file. A copy is available in your partner portal:\n${APP_URL}/partner-portal\n\nDocument hash (SHA-256): ${agreement.document_sha256}\n\nWelcome to the program.\n\n— The Hybrid Ads team\n`
    );

    await sendResendEmail(
      HYBRID_ADS_EMAIL,
      `Partner signed: ${partnerName}`,
      `<p>${partnerName} (${partnerEmail}) signed the Hybrid Ads Partner Agreement.</p>
       <p>Document hash (SHA-256): <code>${agreement.document_sha256}</code></p>
       <p>Signed at: ${nowIso}</p>
       <p>Signer IP: ${ip || "unknown"}</p>`,
      `${partnerName} (${partnerEmail}) signed the Hybrid Ads Partner Agreement.\n\nDocument hash (SHA-256): ${agreement.document_sha256}\nSigned at: ${nowIso}\nSigner IP: ${ip || "unknown"}\n`
    );

    return json(200, { ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return json(500, { error: message });
  }
});
