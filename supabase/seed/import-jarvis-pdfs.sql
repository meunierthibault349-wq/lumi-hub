-- ============================================================
-- ÉTAPE 1 : Exécuter d'abord la migration 010
-- (Ajoute les colonnes file_type et file_url)
--
-- ALTER TABLE jarvis_docs ADD COLUMN IF NOT EXISTS file_type text NOT NULL DEFAULT 'markdown';
-- ALTER TABLE jarvis_docs ADD COLUMN IF NOT EXISTS file_url  text;
-- ============================================================

-- ============================================================
-- ÉTAPE 2 : Uploader les PDFs dans Supabase Storage
--
-- 1. Aller sur : Supabase Dashboard > Storage
-- 2. Créer un bucket nommé "jarvis-docs" (Public)
-- 3. Uploader les 2 fichiers :
--    - Lumi_BusinessPlan_Complet.pdf
--    - Lumi_Presentation_Cabinet.pdf
-- 4. Copier les URLs publiques (format ci-dessous)
-- ============================================================

-- ============================================================
-- ÉTAPE 3 : Insérer les entrées PDF
-- Remplace <PROJECT_REF> par ton ID de projet Supabase
-- (visible dans Settings > General)
-- ============================================================

INSERT INTO jarvis_docs (title, category, path, file_type, file_url, content)
VALUES
  (
    'Business Plan Lumi',
    'import',
    'import/Lumi_BusinessPlan_Complet.pdf',
    'pdf',
    'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/jarvis-docs/Lumi_BusinessPlan_Complet.pdf',
    ''
  ),
  (
    'Présentation Cabinet Lumi',
    'import',
    'import/Lumi_Presentation_Cabinet.pdf',
    'pdf',
    'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/jarvis-docs/Lumi_Presentation_Cabinet.pdf',
    ''
  )
ON CONFLICT (path) DO UPDATE
  SET file_type  = EXCLUDED.file_type,
      file_url   = EXCLUDED.file_url,
      updated_at = now();

-- ============================================================
-- ÉTAPE 4 : Ajouter le document "Commandes Jarvis" (catégorie config)
-- ============================================================

INSERT INTO jarvis_docs (title, category, path, file_type, content)
VALUES (
  'Commandes Jarvis',
  'config',
  'config/commands-reference.md',
  'markdown',
$commands$
# Commandes Jarvis

> Ces commandes se lancent dans Claude Code avec `/nom-commande`.

---

## Commandes de session

### /prime
Démarrer une nouvelle session avec contexte complet. Lit CLAUDE.md, CONTEXT.md et HISTORY.md.

### /update
Mettre à jour les fichiers de contexte avec les derniers changements.

### /morning
Démarrer la journée en 30 secondes : veille personnalisée + agenda + emails importants.

### /weekly
Bilan de la semaine écoulée + priorités de la semaine suivante.

---

## Commandes commerciales

### /brief [client]
Briefing complet avant un appel ou une réunion client.

### /email [contact] [sujet]
Rédiger un email et créer un draft directement dans Gmail.

### /prospect [secteur] [ville]
Identifier et enrichir des prospects TPE/PME via Lusha.

### /pipeline
État du pipeline commercial en un coup d'oeil.

### /devis [client]
Générer une proposition commerciale complète.

### /simuler [secteur]
Simuler le pack Lumi optimal pour un prospect.

### /onboard [client]
Démarrer une nouvelle mission client de façon structurée.

---

## Commandes contenu

### /post [client] [réseau]
Générer un post prêt à publier (Instagram, LinkedIn, Facebook, TikTok).

### /caption [client]
Caption Instagram ultra-rapide avec hashtags.

### /contenu [client]
Générer un calendrier éditorial complet sur tous les réseaux d'un client.

---

## Commandes productivité

### /next
Identifier la prochaine action la plus importante à faire maintenant.

### /project
Gérer le portefeuille de projets Lumi.

### /todo [action]
- `/todo` — afficher les tâches du jour
- `/todo add "titre" [projet]` — ajouter une tâche
- `/todo done [id]` — marquer comme terminée

### /chrono [action]
- `/chrono start [description]` — démarrer une session
- `/chrono stop` — arrêter la session en cours
- `/chrono today` — bilan du jour

### /commit
Sauvegarder les changements dans Git.

---

## Agents disponibles (28)

**Contenu :** instagram, facebook, tiktok, linkedin, editorial-strategy-director, lumi-contenu-lumi, lumi-copywriter

**Sites clients :** web-developer-lumi, mobile-web-developer, lumi-seo, lumi-branding, lumi-google-my-business

**Apps web / Hub :** lumi-ux-designer, lumi-frontend-react, lumi-backend-supabase, lumi-qa

**Pub payante :** lumi-meta-ads, lumi-google-ads

**Ops clients :** lumi-devis, lumi-onboarding, lumi-account-manager, lumi-legal, lumi-ia-builder, lumi-email-marketing

**Business Lumi :** lumi-finance, lumi-prospection, lumi-sales-coach, lumi-analytics
$commands$
)
ON CONFLICT (path) DO UPDATE
  SET content    = EXCLUDED.content,
      updated_at = now();
