'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, TaskRow, ProjectRow, MilestoneRow } from '@/lib/supabase';
import MissionSlideOver from '@/components/MissionSlideOver';

const MRR_OBJECTIF = 5000;

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [milestones, setMilestones] = useState<MilestoneRow[]>([]);
  const [mrrTotal, setMrrTotal] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('tasks').select('*').order('priority', { ascending: false }),
      supabase.from('projects').select('*'),
      supabase.from('milestones').select('*').order('date'),
      supabase.from('clients').select('mrr'),
    ]).then(([tasksRes, projectsRes, milestonesRes, clientsRes]) => {
      const firstError = tasksRes.error || projectsRes.error || milestonesRes.error || clientsRes.error;
      if (firstError) {
        setError(firstError.message);
      } else {
        if (tasksRes.data) setTasks(tasksRes.data);
        if (projectsRes.data) setProjects(projectsRes.data);
        if (milestonesRes.data) setMilestones(milestonesRes.data);
        if (clientsRes.data) setMrrTotal(clientsRes.data.reduce((s: number, c: { mrr: number }) => s + c.mrr, 0));
      }
      setLoading(false);
    });
  }, []);

  async function toggleTask(id: string) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const { error } = await supabase.from('tasks').update({ done: !task.done }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function pClass(p: number) { return p >= 8 ? 'p-high' : p >= 6 ? 'p-mid' : 'p-low'; }

  const now = new Date();
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const dateStr = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const activeMissions = projects.filter(p => p.status !== 'livré');
  const urgent = tasks.filter(t => !t.done && t.priority >= 7).length;
  const topTasks = tasks.filter(t => !t.done).slice(0, 5);
  const mrrPct = mrrTotal > 0 ? Math.min(100, (mrrTotal / MRR_OBJECTIF) * 100).toFixed(1) : '0';

  function daysUntil(dateStr: string): number {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);
  }
  function daysLabel(d: number) {
    if (d < 0) return `${Math.abs(d)}j de retard`;
    if (d === 0) return "Aujourd'hui";
    return `${d} jour${d > 1 ? 's' : ''}`;
  }
  function daysCls(d: number): 'days-urgent' | 'days-warn' | 'days-ok' {
    return d <= 7 ? 'days-urgent' : d <= 14 ? 'days-warn' : 'days-ok';
  }

  const milestonesWithDays = milestones.map(m => ({ ...m, d: daysUntil(m.date) }));
  const nextMilestone = [...milestonesWithDays].sort((a, b) => a.d - b.d)[0];

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Dashboard</div>
        <div className="r-hm" style={{ color: 'var(--gray)', fontSize: 13, marginLeft: 'auto' }}>{dateStr}</div>
        <div style={{ marginLeft: 'auto' }} className="r-hm" />
        <button className="btn r-hm" onClick={() => router.push('/agents')}>⚡ Lancer un agent</button>
        <button className="btn primary r-hm" onClick={() => router.push('/projets')}>+ Nouveau projet</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div className="r-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <div className="metric-card">
            <div className="metric-label">MRR actuel</div>
            <div className="metric-val" style={{ color: 'var(--teal-light)' }}>{mrrTotal.toLocaleString('fr-FR')} €</div>
            <div className="metric-sub">Objectif : {MRR_OBJECTIF.toLocaleString('fr-FR')} €/mois · {mrrPct}%</div>
            <div className="progress-bar" style={{ marginTop: 10 }}><div className="progress-fill" style={{ width: `${mrrPct}%` }} /></div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Projets actifs</div>
            <div className="metric-val">{activeMissions.length}</div>
            <div className="metric-sub">sur {projects.length} missions totales</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Tâches urgentes</div>
            <div className="metric-val" style={{ color: 'var(--amber)' }}>{urgent}</div>
            <div className="metric-sub">priorité P7 ou plus</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Prochain jalon</div>
            {nextMilestone ? (
              <>
                <div className="metric-val" style={{ fontSize: 18, color: nextMilestone.d <= 7 ? '#f87171' : nextMilestone.d <= 14 ? 'var(--amber)' : 'var(--mint)' }}>
                  {daysLabel(nextMilestone.d)}
                </div>
                <div className="metric-sub">{nextMilestone.title.split(' — ')[0]} · {new Date(nextMilestone.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
              </>
            ) : <div className="metric-val">—</div>}
          </div>
        </div>

        <div className="r-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Tâches du jour</div>
              <button className="panel-action" onClick={() => router.push('/taches')}>Tout voir →</button>
            </div>
            <div>
              {topTasks.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer' }} onClick={() => toggleTask(t.id)}>
                  <div className={`task-check${t.done ? ' done' : ''}`}>{t.done && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}</div>
                  <div style={{ flex: 1, fontSize: 13, color: t.done ? 'var(--gray-dim)' : 'var(--white)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--night-3)', color: 'var(--gray)', whiteSpace: 'nowrap' }}>{t.project}</span>
                  <span className={`priority-badge ${pClass(t.priority)}`}>P{t.priority}</span>
                </div>
              ))}
              {topTasks.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>
                  {loading ? 'Chargement…' : error ? `Erreur : ${error}` : 'Toutes les tâches sont terminées ✓'}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Projets actifs</div>
              <button className="panel-action" onClick={() => router.push('/projets')}>Tout voir →</button>
            </div>
            <div>
              {activeMissions.map(m => (
                <div key={m.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer' }} onClick={() => setSelectedProject(m)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.client_color, flexShrink: 0 }} />
                    <div style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{m.title}</div>
                    <span className={`badge badge-${m.status}`}>{m.status.replace(/_/g, ' ')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--gray)' }}>{m.client}</span>
                    <span style={{ fontSize: 11, color: m.status === 'en_attente_client' ? '#f87171' : 'var(--gray)', marginLeft: 'auto' }}>
                      {m.status === 'en_attente_client' ? '⚠ ' : ''}Deadline : {m.deadline}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className={`progress-fill${m.status === 'en_attente_client' ? ' amber' : ''}`} style={{ width: `${m.progress}%` }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--gray)', whiteSpace: 'nowrap' }}>{m.progress}%</span>
                  </div>
                </div>
              ))}
              {activeMissions.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: loading ? 'var(--gray-dim)' : error ? '#f87171' : 'var(--gray-dim)', fontSize: 13 }}>
                  {loading ? 'Chargement…' : error ? `Erreur : ${error}` : 'Aucun projet actif'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="r-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Jalons à venir</div></div>
            <div>
              {milestonesWithDays.map((j) => {
                const cls = daysCls(j.d);
                const bg = cls === 'days-urgent' ? 'rgba(239,68,68,.2)' : cls === 'days-warn' ? 'rgba(239,159,39,.2)' : 'rgba(93,202,165,.15)';
                const col = cls === 'days-urgent' ? '#f87171' : cls === 'days-warn' ? 'var(--amber)' : 'var(--mint)';
                return (
                  <div key={j.id} style={{ display: 'flex', gap: 12, padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: j.client_color, marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13 }}>{j.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>{new Date(j.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', alignSelf: 'center', background: bg, color: col }}>{daysLabel(j.d)}</span>
                  </div>
                );
              })}
              {milestones.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: error ? '#f87171' : 'var(--gray-dim)', fontSize: 13 }}>
                  {loading ? 'Chargement…' : error ? `Erreur : ${error}` : 'Aucun jalon à venir'}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Agents actifs</div>
              <button className="panel-action" onClick={() => router.push('/agents')}>Tout voir →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: 14 }}>
              {[{ e: '🌐', n: 'Web Developer', p: 'Web & Tech' }, { e: '📱', n: 'Instagram', p: 'Contenu' }, { e: '🤝', n: 'Account Mgr', p: 'Client Success' }, { e: '🔍', n: 'SEO', p: 'Web & Tech' }, { e: '📊', n: 'Analytics', p: 'Client Success' }, { e: '💰', n: 'Finance', p: 'Opérations' }].map(a => (
                <div key={a.n} onClick={() => router.push('/agents')}
                  style={{ background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <div className="agent-avatar-wrap" style={{ width: 36, height: 36, fontSize: 16 }}>{a.e}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{a.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-dim)' }}>{a.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedProject && <MissionSlideOver project={selectedProject} onClose={() => setSelectedProject(null)} onSave={p => setProjects(prev => prev.map(x => x.id === p.id ? p : x))} />}
    </>
  );
}
