-- Migration 010 : Support PDF dans jarvis_docs
-- Ajoute file_type (markdown | pdf) et file_url (URL Supabase Storage ou externe)

ALTER TABLE jarvis_docs ADD COLUMN IF NOT EXISTS file_type text NOT NULL DEFAULT 'markdown';
ALTER TABLE jarvis_docs ADD COLUMN IF NOT EXISTS file_url  text;
