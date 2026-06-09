'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, TaskRow } from '@/lib/supabase';
import { MISSIONS, Mission } from '@/lib/data';
import MissionSlideOver from '@/components/MissionSlideOver';

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    const { data } = await supabase.from('tasks').select('*').order('priority', { ascending: false });
    if (data) setTasks(data);
  }

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

  const activeMissions = MISSIONS.filter(m => m.status !== 'livré');
  const urgent = tasks.filter(t => !t.done && t.priority >= 7).length;
  const topTasks = tasks.filter(t => !t.done).slice(0, 5);

  return (
    <>
      <div style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Dashboard</div>
        <div style={{ color: 'var(--gray)', fontSize: 13, marginLeft: 'auto' }}>{dateStr}</div>
        <button className="btn" onClick={() => router.push('/agents')}>⚡ Lancer un agent</button>
        <button className="btn primary" onClick={() => router.push('/projets')}>+ Nouveau projet</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <div className="metric-card">
            <div className="metric-label">MRR actuel</div>
            <div className="metric-val" style={{ color: 'var(--teal-light)' }}>490 €</div>
            <div className="metric-sub">Objectif : 5 000 €/mois</div>
            <div className="progress-bar" style={{ marginTop: 10 }}><div className="progress-fill" style={{ width: '9.8%' }} /></div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Projets actifs</div>
            <div className="metric-val">{activeMissions.length}</div>
            <div className="metric-sub">sur {MISSIONS.length} missions totales</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Tâches urgentes</div>
            <div className="metric-val" style={{ color: 'var(--amber)' }}>{urgent}</div>
            <div className="metric-sub">priorité P7 ou plus</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Prochain jalon</div>
            <div className="metric-val" style={{ fontSize: 18, color: '#f87171' }}>6 jours</div>
            <div className="metric-sub">BeLoc — deadline 15 juin</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Tâches du jour</div>
              <button className="panel-action" onClick={() => router.push('/taches')}>Tout voir →</button>
            </div>
            <div>
              {topTasks.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer' }}
                  onClick={() => toggleTask(t.id)}>
                  <div className={`task-check${t.done ? ' done' : ''}`}>
                    {t.done && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: t.done ? 'var(--gray-dim)' : 'var(--white)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--night-3)', color: 'var(--gray)', whiteSpace: 'nowrap' }}>{t.project}</span>
                  <span className={`priority-badge ${pClass(t.priority)}`}>P{t.priority}</span>
                </div>
              ))}
              {topTasks.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>
                  {tasks.length === 0 ? 'Chargement…' : 'Toutes les tâches sont terminées ✓'}
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
                <div key={m.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer' }}
                  onClick={() => setSelectedMission(m)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.clientColor, flexShrink: 0 }} />
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
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Jalons à venir</div></div>
            <div>
              {[
                { color: '#f87171', title: 'BeLoc — Livraison site marchand', date: '15 juin 2026', days: '6 jours', cls: 'days-urgent' },
                { color: 'var(--amber)', title: '100P — Calendrier éditorial juillet', date: '15 juin 2026', days: '6 jours', cls: 'days-warn' },
                { color: 'var(--mint)', title: 'Point mensuel clients', date: '25 juin 2026', days: '16 jours', cls: 'days-ok' },
                { color: 'var(--mint)', title: 'Outil IA Rôtisserie — livraison estimée', date: '31 juil. 2026', days: '52 jours', cls: 'days-ok' },
              ].map((j, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: j.color, marginTop: 4, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13 }}>{j.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>{j.date}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', alignSelf: 'center',
                    background: j.cls === 'days-urgent' ? 'rgba(239,68,68,.2)' : j.cls === 'days-warn' ? 'rgba(239,159,39,.2)' : 'rgba(93,202,165,.15)',
                    color: j.cls === 'days-urgent' ? '#f87171' : j.cls === 'days-warn' ? 'var(--amber-light)' : 'var(--mint)' }}>
                    {j.days}
                  </span>
                </div>
              ))}
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

      {selectedMission && <MissionSlideOver mission={selectedMission} onClose={() => setSelectedMission(null)} />}
    </>
  );
}
