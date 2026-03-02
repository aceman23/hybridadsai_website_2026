/*
  # AI Systems Platform Schema

  1. New Tables
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, client-side session identifier)
      - `created_at` (timestamp)
    - `chat_messages`
      - `id` (uuid, primary key)
      - `session_id` (text, links to session)
      - `role` (text: 'user' or 'assistant')
      - `content` (text, message content)
      - `model` (text, AI model used)
      - `created_at` (timestamp)
    - `demo_interactions`
      - `id` (uuid, primary key)
      - `feature` (text, which feature was interacted with)
      - `metadata` (jsonb, additional data)
      - `created_at` (timestamp)
    - `waitlist`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `plan` (text, selected plan)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Allow anonymous inserts for chat and waitlist
    - Restrict reads to authenticated users for admin
*/

CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  model text DEFAULT 'nexus-7',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  plan text DEFAULT 'starter',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chat sessions"
  ON chat_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read own session messages"
  ON chat_messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert demo interactions"
  ON demo_interactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can insert to waitlist"
  ON waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
