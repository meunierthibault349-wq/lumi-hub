'use client';
import { useState } from 'react';

type LivrableType = 'site' | 'logo' | 'stratégie' | 'devis' | 'document' | 'outil' | 'facture' | 'calendrier';
type LivrableStatus = 'livré' | 'en cours' | 'en attente';

interface Livrable {
  id: string;
  name: string;
  type: LivrableType;
  status: LivrableStatus;
  description: string;
  date?: string;
  url?: string;
}

interface Section {
  id: string;
  label: string;
  color: string;
  emoji: string;
  livrables: Livrable[];
}

const SECTIONS: Section[] = [
  {
    id: '100P',
    label: '100P Location',
    color: '#8B1E2F',
    emoji: '🚗',
    livrables: [
      {
        id: '100p-site',
        name: 'Site vitrine 100P Location',
        type: 'site',
        status: 'livré',
        date: '2026-06-08',
        description: 'Refonte complète — mobile-first, PWA, SEO, WCAG AA, safe areas iOS. Production-ready. Push GitHub en attente.',
      },
      {
        id: '100p-logo',
        name: 'Logo système v1.0',
        type: 'logo',
        status: 'livré',
        date: '2026-06-08',
        description: '8 variantes — "100" crème #F4EFE3 + "P" bordeaux #8B1E2F, Inter 900. Validé par Thibault, validation Jean Charles en attente.',
      },
      {
        id: '100p-instagram-juillet',
        name: 'Stratégie Instagram juillet 2026',
        type: 'calendrier',
        status: 'livré',
        date: '2026-06-05',
        description: '13 posts avec captions complètes, hashtags mixtes (populaires + niche), recommandations horaires.',
      },
      {
        id: '100p-ia-rotisserie',
        name: 'Outils IA Rôtisserie/Volaillerie',
        type: 'outil',
        status: 'en cours',
        description: 'Mission élargie TYT03. Programme fidélité livré. Devis Pack IA (min. 1 500 €) à construire.',
      },
    ],
  },
  {
    id: 'BeLoc',
    label: 'BeLoc',
    color: '#C9A96E',
    emoji: '🏎️',
    livrables: [
      {
        id: 'beloc-site',
        name: 'Site marchand BeLoc',
        type: 'site',
        status: 'en attente',
        date: '2026-06-08',
        url: 'https://meunierthibault349-wq.github.io/beloc-site/',
        description: 'Dark theme, tunnel réservation, FAQ, zones livraison, tarifs. Audit final 25+ corrections. En attente retours recette client.',
      },
      {
        id: 'beloc-logo',
        name: 'Logo système v1.0',
        type: 'logo',
        status: 'livré',
        date: '2026-06-08',
        description: 'Space Grotesk 700, or #C9A96E sur fond sombre. Barre gradient gauche signature. 6 concepts livrés, choix client en attente.',
      },
      {
        id: 'beloc-devis',
        name: 'Devis DEV-2026-BeLoc-01',
        type: 'devis',
        status: 'livré',
        date: '2026-06-08',
        description: 'Proposition commerciale complète — 4 500 € HT. Pack Visibilité 890 €/mois + one-shot site marchand.',
      },
      {
        id: 'beloc-cdc',
        name: 'Cahier des charges CDC-2026-BeLoc-01',
        type: 'document',
        status: 'livré',
        date: '2026-06-08',
        description: '10 sections — périmètre technique, design, fonctionnalités, planning, conditions.',
      },
      {
        id: 'beloc-strategie',
        name: 'Stratégie digitale de lancement',
        type: 'stratégie',
        status: 'livré',
        date: '2026-06-08',
        description: 'Positionnement luxe/premium, 4 canaux (SEO, Meta Ads, Instagram, GMB), plan 90 jours, budget pub estimé.',
      },
      {
        id: 'beloc-brief',
        name: 'Brief client interactif',
        type: 'document',
        status: 'livré',
        date: '2026-06-08',
        description: 'Fiche client interactive HTML — profil, flotte, objectifs, points en suspens.',
      },
      {
        id: 'beloc-livraison',
        name: 'Dossier de livraison complet',
        type: 'document',
        status: 'livré',
        date: '2026-06-08',
        description: 'Package complet : devis PDF + CDC PDF + code source site + note de valeur.',
      },
    ],
  },
  {
    id: 'TYT03',
    label: 'TYT03 / Rôtisserie',
    color: '#EF9F27',
    emoji: '🍗',
    livrables: [
      {
        id: 'tyt03-fidelite',
        name: 'Programme fidélité client',
        type: 'outil',
        status: 'livré',
        date: '2026-06-08',
        description: 'Interface caisse (scan/enregistrement achat), dashboard analytics ventes, système de points. 3 vues : index, caisse, dashboard.',
      },
      {
        id: 'tyt03-devis-ia',
        name: 'Devis Pack IA rôtisserie',
        type: 'devis',
        status: 'en cours',
        description: 'Pack IA sur devis (min. 1 500 €) à construire — outils IA pour la caisse, les stocks et le pilotage.',
      },
    ],
  },
  {
    id: 'cabinet',
    label: 'Cabinet Lumi',
    color: '#0d9488',
    emoji: '🏢',
    livrables: [
      {
        id: 'cabinet-offre',
        name: 'Offre commerciale Lumi',
        type: 'document',
        status: 'livré',
        description: 'Présentation des 4 packs (Starter, Visibilité, Performance, IA), tarifs, conditions.',
      },
      {
        id: 'cabinet-simulateur',
        name: 'Simulateur de devis',
        type: 'outil',
        status: 'livré',
        description: 'Outil interne pour simuler le pack optimal selon le profil prospect.',
      },
      {
        id: 'cabinet-agents',
        name: 'Infrastructure IA — 20 agents',
        type: 'outil',
        status: 'livré',
        date: '2026-06-10',
        description: '20 agents actifs en 5 pôles : contenu, acquisition, web, pilotage, opérations. Tous opérationnels dans le Hub.',
      },
    ],
  },
];

const TYPE_CONFIG: Record<LivrableType, { label: string; color: string; bg: string }> = {
  site: { label: 'Site web', color: '#60a5fa', bg: 'rgba(96,165,250,.12)' },
  logo: { label: 'Logo', color: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
  stratégie: { label: 'Stratégie', color: '#34d399', bg: 'rgba(52,211,153,.12)' },
  devis: { label: 'Devis', color: '#fbbf24', bg: 'rgba(251,191,36,.12)' },
  document: { label: 'Document', color: '#94a3b8', bg: 'rgba(148,163,184,.12)' },
  outil: { label: 'Outil IA', color: '#0d9488', bg: 'rgba(13,148,136,.12)' },
  facture: { label: 'Facture', color: '#f87171', bg: 'rgba(248,113,113,.12)' },
  calendrier: { label: 'Calendrier', color: '#fb923c', bg: 'rgba(251,146,60,.12)' },
};

const STATUS_CONFIG: Record<LivrableStatus, { label: string; color: string; dot: string }> = {
  'livré': { label: 'Livré', color: 'var(--mint)', dot: '#10b981' },
  'en cours': { label: 'En cours', color: 'var(--amber)', dot: '#f59e0b' },
  'en attente': { label: 'En attente', color: 'var(--gray)', dot: '#64748b' },
};

export default function LivrablesPage() {
  const [filter, setFilter] = useState<string>('all');

  const allCount = SECTIONS.reduce((acc, s) => acc + s.livrables.length, 0);
  const livrésCount = SECTIONS.reduce((acc, s) => acc + s.livrables.filter(l => l.status === 'livré').length, 0);

  return (
    <>
      {/* Header */}
      <div style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Livrables</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          {livrésCount}/{allCount} livrés
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['all', ...SECTIONS.map(s => s.id)].map(id => {
            const section = SECTIONS.find(s => s.id === id);
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: `1px solid ${filter === id ? (section?.color ?? 'var(--teal)') : 'rgba(255,255,255,.08)'}`,
                  background: filter === id ? `${section?.color ?? '#0d9488'}18` : 'transparent',
                  color: filter === id ? (section?.color ?? 'var(--teal-light)') : 'var(--gray)',
                  fontSize: 12,
                  fontWeight: filter === id ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all .15s',
                }}
              >
                {id === 'all' ? 'Tous' : (section?.label ?? id)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {SECTIONS.filter(s => filter === 'all' || s.id === filter).map(section => (
          <div key={section.id}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${section.color}30` }}>
              <span style={{ fontSize: 20 }}>{section.emoji}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15, color: section.color }}>
                  {section.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>
                  {section.livrables.filter(l => l.status === 'livré').length}/{section.livrables.length} livrables complétés
                </div>
              </div>
            </div>

            {/* Livrables grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {section.livrables.map(livrable => {
                const typeConf = TYPE_CONFIG[livrable.type];
                const statusConf = STATUS_CONFIG[livrable.status];
                return (
                  <div
                    key={livrable.id}
                    style={{
                      background: 'var(--night-2)',
                      border: '1px solid rgba(255,255,255,.06)',
                      borderRadius: 12,
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      transition: 'border-color .15s',
                    }}
                  >
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 5,
                        background: typeConf.bg,
                        color: typeConf.color,
                        flexShrink: 0,
                      }}>
                        {typeConf.label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusConf.dot }} />
                        <span style={{ fontSize: 11, color: statusConf.color }}>{statusConf.label}</span>
                      </div>
                    </div>

                    {/* Name */}
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--white)', lineHeight: 1.3 }}>
                      {livrable.name}
                    </div>

                    {/* Description */}
                    <div style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.5, flex: 1 }}>
                      {livrable.description}
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      {livrable.date ? (
                        <span style={{ fontSize: 11, color: 'var(--gray-dim)' }}>
                          {new Date(livrable.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      ) : <span />}
                      {livrable.url && (
                        <a
                          href={livrable.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '4px 10px',
                            background: `${section.color}18`,
                            border: `1px solid ${section.color}40`,
                            borderRadius: 6,
                            color: section.color,
                            fontSize: 11,
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          Voir
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
