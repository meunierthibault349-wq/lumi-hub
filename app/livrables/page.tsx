'use client';
import { useState, useEffect, useCallback } from 'react';

// ─── Types statiques ───────────────────────────────────────────────────────────
type LivrableType = 'site' | 'logo' | 'stratégie' | 'devis' | 'document' | 'outil' | 'facture' | 'calendrier';
type LivrableStatus = 'livré' | 'en cours' | 'en attente';

interface Livrable { id: string; name: string; type: LivrableType; status: LivrableStatus; description: string; date?: string; url?: string; }
interface Section { id: string; label: string; color: string; emoji: string; livrables: Livrable[]; }

// ─── Types IA ─────────────────────────────────────────────────────────────────
interface LivrableIA {
  id: string;
  title: string;
  type: string;
  client: string;
  client_color: string;
  content: string;
  agent_mode: string;
  image_url?: string | null;
  status: 'brouillon' | 'validé' | 'livré';
  created_at: string;
}

// ─── Données statiques ────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: '100P', label: '100P Location', color: '#8B1E2F', emoji: '🚗',
    livrables: [
      { id: '100p-site', name: 'Site vitrine 100P Location', type: 'site', status: 'livré', date: '2026-06-08', description: 'Refonte complète — mobile-first, PWA, SEO, WCAG AA. Production-ready. Push GitHub en attente.' },
      { id: '100p-logo', name: 'Logo système v1.0', type: 'logo', status: 'livré', date: '2026-06-08', description: '8 variantes — "100" crème + "P" bordeaux, Inter 900. Validé Thibault, validation Jean Charles en attente.' },
      { id: '100p-instagram-juillet', name: 'Stratégie Instagram juillet 2026', type: 'calendrier', status: 'livré', date: '2026-06-05', description: '13 posts avec captions complètes, hashtags mixtes, recommandations horaires.' },
      { id: '100p-ia-rotisserie', name: 'Outils IA Rôtisserie/Volaillerie', type: 'outil', status: 'en cours', description: 'Mission élargie TYT03. Devis Pack IA (min. 1 500 €) à construire.' },
    ],
  },
  {
    id: 'BeLoc', label: 'BeLoc', color: '#C9A96E', emoji: '🏎️',
    livrables: [
      { id: 'beloc-site', name: 'Site marchand BeLoc', type: 'site', status: 'en attente', date: '2026-06-08', url: 'https://meunierthibault349-wq.github.io/beloc-site/', description: 'Dark theme, tunnel réservation, FAQ, zones livraison, tarifs. En attente retours recette.' },
      { id: 'beloc-logo', name: 'Logo système v1.0', type: 'logo', status: 'livré', date: '2026-06-08', description: 'Space Grotesk 700, or #C9A96E sur fond sombre. 6 concepts livrés, choix client en attente.' },
      { id: 'beloc-devis', name: 'Devis DEV-2026-BeLoc-01', type: 'devis', status: 'livré', date: '2026-06-08', description: 'Proposition commerciale — 4 500 € HT. Pack Visibilité 890 €/mois + one-shot.' },
      { id: 'beloc-cdc', name: 'Cahier des charges CDC-2026-BeLoc-01', type: 'document', status: 'livré', date: '2026-06-08', description: '10 sections — périmètre technique, design, fonctionnalités, planning, conditions.' },
      { id: 'beloc-strategie', name: 'Stratégie digitale de lancement', type: 'stratégie', status: 'livré', date: '2026-06-08', description: 'Positionnement luxe/premium, 4 canaux, plan 90 jours, budget pub estimé.' },
      { id: 'beloc-livraison', name: 'Dossier de livraison complet', type: 'document', status: 'livré', date: '2026-06-08', description: 'Package : devis PDF + CDC PDF + code source + note de valeur.' },
    ],
  },
  {
    id: 'TYT03', label: 'TYT03 / Rôtisserie', color: '#EF9F27', emoji: '🍗',
    livrables: [
      { id: 'tyt03-fidelite', name: 'Programme fidélité client', type: 'outil', status: 'livré', date: '2026-06-08', description: 'Interface caisse, dashboard analytics ventes, système de points.' },
      { id: 'tyt03-devis-ia', name: 'Devis Pack IA rôtisserie', type: 'devis', status: 'en cours', description: 'Pack IA sur devis (min. 1 500 €) — outils IA pour la caisse, stocks, pilotage.' },
    ],
  },
  {
    id: 'cabinet', label: 'Cabinet Lumi', color: '#0d9488', emoji: '🏢',
    livrables: [
      { id: 'cabinet-offre', name: 'Offre commerciale Lumi', type: 'document', status: 'livré', description: '4 packs (Starter, Visibilité, Performance, IA), tarifs, conditions.' },
      { id: 'cabinet-agents', name: 'Infrastructure IA — 20 agents', type: 'outil', status: 'livré', date: '2026-06-10', description: '20 agents actifs en 5 pôles. Tous opérationnels dans le Hub.' },
    ],
  },
];

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  site: { label: 'Site web', color: '#60a5fa', bg: 'rgba(96,165,250,.12)' },
  logo: { label: 'Logo', color: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
  stratégie: { label: 'Stratégie', color: '#34d399', bg: 'rgba(52,211,153,.12)' },
  strategie: { label: 'Stratégie', color: '#34d399', bg: 'rgba(52,211,153,.12)' },
  devis: { label: 'Devis', color: '#fbbf24', bg: 'rgba(251,191,36,.12)' },
  document: { label: 'Document', color: '#94a3b8', bg: 'rgba(148,163,184,.12)' },
  outil: { label: 'Outil IA', color: '#0d9488', bg: 'rgba(13,148,136,.12)' },
  facture: { label: 'Facture', color: '#f87171', bg: 'rgba(248,113,113,.12)' },
  calendrier: { label: 'Calendrier', color: '#fb923c', bg: 'rgba(251,146,60,.12)' },
  'post-instagram': { label: 'Instagram', color: '#e1306c', bg: 'rgba(225,48,108,.12)' },
  'post-linkedin': { label: 'LinkedIn', color: '#0077b5', bg: 'rgba(0,119,181,.12)' },
  'post-facebook': { label: 'Facebook', color: '#1877f2', bg: 'rgba(24,119,242,.12)' },
  'post-tiktok': { label: 'TikTok', color: '#69c9d0', bg: 'rgba(105,201,208,.12)' },
  rapport: { label: 'Rapport', color: '#818cf8', bg: 'rgba(129,140,248,.12)' },
};

const STATUS_IA: Record<string, { label: string; color: string; dot: string }> = {
  brouillon: { label: 'Brouillon', color: '#94a3b8', dot: '#475569' },
  validé: { label: 'Validé', color: '#34d399', dot: '#10b981' },
  livré: { label: 'Livré', color: '#0d9488', dot: '#0d9488' },
};

function getTypeConf(type: string) {
  return TYPE_CONFIG[type?.toLowerCase()] ?? { label: type ?? '—', color: '#94a3b8', bg: 'rgba(148,163,184,.12)' };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LivrablesPage() {
  const [tab, setTab] = useState<'ia' | 'catalogue'>('ia');
  const [filter, setFilter] = useState('all');
  const [iaLivrables, setIaLivrables] = useState<LivrableIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchLivrables = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/livrables');
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setIaLivrables(data.livrables ?? []);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLivrables(); }, [fetchLivrables]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch('/api/livrables', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    if (res.ok) setIaLivrables(prev => prev.map(l => l.id === id ? { ...l, status: status as LivrableIA['status'] } : l));
  }

  async function deleteLivrable(id: string) {
    const res = await fetch(`/api/livrables?id=${id}`, { method: 'DELETE' });
    if (res.ok) setIaLivrables(prev => prev.filter(l => l.id !== id));
  }

  function copyContent(id: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const iaClients = ['all', ...Array.from(new Set(iaLivrables.map(l => l.client).filter(Boolean)))];
  const filteredIA = filter === 'all' ? iaLivrables : iaLivrables.filter(l => l.client === filter);

  const catalogueAllCount = SECTIONS.reduce((a, s) => a + s.livrables.length, 0);
  const catalogueLivrés = SECTIONS.reduce((a, s) => a + s.livrables.filter(l => l.status === 'livré').length, 0);

  return (
    <>
      {/* Header */}
      <div className="page-topbar">
        <div className="page-title">Livrables</div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--night-3)', borderRadius: 8, padding: 3 }}>
          {[
            { key: 'ia', label: `⚡ Générés par IA${iaLivrables.length ? ` (${iaLivrables.length})` : ''}` },
            { key: 'catalogue', label: `📁 Catalogue (${catalogueLivrés}/${catalogueAllCount})` },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as 'ia' | 'catalogue'); setFilter('all'); }} style={{ padding: '5px 14px', borderRadius: 6, border: 'none', background: tab === t.key ? 'var(--night-2)' : 'transparent', color: tab === t.key ? 'var(--white)' : 'var(--gray)', fontSize: 12, fontWeight: tab === t.key ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Filtres */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {tab === 'ia'
            ? iaClients.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${filter === c ? 'var(--teal)' : 'rgba(255,255,255,.08)'}`, background: filter === c ? 'rgba(13,148,136,.15)' : 'transparent', color: filter === c ? 'var(--teal)' : 'var(--gray)', fontSize: 12, fontWeight: filter === c ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                {c === 'all' ? 'Tous' : c}
              </button>
            ))
            : ['all', ...SECTIONS.map(s => s.id)].map(id => {
              const s = SECTIONS.find(x => x.id === id);
              return (
                <button key={id} onClick={() => setFilter(id)} style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${filter === id ? (s?.color ?? 'var(--teal)') : 'rgba(255,255,255,.08)'}`, background: filter === id ? `${s?.color ?? '#0d9488'}18` : 'transparent', color: filter === id ? (s?.color ?? 'var(--teal)') : 'var(--gray)', fontSize: 12, fontWeight: filter === id ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {id === 'all' ? 'Tous' : (s?.label ?? id)}
                </button>
              );
            })
          }
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* ── Onglet IA ── */}
        {tab === 'ia' && (
          loading ? (
            <div style={{ color: 'var(--gray)', fontSize: 13, textAlign: 'center', marginTop: 60 }}>Chargement...</div>
          ) : fetchError ? (
            <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginTop: 60 }}>Erreur : {fetchError}</div>
          ) : filteredIA.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: 80 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
              <div style={{ color: 'var(--white)', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Aucun livrable généré</div>
              <div style={{ color: 'var(--gray)', fontSize: 13 }}>Utilise le Chef Adjoint pour générer du contenu et sauvegarde-le ici.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredIA.map(liv => {
                const typeConf = getTypeConf(liv.type);
                const statusConf = STATUS_IA[liv.status] ?? STATUS_IA.brouillon;
                const isExpanded = expanded === liv.id;
                const preview = liv.content.slice(0, 220) + (liv.content.length > 220 ? '...' : '');

                return (
                  <div key={liv.id} style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Top */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5, background: typeConf.bg, color: typeConf.color }}>{typeConf.label}</span>
                      {liv.client && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5, background: `${liv.client_color ?? '#0d9488'}18`, color: liv.client_color ?? 'var(--teal)', border: `1px solid ${liv.client_color ?? '#0d9488'}30` }}>{liv.client}</span>
                      )}
                      {liv.agent_mode && (
                        <span style={{ fontSize: 11, color: 'var(--gray-dim)', background: 'var(--night-3)', padding: '3px 8px', borderRadius: 5 }}>MODE : {liv.agent_mode}</span>
                      )}
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusConf.dot }} />
                        <span style={{ fontSize: 11, color: statusConf.color }}>{statusConf.label}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--white)' }}>{liv.title}</div>

                    {/* Image générée */}
                    {liv.image_url && (
                      <div style={{ marginBottom: 4 }}>
                        <img src={liv.image_url} alt="Visuel généré" style={{ width: '100%', maxWidth: 320, borderRadius: 8, display: 'block' }} />
                      </div>
                    )}

                    {/* Content preview */}
                    <div style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {isExpanded ? liv.content : preview}
                    </div>
                    {liv.content.length > 220 && (
                      <button onClick={() => setExpanded(isExpanded ? null : liv.id)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--teal)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                        {isExpanded ? '▲ Réduire' : '▼ Voir tout'}
                      </button>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,.04)', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: 'var(--gray-dim)' }}>
                        {new Date(liv.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                        <a href={`/api/pdf/livrable?livrableId=${liv.id}`} target="_blank" rel="noopener noreferrer"
                          style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(13,148,136,.08)', border: '1px solid rgba(13,148,136,.2)', color: 'var(--teal)', fontSize: 11, fontFamily: 'inherit', fontWeight: 600, textDecoration: 'none' }}>
                          PDF
                        </a>
                        <button onClick={() => copyContent(liv.id, liv.content)} style={{ padding: '4px 10px', borderRadius: 6, background: copied === liv.id ? 'rgba(52,211,153,.12)' : 'var(--night-3)', border: 'none', color: copied === liv.id ? '#34d399' : 'var(--gray)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                          {copied === liv.id ? '✓ Copié' : 'Copier'}
                        </button>
                        {liv.status === 'brouillon' && (
                          <button onClick={() => updateStatus(liv.id, 'validé')} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.25)', color: '#34d399', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                            Valider
                          </button>
                        )}
                        {liv.status === 'validé' && (
                          <button onClick={() => updateStatus(liv.id, 'livré')} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(13,148,136,.1)', border: '1px solid rgba(13,148,136,.25)', color: 'var(--teal)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                            Marquer livré
                          </button>
                        )}
                        <button onClick={() => deleteLivrable(liv.id)} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.2)', color: '#f87171', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── Onglet Catalogue ── */}
        {tab === 'catalogue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {SECTIONS.filter(s => filter === 'all' || s.id === filter).map(section => (
              <div key={section.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${section.color}30` }}>
                  <span style={{ fontSize: 20 }}>{section.emoji}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15, color: section.color }}>{section.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>{section.livrables.filter(l => l.status === 'livré').length}/{section.livrables.length} livrables complétés</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {section.livrables.map(liv => {
                    const typeConf = TYPE_CONFIG[liv.type] ?? { label: liv.type, color: '#94a3b8', bg: 'rgba(148,163,184,.12)' };
                    const statusDot = liv.status === 'livré' ? '#10b981' : liv.status === 'en cours' ? '#f59e0b' : '#64748b';
                    const statusColor = liv.status === 'livré' ? 'var(--mint)' : liv.status === 'en cours' ? 'var(--amber)' : 'var(--gray)';
                    return (
                      <div key={liv.id} style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5, background: typeConf.bg, color: typeConf.color }}>{typeConf.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusDot }} />
                            <span style={{ fontSize: 11, color: statusColor }}>{liv.status}</span>
                          </div>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--white)', lineHeight: 1.3 }}>{liv.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.5, flex: 1 }}>{liv.description}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                          {liv.date ? <span style={{ fontSize: 11, color: 'var(--gray-dim)' }}>{new Date(liv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span> : <span />}
                          {liv.url && (
                            <a href={liv.url} target="_blank" rel="noopener noreferrer" style={{ padding: '4px 10px', background: `${section.color}18`, border: `1px solid ${section.color}40`, borderRadius: 6, color: section.color, fontSize: 11, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                              Voir <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
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
        )}
      </div>
    </>
  );
}
