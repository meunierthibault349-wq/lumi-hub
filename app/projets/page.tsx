'use client';
import { useState } from 'react';
import { MISSIONS, Mission } from '@/lib/data';
import MissionSlideOver from '@/components/MissionSlideOver';

const CLIENTS = [
  { id: 'CLT-001', name: '100P Location', sector: 'Location voiture sans permis — Jean Charles Taret', color: '#8B1E2F', mrr: '490 €/mois MRR' },
  { id: 'CLT-002', name: 'BeLoc', sector: 'Location véhicules luxe & premium — Auvergne-Rhône-Alpes', color: '#C9A96E', mrr: '890 €/mois MRR' },
];

const CLIENT_MISSIONS: Record<string, Mission[]> = {
  'CLT-001': MISSIONS.filter(m => m.client === '100P Location' || m.client === 'TYT03 — Jean Charles Taret'),
  'CLT-002': MISSIONS.filter(m => m.client === 'BeLoc'),
};

const DEADLINE_COLOR: Record<string, string> = {
  'livré': 'var(--mint)', 'en_cours': 'var(--amber-light)', 'en_attente_client': '#f87171', 'demarrage': 'var(--gray)',
};

export default function ProjetsPage() {
  const [selected, setSelected] = useState<Mission | null>(null);

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Projets</div>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary">+ Nouveau projet</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {CLIENTS.map(client => (
          <div key={client.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '12px 12px 0 0', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: client.color }} />
              <div>
                <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15 }}>{client.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>{client.sector}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--mint)' }}>{client.mrr}</div>
            </div>

            <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
              {/* Header row */}
              <div className="r-mhdr" style={{ display: 'grid', gridTemplateColumns: '1fr 130px 150px 110px 80px', gap: 16, padding: '10px 18px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--gray-dim)' }}>
                <div>Mission</div><div>Statut</div><div>Progression</div><div>Devis</div><div>Deadline</div>
              </div>

              {CLIENT_MISSIONS[client.id]?.map(m => (
                <div key={m.id} onClick={() => setSelected(m)}
                  className="r-mr"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 130px 150px 110px 80px', gap: 16, padding: '12px 18px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,.04)', cursor: 'pointer', transition: 'background .1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 2 }}>{m.ref}</div>
                  </div>
                  <div><span className={`badge badge-${m.status}`}>{m.status.replace(/_/g, ' ')}</span></div>
                  <div className="r-mch" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className={`progress-fill${m.status === 'en_attente_client' ? ' amber' : ''}`} style={{ width: `${m.progress}%` }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--gray)' }}>{m.progress}%</span>
                  </div>
                  <div className="r-mch" style={{ fontSize: 12, color: 'var(--gray)' }}>{m.devis}</div>
                  <div className="r-mch" style={{ fontSize: 12, color: DEADLINE_COLOR[m.status] }}>{m.deadline}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && <MissionSlideOver mission={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
