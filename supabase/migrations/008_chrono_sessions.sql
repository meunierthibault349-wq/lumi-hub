-- Migration 008 : Table chrono_sessions
-- Suivi du temps de travail (remplace localStorage dans /chrono)

CREATE TABLE IF NOT EXISTS chrono_sessions (
  id          text PRIMARY KEY,
  description text NOT NULL,
  project     text NOT NULL,
  start_ts    bigint NOT NULL,
  end_ts      bigint,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE chrono_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_full_access" ON chrono_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
