-- ══════════════════════════════════════════════════════════════
-- LUMI HUB — Migration 011 : Correction schéma clients
-- Ajoute les colonnes manquantes + backfill depuis les anciennes
-- À coller et exécuter dans Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- Ajouter les colonnes attendues par le Hub (si elles n'existent pas)
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS color        text,
  ADD COLUMN IF NOT EXISTS contact      text,
  ADD COLUMN IF NOT EXISTS status       text DEFAULT 'actif',
  ADD COLUMN IF NOT EXISTS last_contact text DEFAULT '',
  ADD COLUMN IF NOT EXISTS pending      jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS notes        jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS vehicles     jsonb,
  ADD COLUMN IF NOT EXISTS ref          text;

-- Backfill depuis les anciennes colonnes si elles existent
UPDATE clients SET color   = accent_color  WHERE color   IS NULL AND accent_color  IS NOT NULL;
UPDATE clients SET contact = contact_name  WHERE contact IS NULL AND contact_name  IS NOT NULL;
UPDATE clients SET ref     = 'CLT-002'     WHERE name = 'BeLoc'   AND ref IS NULL;
