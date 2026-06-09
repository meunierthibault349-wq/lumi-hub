'use client';
import { useState } from 'react';

const MRR_ENCAISSE = 490;
const MRR_A_FACTURER = 890;
const MRR_TOTAL = MRR_ENCAISSE + MRR_A_FACTURER;
const OBJECTIF = 5000;
const GAP = OBJECTIF - MRR_TOTAL;

const CLIENTS = [
  {
    id: 'C1', name: '100P Location', color: '#8B1E2F', mrr: 490,
    pack: 'Pack Starter', status: 'encaisse' as const, contact: 'Jean Charles Taret',
    prochaineFact: '1 juil. 2026',
  },
  {
    id: 'C2', name: 'BeLoc', color: '#C9A96E', mrr: 890,
    pack: 'Pack Visibilité', status: 'a_facturer' as const, contact: 'BeLoc',
    prochaineFact: '10 juin 2026',
  },
];

interface Invoice {
  id: string; client: string; clientColor: string; desc: string;
  amount: number; date: string; status: 'encaisse' | 'en_attente' | 'a_faire';
}

const INVOICES: Invoice[] = [
  { id: 'F001', client: '100P Location', clientColor: '#8B1E2F', desc: 'Site Internet 100P Location', amount: 1400, date: 'juin 2026', status: 'encaisse' },
  { id: 'F002', client: 'BeLoc', clientColor: '#C9A96E', desc: 'Site Internet Marchand BeLoc — Pack Dev', amount: 4500, date: 'juin 2026', status: 'en_attente' },
  { id: 'F003', client: 'BeLoc', clientColor: '#C9A96E', desc: 'Pack Visibilité — juin 2026', amount: 890, date: 'juin 2026', status: 'a_faire' },
  { id: 'F004', client: '100P Location', clientColor: '#8B1E2F', desc: 'Pack Starter — juin 2026', amount: 490, date: 'juin 2026', status: 'encaisse' },
  { id: 'F005', client: 'TYT03 — Jean Charles Taret', clientColor: '#8B1E2F', desc: 'Outil IA Rôtisserie — devis à construire', amount: 1500, date: 'juil. 2026', status: 'a_faire' },
];

const PACKS_NEEDED: { name: string; price: number; count: number }[] = (() => {
  const remaining = GAP;
  if (remaining <= 0) return [];
  return [
    { name: 'Starter (490€)', price: 490, count: Math.ceil(remaining / 490) },
    { name: 'Visibilité (890€)', price: 890, count: Math.ceil(remaining / 890) },
    { name: 'Performance (1490€)', price: 1490, count: Math.ceil(remaining / 1490) },
  ];
})();

const STATUS_LABEL: Record<string, string> = {
  encaisse: 'Encaissé', en_attente: 'En attente', a_faire: 'À envoyer',
};
const STATUS_COLOR: Record<string, string> = {
  encaisse: 'var(--mint)', en_attente: 'var(--amber)', a_faire: '#f87171',
};

export default function FinancesPage() {
  const [filter, setFilter] = useState<'all' | 'encaisse' | 'en_attente' | 'a_faire'>('all');

  const filtered = filter === 'all' ? INVOICES : INVOICES.filter(f => f.status === filter);
  const totalEncaisse = INVOICES.filter(f => f.status === 'encaisse').reduce((s, f) => s + f.amount, 0);
  const totalEnAttente = INVOICES.filter(f => f.status === 'en_attente' || f.status === 'a_faire').reduce((s, f) => s + f.amount, 0);

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Finances</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          Objectif : 5 000 €/mois
        </span>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary r-hm">+ Nouvelle facture</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* MRR Progress */}
        <div className="panel" style={{ marginBottom: 20, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 4 }}>
                MRR — progression vers l'objectif
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: 36, color: 'var(--teal-light)' }}>
                  {MRR_TOTAL.toLocaleString('fr-FR')} €
                </span>
                <span style={{ fontSize: 15, color: 'var(--gray)' }}>/ {OBJECTIF.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#f87171', fontWeight: 600 }}>
                Il manque {GAP.toLocaleString('fr-FR')} €/mois
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>
                {((MRR_TOTAL / OBJECTIF) * 100).toFixed(1)}% de l'objectif atteint
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--night-4)', borderRadius: 6, height: 12, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 6,
              background: 'linear-gradient(90deg, var(--teal), var(--teal-light))',
              width: `${Math.min((MRR_TOTAL / OBJECTIF) * 100, 100)}%`,
              transition: 'width .4s ease',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--teal-light)', border: '2px solid var(--night-2)',
                marginRight: -8,
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, marginTop: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mint)' }} />
              <span style={{ fontSize: 12, color: 'var(--gray)' }}>Encaissé : <strong style={{ color: 'var(--mint)' }}>{MRR_ENCAISSE} €</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)' }} />
              <span style={{ fontSize: 12, color: 'var(--gray)' }}>À facturer : <strong style={{ color: 'var(--amber)' }}>{MRR_A_FACTURER} €</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171' }} />
              <span style={{ fontSize: 12, color: 'var(--gray)' }}>Gap objectif : <strong style={{ color: '#f87171' }}>{GAP} €</strong></span>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="r-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          <div className="metric-card">
            <div className="metric-label">MRR contractuel</div>
            <div className="metric-val" style={{ color: 'var(--teal-light)' }}>{MRR_TOTAL} €</div>
            <div className="metric-sub">2 clients signés</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Factures encaissées</div>
            <div className="metric-val" style={{ color: 'var(--mint)' }}>{totalEncaisse.toLocaleString('fr-FR')} €</div>
            <div className="metric-sub">one-shots + abonnements</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">En attente / À envoyer</div>
            <div className="metric-val" style={{ color: 'var(--amber)' }}>{totalEnAttente.toLocaleString('fr-FR')} €</div>
            <div className="metric-sub">à encaisser ce mois</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">CA juin estimé</div>
            <div className="metric-val">{(totalEncaisse + totalEnAttente).toLocaleString('fr-FR')} €</div>
            <div className="metric-sub">si tout encaissé</div>
          </div>
        </div>

        <div className="r-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Clients actifs */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Revenus récurrents</div>
              <span style={{ fontSize: 12, color: 'var(--teal-light)', fontWeight: 600 }}>{MRR_TOTAL} €/mois</span>
            </div>
            {CLIENTS.map(c => (
              <div key={c.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>{c.pack}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c.status === 'encaisse' ? 'var(--mint)' : 'var(--amber)' }}>
                    {c.mrr} €/mois
                  </div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>
                    <span style={{ padding: '1px 6px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: c.status === 'encaisse' ? 'rgba(93,202,165,.15)' : 'rgba(239,159,39,.15)', color: c.status === 'encaisse' ? 'var(--mint)' : 'var(--amber)' }}>
                      {c.status === 'encaisse' ? 'Encaissé' : 'À facturer'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Projection */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Projection vers 5 000 €</div>
              <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>−{GAP} €</span>
            </div>
            <div style={{ padding: '12px 18px' }}>
              <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 12 }}>
                Pour atteindre l'objectif, il faut signer :
              </div>
              {PACKS_NEEDED.map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--night-3)', borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 13 }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--white)' }}>{p.count}</span>
                    <span style={{ fontSize: 12, color: 'var(--gray)' }}>client{p.count > 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(13,148,136,.08)', borderRadius: 8, border: '1px solid rgba(13,148,136,.15)' }}>
                <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 4 }}>MRR restant à signer</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--teal-light)' }}>{GAP.toLocaleString('fr-FR')} €/mois</div>
              </div>
            </div>
          </div>
        </div>

        {/* Factures */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Suivi des factures</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'a_faire', 'en_attente', 'encaisse'] as const).map(f => (
                <button key={f} className={`btn${filter === f ? ' active' : ''}`}
                  style={filter === f ? { background: 'rgba(13,148,136,.15)', color: 'var(--teal-light)', borderColor: 'rgba(13,148,136,.3)', padding: '4px 10px', fontSize: 12 } : { padding: '4px 10px', fontSize: 12 }}
                  onClick={() => setFilter(f)}>
                  {f === 'all' ? 'Toutes' : STATUS_LABEL[f]}
                </button>
              ))}
            </div>
          </div>

          <div className="r-thdr" style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 110px', gap: 16, padding: '10px 18px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--gray-dim)' }}>
            <div>Description</div><div>Client</div><div>Montant</div><div>Statut</div>
          </div>

          {filtered.map(inv => (
            <div key={inv.id}
              style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 110px', gap: 16, padding: '12px 18px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,.04)', transition: 'background .1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{inv.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 2 }}>{inv.date} · {inv.id}</div>
              </div>
              <div className="r-tch" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: inv.clientColor, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--gray)' }}>{inv.client.split(' ')[0]}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)' }}>
                {inv.amount.toLocaleString('fr-FR')} €
              </div>
              <div>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: inv.status === 'encaisse' ? 'rgba(93,202,165,.15)' : inv.status === 'en_attente' ? 'rgba(239,159,39,.15)' : 'rgba(239,68,68,.15)', color: STATUS_COLOR[inv.status] }}>
                  {STATUS_LABEL[inv.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
