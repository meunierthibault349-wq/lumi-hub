-- ══════════════════════════════════════════════════════════════════
-- LUMI HUB — Import documents Jarvis → jarvis_docs
-- 1. Exécuter d'abord la migration 009_jarvis_docs.sql
-- 2. Coller ce fichier dans Supabase SQL Editor et exécuter.
-- Idempotent : ON CONFLICT (path) DO UPDATE
-- ══════════════════════════════════════════════════════════════════

-- ════ CONTEXT.md ════
INSERT INTO jarvis_docs (title, category, path, content, updated_at) VALUES (
  'Mon profil',
  'contexte',
  'context/CONTEXT.md',
  $lumi_c1$# CONTEXT.md

> Mon contexte personnel et professionnel pour mon Jarvis.

---

## Qui je suis

- **Prénom :** Thibault
- **Ville / Pays :** Vichy, France
- **Situation actuelle :** Jeune entrepreneur en sortie d'études. Master Stratégie d'entreprise à l'INSEEC MSc, réalisé en alternance chez Michelin au poste de Market Intelligence.
- **Profil dominant :** Entrepreneur

---

## Ce que je fais

### Activité principale

Je dirige Lumi, mon cabinet de conseil spécialisé en stratégie digitale, développement web et développement d'outils IA. J'accompagne les TPE/PME et les commerces de ville dans leur présence et leur performance digitale.

### Offres packagées (structurées en juin 2026)

**Abonnements mensuels récurrents :**
- Pack Starter — 490 €/mois : site vitrine 3-5p, GMB 4 posts/mois, 1 réseau social (8 posts/mois), point mensuel 30 min. One-shot création site : 1 400 €.
- Pack Visibilité — 890 €/mois : site vitrine avancé ou e-commerce, GMB hebdo + avis, 2 réseaux sociaux (12 posts/mois), SEO local, rapport mensuel. One-shot : 2 200–3 800 €.
- Pack Performance — 1 490 €/mois : tout le Pack Visibilité + 3 réseaux (16 posts/mois), 1 campagne pub (Meta ou Google Ads), reporting avancé, réactivité 24h. One-shot : 3 800–6 000 €.
- Pack IA — sur devis (min. 1 500 €) : audit process, développement outil IA sur mesure, automatisation workflows N8N.

**Frais one-shot création de site :**
- Landing page : 650 €
- Site vitrine 3-5p : 1 400 €
- Site vitrine avancé 6-10p : 2 200 €
- Site e-commerce : 3 800 €
- Site marchand complexe (réservation/flotte) : 5 000–7 000 €

**Clients actuels :**
- TYT03 (Jean Charles Taret) : 100P Location + Rôtisserie + Volaillerie au marché couvert de Vichy.
- BeLoc : agence de location de véhicules luxe et premium, 100% en ligne, Auvergne-Rhône-Alpes.

---

## Mes objectifs

### Court terme (3 à 6 mois)
- Signer 5 nouveaux clients TPE/PME
- Atteindre 5 000 euros de CA mensuel récurrent
- Structurer mon offre et mes process pour pouvoir déléguer

### Long terme (1 à 3 ans)
- Élargir Lumi vers un cabinet de conseil en stratégie globale
- Déléguer les tâches pour passer essentiellement au management
- M'appuyer au maximum sur l'intelligence artificielle

---

## Identité visuelle Lumi

### Logo — Concept 05 "L Négatif Glow"
- **Icône :** badge carré arrondi Night (#0B1120) avec bordure gradient teal (#0D9488) → amber (#EF9F27), lettre L en teal #0D9488
- **Wordmark :** "LUMI" — Plus Jakarta Sans 800, gradient text teal-light → amber
- **Tagline :** "Stratégie digitale" — Plus Jakarta Sans 400, #5DCAA5

### Palette officielle

| Nom | Hex |
|-----|-----|
| Night | #0B1120 |
| Teal | #0D9488 |
| Mint | #5DCAA5 |
| Amber | #EF9F27 |
| White | #F8FFFE |

### Typographie
- **Titres / logo :** Plus Jakarta Sans (700–800)
- **Corps :** Inter (400–500)
$lumi_c1$,
  '2026-06-10T00:00:00Z'
) ON CONFLICT (path) DO UPDATE SET content = EXCLUDED.content, updated_at = EXCLUDED.updated_at;


-- ════ GOALS.md ════
INSERT INTO jarvis_docs (title, category, path, content, updated_at) VALUES (
  'Objectifs',
  'contexte',
  'context/GOALS.md',
  $lumi_c2$# GOALS.md

> Objectifs mensuels et annuels de Lumi. Mis à jour via /update à chaque début de mois.

---

## Objectifs annuels 2026

| Objectif | Cible | Statut |
|----------|-------|--------|
| MRR mensuel récurrent | 5 000 €/mois | En cours |
| Nouveaux clients signés | 5 clients TPE/PME | En cours |
| Structurer les process | Déléguer les tâches récurrentes | En cours |

---

## Objectifs du mois — Juin 2026

### OKR 1 : Commercial
- **Objectif :** Signer 1 nouveau client ce mois
- **KR1 :** Envoyer 10 propositions commerciales
- **KR2 :** Avoir 3 appels de découverte
- **KR3 :** 1 signature
- **Statut :** À démarrer

### OKR 2 : Clients actifs
- **Objectif :** Finaliser les livrables en cours (100P + BeLoc)
- **KR1 :** Site BeLoc mis en ligne avec les vraies infos client
- **KR2 :** Logo 100P choisi et système complet livré
- **KR3 :** Calendrier éditorial juillet livré pour 100P
- **Statut :** En cours

### OKR 3 : Visibilité Lumi
- **Objectif :** Publier 4 posts LinkedIn ce mois
- **KR1 :** 1 post/semaine sur LinkedIn
- **KR2 :** Au moins 1 post avec témoignage ou case study
- **Statut :** À démarrer

### OKR 4 : Infrastructure
- **Objectif :** Tester les nouveaux automatismes Jarvis
- **KR1 :** Valider que morning-auto fonctionne correctement
- **KR2 :** Premier /prospect sur un secteur cible
- **Statut :** En cours

---

## MRR actuel

| Client | Pack | MRR |
|--------|------|-----|
| 100P Location | Pack Starter (à confirmer) | ~490 €/mois |
| BeLoc | Pack Visibilité | 890 €/mois |
| **Total estimé** | | **~1 380 €/mois** |
| **Objectif** | | **5 000 €** |
| **Delta** | | **-3 620 € (3-4 clients à signer)** |
$lumi_c2$,
  '2026-06-10T00:00:00Z'
) ON CONFLICT (path) DO UPDATE SET content = EXCLUDED.content, updated_at = EXCLUDED.updated_at;


-- ════ HISTORY.md (dernières sessions) ════
INSERT INTO jarvis_docs (title, category, path, content, updated_at) VALUES (
  'Historique sessions',
  'contexte',
  'context/HISTORY.md',
  $lumi_c3$# Workspace History

> Journal chronologique des sessions et décisions importantes. Le plus récent en haut.

---

## 2026-06-10 (session 18)

### Correction crash /morning et /clients sur hub.lumi-site.fr

**Problème :** Pages /morning et /clients retournaient "This page couldn't load". Cause : champs JSONB `pending` et `notes` retournent `null` quand non renseignés.

**Fix appliqué** (commit 1b71adc) :
- app/morning/page.tsx : `(c.pending ?? []).length`
- app/clients/page.tsx : idem + `(selected.notes ?? []).map(...)`

**Apprentissage :** Toujours utiliser `?? []` sur les champs JSONB Supabase en TypeScript.

---

## 2026-06-09 (session 17)

### Décision architecturale Hub — Supabase comme pivot technique

**Contexte :** 8 fichiers HTML existants ne se parlaient pas, données mockées, 3 design systems différents.

**Décision :** Supabase Auth + PostgreSQL + Storage + Vercel.

**Roadmap validée :**
- Court terme : schéma BDD + migration JSON existants + connexion lumi-project-hub à Supabase
- Moyen terme : portail client auth réelle (magic link) livré à 100P et BeLoc
- Long terme : analytics auto, facturation Stripe, SaaS multi-agences (39-149 €/mois)

---

## 2026-06-08 (session 16)

### Lumi Agent Studio — Plateforme de gestion des agents

**Livrables :**
- `livrables/cabinet/agent-studio-lumi.html` : 1 910 lignes
- 20 agents actifs organisés en 5 pôles avec avatars SVG style Lumi
- Chat intégré temps réel via API Anthropic
- 20 system prompts rédigés sur mesure

**5 pôles :**
1. Contenu & Réseaux (7 agents) : editorial-director, instagram, facebook, linkedin, tiktok, email-marketing, copywriter
2. Web & Tech (5 agents) : web-developer, mobile-web-developer, seo, google-my-business, branding
3. Growth & Acquisition (5 agents) : meta-ads, google-ads, prospection, devis, ia-builder
4. Client Success (4 agents) : onboarding, account-manager, analytics, project-manager
5. Opérations Cabinet (3 agents) : finance, contenu-lumi, legal

---

## 2026-06-08 (session 15)

### Lumi Project Hub — Pôle gestion de projet complet

**Architecture retenue :**
- Vue par client (blocs expandables) avec missions à l'intérieur
- Code couleurs urgence en temps réel (mint/amber/rouge/teal/gris)
- 4 métriques count-up : CA one-shot actif, MRR, projets actifs, prochain jalon

---

## 2026-06-08 (session 14)

### TDL interactive Lumi — Task Manager complet

**Livrables :**
- `livrables/cabinet/todo-lumi.html` : 3 vues (Aujourd'hui / Par projet / Cabinet)
- Quick-add persistante, badges priorité P1-10, tâches récurrentes avec auto-régénération
- Auto-save silencieux via File System Access API + IndexedDB

---

## 2026-06-08 (session 13)

### Site 100P — 3 passes expertes, niveau production

- Passe 1 : Formspree, SEO de base, accessibilité initiale
- Passe 2 : web-developer-lumi — performance, SEO avancé, accessibilité AA, sécurité, PWA
- Passe 3 : mobile-web-developer — iOS/Android, touch, GPU

**Statut :** production-ready. Reste : Formspree ID, og-100p.jpg, WebP images.

---

## 2026-06-08 (session 11)

### Site BeLoc — Audit final, dossier de livraison complet

- Audit final : 25+ corrections
- Cahier des charges PDF (CDC-2026-BeLoc-01, 10 sections)
- Devis PDF (DEV-2026-BeLoc-01, 4 500 € HT)
- Dossier de livraison structuré et envoyé

---

## 2026-06-06

### Structuration complète de l'offre Lumi

- 4 packs définis et tarifés : Starter (490 €/mois), Visibilité (890 €/mois), Performance (1 490 €/mois), Pack IA (sur devis)
- Grille one-shot créée : landing page (650 €) → site marchand complexe (5 000–7 000 €)
- Conditions générales : 6 mois engagement, préavis 30j, 2 révisions/an

---

## 2026-06-05 (session 2)

### Infrastructure IA Lumi — 17 agents Claude Code créés

- Paperclip installé et connecté à Claude
- 17 agents créés (côté clients : editorial, instagram, facebook, linkedin, tiktok, web, GMB, email, SEO, meta-ads, google-ads + côté interne : prospection, devis, analytics, account-manager, onboarding, finance, contenu-lumi)
- Circuit testé : calendrier Instagram 100P + stratégie digitale BeLoc

---

## 2026-06-04

### Nouveau client : BeLoc

- Signature d'un nouveau client : BeLoc, agence de location de véhicules luxe et premium
- Mission initiale : création d'un site internet marchand

---

## 2026-06-03

### Installation initiale du Jarvis

- Workspace personnalisé pour Thibault, basé à Vichy
- Activité : dirige Lumi, cabinet de conseil en stratégie digitale pour TPE/PME
- Objectifs court terme : signer 5 nouveaux clients, atteindre 5 000 €/mois MRR
$lumi_c3$,
  '2026-06-11T00:00:00Z'
) ON CONFLICT (path) DO UPDATE SET content = EXCLUDED.content, updated_at = EXCLUDED.updated_at;


-- ════ 100P.md ════
INSERT INTO jarvis_docs (title, category, path, content, updated_at) VALUES (
  '100P Location',
  'clients',
  'context/clients/100P.md',
  $lumi_c4$# Client : 100P Location — Jean Charles Taret (TYT03)

> Fiche client vivante. Dernière mise à jour : 2026-06-10

---

## Identité client

- **Nom commercial :** 100P Location
- **Gérant :** Jean Charles Taret
- **Structure juridique :** TYT03 (regroupe 3 activités)
- **Type :** 100% en ligne, sans agence physique
- **Zone :** National (location voiture sans permis)
- **Site actuel :** 100p-location.fr

---

## Activités de TYT03

1. **100P Location** — Location de voiture sans permis, 100% en ligne
2. **Rôtisserie** — Au marché couvert de Vichy
3. **Volaillerie** — Au marché couvert de Vichy

---

## Mission Lumi

- **Pack actif :** À confirmer (stratégie digitale en cours)
- **Livrables réalisés :**
  - Site vitrine 100P Location reconstruit
  - Stratégie éditoriale Instagram juillet 2026 (13 posts)
  - Logo système v1.0 VALIDÉ — "100" crème #F4EFE3 + "P" bordeaux #8B1E2F, Inter 900, 8 variantes
- **Mission élargie envisagée :** Outils IA pour rôtisserie/volaillerie

---

## Statut actuel

**EN ATTENTE CLIENT — balle dans le camp de Jean Charles**

- **Site :** Production-ready livré. En attente : Formspree ID + og-image + push GitHub
- **Logo :** Système v1.0 validé par Thibault. Validation formelle par Jean Charles en attente
- **Contenu réseaux :** Calendrier Instagram juillet généré (13 posts), prêt à publier

---

## Points en suspens

- [ ] Jean Charles doit valider formellement le logo système v1.0
- [ ] Push du site sur repo GitHub privé (repo : site-100p-location)
- [ ] Remplacer FORM_ID_PLACEHOLDER dans index.html (Formspree)
- [ ] Créer og-100p.jpg (1200×630px)
- [ ] Convertir PNG en WebP : photo-hero, Aixam, topolino3, aixam2
- [ ] Proposition d'outils IA pour la rôtisserie/volaillerie

---

## Contacts

- **Email :** taret.jean-charles@orange.fr
- **Téléphone :** À compléter

---

## Historique des échanges

| Date | Type | Résumé |
|------|------|--------|
| 2026-06-08 (s13) | Production | 3 passes expertes — PWA manifest créé, site production-ready |
| 2026-06-08 (s8) | Validation | Logo système v1.0 validé — "100" crème + "P" bordeaux, Inter 900 |
| 2026-06-08 | Livrable | Site 100P reconstruit depuis zéro |
| 2026-06-05 | Livrable | Calendrier Instagram juillet 2026 généré (13 posts) |

---

## Notes importantes

- Jean Charles gère 3 activités très différentes
- Prospect idéal pour le Pack IA (sur devis, min. 1 500 €)
$lumi_c4$,
  '2026-06-10T00:00:00Z'
) ON CONFLICT (path) DO UPDATE SET content = EXCLUDED.content, updated_at = EXCLUDED.updated_at;


-- ════ BeLoc.md ════
INSERT INTO jarvis_docs (title, category, path, content, updated_at) VALUES (
  'BeLoc',
  'clients',
  'context/clients/BeLoc.md',
  $lumi_c5$# Client : BeLoc — Location véhicules luxe & premium

> Fiche client vivante. Dernière mise à jour : 2026-06-10

---

## Identité client

- **Nom commercial :** BeLoc
- **Type :** Agence de location de véhicules luxe et premium, 100% en ligne, sans agence physique
- **Zone :** Auvergne-Rhône-Alpes (toute la région)
- **Statut :** Agence récente, en plein développement

---

## Flotte actuelle

| Véhicule | Année |
|----------|-------|
| Audi RS3 | 2025 |
| Golf 8R | 2025 |
| Golf 8 | 2025 |
| Clio 6 Alpine | 2026 |
| Clio 5 | 2025 |

---

## Mission Lumi

- **Pack actif :** Pack Visibilité (890 €/mois) + one-shot site marchand complexe
- **Livrables réalisés :**
  - Site marchand complet (responsive, dark theme, tunnel réservation, FAQ, zones, tarifs)
  - Audit final + 25+ corrections
  - Fiche client interactive (brief-client-beloc.html)
  - Logo système v1.0 VALIDÉ — Space Grotesk 700, or #C9A96E sur fond sombre
  - Stratégie digitale de lancement complète (4 canaux, plan 90 jours)
  - Cahier des charges PDF (CDC-2026-BeLoc-01, 10 sections)
  - Devis PDF (DEV-2026-BeLoc-01, 4 500 € HT)
  - Dossier de livraison complet envoyé

---

## Statut actuel

**EN ATTENTE CLIENT — dossier de livraison envoyé**

- **Site :** Livré. En attente retours recette.
- **Deadline mise en ligne :** 15 juin 2026
- **Photos véhicules :** SVG placeholders en place, vraies photos RS3 et Golf 8R à fournir

---

## Points en suspens (à compléter par le client)

- [ ] Numéro WhatsApp réel (actuellement 33600000000)
- [ ] Vraies photos RS3 et Golf 8R
- [ ] Contenu pages légales (Mentions légales, CGV, Confidentialité)
- [ ] Compte Formspree (formulaire de contact)
- [ ] Choix d'un logo parmi les 6 concepts livrés
- [ ] GA4 Measurement ID
- [ ] Meta Pixel ID
- [ ] SIRET et infos légales complètes

---

## Contacts

- **Email :** À compléter
- **Téléphone :** À compléter

---

## Historique des échanges

| Date | Type | Résumé |
|------|------|--------|
| 2026-06-08 (s11) | Livraison | Audit final, dossier complet, devis 4 500 € HT, CDC |
| 2026-06-08 (s8) | Validation | Logo système v1.0 validé — Space Grotesk or, barre gradient |
| 2026-06-08 (s6) | Livrable | Finition complète site — 30+ améliorations, desktop-ready |
| 2026-06-08 (s4) | Validation | Version desktop stable validée ("top niveau design") |
| 2026-06-04 | Signature | Nouveau client signé |

---

## Notes importantes

- Agence récente : stratégie digitale de lancement critique pour leur croissance
- Cible : particuliers et professionnels en Auvergne-Rhône-Alpes
- Potentiel fort pour Meta Ads et Google Ads une fois le site en ligne
- Upsell naturel : Pack Performance (1 490 €/mois)
$lumi_c5$,
  '2026-06-10T00:00:00Z'
) ON CONFLICT (path) DO UPDATE SET content = EXCLUDED.content, updated_at = EXCLUDED.updated_at;
