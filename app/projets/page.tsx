'use client';
import { useState, useEffect } from 'react';
import { supabase, ProjectRow, ClientRow } from '@/lib/supabase';
import MissionSlideOver from '@/components/MissionSlideOver';

const STATUTS_PROJET = [
  { value: 'demarrage', label: 'Démarrage' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'en_attente_client', label: 'En attente client' },
  { value: 'livré', label: 'Livré' },
] as const;

type StatutProjet = 'demarrage' | 'en_cours' | 'en_attente_client' | 'livré';

export default function ProjetsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [selected, setSelected] = useState<ProjectRow | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    client_id: '',
    devis: '',
    deadline: '',
    status: 'demarrage' as StatutProjet,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('*').order('created_at'),
      supabase.from('clients').select('*').order('created_at'),
    ]).then(([projectsRes, clientsRes]) => {
      const firstError = projectsRes.error || clientsRes.error;
      if (firstError) {
        setError(firstError.message);
      } else {
        if (projectsRes.data) setProjects(projectsRes.data);
        if (clientsRes.data) setClients(clientsRes.data);
      }
      setLoading(false);
    });
  }, []);

  function handleSave(updated: ProjectRow) {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelected(updated);
  }

  function openModal() {
    setForm({ title: '', client_id: clients[0]?.id ?? '', devis: '', deadline: '', status: 'demarrage' });
    setShowModal(true);
  }

  async function createProject() {
    if (!form.title.trim() || !form.client_id) return;
    setSaving(true);
    const client = clients.find(c => c.id === form.client_id);
    const { data, error } = await supabase.from('projects').insert([{
      id: 'PRJ-' + Date.now(),
      title: form.title,
      client_id: form.client_id,
      client: client?.name ?? '',
      client_color: client?.color ?? '#0D9488',
      status: form.status,
      devis: form.devis,
      deadline: form.deadline,
      progress: 0,
      priority: 'normale',
      ref: '',
      summary: '',
      livrables: [],
      agents: [],
    }]).select().single();
    setSaving(false);
    if (!error && data) {
      setProjects(prev => [...prev, data]);
      setShowModal(false);
    }
  }

  const DEADLINE_COLOR: Record<string, string> = {
    'livré': 'var(--mint)', 'en_cours': 'var(--amber-light)', 'en_attente_client': '#f87171', 'demarrage': 'var(--gray)',
  };

  return (
    <>
      <div className="r-tb page-topbar">
        <div className="page-title">Projets</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          {projects.filter(p => p.status !== 'livré').length} actifs
        </span>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary r-hm" onClick={openModal}>+ Nouveau projet</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {loading && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Chargement…</div>
        )}
        {!loading && error && (
          <div style={{ padding: 40, textAlign: 'center', color: '#f87171', fontSize: 13 }}>Erreur : {error}</div>
        )}
        {!loading && !error && clients.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Aucun projet pour l'instant.</div>
        )}
        {clients.map(client => {
          const clientProjects = projects.filter(p => p.client === client.name);
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

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-card" style={{ width: 480, maxWidth: '95vw' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16 }}>Nouveau projet</div>
              <button className="btn" style={{ width: 28, height: 28, padding: 0, fontSize: 14 }} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Titre</label>
                <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex : Refonte site web…" autoFocus />
              </div>
              <div>
                <label className="form-label">Client</label>
                <select className="form-select" value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Devis</label>
                  <input className="form-input" value={form.devis} onChange={e => setForm(p => ({ ...p, devis: e.target.value }))} placeholder="Ex : 1 500 €" />
                </div>
                <div>
                  <label className="form-label">Deadline</label>
                  <input className="form-input" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} placeholder="Ex : 30 juin" />
                </div>
              </div>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as StatutProjet }))}>
                  {STATUTS_PROJET.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn primary" onClick={createProject} disabled={saving}>
                {saving ? 'Création…' : 'Créer le projet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
