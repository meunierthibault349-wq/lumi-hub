'use client';
import { useState, useEffect } from 'react';
import { supabase, ProspectRow } from '@/lib/supabase';

const COLS = [
  { id: 'froid',    label: 'Froid',    color: 'var(--gray)' },
  { id: 'contacte', label: 'Contacté', color: 'var(--teal-light)' },
  { id: 'chaud',    label: 'Chaud',    color: 'var(--amber)' },
  { id: 'signe',    label: 'Signé',    color: 'var(--mint)' },
];
const NAME_COLOR: Record<string, string> = { froid: 'var(--white)', contacte: 'var(--teal-light)', chaud: 'var(--amber-light)', signe: 'var(--mint)' };

export default function PipelinePage() {
  const [prospects, setProspects] = useState<ProspectRow[]>([]);
  const [dragging, setDragging] = useState<{ id: string; from: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [targetCol, setTargetCol] = useState('froid');
  const [form, setForm] = useState({ name: '', sector: '', pack: '' });

  useEffect(() => { loadProspects(); }, []);

  async function loadProspects() {
    const { data } = await supabase.from('prospects').select('*').order('created_at', { ascending: true });
    if (data) setProspects(data);
  }

  function byStage(stage: string) { return prospects.filter(p => p.stage === stage); }

  const hotCount = byStage('chaud').length;

  async function addProspect() {
    if (!form.name.trim()) return;
    const tags = form.pack ? [form.pack] : [];
    const { data, error } = await supabase.from('prospects').insert([{
      name: form.name,
      sector: form.sector || 'À compléter',
      tags,
      stage: targetCol,
    }]).select().single();
    if (!error && data) {
      setProspects(prev => [...prev, data]);
      setForm({ name: '', sector: '', pack: '' });
      setShowModal(false);
    }
  }

  function onDragStart(id: string, from: string) { setDragging({ id, from }); }
  function onDragOver(e: React.DragEvent, col: string) { e.preventDefault(); setDragOver(col); }

  async function onDrop(col: string) {
    if (!dragging || dragging.from === col) { setDragging(null); setDragOver(null); return; }
    const { error } = await supabase.from('prospects').update({ stage: col }).eq('id', dragging.id);
    if (!error) setProspects(prev => prev.map(p => p.id === dragging.id ? { ...p, stage: col as ProspectRow['stage'] } : p));
    setDragging(null); setDragOver(null);
  }

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Pipeline</div>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary" onClick={() => setShowModal(true)}>+ Ajouter</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div className="r-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <div className="metric-card"><div className="metric-label">Total pipeline</div><div className="metric-val">{prospects.length}</div><div className="metric-sub">prospects identifiés</div></div>
          <div className="metric-card"><div className="metric-label">Prospects chauds</div><div className="metric-val" style={{ color: 'var(--amber)' }}>{hotCount}</div><div className="metric-sub">en discussion active</div></div>
          <div className="metric-card"><div className="metric-label">CA pipeline estimé</div><div className="metric-val" style={{ color: 'var(--teal-light)' }}>0 €</div><div className="metric-sub">si tous signés</div></div>
          <div className="metric-card"><div className="metric-label">Clients actifs</div><div className="metric-val" style={{ color: 'var(--mint)' }}>2</div><div className="metric-sub">100P + BeLoc</div></div>
        </div>

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
                      style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,.06)', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
                  )}
                </div>
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 200 }}>
                  {cards.map(card => (
                    <div key={card.id} draggable
                      onDragStart={() => onDragStart(card.id, col.id)}
                      onDragEnd={() => setDragging(null)}
                      style={{ background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 8, padding: 12, cursor: 'grab', opacity: dragging?.id === card.id ? .5 : 1, transition: 'all .15s' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: NAME_COLOR[col.id] }}>{card.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray)', marginBottom: 8 }}>{card.sector}</div>
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

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, width: 480, maxWidth: '95vw', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16 }}>Nouveau prospect</div>
              <button className="btn" style={{ width: 28, height: 28, padding: 0, fontSize: 14 }} onClick={() => setShowModal(false)}>x</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label className="form-label">Nom / Enseigne</label><input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex : Boulangerie Martin…" autoFocus /></div>
              <div><label className="form-label">Secteur</label><input className="form-input" value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} placeholder="Ex : Boulangerie artisanale · Vichy" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="form-label">Colonne</label>
                  <select className="form-select" value={targetCol} onChange={e => setTargetCol(e.target.value)}>
                    {COLS.filter(c => c.id !== 'signe').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Pack estimé</label>
                  <select className="form-select" value={form.pack} onChange={e => setForm(p => ({ ...p, pack: e.target.value }))}>
                    <option value="">—</option>
                    <option value="490 €/mois">Starter — 490 €/mois</option>
                    <option value="890 €/mois">Visibilité — 890 €/mois</option>
                    <option value="1 490 €/mois">Performance — 1 490 €/mois</option>
                    <option value="Sur devis">Pack IA</option>
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
