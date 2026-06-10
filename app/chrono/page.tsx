'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Session {
  id: string;
  description: string;
  project: string;
  start: number;
  end: number | null;
}

const PROJECTS = ['100P Location', 'BeLoc', 'Lumi Cabinet', 'Prospection', 'Interne'];

const STORAGE_KEY = 'lumi-chrono-sessions';

function loadSessions(): Session[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}

function saveSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function formatDuration(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
  if (m > 0) return `${m}m${s.toString().padStart(2, '0')}`;
  return `${s}s`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function isToday(ts: number): boolean {
  const d = new Date(ts); const n = new Date();
  return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}

function isThisWeek(ts: number): boolean {
  const now = Date.now();
  const monday = now - (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) * 86400000;
  const mondayStart = new Date(monday); mondayStart.setHours(0, 0, 0, 0);
  return ts >= mondayStart.getTime();
}

const PROJECT_COLORS: Record<string, string> = {
  '100P Location': '#8B1E2F',
  'BeLoc': '#C9A96E',
  'Lumi Cabinet': 'var(--teal)',
  'Prospection': 'var(--mint)',
  'Interne': 'var(--gray)',
};

export default function ChronoPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [active, setActive] = useState<Session | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [desc, setDesc] = useState('');
  const [project, setProject] = useState(PROJECTS[2]);
  const [view, setView] = useState<'today' | 'week' | 'all'>('today');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const all = loadSessions();
    setSessions(all);
    const running = all.find(s => s.end === null);
    if (running) {
      setActive(running);
      setDesc(running.description);
      setProject(running.project);
    }
  }, []);

  const tick = useCallback(() => {
    setActive(prev => {
      if (!prev) return prev;
      setElapsed(Date.now() - prev.start);
      return prev;
    });
  }, []);

  useEffect(() => {
    if (active) {
      setElapsed(Date.now() - active.start);
      intervalRef.current = setInterval(tick, 1000);
    } else {
      setElapsed(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, tick]);

  function startSession() {
    if (!desc.trim()) return;
    const s: Session = { id: crypto.randomUUID(), description: desc.trim(), project, start: Date.now(), end: null };
    const updated = [...sessions, s];
    setSessions(updated);
    saveSessions(updated);
    setActive(s);
  }

  function stopSession() {
    if (!active) return;
    const updated = sessions.map(s => s.id === active.id ? { ...s, end: Date.now() } : s);
    setSessions(updated);
    saveSessions(updated);
    setActive(null);
    setDesc('');
  }

  function deleteSession(id: string) {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
    if (active?.id === id) setActive(null);
  }

  const todaySessions = sessions.filter(s => isToday(s.start) && s.end !== null);
  const weekSessions = sessions.filter(s => isThisWeek(s.start) && s.end !== null);
  const allDone = sessions.filter(s => s.end !== null);

  const todayMs = todaySessions.reduce((sum, s) => sum + (s.end! - s.start), 0);
  const weekMs = weekSessions.reduce((sum, s) => sum + (s.end! - s.start), 0);

  const weekByProject: Record<string, number> = {};
  weekSessions.forEach(s => { weekByProject[s.project] = (weekByProject[s.project] ?? 0) + (s.end! - s.start); });
  const maxProjectMs = Math.max(...Object.values(weekByProject), 1);

  const displayed = view === 'today' ? todaySessions : view === 'week' ? weekSessions : allDone;
  const displayedReversed = [...displayed].reverse();

  const timerH = Math.floor(elapsed / 3600000);
  const timerM = Math.floor((elapsed % 3600000) / 60000);
  const timerS = Math.floor((elapsed % 60000) / 1000);
  const timerStr = `${timerH.toString().padStart(2, '0')}:${timerM.toString().padStart(2, '0')}:${timerS.toString().padStart(2, '0')}`;

  return (
    <>
      <div style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Chrono</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          Suivi du temps
        </span>
        <div style={{ marginLeft: 'auto' }} />
        <span style={{ fontSize: 13, color: 'var(--teal-light)', fontWeight: 600 }}>
          Aujourd'hui : {formatDuration(todayMs)} · Semaine : {formatDuration(weekMs)}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* Timer + controls */}
        <div className="panel" style={{ marginBottom: 20, padding: '28px 32px', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-jakarta)', fontSize: 64, fontWeight: 800, letterSpacing: 4,
            color: active ? 'var(--teal-light)' : 'var(--gray-dim)',
            transition: 'color .3s',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {timerStr}
          </div>

          {active && (
            <div style={{ marginTop: 8, fontSize: 14, color: 'var(--gray)' }}>
              <span style={{ color: PROJECT_COLORS[active.project] ?? 'var(--teal-light)', fontWeight: 600 }}>{active.project}</span>
              {' · '}{active.description}
            </div>
          )}

          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {!active ? (
              <>
                <input
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') startSession(); }}
                  placeholder="Description de la session…"
                  style={{ padding: '10px 16px', background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: 'var(--white)', fontSize: 14, fontFamily: 'inherit', width: 280 }}
                />
                <select
                  value={project}
                  onChange={e => setProject(e.target.value)}
                  style={{ padding: '10px 14px', background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: 'var(--white)', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
                  {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button
                  onClick={startSession}
                  disabled={!desc.trim()}
                  className="btn primary"
                  style={{ padding: '10px 28px', fontSize: 14, opacity: desc.trim() ? 1 : .5 }}>
                  ▶ Démarrer
                </button>
              </>
            ) : (
              <button
                onClick={stopSession}
                style={{ padding: '12px 36px', fontSize: 15, fontWeight: 700, background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 10, color: '#f87171', cursor: 'pointer', fontFamily: 'inherit' }}>
                ■ Arrêter
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* KPIs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="metric-card">
                <div className="metric-label">Aujourd'hui</div>
                <div className="metric-val" style={{ color: 'var(--teal-light)' }}>{formatDuration(todayMs)}</div>
                <div className="metric-sub">{todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Cette semaine</div>
                <div className="metric-val" style={{ color: 'var(--mint)' }}>{formatDuration(weekMs)}</div>
                <div className="metric-sub">{weekSessions.length} session{weekSessions.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>

          {/* Répartition par projet */}
          <div className="panel" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 14 }}>
              Cette semaine par projet
            </div>
            {Object.keys(weekByProject).length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--gray-dim)' }}>Aucune session cette semaine.</div>
            ) : (
              Object.entries(weekByProject).sort((a, b) => b[1] - a[1]).map(([proj, ms]) => (
                <div key={proj} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: PROJECT_COLORS[proj] ?? 'var(--gray)', fontWeight: 600 }}>{proj}</span>
                    <span style={{ color: 'var(--gray)' }}>{formatDuration(ms)}</span>
                  </div>
                  <div style={{ background: 'var(--night-4)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, background: PROJECT_COLORS[proj] ?? 'var(--teal)', width: `${(ms / maxProjectMs) * 100}%`, transition: 'width .4s' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Historique */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Historique</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['today', 'week', 'all'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className="btn"
                  style={view === v ? { background: 'rgba(13,148,136,.15)', color: 'var(--teal-light)', borderColor: 'rgba(13,148,136,.3)', padding: '4px 10px', fontSize: 12 } : { padding: '4px 10px', fontSize: 12 }}>
                  {v === 'today' ? "Aujourd'hui" : v === 'week' ? 'Semaine' : 'Tout'}
                </button>
              ))}
            </div>
          </div>

          {displayedReversed.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--gray-dim)' }}>
              Aucune session{view === 'today' ? " aujourd'hui" : view === 'week' ? ' cette semaine' : ''}.
            </div>
          ) : (
            displayedReversed.map(s => (
              <div key={s.id}
                style={{ display: 'grid', gridTemplateColumns: '12px 1fr auto auto', gap: 12, padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,.04)', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: PROJECT_COLORS[s.project] ?? 'var(--teal)', justifySelf: 'center' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.description}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 2 }}>
                    {s.project} · {formatTime(s.start)}{s.end ? ` → ${formatTime(s.end)}` : ' · en cours'}
                    {!isToday(s.start) && ` · ${new Date(s.start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', whiteSpace: 'nowrap' }}>
                  {s.end ? formatDuration(s.end - s.start) : formatDuration(elapsed)}
                </div>
                <button onClick={() => deleteSession(s.id)}
                  style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                  ×
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}
