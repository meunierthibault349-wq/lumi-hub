export interface AgentDef {
  e: string;
  n: string;
  recruit?: boolean;
}

export interface PoleData {
  pole: string;
  agents: AgentDef[];
}

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

export const MORNING_AGENTS = [
  { e: '🌐', n: 'Web Developer', reason: 'Site BeLoc à finaliser' },
  { e: '🤝', n: 'Account Manager', reason: 'Relance BeLoc infos manquantes' },
  { e: '📱', n: 'Instagram', reason: 'Calendrier 100P juillet' },
  { e: '💰', n: 'Finance', reason: 'Facture BeLoc juin à envoyer' },
];
