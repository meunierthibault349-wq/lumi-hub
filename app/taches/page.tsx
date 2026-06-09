'use client';
import { useState } from 'react';
import { INITIAL_TASKS, Task } from '@/lib/data';

const PROJECTS = ['all', 'BeLoc', '100P', 'Lumi Cabinet', 'Interne', 'Prospection'];
const PROJECT_LABELS: Record<string, string> = { all: 'Toutes', BeLoc: 'BeLoc', '100P': '100P', 'Lumi Cabinet': 'Cabinet', Interne: 'Interne', Prospection: 'Prospection' };

function pClass(p: number) { return p >= 8 ? 'p-high' : p >= 6 ? 'p-mid' : 'p-low'; }

export default function TachesPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', project: 'BeLoc', priority: 6, due: '' });

  const filtered = tasks.filter(t => {
    const matchProject = filter === 'all' || t.project === filter;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchProject && matchSearch;
  });

  const remaining = tasks.filter(t => !t.done).length;

  function toggle(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function addTask() {
    if (!newTask.title.trim()) return;
    setTasks(prev => [{ id: 't' + Date.now(), ...newTask, overdue: false, done: false }, ...prev]);
    setNewTask({ title: '', project: 'BeLoc', priority: 6, due: '' });
    setShowModal(false);
  }

  return (
    <>
      <div style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Tâches</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>{remaining} restantes</span>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary" onClick={() => setShowModal(true)}>+ Ajouter une tâche</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {PROJECTS.map(p => (
            <button key={p} className={`btn${filter === p ? ' active' : ''}`}
              style={filter === p ? { background: 'rgba(13,148,136,.15)', color: 'var(--teal-light)', borderColor: 'rgba(13,148,136,.3)' } : {}}
              onClick={() => setFilter(p)}>
              {PROJECT_LABELS[p]}
              {p === 'all' && ` (${tasks.filter(t => !t.done).length})`}
            </button>
          ))}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
            style={{ marginLeft: 'auto', padding: '7px 14px', background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: 'var(--white)', fontSize: 13, fontFamily: 'inherit', width: 220 }} />
        </div>

        {/* Table */}
        <div className="panel">
          <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 110px 80px 60px', gap: 14, padding: '10px 18px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--gray-dim)' }}>
            <div /><div>Tâche</div><div>Projet</div><div>Échéance</div><div>Priorité</div>
          </div>
          {filtered.map(t => (
            <div key={t.id} onClick={() => toggle(t.id)}
              style={{ display: 'grid', gridTemplateColumns: '20px 1fr 110px 80px 60px', gap: 14, padding: '11px 18px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,.04)', cursor: 'pointer', transition: 'background .1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className={`task-check${t.done ? ' done' : ''}`}>
                {t.done && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ fontSize: 13, color: t.done ? 'var(--gray-dim)' : 'var(--white)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
              <div><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--night-3)', color: 'var(--gray)' }}>{t.project}</span></div>
              <div style={{ fontSize: 12, color: t.overdue ? '#f87171' : 'var(--gray)' }}>{t.due}</div>
              <div><span className={`priority-badge ${pClass(t.priority)}`}>P{t.priority}</span></div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Aucune tâche</div>}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, width: 480, maxWidth: '95vw', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16 }}>Nouvelle tâche</div>
              <button className="btn" style={{ width: 28, height: 28, padding: 0, fontSize: 14 }} onClick={() => setShowModal(false)}>x</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label className="form-label">Titre</label><input className="form-input" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="Description de la tâche…" autoFocus /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="form-label">Projet</label>
                  <select className="form-select" value={newTask.project} onChange={e => setNewTask(p => ({ ...p, project: e.target.value }))}>
                    {['BeLoc', '100P', 'Lumi Cabinet', 'Interne', 'Prospection'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Priorité</label>
                  <select className="form-select" value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: Number(e.target.value) }))}>
                    {[9,8,7,6,5,4].map(n => <option key={n} value={n}>P{n}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="form-label">Échéance</label><input className="form-input" type="date" value={newTask.due} onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))} /></div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn primary" onClick={addTask}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
