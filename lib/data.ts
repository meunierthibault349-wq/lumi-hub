export type TaskStatus = 'todo' | 'done';
export type MissionStatus = 'livré' | 'en_cours' | 'en_attente_client' | 'demarrage';

export interface Task {
  id: string;
  title: string;
  project: string;
  due: string;
  overdue: boolean;
  priority: number;
  done: boolean;
}

export interface Livrable {
  icon: string;
  type: string;
  name: string;
}

export interface Mission {
  id: number;
  title: string;
  client: string;
  clientColor: string;
  status: MissionStatus;
  progress: number;
  ref: string;
  devis: string;
  deadline: string;
  summary: string;
  livrables: Livrable[];
  agents: string[];
}

export interface Prospect {
  id: string;
  name: string;
  sector: string;
  tags: string[];
}

export interface AgentDef {
  e: string;
  n: string;
  recruit?: boolean;
}

export interface PoleData {
  pole: string;
  agents: AgentDef[];
}

export const MISSIONS: Mission[] = [
  {
    id: 0, title: 'Site Internet 100P Location', client: '100P Location', clientColor: '#8B1E2F',
    status: 'livré', progress: 100, ref: 'DEV-2026-100P-01', devis: '1 400 € one-shot', deadline: '08 juin 2026',
    summary: 'Site production-ready livré en 3 passes expertes (SEO, accessibilité, mobile). Reste Formspree ID et og-image à fournir par le client.',
    livrables: [{ icon: '🌐', type: 'site', name: 'Site HTML complet' }, { icon: '🎨', type: 'design', name: 'Logo système v1.0' }],
    agents: ['web-developer-lumi', 'mobile-web-developer'],
  },
  {
    id: 1, title: 'Stratégie Digitale 100P', client: '100P Location', clientColor: '#8B1E2F',
    status: 'en_cours', progress: 40, ref: 'Abonnement signé', devis: '490 €/mois', deadline: '08 juillet 2026',
    summary: 'Calendrier éditorial Instagram juillet 2026 généré (13 posts). SEO local et GMB à démarrer.',
    livrables: [],
    agents: ['instagram-content-strategist', 'lumi-seo', 'lumi-google-my-business'],
  },
  {
    id: 2, title: 'Outil IA Rôtisserie & Volaillerie', client: 'TYT03 — Jean Charles Taret', clientColor: '#8B1E2F',
    status: 'demarrage', progress: 10, ref: 'Devis à construire', devis: '~1 500 € estimé', deadline: '31 juillet 2026',
    summary: 'Piste identifiée : outil IA gestion stocks, commandes et recettes pour le marché couvert de Vichy. Devis à construire.',
    livrables: [],
    agents: ['lumi-devis'],
  },
  {
    id: 3, title: 'Site Internet Marchand + Stratégie Digitale', client: 'BeLoc', clientColor: '#C9A96E',
    status: 'en_attente_client', progress: 90, ref: 'DEV-2026-BeLoc-01', devis: '4 500 € + 890 €/mois', deadline: '15 juin 2026 ⚠',
    summary: 'Dossier de livraison complet envoyé (devis 4 500 € + CDC 10 sections). En attente retours recette. 12 infos requises de BeLoc avant mise en ligne.',
    livrables: [
      { icon: '📁', type: 'dossier', name: 'Dossier de livraison' },
      { icon: '🌐', type: 'site', name: 'Site BeLoc (local)' },
      { icon: '🎨', type: 'design', name: 'Logo système v1.0' },
      { icon: '📋', type: 'devis', name: 'Devis DEV-2026-BeLoc-01' },
    ],
    agents: ['web-developer-lumi', 'mobile-web-developer', 'lumi-devis'],
  },
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Lancer agent web-developer-lumi — site Lumi (brief session 10)', project: 'Lumi Cabinet', due: '15 juin', overdue: false, priority: 9, done: false },
  { id: 't2', title: 'Envoyer la facture de juin à BeLoc (Pack Visibilité 890 €)', project: 'Interne', due: '10 juin', overdue: true, priority: 8, done: false },
  { id: 't3', title: 'Récupérer photos RS3 et Golf 8R auprès du client BeLoc', project: 'BeLoc', due: '5 juin', overdue: true, priority: 8, done: false },
  { id: 't4', title: 'Récupérer infos techniques BeLoc (GA4, Meta Pixel, Formspree, WhatsApp, SIRET)', project: 'BeLoc', due: '12 juin', overdue: false, priority: 8, done: false },
  { id: 't5', title: 'Contacter 5 restaurants du centre-ville de Vichy pour démo site vitrine', project: 'Prospection', due: '13 juin', overdue: false, priority: 7, done: false },
  { id: 't6', title: 'Stratégie digitale BeLoc — Meta Ads, SEO local, contenu réseaux', project: 'BeLoc', due: '20 juin', overdue: false, priority: 7, done: false },
  { id: 't7', title: 'Finaliser la page offre Lumi Hub (pricing + fonctionnalités)', project: 'Lumi Cabinet', due: '11 juin', overdue: false, priority: 6, done: false },
  { id: 't8', title: 'Calendrier éditorial 100P Location — posts juillet 2026 (Instagram + Facebook)', project: '100P', due: '15 juin', overdue: false, priority: 6, done: false },
  { id: 't9', title: 'Développer outils IA rôtisserie/volaillerie pour Jean Charles (TYT03)', project: '100P', due: '25 juin', overdue: false, priority: 5, done: false },
];

export const INITIAL_PIPELINE: Record<string, Prospect[]> = {
  froid: [],
  contacte: [],
  chaud: [],
  signe: [
    { id: 'p1', name: '100P Location', sector: 'Location voiture sans permis · Vichy', tags: ['490 €/mois', 'Site livré', 'Stratégie en cours'] },
    { id: 'p2', name: 'BeLoc', sector: 'Location véhicules luxe · Auvergne-Rhône-Alpes', tags: ['890 €/mois', 'Site livré', 'Attente retours'] },
  ],
};

export const AGENTS_DATA: PoleData[] = [
  { pole: 'Contenu & Réseaux', agents: [
    { e: '🎬', n: 'Editorial Director' }, { e: '📱', n: 'Instagram' }, { e: '👤', n: 'Facebook' },
    { e: '💼', n: 'LinkedIn' }, { e: '🎵', n: 'TikTok' }, { e: '✉️', n: 'Email Marketing' },
    { e: '✍️', n: 'Copywriter', recruit: true },
  ]},
  { pole: 'Web & Tech', agents: [
    { e: '🌐', n: 'Web Developer' }, { e: '📲', n: 'Mobile Web Dev' },
    { e: '🔍', n: 'SEO' }, { e: '📍', n: 'Google My Business' },
    { e: '🎨', n: 'Branding', recruit: true },
  ]},
  { pole: 'Growth & Acquisition', agents: [
    { e: '📣', n: 'Meta Ads' }, { e: '🔎', n: 'Google Ads' },
    { e: '🎯', n: 'Prospection' }, { e: '📋', n: 'Devis' },
    { e: '🤖', n: 'IA Builder', recruit: true },
  ]},
  { pole: 'Client Success', agents: [
    { e: '🚀', n: 'Onboarding' }, { e: '🤝', n: 'Account Manager' },
    { e: '📊', n: 'Analytics' }, { e: '📁', n: 'Project Manager' },
  ]},
  { pole: 'Opérations Cabinet', agents: [
    { e: '💰', n: 'Finance' }, { e: '✨', n: 'Contenu Lumi' },
    { e: '⚖️', n: 'Legal', recruit: true },
  ]},
];

export const AGENT_RESPONSES: Record<string, string[]> = {
  'Web Developer': ['Je prends en charge le développement. Quel site ou module veux-tu que je construise ?'],
  'Instagram': ['Prêt à créer du contenu Instagram. Quel client et quel type de post ?'],
  'SEO': ['Je démarre l\'audit SEO. Donne-moi l\'URL du site ou le mot-clé cible.'],
  'Finance': ['MRR actuel : 490 €, objectif 5 000 €. Que veux-tu analyser ?'],
  'default': ['Bonjour ! Je suis prêt à t\'aider. Quelle est ta demande ?'],
};
