'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, ProspectRow } from '@/lib/supabase';

const COLS = [
  { id: 'froid',    label: 'Froid',    color: 'var(--gray)' },
  { id: 'contacte', label: 'Contacté', color: 'var(--teal-light)' },
  { id: 'chaud',    label: 'Chaud',    color: 'var(--amber)' },
  { id: 'signe',    label: 'Signé',    color: 'var(--mint)' },
];
const NAME_COLOR: Record<string, string> = { froid: 'var(--white)', contacte: 'var(--teal-light)', chaud: 'var(--amber-light)', signe: 'var(--mint)' };

const PACKS = [
  { label: '—', value: '' },
  { label: 'Starter — 490 €/mois', value: '490 €/mois', mrr: 490 },
  { label: 'Visibilité — 890 €/mois', value: '890 €/mois', mrr: 890 },
  { label: 'Performance — 1 490 €/mois', value: '1 490 €/mois', mrr: 1490 },
  { label: 'Pack IA — sur devis', value: 'Sur devis', mrr: 1500 },
];

function extractMrr(tags: string[]): number {
  for (const tag of tags) {
    const p = PACKS.find(p => p.value === tag);
    if (p) return p.mrr ?? 0;
  }
  return 0;
}

export default function PipelinePage() {
  const router = useRouter();
  const [prospects, setProspects] = useState<ProspectRow[]>([]);
  const [dragging, setDragging] = useState<{ id: string; from: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<ProspectRow | null>(null);
  const [targetCol, setTargetCol] = useState('froid');
  const [form, setForm] = useState({ name: '', sector: '', pack: '' });
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => { loadProspects(); }, []);

  async function loadProspects() {
    const { data } = await supabase.from('prospects').select('*').order('created_at', { ascending: true });
    if (data) setProspects(data);
  }

  function byStage(stage: string) { return prospects.filter(p => p.stage === stage); }

  const hotCount = byStage('chaud').length;
  const pipelineMrr = prospects.filter(p => p.stage !== 'signe').reduce((s, p) => s + extractMrr(p.tags), 0);

  async function addProspect() {
    if (!form.name.trim()) return;
    const tags = form.pack ? [form.pack] : [];
    const { data, error } = await supabase.from('prospects').insert([{
      name: form.name, sector: form.sector || 'À compléter', tags, stage: targetCol,
    }]).select().single();
    if (!error && data) { setProspects(prev => [...prev, data]); setForm({ name: '', sector: '', pack: '' }); setShowModal(false); }
  }

  async function deleteProspect(id: string) {
    await supabase.from('prospects').delete().eq('id', id);
    setProspects(prev => prev.filter(p => p.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  async function moveProspect(id: string, stage: string) {
    await supabase.from('prospects').update({ stage }).eq('id', id);
    setProspects(prev => prev.map(p => p.id === id ? { ...p, stage: stage as ProspectRow['stage'] } : p));
    setSelected(prev => prev?.id === id ? { ...prev, stage: stage as ProspectRow['stage'] } : prev);
  }

  function onDragStart(id: string, from: string) { setDragging({ id, from }); }
  function onDragOver(e: React.DragEvent, col: string) { e.preventDefault(); setDragOver(col); }

  async function onDrop(col: string) {
    if (!dragging || dragging.from === col) { setDragging(null); setDragOver(null); return; }
    await moveProspect(dragging.id, col);
    setDragging(null); setDragOver(null);
  }

  const NEXT_STAGE: Record<string, string> = { froid: 'contacte', contacte: 'chaud', chaud: 'signe' };

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Pipeline</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          {prospects.length} prospect{prospects.length > 1 ? 's' : ''}
        </span>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary" onClick={() => { setTargetCol('froid'); setShowModal(true); }}>+ Ajouter</button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main kanban */}
        <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {/* KPIs */}
          <div className="r-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
            <div className="metric-card">
              <div className="metric-label">Total pipeline</div>
              <div className="metric-val">{prospects.length}</div>
              <div className="metric-sub">prospects identifiés</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Prospects chauds</div>
              <div className="metric-val" style={{ color: 'var(--amber)' }}>{hotCount}</div>
              <div className="metric-sub">en discussion active</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">MRR pipeline estimé</div>
              <div className="metric-val" style={{ color: 'var(--teal-light)' }}>{pipelineMrr > 0 ? `${pipelineMrr} €` : '—'}</div>
              <div className="metric-sub">si tous signés</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Clients signés</div>
              <div className="metric-val" style={{ color: 'var(--mint)' }}>{byStage('signe').length}</div>
              <div className="metric-sub">dans le pipeline</div>
            </div>
          </div>

          {/* Kanban */}
          <div className="r-gk" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {COLS.map(col => {
              const cards = byStage(col.id);
              return (
                <div key={col.id}
                  onDragOver={e => onDragOver(e, col.id)}
                  onDrop={() => onDrop(col.id)}
                  onDragLeave={() => setDragOver(null)}
                  style={{ background: 'var(--night-2)', border: `1px solid ${dragOver === col.id ? 'var(--teal)' : 'rgba(255,255,255,.06)'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color .15s' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                    <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 13, flex: 1 }}>{col.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>{cards.length}</div>
                    {col.id !== 'signe' && (
                      <button onClick={() => { setTargetCol(col.id); setShowModal(true); }}
                        style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,.06)', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    )}
                  </div>
                  <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 200 }}>
                    {cards.map(card => (
                      <div key={card.id} draggable
                        onDragStart={() => onDragStart(card.id, col.id)}
                        onDragEnd={() => setDragging(null)}
                        onClick={() => setSelected(card)}
                        style={{ background: selected?.id === card.id ? 'rgba(13,148,136,.08)' : 'var(--night-3)', border: `1px solid ${selected?.id === card.id ? 'rgba(13,148,136,.35)' : 'rgba(255,255,255,.06)'}`, borderRadius: 8, padding: 12, cursor: 'pointer', opacity: dragging?.id === card.id ? .5 : 1, transition: 'all .15s' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: NAME_COLOR[col.id] }}>{card.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray)', marginBottom: card.tags.length ? 8 : 0 }}>{card.sector}</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {card.tags.map(tag => <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'var(--night-4)', color: 'var(--gray)' }}>{tag}</span>)}
                        </div>
                      </div>
                    ))}
                    {cards.length === 0 && (
                      <div style={{ padding: '20px 12px', textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13, border: '2px dashed rgba(255,255,255,.07)', borderRadius: 8 }}>
                        Dépose ici ou clique +
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slide-over fiche prospect */}
        {selected && (
          <div className="r-ac" style={{ width: 360, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', background: 'var(--night-2)', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>{selected.sector}</div>
              </div>
              <button onClick={() => setSelected(null)} className="btn" style={{ width: 26, height: 26, padding: 0, fontSize: 14, flexShrink: 0 }}>×</button>
            </div>

            <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Statut */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 8 }}>Statut</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {COLS.map(c => (
                    <button key={c.id} onClick={() => moveProspect(selected.id, c.id)}
                      style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, border: `1px solid ${selected.stage === c.id ? c.color : 'rgba(255,255,255,.08)'}`, background: selected.stage === c.id ? c.color + '20' : 'transparent', color: selected.stage === c.id ? c.color : 'var(--gray)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: selected.stage === c.id ? 700 : 400 }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pack */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 8 }}>Pack estimé</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selected.tags.length === 0
                    ? <span style={{ fontSize: 12, color: 'var(--gray-dim)' }}>Non défini</span>
                    : selected.tags.map(t => <span key={t} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'rgba(13,148,136,.1)', color: 'var(--teal-light)', border: '1px solid rgba(13,148,136,.2)' }}>{t}</span>)}
                </div>
              </div>

              {/* Avancer dans le pipeline */}
              {NEXT_STAGE[selected.stage] && (
                <button onClick={() => moveProspect(selected.id, NEXT_STAGE[selected.stage])}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', background: 'rgba(13,148,136,.12)', border: '1px solid rgba(13,148,136,.25)', borderRadius: 10, color: 'var(--teal-light)', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Passer à {COLS.find(c => c.id === NEXT_STAGE[selected.stage])?.label} →
                </button>
              )}

              {/* Actions rapides */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 8 }}>Actions rapides</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href={`/agents?client=${encodeURIComponent(selected.name)}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, textDecoration: 'none', color: 'var(--white)', fontSize: 13, cursor: 'pointer', transition: 'border-color .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(13,148,136,.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)')}>
                    <span style={{ fontSize: 16 }}>⚡</span>
                    <span>Lancer un agent</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gray)' }}>↗</span>
                  </a>
                  <button onClick={() => router.push('/agents?agent=Devis')}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, color: 'var(--white)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'border-color .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)')}>
                    <span style={{ fontSize: 16 }}>📋</span>
                    <span>Générer un devis</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gray)' }}>↗</span>
                  </button>
                </div>
              </div>

              {/* Note rapide */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 8 }}>Note rapide</div>
                <textarea
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Contexte, besoins, prochaine action…"
                  rows={4}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, color: 'var(--white)', fontSize: 13, fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Danger zone */}
              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.05)' }}>
                <button onClick={() => { if (confirm(`Supprimer ${selected.name} ?`)) deleteProspect(selected.id); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'transparent', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, color: '#f87171', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  Supprimer ce prospect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal ajout */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, width: 480, maxWidth: '95vw', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16 }}>Nouveau prospect</div>
              <button className="btn" style={{ width: 28, height: 28, padding: 0, fontSize: 14 }} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label className="form-label">Nom / Enseigne</label><input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addProspect()} placeholder="Ex : Boulangerie Martin…" autoFocus /></div>
              <div><label className="form-label">Secteur</label><input className="form-input" value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addProspect()} placeholder="Ex : Boulangerie artisanale · Vichy" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="form-label">Colonne</label>
                  <select className="form-select" value={targetCol} onChange={e => setTargetCol(e.target.value)}>
                    {COLS.filter(c => c.id !== 'signe').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Pack estimé</label>
                  <select className="form-select" value={form.pack} onChange={e => setForm(p => ({ ...p, pack: e.target.value }))}>
                    {PACKS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn primary" onClick={addProspect}>Ajouter au pipeline</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
