-- ══════════════════════════════════════════════════════════════
-- LUMI HUB — Migration 003 : Table livrables_ia
-- Livrables générés par les agents IA (Chef Adjoint + agents spécialisés)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS livrables_ia (
  id          text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title       text NOT NULL,
  type        text,
  client      text,
  client_color text,
  content     text NOT NULL,
  agent_mode  text,
  status      text DEFAULT 'brouillon',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE livrables_ia DISABLE ROW LEVEL SECURITY;
