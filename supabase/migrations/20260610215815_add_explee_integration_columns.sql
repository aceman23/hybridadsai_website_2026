-- Add Explee integration columns to gtm_customers
ALTER TABLE gtm_customers
  ADD COLUMN explee_api_key text,
  ADD COLUMN explee_customer_id text,
  ADD COLUMN explee_status text NOT NULL DEFAULT 'pending'
    CHECK (explee_status IN ('pending', 'active', 'suspended')),
  ADD COLUMN daily_budget integer NOT NULL DEFAULT 10,
  ADD COLUMN icp_description text,
  ADD COLUMN last_campaign_run timestamptz;

-- Add Explee columns to gtm_campaigns
ALTER TABLE gtm_campaigns
  ADD COLUMN explee_run_id text,
  ADD COLUMN prospects_found integer NOT NULL DEFAULT 0;

-- Drop the old status constraint and replace with expanded one
ALTER TABLE gtm_campaigns DROP CONSTRAINT IF EXISTS gtm_campaigns_status_check;
ALTER TABLE gtm_campaigns ADD CONSTRAINT gtm_campaigns_status_check
  CHECK (status IN ('draft', 'active', 'paused', 'completed', 'failed'));
