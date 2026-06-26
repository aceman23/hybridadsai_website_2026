
-- 1. Add user_id as nullable first
ALTER TABLE content_projects ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- 2. Delete existing rows (no real user data yet)
DELETE FROM content_sessions;
DELETE FROM content_sources;
DELETE FROM content_projects;

-- 3. Make user_id NOT NULL
ALTER TABLE content_projects ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE content_projects ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 4. Drop all permissive (always-true) policies on content_projects
DROP POLICY IF EXISTS "select_content_projects" ON content_projects;
DROP POLICY IF EXISTS "insert_content_projects" ON content_projects;
DROP POLICY IF EXISTS "update_content_projects" ON content_projects;
DROP POLICY IF EXISTS "delete_content_projects" ON content_projects;

-- 5. Drop all permissive policies on content_sources
DROP POLICY IF EXISTS "select_content_sources" ON content_sources;
DROP POLICY IF EXISTS "insert_content_sources" ON content_sources;
DROP POLICY IF EXISTS "update_content_sources" ON content_sources;
DROP POLICY IF EXISTS "delete_content_sources" ON content_sources;

-- 6. Drop all permissive policies on content_sessions
DROP POLICY IF EXISTS "select_content_sessions" ON content_sessions;
DROP POLICY IF EXISTS "insert_content_sessions" ON content_sessions;
DROP POLICY IF EXISTS "update_content_sessions" ON content_sessions;
DROP POLICY IF EXISTS "delete_content_sessions" ON content_sessions;

-- 7. Create ownership-scoped policies for content_projects
CREATE POLICY "select_own_projects" ON content_projects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_projects" ON content_projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_projects" ON content_projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_projects" ON content_projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 8. Create sub-query scoped policies for content_sources
CREATE POLICY "select_own_sources" ON content_sources FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sources.project_id AND user_id = auth.uid())
  );
CREATE POLICY "insert_own_sources" ON content_sources FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sources.project_id AND user_id = auth.uid())
  );
CREATE POLICY "update_own_sources" ON content_sources FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sources.project_id AND user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sources.project_id AND user_id = auth.uid())
  );
CREATE POLICY "delete_own_sources" ON content_sources FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sources.project_id AND user_id = auth.uid())
  );

-- 9. Create sub-query scoped policies for content_sessions
CREATE POLICY "select_own_sessions" ON content_sessions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sessions.project_id AND user_id = auth.uid())
  );
CREATE POLICY "insert_own_sessions" ON content_sessions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sessions.project_id AND user_id = auth.uid())
  );
CREATE POLICY "update_own_sessions" ON content_sessions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sessions.project_id AND user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sessions.project_id AND user_id = auth.uid())
  );
CREATE POLICY "delete_own_sessions" ON content_sessions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM content_projects WHERE id = content_sessions.project_id AND user_id = auth.uid())
  );

-- 10. Revoke GraphQL schema visibility from anon on content_* tables
REVOKE SELECT ON content_projects FROM anon;
REVOKE SELECT ON content_sources FROM anon;
REVOKE SELECT ON content_sessions FROM anon;

-- 11. Revoke GraphQL schema visibility from anon on gtm_* tables
REVOKE SELECT ON gtm_campaigns FROM anon;
REVOKE SELECT ON gtm_customers FROM anon;
REVOKE SELECT ON gtm_payments FROM anon;
