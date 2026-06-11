export interface AgentDef {
  /** Prénom de l'agent (seed DiceBear) */
  firstName: string;
  /** Nom du rôle affiché dans l'UI */
  n: string;
  /** Emoji conservé pour la rétrocompatibilité (Morning page, etc.) */
  e: string;
  /** Superpower affiché au hover */
  superpower?: string;
  /** Agent à recruter — carte en pointillés */
  recruit?: boolean;
}

export interface PoleData {
  pole: string;
  /** Couleur accentuation du pôle (teinte hex) */
  color: string;
  agents: AgentDef[];
}

export const AGENTS_DATA: PoleData[] = [
  {
    pole: 'Contenu & Réseaux',
    color: '#0D9488',
    agents: [
      { firstName: 'Sophie', n: 'Editorial Director', e: '🎬', superpower: 'Orchestre 4 réseaux et 20 posts en une seule instruction' },
      { firstName: 'Emma',   n: 'Instagram',          e: '📱', superpower: 'Génère des captions virales + hashtags en 30 secondes' },
      { firstName: 'Lucas',  n: 'Facebook',            e: '👤', superpower: 'Anime ta page Facebook et fidélise ta communauté locale' },
      { firstName: 'Thomas', n: 'LinkedIn',            e: '💼', superpower: 'Posts LinkedIn B2B qui décrochent des rendez-vous' },
      { firstName: 'Léa',    n: 'TikTok',              e: '🎵', superpower: 'Scripts TikTok tendance, prêts à filmer avec ton iPhone' },
      { firstName: 'Marie',  n: 'Email Marketing',     e: '✉️', superpower: 'Séquences email qui convertissent, sans spammer' },
      { firstName: 'Chloé',  n: 'Copywriter',          e: '✍️', recruit: true },
    ],
  },
  {
    pole: 'Web & Tech',
    color: '#5DCAA5',
    agents: [
      { firstName: 'Maxime', n: 'Web Developer',    e: '🌐', superpower: 'Site vitrine production-ready livré en quelques heures' },
      { firstName: 'Kevin',  n: 'Mobile Dev',        e: '📲', superpower: 'Expérience mobile irréprochable sur tous les écrans' },
      { firstName: 'Julie',  n: 'SEO',               e: '🔍', superpower: "Audit SEO complet et plan d'action priorisé" },
      { firstName: 'Pierre', n: 'Google My Business', e: '📍', superpower: 'Fiche Google optimisée pour dominer la recherche locale' },
      { firstName: 'Chloé',  n: 'Branding',          e: '🎨', recruit: true },
    ],
  },
  {
    pole: 'Apps & Hub',
    color: '#6366F1',
    agents: [
      { firstName: 'Élise',   n: 'UX Designer',       e: '🎨', superpower: 'Transforme une idée floue en parcours utilisateur clair' },
      { firstName: 'Adrien',  n: 'Frontend React',    e: '⚛️', superpower: 'Composants React production-ready en quelques minutes' },
      { firstName: 'Romain',  n: 'Backend Supabase',  e: '🗄️', superpower: 'Backend sécurisé avec RLS policies sans effort' },
      { firstName: 'Mathieu', n: 'QA',                e: '🧪', superpower: 'Zéro bug en prod grâce aux tests E2E automatisés' },
    ],
  },
  {
    pole: 'Growth & Acquisition',
    color: '#EF9F27',
    agents: [
      { firstName: 'Camille', n: 'Meta Ads',   e: '📣', superpower: 'Campagnes Meta Ads qui convertissent sur petits budgets' },
      { firstName: 'Nathan',  n: 'Google Ads', e: '🔎', superpower: 'Google Ads pour capter les clients prêts à acheter' },
      { firstName: 'Alex',    n: 'Prospection', e: '🎯', superpower: 'Listes prospects qualifiés + coordonnées en quelques minutes' },
      { firstName: 'Sarah',   n: 'Devis',       e: '📋', superpower: 'Propositions commerciales convaincantes et bien chiffrées' },
      { firstName: 'Victor',  n: 'IA Builder',  e: '🤖', recruit: true },
    ],
  },
  {
    pole: 'Client Success',
    color: '#A855F7',
    agents: [
      { firstName: 'Charlotte', n: 'Onboarding',      e: '🚀', superpower: 'Nouveau client opérationnel en 24h top chrono' },
      { firstName: 'Hugo',      n: 'Account Manager', e: '🤝', superpower: 'Relation client impeccable, zéro friction' },
      { firstName: 'Pauline',   n: 'Analytics',       e: '📊', superpower: 'Données brutes transformées en décisions actionnables' },
      { firstName: 'Raphaël',   n: 'Project Manager', e: '📁', superpower: 'Missions structurées, délais tenus, livrables propres' },
    ],
  },
  {
    pole: 'Opérations Cabinet',
    color: '#F43F5E',
    agents: [
      { firstName: 'Claire', n: 'Finance',      e: '💰', superpower: 'MRR, trésorerie et facturation sous contrôle' },
      { firstName: 'Jade',   n: 'Contenu Lumi', e: '✨', superpower: 'Contenu Lumi qui attire de nouveaux prospects chaque semaine' },
      { firstName: 'Matthieu', n: 'Legal',      e: '⚖️', recruit: true },
      { firstName: 'Inès',   n: 'Copywriter',   e: '✍️', recruit: true },
    ],
  },
];

export const MORNING_AGENTS = [
  { e: '🌐', n: 'Web Developer',  firstName: 'Maxime',   reason: 'Site BeLoc à finaliser' },
  { e: '🤝', n: 'Account Manager', firstName: 'Hugo',    reason: 'Relance BeLoc infos manquantes' },
  { e: '📱', n: 'Instagram',       firstName: 'Emma',    reason: 'Calendrier 100P juillet' },
  { e: '💰', n: 'Finance',         firstName: 'Claire',  reason: 'Facture BeLoc juin à envoyer' },
];
