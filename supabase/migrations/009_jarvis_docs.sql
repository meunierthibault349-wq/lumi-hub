-- Migration 009 : Table jarvis_docs
-- Stocke les documents du workspace Jarvis (CONTEXT, GOALS, HISTORY, fiches clients)

CREATE TABLE IF NOT EXISTS jarvis_docs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  category    text NOT NULL,
  path        text NOT NULL UNIQUE,
  content     text NOT NULL DEFAULT '',
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE jarvis_docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_full_access" ON jarvis_docs FOR ALL TO authenticated USING (true) WITH CHECK (true);
