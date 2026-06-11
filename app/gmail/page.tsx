'use client';
import { useState, useEffect, useCallback } from 'react';
import { CLIENT_COLOR_KEYWORDS } from '@/lib/client-colors';

interface Thread {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  unread: boolean;
  messageCount: number;
}

function clientColor(email: string): string | null {
  const lower = email.toLowerCase();
  for (const [key, color] of Object.entries(CLIENT_COLOR_KEYWORDS)) {
    if (lower.includes(key)) return color;
  }
  return null;
}

function formatFrom(raw: string): string {
  const match = raw.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : raw.replace(/<.*>/, '').trim();
}

function formatDate(raw: string): string {
  try {
    const d = new Date(raw);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = diffMs / 3600000;
    if (diffH < 1) return "À l'instant";
    if (diffH < 24) return `Il y a ${Math.round(diffH)}h`;
    if (diffH < 48) return 'Hier';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch { return raw; }
}

export default function GmailPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'clients'>('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ maxResults: '20' });
      if (q) params.set('q', q);
      const res = await fetch(`/api/gmail?${params}`);
      if (res.status === 503) { setNotConfigured(true); setLoading(false); return; }
      const data = await res.json();
      if (data.error) { setError(data.error); } else { setThreads(data.threads || []); }
    } catch { setError("Impossible de contacter l'API Gmail."); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(search || undefined);
  }

  const displayed = threads.filter(t => {
    if (filter === 'unread') return t.unread;
    if (filter === 'clients') return clientColor(t.from) !== null;
    return true;
  });

  if (notConfigured) {
    return (
      <>
        <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
          <div className="page-title">Gmail</div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ maxWidth: 480, background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '32px 36px' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📬</div>
            <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Gmail non configuré</div>
            <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.7, marginBottom: 20 }}>
              Pour connecter Gmail, ajoute ces 3 variables dans les env vars Vercel (Settings → Environment Variables) :
            </div>
            {[
              { k: 'GOOGLE_CLIENT_ID', v: 'ton Client ID Google Cloud' },
              { k: 'GOOGLE_CLIENT_SECRET', v: 'ton Client Secret' },
              { k: 'GOOGLE_REFRESH_TOKEN', v: 'ton Refresh Token (OAuth Playground)' },
            ].map(({ k, v }) => (
              <div key={k} style={{ background: 'var(--night-3)', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--teal-light)', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-dim)' }}>{v}</div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(13,148,136,.08)', borderRadius: 8, border: '1px solid rgba(13,148,136,.15)', fontSize: 12, color: 'var(--gray)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--teal-light)' }}>Scopes requis :</strong><br />
              <code>https://www.googleapis.com/auth/gmail.readonly</code><br />
              Obtiens le refresh token via <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-light)' }}>OAuth Playground</a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Gmail</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          {threads.filter(t => t.unread).length} non lus
        </span>
        <form onSubmit={handleSearch} style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            style={{ background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: 'var(--white)', outline: 'none', width: 180 }}
          />
          <button type="submit" className="btn" style={{ padding: '6px 14px' }}>Chercher</button>
        </form>
        <a href="https://mail.google.com/mail/u/0/#compose" target="_blank" rel="noopener noreferrer" className="btn primary r-hm" style={{ textDecoration: 'none' }}>
          + Composer
        </a>
      </div>

      <div className="r-pc" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['all', 'unread', 'clients'] as const).map(f => (
            <button key={f}
              className={`btn${filter === f ? ' active' : ''}`}
              style={filter === f ? { background: 'rgba(13,148,136,.15)', color: 'var(--teal-light)', borderColor: 'rgba(13,148,136,.3)', padding: '5px 14px' } : { padding: '5px 14px' }}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tous' : f === 'unread' ? 'Non lus' : 'Clients'}
            </button>
          ))}
          <button className="btn" style={{ marginLeft: 'auto', padding: '5px 14px' }} onClick={() => load()}>
            ↺ Rafraîchir
          </button>
        </div>

        {/* Thread list */}
        <div className="panel" style={{ overflow: 'hidden' }}>
          {loading && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Chargement…</div>
          )}
          {error && (
            <div style={{ padding: 20, textAlign: 'center', color: '#f87171', fontSize: 13 }}>{error}</div>
          )}
          {!loading && !error && displayed.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>Aucun email</div>
          )}
          {!loading && displayed.map(t => {
            const color = clientColor(t.from);
            const fromName = formatFrom(t.from);
            return (
              <a key={t.id}
                href={`https://mail.google.com/mail/u/0/#inbox/${t.id}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', textDecoration: 'none', transition: 'background .1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                {/* Avatar */}
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, background: color ? color + '33' : 'var(--night-3)', border: `1.5px solid ${color || 'rgba(255,255,255,.08)'}`, color: color || 'var(--gray)' }}>
                  {fromName.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: t.unread ? 700 : 500, color: t.unread ? 'var(--white)' : 'var(--gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                      {fromName}
                    </span>
                    {color && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    )}
                    {t.unread && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, background: 'rgba(13,148,136,.2)', color: 'var(--teal-light)', flexShrink: 0 }}>Nouveau</span>
                    )}
                    {t.messageCount > 1 && (
                      <span style={{ fontSize: 11, color: 'var(--gray-dim)', flexShrink: 0 }}>{t.messageCount}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: t.unread ? 600 : 400, color: t.unread ? 'var(--white)' : 'var(--gray)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.subject}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.snippet}
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'var(--gray-dim)', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2 }}>
                  {formatDate(t.date)}
                </div>
              </a>
            );
          })}
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer"
            className="btn" style={{ textDecoration: 'none', fontSize: 12 }}>
            Ouvrir Gmail complet ↗
          </a>
        </div>
      </div>
    </>
  );
}
