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

type Action = "approve" | "reject" | "resend" | "save_notes";

interface Body {
  action: Action;
  application_id: string;
  hybrid_signer_name?: string;
  hybrid_signer_title?: string;
  admin_notes?: string;
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

function renderTemplate(
  body: string,
  fields: { developer_name: string; developer_address: string; effective_date: string }
): string {
  return body
    .replaceAll("{{developer_name}}", fields.developer_name)
    .replaceAll("{{developer_address}}", fields.developer_address)
    .replaceAll("{{effective_date}}", fields.effective_date);
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

    const service = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: adminRow } = await service
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!adminRow) return json(403, { error: "Not authorized" });

    const body = (await req.json()) as Body;
    if (!body?.action || !body?.application_id) {
      return json(400, { error: "action and application_id are required" });
    }

    const { data: application, error: appErr } = await service
      .from("partner_applications")
      .select("*")
      .eq("id", body.application_id)
      .maybeSingle();
    if (appErr || !application) return json(404, { error: "Application not found" });

    const partnerEmail = application.email as string;

    if (body.action === "save_notes") {
      await service
        .from("partner_applications")
        .update({
          admin_notes: body.admin_notes ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id);
      return json(200, { ok: true });
    }

    if (body.action === "reject") {
      await service
        .from("partner_applications")
        .update({
          status: "rejected",
          admin_notes: body.admin_notes ?? application.admin_notes ?? null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id);

      await service.from("partner_notifications").insert({
        user_id: application.user_id,
        type: "application_rejected",
        title: "Application not approved",
        body:
          "Thanks for applying to the Hybrid Ads Partner Program. After review, we're not moving forward with your application at this time.",
      });

      await sendResendEmail(
        partnerEmail,
        "Your Hybrid Ads Partner application",
        `<p>Hi ${application.full_name || "there"},</p>
         <p>Thanks for applying to the Hybrid Ads Partner Program. After careful review, we're not moving forward with your application at this time.</p>
         <p>We appreciate the time you took to share your work with us.</p>
         <p>— The Hybrid Ads team</p>`,
        `Hi ${application.full_name || "there"},\n\nThanks for applying to the Hybrid Ads Partner Program. After careful review, we're not moving forward with your application at this time.\n\nWe appreciate the time you took to share your work with us.\n\n— The Hybrid Ads team\n`
      );

      return json(200, { ok: true });
    }

    if (body.action === "approve") {
      if (!body.hybrid_signer_name || !body.hybrid_signer_title) {
        return json(400, {
          error: "hybrid_signer_name and hybrid_signer_title are required to approve",
        });
      }

      const { data: template, error: tplErr } = await service
        .from("agreement_templates")
        .select("*")
        .eq("is_active", true)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (tplErr || !template) return json(500, { error: "No active agreement template" });

      const effectiveDate = new Date().toISOString().slice(0, 10);
      const developerName = application.legal_name || application.full_name;
      const developerAddress = application.address || application.city || "On file";
      const rendered = renderTemplate(template.body as string, {
        developer_name: developerName,
        developer_address: developerAddress,
        effective_date: effectiveDate,
      });
      const documentSha = await sha256Hex(rendered);

      const { data: agreement, error: agrErr } = await service
        .from("partner_agreements")
        .insert({
          application_id: application.id,
          user_id: application.user_id,
          template_id: template.id,
          template_version: template.version,
          rendered_body: rendered,
          document_sha256: documentSha,
          status: "sent",
          hybrid_signer_name: body.hybrid_signer_name,
          hybrid_signer_title: body.hybrid_signer_title,
          hybrid_signed_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (agrErr) return json(500, { error: agrErr.message });

      await service
        .from("partner_applications")
        .update({
          status: "agreement_sent",
          admin_notes: body.admin_notes ?? application.admin_notes ?? null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id);

      await service.from("partner_notifications").insert({
        user_id: application.user_id,
        type: "agreement_sent",
        title: "Your partner agreement is ready to sign",
        body:
          "Your application was approved. Review and sign the Developer Enablement & Revenue Share Agreement to become an active partner.",
      });

      await sendResendEmail(
        partnerEmail,
        "Your Hybrid Ads Partner agreement is ready to sign",
        `<p>Hi ${application.full_name || "there"},</p>
         <p>Great news — your application to the Hybrid Ads Partner Program was approved.</p>
         <p>Your Developer Enablement & Revenue Share Agreement is ready for your review and signature in your partner portal:</p>
         <p><a href="${APP_URL}/partner-portal">${APP_URL}/partner-portal</a></p>
         <p>The revenue split is 55% to Hybrid Ads / 45% to you, with an initial 12-month term as described in the agreement.</p>
         <p>— The Hybrid Ads team</p>`,
        `Hi ${application.full_name || "there"},\n\nGreat news — your application to the Hybrid Ads Partner Program was approved.\n\nYour Developer Enablement & Revenue Share Agreement is ready for your review and signature in your partner portal:\n${APP_URL}/partner-portal\n\nThe revenue split is 55% to Hybrid Ads / 45% to you, with an initial 12-month term as described in the agreement.\n\n— The Hybrid Ads team\n`
      );

      return json(200, { ok: true, agreement_id: agreement.id });
    }

    if (body.action === "resend") {
      const { data: agreement } = await service
        .from("partner_agreements")
        .select("*")
        .eq("application_id", application.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!agreement) return json(404, { error: "No agreement to resend" });

      const recomputed = await sha256Hex(agreement.rendered_body as string);
      if (recomputed !== agreement.document_sha256) {
        return json(500, { error: "Stored agreement failed integrity check" });
      }

      await service.from("partner_notifications").insert({
        user_id: application.user_id,
        type: "agreement_resent",
        title: "Reminder: your partner agreement",
        body: "A reminder that your partner agreement is waiting for your signature.",
      });

      await sendResendEmail(
        partnerEmail,
        "Reminder: sign your Hybrid Ads Partner agreement",
        `<p>Hi ${application.full_name || "there"},</p>
         <p>Just a quick reminder — your Hybrid Ads Partner agreement is still waiting for your signature:</p>
         <p><a href="${APP_URL}/partner-portal">${APP_URL}/partner-portal</a></p>
         <p>— The Hybrid Ads team</p>`,
        `Hi ${application.full_name || "there"},\n\nJust a quick reminder — your Hybrid Ads Partner agreement is still waiting for your signature:\n${APP_URL}/partner-portal\n\n— The Hybrid Ads team\n`
      );

      return json(200, { ok: true });
    }

    return json(400, { error: "Unknown action" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return json(500, { error: message });
  }
});
