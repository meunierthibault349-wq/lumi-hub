'use client';
import { useState, useEffect } from 'react';
import { supabase, TaskRow } from '@/lib/supabase';

const PROJECTS = ['all', 'BeLoc', '100P', 'Lumi Cabinet', 'Interne', 'Prospection'];
const PROJECT_LABELS: Record<string, string> = { all: 'Toutes', BeLoc: 'BeLoc', '100P': '100P', 'Lumi Cabinet': 'Cabinet', Interne: 'Interne', Prospection: 'Prospection' };

function pClass(p: number) { return p >= 8 ? 'p-high' : p >= 6 ? 'p-mid' : 'p-low'; }

export default function TachesPage() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', project: 'BeLoc', priority: 6, due: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    const { data, error } = await supabase.from('tasks').select('*').order('priority', { ascending: false });
    if (error) setError(error.message);
    else if (data) setTasks(data);
    setLoading(false);
  }

  const filtered = tasks.filter(t => {
    const matchProject = filter === 'all' || t.project === filter;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchProject && matchSearch;
  });

  const remaining = tasks.filter(t => !t.done).length;

  async function toggle(id: string) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const { error } = await supabase.from('tasks').update({ done: !task.done }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function clearDone() {
    const ids = tasks.filter(t => t.done).map(t => t.id);
    if (!ids.length) return;
    const { error } = await supabase.from('tasks').delete().in('id', ids);
    if (!error) setTasks(prev => prev.filter(t => !t.done));
  }

  async function addTask() {
    if (!newTask.title.trim()) return;
    const { data, error } = await supabase.from('tasks').insert([{
      title: newTask.title,
      project: newTask.project,
      priority: newTask.priority,
      due: newTask.due,
      done: false,
      overdue: false,
    }]).select().single();
    if (!error && data) {
      setTasks(prev => [data, ...prev]);
      setNewTask({ title: '', project: 'BeLoc', priority: 6, due: '' });
      setShowModal(false);
    }
  }

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Tâches</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>{remaining} restantes</span>
        <div style={{ marginLeft: 'auto' }} />
        {tasks.some(t => t.done) && (
          <button className="btn" onClick={clearDone} style={{ fontSize: 12, color: 'var(--gray)' }}>
            Effacer terminées ({tasks.filter(t => t.done).length})
          </button>
        )}
        <button className="btn primary" onClick={() => setShowModal(true)}>+ Ajouter</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
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

        <div className="panel">
          <div className="r-thdr" style={{ display: 'grid', gridTemplateColumns: '20px 1fr 110px 80px 60px 28px', gap: 14, padding: '10px 18px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--gray-dim)' }}>
            <div /><div>Tâche</div><div>Projet</div><div>Échéance</div><div>Priorité</div><div />
          </div>
          {filtered.map(t => (
            <div key={t.id}
              className="r-tr"
              style={{ display: 'grid', gridTemplateColumns: '20px 1fr 110px 80px 60px 28px', gap: 14, padding: '11px 18px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,.04)', transition: 'background .1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className={`task-check${t.done ? ' done' : ''}`} onClick={() => toggle(t.id)} style={{ cursor: 'pointer' }}>
                {t.done && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
              </div>
              <div onClick={() => toggle(t.id)} style={{ fontSize: 13, color: t.done ? 'var(--gray-dim)' : 'var(--white)', textDecoration: t.done ? 'line-through' : 'none', cursor: 'pointer' }}>{t.title}</div>
              <div className="r-tch"><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--night-3)', color: 'var(--gray)' }}>{t.project}</span></div>
              <div className="r-tch" style={{ fontSize: 12, color: t.overdue ? '#f87171' : 'var(--gray)' }}>{t.due}</div>
              <div><span className={`priority-badge ${pClass(t.priority)}`}>P{t.priority}</span></div>
              <button onClick={() => deleteTask(t.id)}
                style={{ width: 26, height: 26, borderRadius: 6, background: 'transparent', border: '1px solid transparent', color: 'var(--gray-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--gray-dim)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: error ? '#f87171' : 'var(--gray-dim)', fontSize: 13 }}>
              {loading ? 'Chargement…' : error ? `Erreur : ${error}` : 'Aucune tâche'}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, width: 480, maxWidth: '95vw', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16 }}>Nouvelle tâche</div>
              <button className="btn" style={{ width: 28, height: 28, padding: 0, fontSize: 14 }} onClick={() => setShowModal(false)}>x</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label className="form-label">Titre</label><input className="form-input" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="Description de la tâche…" autoFocus onKeyDown={e => e.key === 'Enter' && addTask()} /></div>
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
