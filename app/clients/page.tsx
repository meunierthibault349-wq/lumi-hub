'use client';
import { useState, useEffect } from 'react';
import { supabase, ClientRow, ProjectRow } from '@/lib/supabase';
import { CLIENT_AUTO_PALETTE } from '@/lib/client-colors';

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

const STATUS_LABEL: Record<string, string> = {
  actif: 'Actif', attente_client: 'Attente client', demarrage: 'Démarrage',
};
const STATUS_COLOR: Record<string, string> = {
  actif: 'var(--mint)', attente_client: 'var(--amber)', demarrage: 'var(--gray)',
};
const STATUS_BG: Record<string, string> = {
  actif: 'rgba(93,202,165,.15)', attente_client: 'rgba(239,159,39,.15)', demarrage: 'rgba(148,163,184,.1)',
};


const PACKS_CLIENT = ['Pack Starter', 'Pack Visibilité', 'Pack Performance', 'Pack IA'] as const;
type PackClient = typeof PACKS_CLIENT[number];

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [selected, setSelected] = useState<ClientRow | null>(null);
  const [tab, setTab] = useState<'missions' | 'pending' | 'notes'>('missions');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    sector: '',
    pack: 'Pack Starter' as PackClient,
    mrr: '',
    contact: '',
    email: '',
  });

  const [editEmail, setEditEmail] = useState<string | null>(null);
  const [saveEmailError, setSaveEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('clients').select('*').order('created_at'),
      supabase.from('projects').select('*').order('created_at'),
    ]).then(([clientsRes, projectsRes]) => {
      const firstError = clientsRes.error || projectsRes.error;
      if (firstError) {
        setError(firstError.message);
      } else {
        if (clientsRes.data) setClients(clientsRes.data);
        if (projectsRes.data) setProjects(projectsRes.data);
      }
      setLoading(false);
    });
  }, []);

  function openClient(c: ClientRow) { setSelected(c); setTab('missions'); setEditEmail(null); setSaveEmailError(null); }

  async function saveEmail() {
    if (!selected || editEmail === null) return;
    setSaveEmailError(null);
    const { error } = await supabase.from('clients').update({ email: editEmail }).eq('id', selected.id);
    if (!error) {
      const updated = { ...selected, email: editEmail };
      setSelected(updated);
      setClients(prev => prev.map(c => c.id === selected.id ? updated : c));
      setEditEmail(null);
    } else {
      setSaveEmailError('Erreur : ' + error.message);
    }
  }

  function openModal() {
    setForm({ name: '', sector: '', pack: 'Pack Starter', mrr: '', contact: '', email: '' });
    setShowModal(true);
  }

  async function createClient() {
    if (!form.name.trim()) return;
    setSaving(true);
    const color = CLIENT_AUTO_PALETTE[clients.length % CLIENT_AUTO_PALETTE.length];
    const { data, error } = await supabase.from('clients').insert([{
      id: 'CLT-' + Date.now(),
      name: form.name,
      sector: form.sector || 'À compléter',
      pack: form.pack,
      mrr: Number(form.mrr) || 0,
      color,
      status: 'actif' as const,
      contact: form.contact,
      email: form.email,
      last_contact: new Date().toLocaleDateString('fr-FR'),
      pending: [],
      notes: [],
    }]).select().single();
    setSaving(false);
    if (!error && data) {
      setClients(prev => [...prev, data]);
      setShowModal(false);
    }
  }

  async function removePending(text: string) {
    if (!selected) return;
    const newPending = (selected.pending ?? []).filter(p => p.text !== text);
    const { error } = await supabase.from('clients').update({ pending: newPending }).eq('id', selected.id);
    if (!error) {
      const updated = { ...selected, pending: newPending };
      setSelected(updated);
      setClients(prev => prev.map(c => c.id === selected.id ? updated : c));
    }
  }

  const totalMrr = clients.reduce((s, c) => s + c.mrr, 0);
  const totalPending = clients.reduce((s, c) => s + (c.pending ?? []).length, 0);

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Clients</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          {clients.length} actifs · {totalMrr} €/mois
        </span>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary r-hm" onClick={openModal}>+ Nouveau client</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        <div className="r-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <div className="metric-card">
            <div className="metric-label">Clients actifs</div>
            <div className="metric-val" style={{ color: 'var(--mint)' }}>{loading ? '…' : clients.length}</div>
            <div className="metric-sub">tous signés</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">MRR total</div>
            <div className="metric-val" style={{ color: 'var(--teal-light)' }}>{loading ? '…' : `${totalMrr} €`}</div>
            <div className="metric-sub">abonnements récurrents</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Actions en attente</div>
            <div className="metric-val" style={{ color: 'var(--amber)' }}>{loading ? '…' : totalPending}</div>
            <div className="metric-sub">sur tous les clients</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">CA one-shot signé</div>
            <div className="metric-val">5 900 €</div>
            <div className="metric-sub">100P (1 400) + BeLoc (4 500)</div>
          </div>
        </div>

        {loading && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Chargement…</div>
        )}
        {!loading && error && (
          <div style={{ padding: 40, textAlign: 'center', color: '#f87171', fontSize: 13 }}>Erreur : {error}</div>
        )}
        {!loading && !error && clients.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Aucun client pour l'instant.</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {clients.map(c => {
            const clientProjects = projects.filter(p => p.client_id === c.id);
            const activeProjects = clientProjects.filter(p => p.status !== 'livré');
            const pendingLumi = (c.pending ?? []).filter(p => p.owner === 'lumi').length;
            const pendingClient = (c.pending ?? []).filter(p => p.owner === 'client').length;

            return (
              <div key={c.id} onClick={() => openClient(c)}
                style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)')}>

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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '12px 20px', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginBottom: 3 }}>Pack</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.pack}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginBottom: 3 }}>Missions actives</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{activeProjects.length} / {clientProjects.length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginBottom: 3 }}>Contact</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.contact}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginBottom: 3 }}>Dernier contact</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.last_contact}</div>
                  </div>
                </div>

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

      {selected && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100 }} onClick={() => setSelected(null)} />
          <div className="slide-over open" style={{ width: 480, zIndex: 200 }}>
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

            <div style={{ padding: '10px 24px', background: 'var(--night-3)', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--gray-dim)', marginBottom: 2 }}>CONTACT</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{selected.contact}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--gray-dim)', marginBottom: 2 }}>EMAIL</div>
                {editEmail !== null ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        autoFocus
                        value={editEmail}
                        onChange={e => { setEditEmail(e.target.value); setSaveEmailError(null); }}
                        onKeyDown={e => { if (e.key === 'Enter') saveEmail(); if (e.key === 'Escape') { setEditEmail(null); setSaveEmailError(null); } }}
                        style={{ fontSize: 12, background: 'var(--night-2)', border: '1px solid rgba(13,148,136,.4)', borderRadius: 4, padding: '2px 6px', color: 'var(--white)', fontFamily: 'inherit', width: 160, outline: 'none' }}
                      />
                      <button onClick={saveEmail} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, border: 'none', background: 'var(--teal)', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>✓</button>
                      <button onClick={() => { setEditEmail(null); setSaveEmailError(null); }} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,.1)', background: 'transparent', color: 'var(--gray)', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                    </div>
                    {saveEmailError && <div style={{ fontSize: 11, color: '#f87171' }}>{saveEmailError}</div>}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{selected.email || <span style={{ color: 'var(--gray-dim)' }}>—</span>}</span>
                    <button
                      onClick={() => setEditEmail(selected.email ?? '')}
                      style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontSize: 10, padding: 0, fontFamily: 'inherit' }}>
                      Modifier
                    </button>
                  </div>
                )}
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <div style={{ fontSize: 10, color: 'var(--gray-dim)', marginBottom: 2 }}>STATUT</div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 20, background: STATUS_BG[selected.status], color: STATUS_COLOR[selected.status] }}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 24px' }}>
              {(['missions', 'pending', 'notes'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: tab === t ? 'var(--teal-light)' : 'var(--gray)', borderBottom: tab === t ? '2px solid var(--teal)' : '2px solid transparent', transition: 'color .15s' }}>
                  {t === 'missions' ? 'Missions' : t === 'pending' ? `En suspens (${(selected.pending ?? []).length})` : 'Notes'}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tab === 'missions' && (() => {
                const clientProjects = projects.filter(p => p.client_id === selected.id);
                if (clientProjects.length === 0) return <div style={{ color: 'var(--gray-dim)', fontSize: 13 }}>Aucune mission.</div>;
                return (
                  <>
                    {clientProjects.map(p => (
                      <div key={p.id} style={{ background: 'var(--night-3)', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(255,255,255,.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.title}</div>
                          <span className={`badge badge-${p.status}`} style={{ flexShrink: 0, fontSize: 11 }}>{p.status.replace(/_/g, ' ')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className={`progress-fill${p.status === 'en_attente_client' ? ' amber' : ''}`} style={{ width: `${p.progress}%` }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--gray)', whiteSpace: 'nowrap' }}>{p.progress}%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gray-dim)' }}>
                          <span>{p.ref}</span>
                          <span>{p.devis} · {p.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}

              {tab === 'pending' && (
                <>
                  {(['lumi', 'client'] as const).map(owner => {
                    const items = (selected.pending ?? []).filter(p => p.owner === owner);
                    if (items.length === 0) return null;
                    return (
                      <div key={owner}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: owner === 'lumi' ? '#f87171' : 'var(--amber)', marginBottom: 8 }}>
                          {owner === 'lumi' ? 'Actions Lumi' : 'Infos à récupérer côté client'}
                        </div>
                        {items.map((p) => (
                          <div key={p.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 12px', background: 'var(--night-3)', borderRadius: 8, marginBottom: 6, border: `1px solid ${owner === 'lumi' ? 'rgba(239,68,68,.1)' : 'rgba(239,159,39,.1)'}` }}>
                            <div
                              onClick={(e) => { e.stopPropagation(); removePending(p.text); }}
                              style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${owner === 'lumi' ? '#f87171' : 'var(--amber)'}`, flexShrink: 0, marginTop: 1, cursor: 'pointer', transition: 'background .15s' }}
                              onMouseEnter={e => (e.currentTarget.style.background = owner === 'lumi' ? 'rgba(239,68,68,.25)' : 'rgba(239,159,39,.25)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            />
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
                  {(selected.notes ?? []).map((n) => (
                    <div key={n} style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6, background: 'var(--night-3)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${selected.color}` }}>
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

            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: 10 }}>
              <button className="btn" style={{ flex: 1 }} onClick={() => setSelected(null)}>Fermer</button>
              <a
                href={`/agents?client=${encodeURIComponent(selected.name)}`}
                className="btn primary"
                style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                ⚡ Lancer un agent
              </a>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, width: 480, maxWidth: '95vw', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16 }}>Nouveau client</div>
              <button className="btn" style={{ width: 28, height: 28, padding: 0, fontSize: 14 }} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Nom</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex : Boulangerie Martin" autoFocus />
              </div>
              <div>
                <label className="form-label">Secteur</label>
                <input className="form-input" value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} placeholder="Ex : Boulangerie artisanale · Vichy" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Pack</label>
                  <select className="form-select" value={form.pack} onChange={e => setForm(p => ({ ...p, pack: e.target.value as PackClient }))}>
                    {PACKS_CLIENT.map(pk => <option key={pk} value={pk}>{pk}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">MRR (€/mois)</label>
                  <input className="form-input" type="number" min={0} value={form.mrr} onChange={e => setForm(p => ({ ...p, mrr: e.target.value }))} placeholder="490" />
                </div>
              </div>
              <div>
                <label className="form-label">Contact</label>
                <input className="form-input" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} placeholder="Ex : Jean Dupont" />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jean@exemple.fr" />
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn primary" onClick={createClient} disabled={saving}>
                {saving ? 'Création…' : 'Créer le client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
