-- Content Lab: projects
CREATE TABLE content_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'New Project',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE content_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_content_projects" ON content_projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_content_projects" ON content_projects FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_content_projects" ON content_projects FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_content_projects" ON content_projects FOR DELETE TO anon, authenticated USING (true);

-- Content Lab: sources per project
CREATE TABLE content_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  domain text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  added_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_content_sources" ON content_sources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_content_sources" ON content_sources FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_content_sources" ON content_sources FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_content_sources" ON content_sources FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX idx_content_sources_project ON content_sources(project_id);

-- Content Lab: generation sessions per project
CREATE TABLE content_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT 'authoritative',
  format text NOT NULL DEFAULT 'stat-hook',
  topic text NOT NULL DEFAULT '',
  platforms text[] NOT NULL DEFAULT '{}',
  post_count integer NOT NULL DEFAULT 2,
  source_refs jsonb NOT NULL DEFAULT '[]',
  posts jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE content_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_content_sessions" ON content_sessions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_content_sessions" ON content_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_content_sessions" ON content_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_content_sessions" ON content_sessions FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX idx_content_sessions_project ON content_sessions(project_id);
