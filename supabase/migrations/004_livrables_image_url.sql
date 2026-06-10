-- Migration 004 : ajout image_url sur livrables_ia
ALTER TABLE livrables_ia ADD COLUMN IF NOT EXISTS image_url text;
