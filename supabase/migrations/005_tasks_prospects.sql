-- ══════════════════════════════════════════════════════════════
-- LUMI HUB — Migration 005 : Tables tasks + prospects
-- Ces tables étaient utilisées par l'app mais jamais migrées.
-- À coller et exécuter dans Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════

-- 1. TABLE TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id          text PRIMARY KEY DEFAULT 'TSK-' || substr(gen_random_uuid()::text, 1, 8),
  title       text NOT NULL,
  project     text DEFAULT '',
  priority    integer DEFAULT 5,
  due         text DEFAULT '',
  done        boolean DEFAULT false,
  overdue     boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- 2. TABLE PROSPECTS
CREATE TABLE IF NOT EXISTS prospects (
  id          text PRIMARY KEY DEFAULT 'PSP-' || substr(gen_random_uuid()::text, 1, 8),
  name        text NOT NULL,
  sector      text DEFAULT 'À compléter',
  tags        jsonb DEFAULT '[]',
  stage       text DEFAULT 'froid' CHECK (stage IN ('froid', 'contacte', 'chaud', 'signe')),
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE prospects DISABLE ROW LEVEL SECURITY;

-- 3. CONTRAINTES CHECK manquantes sur les tables existantes
--    Chaque bloc vérifie d'abord que la colonne existe avant d'ajouter la contrainte.

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='status') THEN
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
    ALTER TABLE projects ADD CONSTRAINT projects_status_check
      CHECK (status IN ('livré', 'en_cours', 'en_attente_client', 'demarrage'));
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='status') THEN
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_status_check;
    ALTER TABLE clients ADD CONSTRAINT clients_status_check
      CHECK (status IN ('actif', 'attente_client', 'demarrage'));
  END IF;
END $$;

DO $$ BEGIN
  -- Ajoute la colonne status si elle manque
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='status') THEN
    ALTER TABLE invoices ADD COLUMN status text DEFAULT 'a_faire';
  END IF;
  -- Puis ajoute la contrainte
  ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
  ALTER TABLE invoices ADD CONSTRAINT invoices_status_check
    CHECK (status IN ('encaisse', 'en_attente', 'a_faire'));
END $$;

-- 4. NOTE SUR LE CONFLIT clients.id / projects.client_id
--
-- La migration 001 déclare : clients.id text PRIMARY KEY
--                             projects.client_id text REFERENCES clients(id)
-- La migration 002 déclare : projects.client_id uuid (sans FK)
--
-- Depuis que la 001 a créé les tables en premier, les CREATE TABLE IF NOT EXISTS
-- de la 002 sont des no-ops. La colonne client_id est donc bien `text` en base,
-- et les IDs du seed ('CLT-001', 'CLT-002') fonctionnent correctement.
--
-- Si jamais vous réinstallez le Hub from scratch, exécuter les migrations
-- DANS L'ORDRE : 001 → 002 → 003 → 004 → 005.
-- La 002 doit être gardée pour les INSERT de données initiales (projets, factures, jalons).
