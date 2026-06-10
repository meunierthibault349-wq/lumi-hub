'use client';
import { useState, useEffect } from 'react';
import { supabase, ClientRow, InvoiceRow } from '@/lib/supabase';

const OBJECTIF = 5000;

const STATUS_LABEL: Record<string, string> = {
  encaisse: 'Encaissé', en_attente: 'En attente', a_faire: 'À envoyer',
};
const STATUS_COLOR: Record<string, string> = {
  encaisse: 'var(--mint)', en_attente: 'var(--amber)', a_faire: '#f87171',
};

export default function FinancesPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [filter, setFilter] = useState<'all' | 'encaisse' | 'en_attente' | 'a_faire'>('all');

  useEffect(() => {
    supabase.from('clients').select('*').order('created_at').then(({ data }) => { if (data) setClients(data); });
    supabase.from('invoices').select('*').order('created_at').then(({ data }) => { if (data) setInvoices(data); });
  }, []);

  const mrrTotal = clients.reduce((s, c) => s + c.mrr, 0);
  const mrrEncaisse = clients.filter(c => c.status === 'actif').reduce((s, c) => s + c.mrr, 0);
  const mrrAFacturer = clients.filter(c => c.status !== 'actif').reduce((s, c) => s + c.mrr, 0);
  const gap = Math.max(0, OBJECTIF - mrrTotal);
  const mrrPct = mrrTotal > 0 ? Math.min(100, (mrrTotal / OBJECTIF) * 100) : 0;

  const filtered = filter === 'all' ? invoices : invoices.filter(f => f.status === filter);
  const totalEncaisse = invoices.filter(f => f.status === 'encaisse').reduce((s, f) => s + f.amount, 0);
  const totalEnAttente = invoices.filter(f => f.status === 'en_attente' || f.status === 'a_faire').reduce((s, f) => s + f.amount, 0);

  const packsNeeded = gap <= 0 ? [] : [
    { name: 'Starter (490€)', price: 490, count: Math.ceil(gap / 490) },
    { name: 'Visibilité (890€)', price: 890, count: Math.ceil(gap / 890) },
    { name: 'Performance (1490€)', price: 1490, count: Math.ceil(gap / 1490) },
  ];

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

        <div className="panel" style={{ marginBottom: 20, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 4 }}>
                MRR — progression vers l'objectif
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: 36, color: 'var(--teal-light)' }}>
                  {clients.length === 0 ? '…' : `${mrrTotal.toLocaleString('fr-FR')} €`}
                </span>
                <span style={{ fontSize: 15, color: 'var(--gray)' }}>/ {OBJECTIF.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#f87171', fontWeight: 600 }}>
                Il manque {gap.toLocaleString('fr-FR')} €/mois
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>
                {mrrPct.toFixed(1)}% de l'objectif atteint
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--night-4)', borderRadius: 6, height: 12, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 6,
              background: 'linear-gradient(90deg, var(--teal), var(--teal-light))',
              width: `${mrrPct}%`,
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
              <span style={{ fontSize: 12, color: 'var(--gray)' }}>Encaissé : <strong style={{ color: 'var(--mint)' }}>{mrrEncaisse} €</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)' }} />
              <span style={{ fontSize: 12, color: 'var(--gray)' }}>À facturer : <strong style={{ color: 'var(--amber)' }}>{mrrAFacturer} €</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171' }} />
              <span style={{ fontSize: 12, color: 'var(--gray)' }}>Gap objectif : <strong style={{ color: '#f87171' }}>{gap} €</strong></span>
            </div>
          </div>
        </div>

        <div className="r-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          <div className="metric-card">
            <div className="metric-label">MRR contractuel</div>
            <div className="metric-val" style={{ color: 'var(--teal-light)' }}>{clients.length === 0 ? '…' : `${mrrTotal} €`}</div>
            <div className="metric-sub">{clients.length} client{clients.length > 1 ? 's' : ''} signé{clients.length > 1 ? 's' : ''}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Factures encaissées</div>
            <div className="metric-val" style={{ color: 'var(--mint)' }}>{invoices.length === 0 ? '…' : `${totalEncaisse.toLocaleString('fr-FR')} €`}</div>
            <div className="metric-sub">one-shots + abonnements</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">En attente / À envoyer</div>
            <div className="metric-val" style={{ color: 'var(--amber)' }}>{invoices.length === 0 ? '…' : `${totalEnAttente.toLocaleString('fr-FR')} €`}</div>
            <div className="metric-sub">à encaisser ce mois</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">CA juin estimé</div>
            <div className="metric-val">{invoices.length === 0 ? '…' : `${(totalEncaisse + totalEnAttente).toLocaleString('fr-FR')} €`}</div>
            <div className="metric-sub">si tout encaissé</div>
          </div>
        </div>

        <div className="r-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Revenus récurrents</div>
              <span style={{ fontSize: 12, color: 'var(--teal-light)', fontWeight: 600 }}>{mrrTotal} €/mois</span>
            </div>
            {clients.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Chargement…</div>
            )}
            {clients.map(c => (
              <div key={c.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>{c.pack}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c.status === 'actif' ? 'var(--mint)' : 'var(--amber)' }}>
                    {c.mrr} €/mois
                  </div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>
                    <span style={{ padding: '1px 6px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: c.status === 'actif' ? 'rgba(93,202,165,.15)' : 'rgba(239,159,39,.15)', color: c.status === 'actif' ? 'var(--mint)' : 'var(--amber)' }}>
                      {c.status === 'actif' ? 'Encaissé' : 'À facturer'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Projection vers 5 000 €</div>
              <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>−{gap} €</span>
            </div>
            <div style={{ padding: '12px 18px' }}>
              <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 12 }}>
                Pour atteindre l'objectif, il faut signer :
              </div>
              {packsNeeded.map(p => (
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
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--teal-light)' }}>{gap.toLocaleString('fr-FR')} €/mois</div>
              </div>
            </div>
          </div>
        </div>

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

          {invoices.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Chargement…</div>
          )}

          {filtered.map(inv => (
            <div key={inv.id}
              style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 110px', gap: 16, padding: '12px 18px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,.04)', transition: 'background .1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{inv.description}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 2 }}>{inv.date} · {inv.id}</div>
              </div>
              <div className="r-tch" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: inv.client_color, flexShrink: 0 }} />
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
