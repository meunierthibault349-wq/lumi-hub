-- ══════════════════════════════════════════════════════════════════
-- LUMI HUB — Import Jarvis → Hub
-- IDs déterministes via md5()::uuid (idempotent, re-exécutable)
-- ══════════════════════════════════════════════════════════════════

-- ════ 1. TASKS ════

INSERT INTO tasks (id, title, project, priority, due, done, overdue) VALUES
  (md5('done-001-jarvis-install')::uuid,      'Installation Jarvis + configuration workspace personnalisé',                'Interne',        5,  '2026-06-03', true,  false),
  (md5('done-002-paperclip-agents')::uuid,    'Infrastructure IA Lumi — Paperclip + 17 agents Claude Code opérationnels', 'Interne',        5,  '2026-06-05', true,  false),
  (md5('done-003-offre-lumi')::uuid,          'Structuration offre Lumi — 4 packs tarifés + simulateur devis',            'Lumi Cabinet',   5,  '2026-06-06', true,  false),
  (md5('done-004-site-100p')::uuid,           'Reconstruction site 100P Location depuis zéro (HTML/CSS autonome)',        '100P',           5,  '2026-06-08', true,  false),
  (md5('done-005-beloc-mobile')::uuid,        'Site BeLoc mobile — dropdowns repositionnés + footer redesigné',           'BeLoc',          5,  '2026-06-08', true,  false),
  (md5('done-006-beloc-desktop')::uuid,       'Site BeLoc version desktop stable validée (architecture unifiée responsive)','BeLoc',        5,  '2026-06-08', true,  false),
  (md5('done-007-beloc-complet')::uuid,       'Site BeLoc P2/P3 — tunnel réservation, FAQ, tarifs, zones livraison, mentions légales, WhatsApp','BeLoc', 5, '2026-06-08', true, false),
  (md5('done-008-beloc-finition')::uuid,      'Site BeLoc finition production — 30+ correctifs, vehicule.html, fiche brief client','BeLoc',  5,  '2026-06-08', true,  false),
  (md5('done-009-charte-lumi')::uuid,         'Charte graphique Lumi + logo Concept 05 "L Négatif Glow" + templates réseaux sociaux','Lumi Cabinet', 5, '2026-06-08', true, false),
  (md5('done-010-logo-100p')::uuid,           'Logo 100P système v1.0 validé — "100" crème + "P" bordeaux Inter 900',    '100P',           5,  '2026-06-08', true,  false),
  (md5('done-011-logo-beloc')::uuid,          'Logo BeLoc système v1.0 validé — Space Grotesk, palette Or #C9A96E sur fond sombre','BeLoc', 5,  '2026-06-08', true,  false),
  (md5('done-012-audit-sites')::uuid,         'Audit expert multi-agents — sites 100P et BeLoc élevés au niveau production','Interne',      5,  '2026-06-08', true,  false),
  (md5('done-013-brainstorm-site-lumi')::uuid,'Brainstorm site Lumi — direction créative validée (personnages SVG, 17 agents IA, storytelling)','Lumi Cabinet', 5, '2026-06-08', true, false),
  (md5('done-014-tdl-tool')::uuid,            'TDL interactive — Lumi Task Manager (HTML + /todo Jarvis + auto-save IndexedDB)','Interne',   5,  '2026-06-08', true,  false),
  (md5('task-001-beloc-photos')::uuid,        'Récupérer les vraies photos RS3 et Golf 8R auprès du client BeLoc',        'BeLoc',          8,  '2026-06-05', false, true),
  (md5('task-002-beloc-infos-tech')::uuid,    'Récupérer infos techniques BeLoc — GA4, Meta Pixel, Formspree, numéro WhatsApp, SIRET','BeLoc', 8, '2026-06-12', false, false),
  (md5('task-003-beloc-strategie')::uuid,     'Stratégie digitale BeLoc — Meta Ads, SEO local, contenu réseaux sociaux',  'BeLoc',          7,  '2026-06-20', false, false),
  (md5('task-004-100p-strategie')::uuid,      'Calendrier éditorial 100P Location — posts juillet 2026 (Instagram + Facebook)','100P',      6,  '2026-06-15', false, false),
  (md5('task-005-100p-ia')::uuid,             'Développer outils IA rôtisserie/volaillerie pour Jean Charles (TYT03)',     '100P',           5,  '2026-06-25', false, false),
  (md5('task-006-lumi-site')::uuid,           'Lancer agent web-developer-lumi pour construire le site Lumi (brief validé session 10)','Lumi Cabinet', 9, '2026-06-15', false, false),
  (md5('task-007-lumi-offre-hub')::uuid,      'Finaliser la page offre Lumi Hub (pricing + fonctionnalités)',              'Lumi Cabinet',   6,  '2026-06-11', false, false),
  (md5('task-008-prospection-vichy')::uuid,   'Contacter 5 restaurants du centre-ville de Vichy pour démo site vitrine',  'Prospection',    7,  '2026-06-13', false, false),
  (md5('task-009-interne-facture')::uuid,     'Envoyer la facture de juin à BeLoc (Pack Visibilité 890 €)',                'Interne',        8,  '2026-06-10', false, true),
  (md5('recur-001-facture-beloc')::uuid,      'Facture mensuelle BeLoc',                                                   'Interne',        7,  '2026-07-01', false, false),
  (md5('recur-002-point-clients')::uuid,      'Point mensuel clients (100P + BeLoc)',                                      'Interne',        6,  '2026-06-25', false, false),
  (md5('recur-003-bilan-semaine')::uuid,      'Bilan semaine + /weekly',                                                   'Interne',        5,  '2026-06-12', false, false),
  (md5('recur-004-veille-lumi')::uuid,        'Veille actualités Lumi (/morning)',                                         'Interne',        4,  '2026-06-09', false, true)
ON CONFLICT (id) DO UPDATE SET
  title    = EXCLUDED.title,
  project  = EXCLUDED.project,
  priority = EXCLUDED.priority,
  due      = EXCLUDED.due,
  done     = EXCLUDED.done,
  overdue  = EXCLUDED.overdue;


-- ════ 2. CHRONO SESSIONS ════

INSERT INTO chrono_sessions (id, description, project, start_ts, end_ts) VALUES
  (
    md5('chrono-jarvis-20260608-initial')::uuid,
    'Jarvis v2 — agents, charte graphique, time tracking',
    'Interne',
    1780797600000,
    1780869540000
  )
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  project     = EXCLUDED.project,
  start_ts    = EXCLUDED.start_ts,
  end_ts      = EXCLUDED.end_ts;
