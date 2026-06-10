-- ══════════════════════════════════════════════
-- LUMI HUB — Migration 001 : Schéma initial
-- À coller et exécuter dans Supabase SQL Editor
-- ══════════════════════════════════════════════

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  full_name    text,
  sector       text,
  color        text,
  pack         text,
  mrr          integer DEFAULT 0,
  status       text DEFAULT 'actif',
  contact      text,
  email        text,
  last_contact text,
  pending      jsonb DEFAULT '[]',
  notes        jsonb DEFAULT '[]',
  vehicles     jsonb,
  created_at   timestamptz DEFAULT now()
);

-- Projects (missions)
CREATE TABLE IF NOT EXISTS projects (
  id           text PRIMARY KEY,
  title        text NOT NULL,
  client_id    text REFERENCES clients(id) ON DELETE CASCADE,
  client       text,
  client_color text,
  status       text DEFAULT 'en_cours',
  progress     integer DEFAULT 0,
  priority     text DEFAULT 'normale',
  ref          text,
  devis        text,
  deadline     text,
  summary      text,
  livrables    jsonb DEFAULT '[]',
  agents       jsonb DEFAULT '[]',
  created_at   timestamptz DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id           text PRIMARY KEY,
  client       text,
  client_color text,
  description  text,
  amount       integer,
  date         text,
  status       text DEFAULT 'a_faire',
  created_at   timestamptz DEFAULT now()
);

-- Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id           serial PRIMARY KEY,
  title        text NOT NULL,
  date         text NOT NULL,
  color        text,
  client_color text,
  created_at   timestamptz DEFAULT now()
);

-- Désactiver RLS (outil privé, pas d'auth multi-utilisateurs)
ALTER TABLE clients  DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE milestones DISABLE ROW LEVEL SECURITY;
