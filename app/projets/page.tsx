'use client';
import { useState, useEffect } from 'react';
import { supabase, ProjectRow, ClientRow } from '@/lib/supabase';
import MissionSlideOver from '@/components/MissionSlideOver';

export default function ProjetsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [selected, setSelected] = useState<ProjectRow | null>(null);

  useEffect(() => {
    supabase.from('projects').select('*').order('created_at').then(({ data }) => { if (data) setProjects(data); });
    supabase.from('clients').select('*').order('created_at').then(({ data }) => { if (data) setClients(data); });
  }, []);

  function handleSave(updated: ProjectRow) {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelected(updated);
  }

  const DEADLINE_COLOR: Record<string, string> = {
    'livré': 'var(--mint)', 'en_cours': 'var(--amber-light)', 'en_attente_client': '#f87171', 'demarrage': 'var(--gray)',
  };

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Projets</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          {projects.filter(p => p.status !== 'livré').length} actifs
        </span>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary r-hm">+ Nouveau projet</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {clients.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Chargement…</div>
        )}
        {clients.map(client => {
          const clientProjects = projects.filter(p => p.client_id === client.id);
          if (clientProjects.length === 0) return null;
          return (
            <div key={client.id} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '12px 12px 0 0', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: client.color }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15 }}>{client.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>{client.sector}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--mint)' }}>{client.mrr} €/mois MRR</div>
              </div>

              <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                <div className="r-mhdr" style={{ display: 'grid', gridTemplateColumns: '1fr 130px 150px 110px 80px', gap: 16, padding: '10px 18px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--gray-dim)' }}>
                  <div>Mission</div><div>Statut</div><div>Progression</div><div>Devis</div><div>Deadline</div>
                </div>
                {clientProjects.map(p => (
                  <div key={p.id} onClick={() => setSelected(p)}
                    className="r-mr"
                    style={{ display: 'grid', gridTemplateColumns: '1fr 130px 150px 110px 80px', gap: 16, padding: '12px 18px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,.04)', cursor: 'pointer', transition: 'background .1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 2 }}>{p.ref}</div>
                    </div>
                    <div><span className={`badge badge-${p.status}`}>{p.status.replace(/_/g, ' ')}</span></div>
                    <div className="r-mch" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className={`progress-fill${p.status === 'en_attente_client' ? ' amber' : ''}`} style={{ width: `${p.progress}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--gray)' }}>{p.progress}%</span>
                    </div>
                    <div className="r-mch" style={{ fontSize: 12, color: 'var(--gray)' }}>{p.devis}</div>
                    <div className="r-mch" style={{ fontSize: 12, color: DEADLINE_COLOR[p.status] }}>{p.deadline}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected && <MissionSlideOver project={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
    </>
  );
}
