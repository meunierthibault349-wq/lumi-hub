-- ══════════════════════════════════════════════════════════════
-- LUMI HUB — Migration 002 : Tables manquantes + données initiales
-- Exécutée le 2026-06-10 dans Supabase SQL Editor
-- Note : client_id en uuid (sans FK) car clients.id est uuid en base
-- ══════════════════════════════════════════════════════════════

-- 1. TABLE PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id           text PRIMARY KEY,
  title        text NOT NULL,
  client_id    uuid,
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
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- 2. TABLE INVOICES
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
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;

-- 3. TABLE MILESTONES
CREATE TABLE IF NOT EXISTS milestones (
  id           serial PRIMARY KEY,
  title        text NOT NULL,
  date         text NOT NULL,
  color        text,
  client_color text,
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE milestones DISABLE ROW LEVEL SECURITY;

-- PROJECTS
INSERT INTO projects (id, title, client_id, client, client_color, status, progress, priority, ref, devis, deadline, summary, livrables, agents)
VALUES
  ('PRJ-2026-001','Site Internet 100P Location',(SELECT id FROM clients WHERE name='100P Location' LIMIT 1),'100P Location','#8B1E2F','livré',100,'normale','PRJ-2026-001','1 400 € one-shot (signé)','2026-06-08','Site production-ready livré en 3 passes expertes.','[{"icon":"🌐","type":"site","name":"Site HTML complet"}]','["web-developer-lumi","mobile-web-developer"]'),
  ('PRJ-2026-002','Stratégie Digitale 100P',(SELECT id FROM clients WHERE name='100P Location' LIMIT 1),'100P Location','#8B1E2F','en_cours',40,'normale','PRJ-2026-002','490 €/mois (signé)','2026-07-08','Calendrier éditorial Instagram juillet généré. SEO local et GMB à démarrer.','[]','["instagram-content-strategist","lumi-seo"]'),
  ('PRJ-2026-003','Outil IA Rôtisserie & Volaillerie',(SELECT id FROM clients WHERE name='100P Location' LIMIT 1),'100P Location','#8B1E2F','demarrage',10,'basse','PRJ-2026-003','~1 500 € one-shot (estimé)','2026-07-31','Piste identifiée : outil IA gestion stocks et recettes pour le marché couvert de Vichy.','[]','["lumi-ia-builder","lumi-devis"]'),
  ('PRJ-2026-004','Site Internet Marchand + Stratégie Digitale',(SELECT id FROM clients WHERE name='BeLoc' LIMIT 1),'BeLoc','#C9A96E','en_attente_client',90,'haute','PRJ-2026-004','4 500 € one-shot + 890 €/mois (signé)','2026-06-15','Dossier de livraison envoyé. En attente retours recette.','[{"icon":"📦","type":"dossier","name":"Dossier de livraison"},{"icon":"🌐","type":"site","name":"Site BeLoc"}]','["web-developer-lumi","mobile-web-developer"]')
ON CONFLICT (id) DO NOTHING;

-- INVOICES
INSERT INTO invoices (id, client, client_color, description, amount, date, status)
VALUES
  ('FACT-2026-001','100P Location','#8B1E2F','Création site internet 100P Location — one-shot',1400,'2026-06-08','encaisse'),
  ('FACT-2026-002','BeLoc','#C9A96E','Création site internet marchand BeLoc — one-shot',4500,'2026-06-10','en_attente'),
  ('FACT-2026-003','100P Location','#8B1E2F','Pack Starter — abonnement juin 2026',490,'2026-06-01','a_faire'),
  ('FACT-2026-004','BeLoc','#C9A96E','Pack Visibilité — abonnement juin 2026',890,'2026-06-15','a_faire')
ON CONFLICT (id) DO NOTHING;

-- MILESTONES
INSERT INTO milestones (title, date, color, client_color)
VALUES
  ('BeLoc — Mise en ligne site', '2026-06-15', 'var(--amber)', '#C9A96E'),
  ('100P — Stratégie digitale juillet', '2026-07-08', 'var(--teal)', '#8B1E2F'),
  ('TYT03 — Livraison outil IA', '2026-07-31', 'var(--gray)', '#8B1E2F');
