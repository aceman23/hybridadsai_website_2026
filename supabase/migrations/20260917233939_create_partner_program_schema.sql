/*
# Partner Program schema

Adds tables and helpers for the Hybrid Ads Partner Program.

## New tables

- `admin_users` — allowlist of user IDs with admin privileges. Membership
  gated by `public.is_admin()`. Manual bootstrap required (see comment
  block near the bottom).
- `partner_applications` — one row per registered partner. Stores every
  form field submitted on `/partners`, the review status and admin notes.
- `agreement_templates` — versioned revenue-share agreement text. Seeded
  with version 1 (55% Hybrid Ads / 45% Developer, 12 month term).
- `partner_agreements` — the immutable rendered agreement that was sent
  and (optionally) signed by a partner. Client cannot write these rows;
  all writes flow through the `partner-admin-action` and
  `partner-sign-agreement` edge functions using the service role.
- `partner_notifications` — in-app notifications shown to partners in
  their portal (application received, agreement sent, signed, etc.).

## Security

- RLS enabled on every table.
- Partners can only read their own rows.
- Partners cannot mutate `status` fields, cannot insert or update
  `partner_agreements` and cannot insert `partner_notifications` from
  the client.
- Admins are the only role that can read/write across all partner rows,
  gated through `public.is_admin()`.
- GraphQL visibility (via PostgREST `authenticated` grants) is revoked
  on every new table so the schema is not enumerable from the browser.

## Manual steps after applying

1. Insert the first admin manually with SQL (see comment below).
2. Set the `RESEND_API_KEY` secret for edge functions.
3. Verify `hybridads.ai` as a sending domain in Resend and route
   `partners@hybridads.ai` through it.
*/

-- Admin allowlist -----------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_select_self" ON admin_users;
CREATE POLICY "admin_users_select_self" ON admin_users FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- SECURITY DEFINER helper so RLS policies can call it without recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Partner applications ------------------------------------------------------

CREATE TABLE IF NOT EXISTS partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  legal_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  city text,
  timezone text,
  address text,
  website text,
  portfolio_url text,
  linkedin_url text,
  github_url text,
  years_experience text,
  primary_skills text[],
  services_offered text[],
  languages text[],
  tools text[],
  availability text,
  hourly_rate text,
  currency text,
  bio text,
  why_partner text,
  work_style text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'agreement_sent', 'signed')),
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partner_applications_status_idx
  ON partner_applications (status);
CREATE INDEX IF NOT EXISTS partner_applications_created_at_idx
  ON partner_applications (created_at DESC);

ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "partner_apps_select_own_or_admin" ON partner_applications;
CREATE POLICY "partner_apps_select_own_or_admin" ON partner_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "partner_apps_insert_self" ON partner_applications;
CREATE POLICY "partner_apps_insert_self" ON partner_applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- Partners can edit their contact details (but never status/admin_notes).
-- Enforce that via a column privilege grant, not the policy predicate.
DROP POLICY IF EXISTS "partner_apps_update_own_or_admin" ON partner_applications;
CREATE POLICY "partner_apps_update_own_or_admin" ON partner_applications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "partner_apps_delete_admin" ON partner_applications;
CREATE POLICY "partner_apps_delete_admin" ON partner_applications FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Lock down the admin-only columns so partners cannot write them, even via
-- their own UPDATE policy.
REVOKE UPDATE ON partner_applications FROM authenticated;
GRANT UPDATE (
  full_name, legal_name, phone, country, city, timezone, address,
  website, portfolio_url, linkedin_url, github_url, years_experience,
  primary_skills, services_offered, languages, tools, availability,
  hourly_rate, currency, bio, why_partner, work_style, updated_at
) ON partner_applications TO authenticated;

-- Agreement templates -------------------------------------------------------

CREATE TABLE IF NOT EXISTS agreement_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version integer NOT NULL UNIQUE,
  title text NOT NULL,
  body text NOT NULL,
  hybrid_share integer NOT NULL,
  developer_share integer NOT NULL,
  term_months integer NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE agreement_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "agreement_templates_select_authenticated" ON agreement_templates;
CREATE POLICY "agreement_templates_select_authenticated" ON agreement_templates FOR SELECT
  TO authenticated USING (is_active = true OR public.is_admin());

-- Seed v1 of the Developer Enablement & Revenue Share Agreement.
INSERT INTO agreement_templates (version, title, body, hybrid_share, developer_share, term_months, is_active)
VALUES (
  1,
  'Hybrid Ads – Developer Enablement & Revenue Share Agreement (v1)',
  E'HYBRID ADS — DEVELOPER ENABLEMENT & REVENUE SHARE AGREEMENT\nVersion 1\n\nThis Developer Enablement & Revenue Share Agreement ("Agreement") is entered into as of {{effective_date}} ("Effective Date") by and between:\n\nHybrid Ads, Inc. ("Hybrid Ads"), a company operating at hybridads.ai; and\n\n{{developer_name}} ("Developer"), residing or operating at {{developer_address}}.\n\nHybrid Ads and Developer are each a "Party" and, together, the "Parties."\n\n1. PURPOSE\n\n1.1 Hybrid Ads operates an AI and paid-media services business and, from time to time, sources work opportunities from clients that require software development, AI engineering, integration, or related technical services (each, a "Client Engagement").\n\n1.2 Developer is an independent professional who wishes to be considered for Client Engagements sourced or referred by Hybrid Ads, on the terms set out below.\n\n1.3 This Agreement governs how Hybrid Ads may refer Client Engagements to Developer, how Developer will deliver the work, and how the resulting revenue will be shared.\n\n2. INDEPENDENT CONTRACTOR RELATIONSHIP\n\n2.1 Developer is an independent contractor. Nothing in this Agreement creates an employment, partnership, joint venture, agency, or franchise relationship between the Parties.\n\n2.2 Developer performs the work under Developer''s own name, accounts, tax identity, business licenses, and tools. Developer is solely responsible for all taxes, benefits, insurance, and legal obligations arising from Developer''s activity.\n\n2.3 Developer controls the manner and means by which Developer performs the work, subject only to the Client Engagement scope agreed with the applicable Client and the delivery standards described in Section 4.\n\n2.4 Neither Party has authority to bind the other. Developer will not represent to any Client or third party that Developer is an employee, officer, or authorized agent of Hybrid Ads.\n\n3. REFERRAL OF CLIENT ENGAGEMENTS\n\n3.1 Hybrid Ads may, at its discretion, present Client Engagements to Developer. Presentation of a Client Engagement is not an offer or a guarantee of work.\n\n3.2 For each Client Engagement Developer accepts, the Parties will agree in writing (which may be by email or in-portal message) on: (a) the scope of work; (b) deliverables; (c) timeline; and (d) the fees payable by the Client.\n\n3.3 Developer is free to accept or decline any Client Engagement. Hybrid Ads is free to refer any Client Engagement to another developer.\n\n4. DEVELOPER OBLIGATIONS\n\n4.1 Developer will perform each accepted Client Engagement in a professional and workmanlike manner, consistent with industry standards for similar work.\n\n4.2 Developer will comply with all applicable laws, and with any reasonable Client policies (such as security, confidentiality, or data handling requirements) that are shared with Developer in writing before the work begins.\n\n4.3 Developer will not subcontract a Client Engagement, in whole or in part, without Hybrid Ads'' prior written consent.\n\n4.4 Developer will keep Hybrid Ads reasonably informed of progress and will promptly notify Hybrid Ads of any material issue affecting delivery.\n\n5. REVENUE SHARE\n\n5.1 For each Client Engagement referred by Hybrid Ads and delivered by Developer under this Agreement, the net fees actually collected from the Client (i.e. fees received, less refunds, chargebacks, and third-party payment processing fees) shall be split as follows:\n\n    Hybrid Ads: 55%\n    Developer:  45%\n\n5.2 Hybrid Ads will invoice and collect payment from the Client, unless the Parties agree otherwise in writing for a specific Client Engagement.\n\n5.3 Developer''s share is payable within thirty (30) days after Hybrid Ads receives cleared payment from the Client for the corresponding milestone or invoice.\n\n5.4 Each Party bears its own taxes on its share of the revenue.\n\n6. INTELLECTUAL PROPERTY\n\n6.1 Ownership of deliverables produced for a Client Engagement is governed by the applicable Client agreement. If the Client agreement is silent, the deliverables are assigned to the Client on payment in full.\n\n6.2 Developer retains ownership of any pre-existing tools, libraries, or know-how used to produce the deliverables, and grants the Client a non-exclusive license to use them as embedded in the deliverables.\n\n6.3 Neither Party acquires rights to the other Party''s trademarks or brand assets, except for the limited right to identify the counter-party in the ordinary course of performing this Agreement.\n\n7. CONFIDENTIALITY\n\n7.1 "Confidential Information" means non-public information disclosed by one Party (or a Client) to the other in connection with a Client Engagement, whether oral, written, or electronic.\n\n7.2 The receiving Party will (a) use Confidential Information only to perform this Agreement, (b) protect it with at least the same care it uses for its own confidential information (and no less than a reasonable standard of care), and (c) not disclose it to any third party except to personnel or subcontractors who need it and are bound by comparable obligations.\n\n7.3 Confidentiality obligations survive for three (3) years after termination of this Agreement, or longer if required by the applicable Client agreement.\n\n8. NON-CIRCUMVENTION\n\n8.1 During the Term and for twelve (12) months after termination, Developer will not directly or indirectly solicit or accept work from any Client introduced to Developer by Hybrid Ads, outside of this Agreement, without Hybrid Ads'' prior written consent.\n\n8.2 This Section 8 does not apply to (a) clients Developer had a prior, documented relationship with before the introduction, or (b) unrelated work Developer is separately engaged for outside of any Hybrid Ads referral.\n\n9. TERM AND TERMINATION\n\n9.1 This Agreement begins on the Effective Date and continues for an initial term of twelve (12) months (the "Initial Term"), and thereafter renews automatically for successive twelve (12) month terms unless either Party gives written notice of non-renewal at least thirty (30) days before the end of the then-current term.\n\n9.2 Either Party may terminate this Agreement at any time, for any reason, on thirty (30) days'' written notice.\n\n9.3 Either Party may terminate this Agreement immediately on written notice if the other Party materially breaches this Agreement and fails to cure the breach within ten (10) business days after written notice.\n\n9.4 Termination does not affect: (a) Client Engagements already in progress, which will be completed on the agreed terms unless the Parties agree otherwise; (b) revenue share owed for work already delivered; or (c) Sections 2.2, 6, 7, 8, 10, 11, and 12, which survive termination.\n\n10. WARRANTIES AND DISCLAIMERS\n\n10.1 Each Party represents that it has the authority to enter into this Agreement, and that doing so does not violate any other agreement it is bound by.\n\n10.2 Developer represents that the deliverables produced under this Agreement will be Developer''s own work (or properly licensed) and will not knowingly infringe any third-party rights.\n\n10.3 EXCEPT FOR THE EXPRESS WARRANTIES IN THIS SECTION 10, NEITHER PARTY MAKES ANY WARRANTIES, EXPRESS OR IMPLIED, AND EACH PARTY DISCLAIMS THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. NO GUARANTEE OF ANY SPECIFIC AMOUNT OR VOLUME OF WORK, INCOME, OR REVENUE IS MADE BY HYBRID ADS.\n\n11. LIMITATION OF LIABILITY\n\n11.1 EXCEPT FOR BREACHES OF CONFIDENTIALITY (SECTION 7), NON-CIRCUMVENTION (SECTION 8), OR INTELLECTUAL PROPERTY (SECTION 6), NEITHER PARTY WILL BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.\n\n11.2 EACH PARTY''S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT WILL NOT EXCEED THE AMOUNTS PAID OR PAYABLE UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.\n\n12. GENERAL\n\n12.1 Governing Law. This Agreement is governed by the laws of the State of Delaware, USA, without regard to conflict-of-laws principles.\n\n12.2 Notices. Written notices under this Agreement may be given by email to the Parties'' primary business email addresses on file.\n\n12.3 Entire Agreement. This Agreement, together with any Client Engagement scope agreed under Section 3.2, is the entire agreement between the Parties on this subject and supersedes prior discussions.\n\n12.4 Amendments. This Agreement may only be amended in writing signed by both Parties (electronic signature accepted).\n\n12.5 Assignment. Neither Party may assign this Agreement without the other Party''s prior written consent, except to a successor by merger or sale of substantially all of its assets.\n\n12.6 Severability. If any provision is held unenforceable, the remaining provisions remain in effect.\n\n12.7 Counterparts / Electronic Signature. This Agreement may be signed electronically and in counterparts, each of which is an original.\n\nSIGNED\n\nHybrid Ads, Inc.\nBy: __________________________\nName: __________________________\nTitle: __________________________\nDate: __________________________\n\nDeveloper\nBy: __________________________\nName: {{developer_name}}\nAddress: {{developer_address}}\nDate: __________________________\n',
  55,
  45,
  12,
  true
) ON CONFLICT (version) DO NOTHING;

-- Partner agreements --------------------------------------------------------

CREATE TABLE IF NOT EXISTS partner_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES partner_applications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES agreement_templates(id),
  template_version integer NOT NULL,
  rendered_body text NOT NULL,
  document_sha256 text NOT NULL,
  status text NOT NULL DEFAULT 'sent'
    CHECK (status IN ('sent', 'signed', 'void')),
  sent_at timestamptz NOT NULL DEFAULT now(),
  hybrid_signer_name text,
  hybrid_signer_title text,
  hybrid_signed_at timestamptz,
  signer_legal_name text,
  signature_image text,
  esign_consent boolean NOT NULL DEFAULT false,
  signed_at timestamptz,
  signer_ip text,
  signer_user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partner_agreements_user_id_idx
  ON partner_agreements (user_id);
CREATE INDEX IF NOT EXISTS partner_agreements_application_id_idx
  ON partner_agreements (application_id);

ALTER TABLE partner_agreements ENABLE ROW LEVEL SECURITY;

-- Partners can only READ their own agreement; all writes go through edge
-- functions with the service role. No INSERT/UPDATE/DELETE policies for
-- authenticated users on purpose.
DROP POLICY IF EXISTS "partner_agreements_select_own_or_admin" ON partner_agreements;
CREATE POLICY "partner_agreements_select_own_or_admin" ON partner_agreements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Partner notifications -----------------------------------------------------

CREATE TABLE IF NOT EXISTS partner_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partner_notifications_user_id_idx
  ON partner_notifications (user_id, created_at DESC);

ALTER TABLE partner_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "partner_notifications_select_own_or_admin" ON partner_notifications;
CREATE POLICY "partner_notifications_select_own_or_admin" ON partner_notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Partners can only update the read_at column on their own notifications.
DROP POLICY IF EXISTS "partner_notifications_update_own" ON partner_notifications;
CREATE POLICY "partner_notifications_update_own" ON partner_notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

REVOKE UPDATE ON partner_notifications FROM authenticated;
GRANT UPDATE (read_at) ON partner_notifications TO authenticated;

-- Hide the schema from PostgREST/GraphQL for signed-in users; all read paths
-- go through the RLS-protected select policies via the REST API anyway.
REVOKE SELECT ON public.admin_users FROM authenticated;
GRANT SELECT ON public.admin_users TO authenticated;
REVOKE SELECT ON public.partner_applications FROM authenticated;
GRANT SELECT ON public.partner_applications TO authenticated;
REVOKE SELECT ON public.agreement_templates FROM authenticated;
GRANT SELECT ON public.agreement_templates TO authenticated;
REVOKE SELECT ON public.partner_agreements FROM authenticated;
GRANT SELECT ON public.partner_agreements TO authenticated;
REVOKE SELECT ON public.partner_notifications FROM authenticated;
GRANT SELECT ON public.partner_notifications TO authenticated;

-- Bootstrap the first admin (run manually after migration) ------------------
--
-- Replace the email below with the real admin account. The user must
-- already exist in auth.users (i.e. have signed up on the app).
--
-- INSERT INTO admin_users (user_id)
-- SELECT id FROM auth.users WHERE email = 'admin@hybridads.ai'
-- ON CONFLICT (user_id) DO NOTHING;
