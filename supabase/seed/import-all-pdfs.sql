-- ============================================================
-- Import de tous les PDFs Jarvis dans jarvis_docs
-- URL base : https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/
--
-- PRÉREQUIS :
-- 1. Migration 010 exécutée (colonnes file_type + file_url)
-- 2. Bucket "jarvis-docs" créé (public) dans Storage
-- 3. Tous les PDFs uploadés dans ce bucket
-- ============================================================

-- ── Mettre à jour les 2 PDFs déjà insérés (changer import → contexte) ───────
UPDATE jarvis_docs
SET category = 'contexte', updated_at = now()
WHERE path IN (
  'import/Lumi_BusinessPlan_Complet.pdf',
  'import/Lumi_Presentation_Cabinet.pdf'
);

-- ── Catégorie : clients ───────────────────────────────────────────────────────
INSERT INTO jarvis_docs (title, category, path, file_type, file_url, content) VALUES
  (
    '100P — Offre commerciale',
    'clients',
    'clients/100P/offre-commerciale-100P-juin2026.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/offre-commerciale-100P-juin2026.pdf',
    ''
  ),
  (
    '100P — Remise livrables',
    'clients',
    'clients/100P/remise-livrables-100P-juin2026.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/remise-livrables-100P-juin2026.pdf',
    ''
  ),
  (
    '100P — Guide prise en main',
    'clients',
    'clients/100P/guide-prise-en-main-100P.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/guide-prise-en-main-100P.pdf',
    ''
  ),
  (
    '100P — Charte graphique',
    'clients',
    'clients/100P/charte-graphique-100P.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/charte-graphique-100P.pdf',
    ''
  ),
  (
    '100P — Stratégie éditoriale juillet',
    'clients',
    'clients/100P/strategie-editoriale-juillet-100P.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/strategie-editoriale-juillet-100P.pdf',
    ''
  ),
  (
    'BeLoc — Offre commerciale',
    'clients',
    'clients/BeLoc/offre-commerciale-BeLoc-juin2026.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/offre-commerciale-BeLoc-juin2026.pdf',
    ''
  )
ON CONFLICT (path) DO UPDATE
  SET file_type = EXCLUDED.file_type,
      file_url  = EXCLUDED.file_url,
      updated_at = now();

-- ── Catégorie : lumi (opérations cabinet) ─────────────────────────────────────
INSERT INTO jarvis_docs (title, category, path, file_type, file_url, content) VALUES
  (
    'Offre commerciale Lumi',
    'lumi',
    'lumi/offre-commerciale-lumi.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/offre-commerciale-lumi.pdf',
    ''
  ),
  (
    'Présentation Lumi',
    'lumi',
    'lumi/presentation-lumi.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/presentation-lumi.pdf',
    ''
  ),
  (
    'Workflow Lumi 2026',
    'lumi',
    'lumi/workflow-lumi-2026.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/workflow-lumi-2026.pdf',
    ''
  ),
  (
    'Workflow Lumi 2026 v2',
    'lumi',
    'lumi/workflow-lumi-2026-v2.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/workflow-lumi-2026-v2.pdf',
    ''
  ),
  (
    'SOP Lumi 2026',
    'lumi',
    'lumi/sop-lumi-2026.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/sop-lumi-2026.pdf',
    ''
  ),
  (
    'SOP Lumi 2026 v2',
    'lumi',
    'lumi/sop-lumi-2026-v2.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/sop-lumi-2026-v2.pdf',
    ''
  ),
  (
    'SOP Lumi 2026 v3',
    'lumi',
    'lumi/sop-lumi-2026-v3.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/sop-lumi-2026-v3.pdf',
    ''
  ),
  (
    'SOP Lumi 2026 v4',
    'lumi',
    'lumi/sop-lumi-2026-v4.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/sop-lumi-2026-v4.pdf',
    ''
  ),
  (
    'SOP Lumi 2026 v5',
    'lumi',
    'lumi/sop-lumi-2026-v5.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/sop-lumi-2026-v5.pdf',
    ''
  ),
  (
    'SOP Lumi 2026 v6',
    'lumi',
    'lumi/sop-lumi-2026-v6.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/sop-lumi-2026-v6.pdf',
    ''
  ),
  (
    'SOP Lumi 2026 v7',
    'lumi',
    'lumi/sop-lumi-2026-v7.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/sop-lumi-2026-v7.pdf',
    ''
  ),
  (
    'SOP Lumi 2026 (Final)',
    'lumi',
    'lumi/sop-lumi-2026-final.pdf',
    'pdf',
    'https://gzncvqpqpdiwceejkfqt.supabase.co/storage/v1/object/public/jarvis-docs/sop-lumi-2026-final.pdf',
    ''
  )
ON CONFLICT (path) DO UPDATE
  SET file_type = EXCLUDED.file_type,
      file_url  = EXCLUDED.file_url,
      updated_at = now();
