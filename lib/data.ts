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
      { firstName: 'Lucas',  n: 'Facebook',           e: '👤', superpower: 'Anime ta page Facebook et fidélise ta communauté locale' },
      { firstName: 'Thomas', n: 'LinkedIn',           e: '💼', superpower: 'Posts LinkedIn B2B qui décrochent des rendez-vous' },
      { firstName: 'Léa',    n: 'TikTok',             e: '🎵', superpower: 'Scripts TikTok tendance, prêts à filmer avec ton iPhone' },
      { firstName: 'Jade',   n: 'Contenu Lumi',       e: '✨', superpower: 'Contenu Lumi qui attire de nouveaux prospects chaque semaine' },
      { firstName: 'Chloé',  n: 'Copywriter',         e: '✍️', superpower: 'Textes qui convertissent sur tous les formats web et print' },
    ],
  },
  {
    pole: 'Web & Tech',
    color: '#5DCAA5',
    agents: [
      { firstName: 'Maxime', n: 'Web Developer',      e: '🌐', superpower: 'Site vitrine production-ready livré en quelques heures' },
      { firstName: 'Kevin',  n: 'Mobile Dev',          e: '📲', superpower: 'Expérience mobile irréprochable sur tous les écrans' },
      { firstName: 'Julie',  n: 'SEO',                 e: '🔍', superpower: "Audit SEO complet et plan d'action priorisé" },
      { firstName: 'Théo',   n: 'Branding',            e: '🎨', superpower: 'Systèmes logo et chartes graphiques livrés en SVG/HTML' },
      { firstName: 'Pierre', n: 'Google My Business',  e: '📍', superpower: 'Fiche Google optimisée pour dominer la recherche locale' },
      { firstName: 'Élise',  n: 'UX Designer',         e: '✏️', superpower: 'Transforme une idée floue en parcours utilisateur clair' },
      { firstName: 'Adrien', n: 'Frontend React',      e: '⚛️', superpower: 'Composants React production-ready en quelques minutes' },
      { firstName: 'Romain', n: 'Backend Supabase',    e: '🗄️', superpower: 'Backend sécurisé avec RLS policies sans effort' },
    ],
  },
  {
    pole: 'Pub payante',
    color: '#EF9F27',
    agents: [
      { firstName: 'Camille', n: 'Meta Ads',   e: '📣', superpower: 'Campagnes Meta Ads qui convertissent sur petits budgets' },
      { firstName: 'Nathan',  n: 'Google Ads', e: '🔎', superpower: 'Google Ads pour capter les clients prêts à acheter' },
    ],
  },
  {
    pole: 'Ops clients',
    color: '#A855F7',
    agents: [
      { firstName: 'Sarah',     n: 'Devis',           e: '📋', superpower: 'Propositions commerciales convaincantes et bien chiffrées' },
      { firstName: 'Charlotte', n: 'Onboarding',      e: '🚀', superpower: 'Nouveau client opérationnel en 24h top chrono' },
      { firstName: 'Hugo',      n: 'Account Manager', e: '🤝', superpower: 'Relation client impeccable, zéro friction' },
      { firstName: 'Matthieu',  n: 'Legal',           e: '⚖️', superpower: 'CGV, mentions légales et contrats web conformes RGPD' },
      { firstName: 'Victor',    n: 'IA Builder',      e: '🤖', superpower: 'Chatbots et workflows N8N clés en main pour tes clients' },
      { firstName: 'Marie',     n: 'Email Marketing', e: '✉️', superpower: 'Séquences email qui convertissent, sans spammer' },
      { firstName: 'Pauline',   n: 'Analytics',       e: '📊', superpower: 'Données brutes transformées en décisions actionnables' },
      { firstName: 'Mathieu',   n: 'QA',              e: '🧪', superpower: 'Zéro bug en prod grâce aux tests E2E automatisés' },
    ],
  },
  {
    pole: 'Cabinet',
    color: '#F43F5E',
    agents: [
      { firstName: 'Claire',   n: 'Finance',          e: '💰', superpower: 'MRR, trésorerie et facturation sous contrôle' },
      { firstName: 'Alex',     n: 'Prospection',      e: '🎯', superpower: 'Listes prospects qualifiés + coordonnées en quelques minutes' },
      { firstName: 'Florian',  n: 'Sales Coach',      e: '🎤', superpower: 'Transforme tes prospects en clients signés' },
      { firstName: 'Raphaël',  n: 'Project Manager',  e: '📁', superpower: 'Missions structurées, délais tenus, livrables propres' },
      { firstName: 'Arthur',   n: 'Jarvis Expert',    e: '⚡', superpower: 'Workspace Jarvis toujours opérationnel et à jour' },
    ],
  },
];

export const MORNING_AGENTS = [
  { e: '🤝', n: 'Account Manager', firstName: 'Hugo',    reason: 'Relance BeLoc + 100P — signatures devis en attente' },
  { e: '🎯', n: 'Prospection',     firstName: 'Alex',    reason: 'MRR à 490 € — trouver 5 nouveaux clients' },
  { e: '📱', n: 'Instagram',       firstName: 'Emma',    reason: 'Calendrier 100P juillet à préparer' },
  { e: '⚖️', n: 'Legal',           firstName: 'Matthieu', reason: 'Contrats BeLoc + 100P à formaliser' },
];
