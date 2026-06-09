-- GTM Customers table
CREATE TABLE gtm_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  stripe_customer_id text,
  stripe_session_id text,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  credits_remaining integer NOT NULL DEFAULT 5000,
  workspace_status text NOT NULL DEFAULT 'provisioning' CHECK (workspace_status IN ('provisioning', 'active')),
  daily_send_limit integer NOT NULL DEFAULT 100,
  icp_definition text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE gtm_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_gtm_customer" ON gtm_customers FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "update_own_gtm_customer" ON gtm_customers FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Insert/delete handled by service_role via edge functions only
CREATE POLICY "service_insert_gtm_customer" ON gtm_customers FOR INSERT
  TO service_role WITH CHECK (true);

CREATE POLICY "service_delete_gtm_customer" ON gtm_customers FOR DELETE
  TO service_role USING (true);

-- GTM Payments audit table
CREATE TABLE gtm_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id text NOT NULL,
  amount_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gtm_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_gtm_payments" ON gtm_payments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "service_insert_gtm_payments" ON gtm_payments FOR INSERT
  TO service_role WITH CHECK (true);

-- GTM Campaigns table
CREATE TABLE gtm_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My First Campaign',
  icp_definition text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused')),
  emails_sent integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gtm_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_gtm_campaigns" ON gtm_campaigns FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_gtm_campaigns" ON gtm_campaigns FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_gtm_campaigns" ON gtm_campaigns FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_gtm_campaigns" ON gtm_campaigns FOR DELETE
  TO authenticated USING (auth.uid() = user_id);