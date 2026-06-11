'use client';
import { useState, useEffect } from 'react';
import { CLIENT_COLOR_KEYWORDS } from '@/lib/client-colors';

interface CalEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  location: string | null;
  description: string | null;
  attendees: { email: string; name: string | null; self: boolean }[];
  hangoutLink: string | null;
  colorId: string | null;
  status: string;
}

function eventColor(ev: CalEvent): string {
  const searchStr = [ev.title, ev.description, ...ev.attendees.map(a => a.email)].join(' ').toLowerCase();
  for (const [key, color] of Object.entries(CLIENT_COLOR_KEYWORDS)) {
    if (searchStr.includes(key)) return color;
  }
  const GCal: Record<string, string> = {
    '1': '#7986cb', '2': '#33b679', '3': '#8e24aa', '4': '#e67c73',
    '5': '#f6c026', '6': '#f5511d', '7': '#0b8043', '8': '#d60000',
    '9': '#616161', '10': '#3f51b5', '11': '#0d47a1',
  };
  return ev.colorId ? (GCal[ev.colorId] || 'var(--teal)') : 'var(--teal)';
}

function formatTime(iso: string, allDay: boolean): string {
  if (allDay) return 'Toute la journée';
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(start: string, end: string, allDay: boolean): string {
  if (allDay) return '';
  const diffMin = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  if (diffMin < 60) return `${diffMin}min`;
  const h = Math.floor(diffMin / 60); const m = diffMin % 60;
  return m ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
}

function dayKey(iso: string, allDay: boolean): string {
  if (allDay) return iso.slice(0, 10);
  return new Date(iso).toISOString().slice(0, 10);
}

function dayLabel(key: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (key === today) return "Aujourd'hui";
  if (key === tomorrow) return 'Demain';
  const d = new Date(key + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/calendar')
      .then(async res => {
        if (res.status === 503) { setNotConfigured(true); setLoading(false); return; }
        const data = await res.json();
        if (data.error) { setError(data.error); } else { setEvents(data.events || []); }
        setLoading(false);
      })
      .catch(() => { setError("Impossible de contacter l'API Calendar."); setLoading(false); });
  }, []);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayCount = events.filter(e => dayKey(e.start, e.allDay) === todayKey).length;
  const weekCount = events.filter(e => {
    const d = new Date(dayKey(e.start, e.allDay));
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const end7 = new Date(now.getTime() + 7 * 86400000);
    return d >= now && d < end7;
  }).length;

  const grouped: Record<string, CalEvent[]> = {};
  for (const ev of events) {
    const k = dayKey(ev.start, ev.allDay);
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(ev);
  }
  const sortedDays = Object.keys(grouped).sort();

  if (notConfigured) {
    return (
      <>
        <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
          <div className="page-title">Agenda</div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ maxWidth: 480, background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '32px 36px' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📅</div>
            <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Agenda non configuré</div>
            <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.7, marginBottom: 20 }}>
              Même config que Gmail. Ajoute les mêmes 3 variables Vercel avec le scope Calendar en plus :
            </div>
            <div style={{ background: 'var(--night-3)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--gray-dim)', marginBottom: 4 }}>Scope à ajouter à OAuth Playground</div>
              <code style={{ fontSize: 12, color: 'var(--teal-light)' }}>https://www.googleapis.com/auth/calendar.readonly</code>
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-dim)', lineHeight: 1.6 }}>
              Si tu as déjà les 3 vars pour Gmail, régénère le refresh token avec les 2 scopes (Gmail + Calendar) et remplace <code>GOOGLE_REFRESH_TOKEN</code> dans Vercel.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Agenda</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          3 semaines
        </span>
        <div style={{ marginLeft: 'auto' }} />
        <a href="https://calendar.google.com/calendar/r/eventedit" target="_blank" rel="noopener noreferrer" className="btn primary r-hm" style={{ textDecoration: 'none' }}>
          + Événement
        </a>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* KPI strip */}
        <div className="r-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <div className="metric-card">
            <div className="metric-label">Aujourd'hui</div>
            <div className="metric-val" style={{ color: todayCount > 0 ? 'var(--amber)' : 'var(--mint)' }}>{loading ? '…' : todayCount}</div>
            <div className="metric-sub">événement{todayCount > 1 ? 's' : ''}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Cette semaine</div>
            <div className="metric-val">{loading ? '…' : weekCount}</div>
            <div className="metric-sub">7 prochains jours</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total</div>
            <div className="metric-val">{loading ? '…' : events.length}</div>
            <div className="metric-sub">sur 3 semaines</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Avec participants</div>
            <div className="metric-val">{loading ? '…' : events.filter(e => e.attendees.length > 1).length}</div>
            <div className="metric-sub">réunions</div>
          </div>
        </div>

        {loading && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Chargement…</div>
        )}
        {error && (
          <div style={{ padding: 20, textAlign: 'center', color: '#f87171', fontSize: 13 }}>{error}</div>
        )}
        {!loading && !error && events.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Aucun événement dans les 3 prochaines semaines</div>
        )}

        {!loading && sortedDays.map(day => (
          <div key={day} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: day === todayKey ? 'var(--teal-light)' : 'var(--gray-dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              {dayLabel(day)}
              {day === todayKey && <span style={{ fontSize: 10, padding: '1px 8px', borderRadius: 20, background: 'rgba(13,148,136,.2)', color: 'var(--teal-light)', fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>Aujourd'hui</span>}
            </div>

            <div className="panel" style={{ overflow: 'hidden' }}>
              {grouped[day].map((ev, i) => {
                const color = eventColor(ev);
                const isOpen = expanded === ev.id;
                const hasDetails = ev.location || ev.description || ev.attendees.length > 1 || ev.hangoutLink;
                return (
                  <div key={ev.id}
                    style={{ borderBottom: i < grouped[day].length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                    <div
                      onClick={() => hasDetails && setExpanded(isOpen ? null : ev.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: hasDetails ? 'pointer' : 'default', transition: 'background .1s' }}
                      onMouseEnter={e => hasDetails && (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                      {/* Color bar */}
                      <div style={{ width: 3, height: 36, borderRadius: 2, background: color, flexShrink: 0 }} />

                      {/* Time */}
                      <div style={{ width: 80, flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: ev.allDay ? 'var(--gray)' : 'var(--white)' }}>
                          {formatTime(ev.start, ev.allDay)}
                        </div>
                        {!ev.allDay && (
                          <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 1 }}>
                            {formatDuration(ev.start, ev.end, ev.allDay)}
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</div>
                        {ev.location && (
                          <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 2 }}>📍 {ev.location}</div>
                        )}
                      </div>

                      {/* Badges */}
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                        {ev.hangoutLink && (
                          <a href={ev.hangoutLink} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(13,148,136,.15)', color: 'var(--teal-light)', textDecoration: 'none', border: '1px solid rgba(13,148,136,.2)', fontWeight: 600 }}>
                            Meet ↗
                          </a>
                        )}
                        {ev.attendees.length > 1 && (
                          <span style={{ fontSize: 11, color: 'var(--gray-dim)' }}>
                            {ev.attendees.length} pers.
                          </span>
                        )}
                        {hasDetails && (
                          <span style={{ fontSize: 11, color: 'var(--gray-dim)', transition: 'transform .2s', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                        )}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isOpen && (
                      <div style={{ padding: '0 18px 16px 35px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {ev.description && (
                          <div style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.6, background: 'var(--night-3)', borderRadius: 8, padding: '10px 14px' }}>
                            {ev.description.replace(/<[^>]+>/g, '').trim().slice(0, 300)}
                          </div>
                        )}
                        {ev.attendees.length > 1 && (
                          <div>
                            <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginBottom: 6 }}>Participants</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {ev.attendees.filter(a => !a.self).map(a => (
                                <span key={a.email} style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.06)', color: 'var(--gray)' }}>
                                  {a.name || a.email}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer"
            className="btn" style={{ textDecoration: 'none', fontSize: 12 }}>
            Ouvrir Google Calendar ↗
          </a>
        </div>
      </div>
    </>
  );
}
