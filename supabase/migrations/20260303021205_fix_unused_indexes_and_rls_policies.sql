/*
  # Fix Security Issues: Unused Indexes and RLS Policy Hardening

  ## Changes

  ### 1. Drop Unused Indexes
  - Drops `idx_chat_messages_session` — reported as never used
  - Drops `idx_chat_messages_created` — reported as never used

  ### 2. Harden RLS INSERT Policies (replace WITH CHECK (true))
  The following tables had INSERT policies that allowed completely unrestricted
  writes (WITH CHECK clause was always true). Each policy is replaced with a
  meaningful data-validation check so that at minimum the required fields must
  contain non-empty values. Anonymous access is preserved where required by the
  app, but blank / garbage records are now rejected.

  #### chat_messages
  - session_id must be a non-empty string
  - content must be a non-empty string

  #### chat_sessions
  - session_id must be a non-empty string

  #### demo_interactions
  - feature must be a non-empty string

  #### waitlist
  - email must match a basic email pattern (contains @ and .)
*/

-- ============================================================
-- 1. Drop unused indexes
-- ============================================================
DROP INDEX IF EXISTS public.idx_chat_messages_session;
DROP INDEX IF EXISTS public.idx_chat_messages_created;

-- ============================================================
-- 2. Harden chat_messages INSERT policy
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;

CREATE POLICY "Anyone can insert chat messages"
  ON public.chat_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    session_id IS NOT NULL AND session_id <> '' AND
    content IS NOT NULL AND content <> ''
  );

-- ============================================================
-- 3. Harden chat_sessions INSERT policy
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert chat sessions" ON public.chat_sessions;

CREATE POLICY "Anyone can insert chat sessions"
  ON public.chat_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    session_id IS NOT NULL AND session_id <> ''
  );

-- ============================================================
-- 4. Harden demo_interactions INSERT policy
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert demo interactions" ON public.demo_interactions;

CREATE POLICY "Anyone can insert demo interactions"
  ON public.demo_interactions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    feature IS NOT NULL AND feature <> ''
  );

-- ============================================================
-- 5. Harden waitlist INSERT policy
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert to waitlist" ON public.waitlist;

CREATE POLICY "Anyone can insert to waitlist"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL AND
    email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
