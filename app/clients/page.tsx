'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MISSIONS } from '@/lib/data';

const SUGGESTED_AGENTS: Record<string, { e: string; n: string }[]> = {
  'CLT-001': [
    { e: '📱', n: 'Instagram' }, { e: '👤', n: 'Facebook' },
    { e: '🔍', n: 'SEO' }, { e: '📍', n: 'Google My Business' },
    { e: '🤝', n: 'Account Manager' }, { e: '📋', n: 'Devis' },
  ],
  'CLT-002': [
    { e: '🌐', n: 'Web Developer' }, { e: '📣', n: 'Meta Ads' },
    { e: '🔍', n: 'SEO' }, { e: '🤝', n: 'Account Manager' },
    { e: '✉️', n: 'Email Marketing' }, { e: '📊', n: 'Analytics' },
  ],
};

interface PendingItem { text: string; owner: 'lumi' | 'client'; }

interface ClientDef {
  id: string; name: string; color: string; sector: string;
  pack: string; mrr: number; contact: string; email: string;
  status: 'actif' | 'attente_client' | 'demarrage';
  lastContact: string;
  pending: PendingItem[];
  notes: string[];
  vehicles?: { model: string; year: number }[];
}

const CLIENTS: ClientDef[] = [
  {
    id: 'CLT-001', name: '100P Location', color: '#8B1E2F',
    sector: 'Location voiture sans permis — national, 100% en ligne',
    pack: 'Pack Starter', mrr: 490, contact: 'Jean Charles Taret',
    email: 'taret.jean-charles@orange.fr',
    status: 'actif', lastContact: '8 juin 2026',
    pending: [
      { text: 'Valider formellement le logo système v1.0', owner: 'client' },
      { text: 'Push du site 100p-location sur repo GitHub privé', owner: 'lumi' },
      { text: 'Remplacer FORM_ID_PLACEHOLDER (créer compte Formspree)', owner: 'lumi' },
      { text: 'Créer og-100p.jpg (1200×630px)', owner: 'lumi' },
      { text: 'Convertir PNG en WebP (4 images)', owner: 'lumi' },
      { text: 'Construire proposition outils IA rôtisserie/volaillerie', owner: 'lumi' },
    ],
    notes: [
      'Jean Charles gère 3 activités : 100P Location (en ligne) + Rôtisserie + Volaillerie (marché de Vichy).',
      'Les outils IA pour les activités alimentaires sont un angle d\'upsell fort — Pack IA sur devis, min. 1 500 €.',
      'Site production-ready (PWA, SEO, accessibilité WCAG AA, responsive iOS).',
    ],
  },
  {
    id: 'CLT-002', name: 'BeLoc', color: '#C9A96E',
    sector: 'Location véhicules luxe & premium — Auvergne-Rhône-Alpes',
    pack: 'Pack Visibilité', mrr: 890, contact: 'À compléter',
    email: 'À compléter',
    status: 'attente_client', lastContact: '8 juin 2026',
    pending: [
      { text: 'Récupérer vraies photos RS3 et Golf 8R', owner: 'client' },
      { text: 'Récupérer infos légales (SIRET, mentions, CGV)', owner: 'client' },
      { text: 'Récupérer URL définitive du site', owner: 'client' },
      { text: 'Récupérer numéro WhatsApp réel', owner: 'client' },
      { text: 'Récupérer compte Formspree', owner: 'client' },
      { text: 'Récupérer GA4 Measurement ID', owner: 'client' },
      { text: 'Récupérer Meta Pixel ID', owner: 'client' },
      { text: 'Valider choix logo parmi les 6 concepts', owner: 'client' },
      { text: 'Envoyer la facture de juin (Pack Visibilité 890 €)', owner: 'lumi' },
      { text: 'Remplacer [NOM GÉRANT] dans le devis et le CDC', owner: 'lumi' },
    ],
    notes: [
      'Agence récente en plein développement. Cible particuliers et pros en AuRA cherchant un véhicule premium.',
      'Upsell naturel : Pack Performance (1 490 €/mois) avec campagnes Meta Ads et Google Ads.',
      'Devis DEV-2026-BeLoc-01 (4 500 € HT) + Pack Visibilité 890 €/mois signé.',
    ],
    vehicles: [
      { model: 'Audi RS3', year: 2025 }, { model: 'Golf 8R', year: 2025 },
      { model: 'Golf 8', year: 2025 }, { model: 'Clio 6 Alpine', year: 2026 },
      { model: 'Clio 5', year: 2025 },
    ],
  },
];

const STATUS_LABEL: Record<string, string> = {
  actif: 'Actif', attente_client: 'Attente client', demarrage: 'Démarrage',
};
const STATUS_COLOR: Record<string, string> = {
  actif: 'var(--mint)', attente_client: 'var(--amber)', demarrage: 'var(--gray)',
};
const STATUS_BG: Record<string, string> = {
  actif: 'rgba(93,202,165,.15)', attente_client: 'rgba(239,159,39,.15)', demarrage: 'rgba(148,163,184,.1)',
};

export default function ClientsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ClientDef | null>(null);
  const [tab, setTab] = useState<'missions' | 'pending' | 'notes'>('missions');
  const [agentPicker, setAgentPicker] = useState(false);

  function openClient(c: ClientDef) { setSelected(c); setTab('missions'); setAgentPicker(false); }

  function launchAgent(clientId: string, clientName: string, agent: { n: string }) {
    router.push(`/agents?client=${encodeURIComponent(clientName)}&agent=${encodeURIComponent(agent.n)}`);
  }

  const totalMrr = CLIENTS.reduce((s, c) => s + c.mrr, 0);
  const totalPending = CLIENTS.reduce((s, c) => s + c.pending.length, 0);

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Clients</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          {CLIENTS.length} actifs · {totalMrr} €/mois
        </span>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary r-hm">+ Nouveau client</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* KPIs */}
        <div className="r-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <div className="metric-card">
            <div className="metric-label">Clients actifs</div>
            <div className="metric-val" style={{ color: 'var(--mint)' }}>{CLIENTS.length}</div>
            <div className="metric-sub">tous signés</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">MRR total</div>
            <div className="metric-val" style={{ color: 'var(--teal-light)' }}>{totalMrr} €</div>
            <div className="metric-sub">abonnements récurrents</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Actions en attente</div>
            <div className="metric-val" style={{ color: 'var(--amber)' }}>{totalPending}</div>
            <div className="metric-sub">sur tous les clients</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">CA one-shot signé</div>
            <div className="metric-val">5 900 €</div>
            <div className="metric-sub">100P (1 400) + BeLoc (4 500)</div>
          </div>
        </div>

        {/* Client cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CLIENTS.map(c => {
            const missions = MISSIONS.filter(m => m.client.includes(c.name.split(' ')[0]));
            const activeMissions = missions.filter(m => m.status !== 'livré');
            const pendingLumi = c.pending.filter(p => p.owner === 'lumi').length;
            const pendingClient = c.pending.filter(p => p.owner === 'client').length;

            return (
              <div key={c.id} onClick={() => openClient(c)}
                style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)')}>

                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: c.color + '22', border: `1px solid ${c.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>{c.sector}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: 'var(--teal-light)' }}>{c.mrr} €/mois</div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, background: STATUS_BG[c.status], color: STATUS_COLOR[c.status] }}>
                      {STATUS_LABEL[c.status]}
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '12px 20px', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginBottom: 3 }}>Pack</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.pack}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginBottom: 3 }}>Missions actives</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{activeMissions.length} / {missions.length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginBottom: 3 }}>Contact</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.contact}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginBottom: 3 }}>Dernier contact</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.lastContact}</div>
                  </div>
                </div>

                {/* Pending alerts */}
                {(pendingLumi > 0 || pendingClient > 0) && (
                  <div style={{ padding: '8px 20px 12px', display: 'flex', gap: 8 }}>
                    {pendingLumi > 0 && (
                      <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(239,68,68,.12)', color: '#f87171', fontWeight: 600 }}>
                        {pendingLumi} action{pendingLumi > 1 ? 's' : ''} Lumi à faire
                      </span>
                    )}
                    {pendingClient > 0 && (
                      <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(239,159,39,.12)', color: 'var(--amber)', fontWeight: 600 }}>
                        {pendingClient} info{pendingClient > 1 ? 's' : ''} client à récupérer
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-over */}
      {selected && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100 }} onClick={() => setSelected(null)} />
          <div className="slide-over open" style={{ width: 480 }}>
            {/* Header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: selected.color + '22', border: `1px solid ${selected.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: selected.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>{selected.pack} · {selected.mrr} €/mois</div>
              </div>
              <button className="btn" style={{ width: 28, height: 28, padding: 0, fontSize: 14 }} onClick={() => setSelected(null)}>×</button>
            </div>

            {/* Contact bar */}
            <div style={{ padding: '10px 24px', background: 'var(--night-3)', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--gray-dim)', marginBottom: 2 }}>CONTACT</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{selected.contact}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--gray-dim)', marginBottom: 2 }}>EMAIL</div>
                <div style={{ fontSize: 12 }}>{selected.email}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <div style={{ fontSize: 10, color: 'var(--gray-dim)', marginBottom: 2 }}>STATUT</div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 20, background: STATUS_BG[selected.status], color: STATUS_COLOR[selected.status] }}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 24px' }}>
              {(['missions', 'pending', 'notes'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: tab === t ? 'var(--teal-light)' : 'var(--gray)', borderBottom: tab === t ? '2px solid var(--teal)' : '2px solid transparent', transition: 'color .15s' }}>
                  {t === 'missions' ? 'Missions' : t === 'pending' ? `En suspens (${selected.pending.length})` : 'Notes'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

              {tab === 'missions' && (() => {
                const clientMissions = MISSIONS.filter(m => m.client.includes(selected.name.split(' ')[0]));
                if (clientMissions.length === 0) return <div style={{ color: 'var(--gray-dim)', fontSize: 13 }}>Aucune mission.</div>;
                return (
                  <>
                    {clientMissions.map(m => (
                      <div key={m.id} style={{ background: 'var(--night-3)', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(255,255,255,.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{m.title}</div>
                          <span className={`badge badge-${m.status}`} style={{ flexShrink: 0, fontSize: 11 }}>{m.status.replace(/_/g, ' ')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className={`progress-fill${m.status === 'en_attente_client' ? ' amber' : ''}`} style={{ width: `${m.progress}%` }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--gray)', whiteSpace: 'nowrap' }}>{m.progress}%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gray-dim)' }}>
                          <span>{m.ref}</span>
                          <span>{m.devis} · {m.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}

              {tab === 'pending' && (
                <>
                  {(['lumi', 'client'] as const).map(owner => {
                    const items = selected.pending.filter(p => p.owner === owner);
                    if (items.length === 0) return null;
                    return (
                      <div key={owner}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: owner === 'lumi' ? '#f87171' : 'var(--amber)', marginBottom: 8 }}>
                          {owner === 'lumi' ? 'Actions Lumi' : 'Infos à récupérer côté client'}
                        </div>
                        {items.map((p, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 12px', background: 'var(--night-3)', borderRadius: 8, marginBottom: 6, border: `1px solid ${owner === 'lumi' ? 'rgba(239,68,68,.1)' : 'rgba(239,159,39,.1)'}` }}>
                            <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${owner === 'lumi' ? '#f87171' : 'var(--amber)'}`, flexShrink: 0, marginTop: 1 }} />
                            <div style={{ fontSize: 13, lineHeight: 1.4 }}>{p.text}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </>
              )}

              {tab === 'notes' && (
                <>
                  {selected.notes.map((n, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6, background: 'var(--night-3)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${selected.color}` }}>
                      {n}
                    </div>
                  ))}
                  {selected.vehicles && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 8 }}>Flotte</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {selected.vehicles.map(v => (
                          <span key={v.model} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'var(--night-3)', color: 'var(--gray)', border: '1px solid rgba(255,255,255,.06)' }}>
                            {v.model} {v.year}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
              {agentPicker && (
                <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 10 }}>
                    Choisir un agent pour {selected.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {(SUGGESTED_AGENTS[selected.id] ?? []).map(a => (
                      <button key={a.n} onClick={() => launchAgent(selected.id, selected.name, a)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 8px', background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(13,148,136,.4)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,148,136,.08)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.08)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--night-3)'; }}>
                        <span style={{ fontSize: 18 }}>{a.e}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--white)', textAlign: 'center', lineHeight: 1.2 }}>{a.n}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ padding: '16px 24px', display: 'flex', gap: 10 }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => setSelected(null)}>Fermer</button>
                <button className="btn primary" style={{ flex: 1 }} onClick={() => setAgentPicker(p => !p)}>
                  {agentPicker ? 'Annuler' : '⚡ Lancer un agent'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
