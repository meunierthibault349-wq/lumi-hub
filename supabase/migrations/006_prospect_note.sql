-- ══════════════════════════════════════════════════════════════
-- LUMI HUB — Migration 006 : Colonne note sur prospects
-- Ajoute un champ texte libre pour les notes rapides de pipeline.
-- ══════════════════════════════════════════════════════════════

ALTER TABLE prospects ADD COLUMN IF NOT EXISTS note text DEFAULT '';
