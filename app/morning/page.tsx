'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, TaskRow, MilestoneRow, ClientRow } from '@/lib/supabase';
import { MORNING_AGENTS } from '@/lib/data';

const MRR_OBJECTIF = 5000;

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);
}
function daysLabel(d: number) {
  if (d < 0) return `${Math.abs(d)}j de retard`;
  if (d === 0) return "Aujourd'hui";
  return `${d}j`;
}
function daysCls(d: number) {
  return d <= 7 ? 'urgent' : d <= 14 ? 'warn' : 'ok';
}

export default function MorningPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [milestones, setMilestones] = useState<MilestoneRow[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [time, setTime] = useState('');

  useEffect(() => {
    supabase.from('tasks').select('*').order('priority', { ascending: false }).then(({ data }) => { if (data) setTasks(data); });
    supabase.from('milestones').select('*').order('date').then(({ data }) => { if (data) setMilestones(data); });
    supabase.from('clients').select('*').order('created_at').then(({ data }) => { if (data) setClients(data); });
    const tick = () => setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  async function toggleTask(id: string) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await supabase.from('tasks').update({ done: !task.done }).eq('id', id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  const now = new Date();
  const h = now.getHours();
  const greeting = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const dateStr = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const mrrTotal = clients.reduce((s, c) => s + c.mrr, 0);
  const mrrPct = mrrTotal > 0 ? Math.min(100, (mrrTotal / MRR_OBJECTIF) * 100).toFixed(1) : '0';
  const topTasks = tasks.filter(t => !t.done && t.priority >= 7).slice(0, 5);
  const urgentMilestones = milestones.map(m => ({ ...m, d: daysUntil(m.date) })).filter(m => m.d <= 14).sort((a, b) => a.d - b.d);
  const totalPending = clients.reduce((s, c) => s + c.pending.length, 0);

  function pClass(p: number) { return p >= 8 ? 'p-high' : p >= 6 ? 'p-mid' : 'p-low'; }

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Morning Briefing</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>{dateStr}</span>
        {time && <span style={{ fontSize: 13, color: 'var(--teal-light)', background: 'rgba(13,148,136,.1)', padding: '2px 10px', borderRadius: 20, border: '1px solid rgba(13,148,136,.2)' }}>{time}</span>}
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary r-hm" onClick={() => router.push('/agents')}>⚡ Lancer un agent</button>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 26, fontWeight: 800, letterSpacing: -.5 }}>
            {greeting}, Thibault.
          </div>
          <div style={{ fontSize: 14, color: 'var(--gray)', marginTop: 4 }}>
            {topTasks.length > 0
              ? `${topTasks.length} tâche${topTasks.length > 1 ? 's' : ''} urgente${topTasks.length > 1 ? 's' : ''} · ${urgentMilestones.length} jalon${urgentMilestones.length > 1 ? 's' : ''} à risque · ${totalPending} actions clients en suspens`
              : `Aucune tâche urgente · ${urgentMilestones.length} jalons à surveiller`}
          </div>
        </div>

        <div className="r-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
          <div className="metric-card" style={{ padding: '14px 16px' }}>
            <div className="metric-label">MRR</div>
            <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 20, fontWeight: 700, color: 'var(--teal-light)' }}>{clients.length === 0 ? '…' : `${mrrTotal} €`}</div>
            <div className="progress-bar" style={{ marginTop: 8 }}><div className="progress-fill" style={{ width: `${mrrPct}%` }} /></div>
            <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 4 }}>{mrrPct}% de {MRR_OBJECTIF} €</div>
          </div>
          <div className="metric-card" style={{ padding: '14px 16px' }}>
            <div className="metric-label">Tâches urgentes</div>
            <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 20, fontWeight: 700, color: topTasks.length > 0 ? '#f87171' : 'var(--mint)' }}>{tasks.length === 0 ? '…' : topTasks.length}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 4 }}>priorité P7 ou plus</div>
          </div>
          <div className="metric-card" style={{ padding: '14px 16px' }}>
            <div className="metric-label">Jalons à risque</div>
            <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 20, fontWeight: 700, color: urgentMilestones.length > 0 ? 'var(--amber)' : 'var(--mint)' }}>{milestones.length === 0 ? '…' : urgentMilestones.length}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 4 }}>dans les 14 prochains jours</div>
          </div>
          <div className="metric-card" style={{ padding: '14px 16px' }}>
            <div className="metric-label">Actions en suspens</div>
            <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 20, fontWeight: 700, color: 'var(--amber)' }}>{clients.length === 0 ? '…' : totalPending}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 4 }}>sur tous les clients</div>
          </div>
        </div>

        <div className="r-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Priorités du jour</div>
              <button className="panel-action" onClick={() => router.push('/taches')}>Tout voir →</button>
            </div>
            <div>
              {topTasks.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>
                  {tasks.length === 0 ? 'Chargement…' : 'Toutes les urgences sont traitées ✓'}
                </div>
              )}
              {topTasks.map(t => (
                <div key={t.id} onClick={() => toggleTask(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer' }}>
                  <div className={`task-check${t.done ? ' done' : ''}`}>
                    {t.done && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: t.done ? 'var(--gray-dim)' : 'var(--white)', textDecoration: t.done ? 'line-through' : 'none', lineHeight: 1.4 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 2 }}>{t.project}</div>
                  </div>
                  <span className={`priority-badge ${pClass(t.priority)}`}>P{t.priority}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Jalons à risque</div>
              <button className="panel-action" onClick={() => router.push('/')}>Dashboard →</button>
            </div>
            <div>
              {urgentMilestones.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>
                  {milestones.length === 0 ? 'Chargement…' : 'Aucun jalon dans les 14 prochains jours'}
                </div>
              )}
              {urgentMilestones.map((m, i) => {
                const cls = daysCls(m.d);
                const col = cls === 'urgent' ? '#f87171' : cls === 'warn' ? 'var(--amber)' : 'var(--mint)';
                const bg = cls === 'urgent' ? 'rgba(239,68,68,.15)' : cls === 'warn' ? 'rgba(239,159,39,.15)' : 'rgba(93,202,165,.1)';
                return (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', alignItems: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.client_color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13 }}>{m.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>
                        {new Date(m.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: bg, color: col, whiteSpace: 'nowrap' }}>
                      {daysLabel(m.d)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="r-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Actions clients</div>
              <button className="panel-action" onClick={() => router.push('/clients')}>Voir clients →</button>
            </div>
            <div>
              {clients.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Chargement…</div>
              )}
              {clients.map(c => {
                const pendingLumi = c.pending.filter(p => p.owner === 'lumi').length;
                const pendingClient = c.pending.filter(p => p.owner === 'client').length;
                return (
                  <div key={c.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                      <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gray)' }}>{c.mrr} €/mois</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {pendingLumi > 0 && (
                        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(239,68,68,.12)', color: '#f87171', fontWeight: 600 }}>
                          {pendingLumi} action{pendingLumi > 1 ? 's' : ''} Lumi
                        </span>
                      )}
                      {pendingClient > 0 && (
                        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(239,159,39,.12)', color: 'var(--amber)', fontWeight: 600 }}>
                          {pendingClient} info{pendingClient > 1 ? 's' : ''} à récupérer
                        </span>
                      )}
                      {pendingLumi === 0 && pendingClient === 0 && (
                        <span style={{ fontSize: 11, color: 'var(--mint)' }}>Tout est à jour ✓</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Agents recommandés</div>
              <button className="panel-action" onClick={() => router.push('/agents')}>Tous les agents →</button>
            </div>
            <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {MORNING_AGENTS.map(a => (
                <div key={a.n} onClick={() => router.push('/agents')}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--night-3)', borderRadius: 10, border: '1px solid rgba(255,255,255,.05)', cursor: 'pointer', transition: 'border-color .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(13,148,136,.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.05)')}>
                  <div className="agent-avatar-wrap" style={{ width: 36, height: 36, fontSize: 16, flexShrink: 0 }}>{a.e}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 1 }}>{a.reason}</div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--teal-light)' }}>Lancer ↗</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
