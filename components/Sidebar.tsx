'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useClientContext } from '@/components/ClientContextProvider';
import { CLIENT_CONTEXTS } from '@/lib/client-contexts';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { AGENTS_DATA } from '@/lib/data';

const AGENTS_COUNT = AGENTS_DATA.reduce((sum, pole) => sum + pole.agents.length, 0);

const NAV_GROUPS = [
  {
    label: 'Quotidien',
    items: [
      {
        href: '/morning', label: 'Morning', badgeKey: null as null,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
      },
      {
        href: '/', label: 'Dashboard', badgeKey: null as null,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
      },
    ],
  },
  {
    label: 'Cabinet',
    items: [
      {
        href: '/clients', label: 'Clients', badgeKey: 'clients' as const,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      },
      {
        href: '/projets', label: 'Projets', badgeKey: 'projects' as const,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18"/><circle cx="6" cy="7" r="1.5" fill="currentColor"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="6" cy="17" r="1.5" fill="currentColor"/></svg>,
      },
      {
        href: '/taches', label: 'Tâches', badgeKey: 'tasks' as const,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
      },
      {
        href: '/pipeline', label: 'Pipeline', badgeKey: 'pipeline' as const,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
      },
    ],
  },
  {
    label: 'IA',
    items: [
      {
        href: '/orchestre', label: 'Chef Adjoint', badgeKey: null as null,
        staticBadge: { text: '⚡', cls: 'teal' },
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      },
      {
        href: '/agents', label: 'Agents IA', badgeKey: null as null,
        staticBadge: { text: String(AGENTS_COUNT), cls: 'teal' },
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><circle cx="18" cy="8" r="2"/><circle cx="6" cy="8" r="2"/></svg>,
      },
      {
        href: '/livrables', label: 'Livrables', badgeKey: null as null,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
      },
      {
        href: '/documents', label: 'Jarvis Docs', badgeKey: null as null,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      },
    ],
  },
  {
    label: 'Outils',
    items: [
      {
        href: '/finances', label: 'Finances', badgeKey: 'mrr' as const,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      },
      {
        href: '/chrono', label: 'Chrono', badgeKey: null as null,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>,
      },
      {
        href: '/gmail', label: 'Gmail', badgeKey: null as null,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      },
      {
        href: '/calendar', label: 'Agenda', badgeKey: null as null,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      },
    ],
  },
];

type BadgeCounts = { tasks: number; projects: number; clients: number; pipeline: number; mrr: number };

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeClient, setActiveClient } = useClientContext();
  const [counts, setCounts] = useState<BadgeCounts>({ tasks: 0, projects: 0, clients: 0, pipeline: 0, mrr: 0 });
  const [expanded, setExpanded] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  useEffect(() => {
    supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('done', false)
      .then(({ count }) => setCounts(p => ({ ...p, tasks: count ?? 0 })));
    supabase.from('projects').select('id', { count: 'exact', head: true }).neq('status', 'livré')
      .then(({ count }) => setCounts(p => ({ ...p, projects: count ?? 0 })));
    supabase.from('clients').select('id, mrr')
      .then(({ data }) => {
        const mrr = (data ?? []).reduce((s: number, c: { mrr: number }) => s + c.mrr, 0);
        setCounts(p => ({ ...p, clients: data?.length ?? 0, mrr }));
      });
    supabase.from('prospects').select('id', { count: 'exact', head: true }).eq('stage', 'chaud')
      .then(({ count }) => setCounts(p => ({ ...p, pipeline: count ?? 0 })));
  }, []);

  function getBadge(item: typeof NAV_GROUPS[0]['items'][0]): { text: string; cls: string } | null {
    if ('staticBadge' in item && item.staticBadge) return item.staticBadge;
    if (!item.badgeKey) return null;
    const v = counts[item.badgeKey];
    if (item.badgeKey === 'mrr') return v > 0 ? { text: `${v} €`, cls: 'teal' } : null;
    if (item.badgeKey === 'tasks') return v > 0 ? { text: String(v), cls: 'red' } : null;
    return v > 0 ? { text: String(v), cls: '' } : null;
  }

  const fadeLabel: React.CSSProperties = {
    opacity: expanded ? 1 : 0,
    maxWidth: expanded ? '160px' : '0px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: `opacity 0.18s ${expanded ? '0.06s' : '0s'}, max-width 0.25s`,
    flexShrink: 0,
  };

  return (
    <aside
      className="sidebar"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: 'fixed',
        left: 0, top: 0,
        height: '100vh',
        width: expanded ? 220 : 64,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 50,
        background: 'rgba(7,12,22,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,.07)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: expanded ? '4px 0 32px rgba(0,0,0,.5)' : '2px 0 12px rgba(0,0,0,.3)',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '18px 0 14px',
        paddingLeft: expanded ? 18 : 0,
        transition: 'padding-left 0.25s',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'flex-start' : 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <div className="logo-icon"><span>L</span></div>
        <div style={{ ...fadeLabel, maxWidth: expanded ? '160px' : '0px' }}>
          <div className="logo-wordmark">LUMI HUB</div>
          <span className="logo-sub">Cabinet de conseil</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: '10px 8px 8px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} style={{ marginBottom: gi < NAV_GROUPS.length - 1 ? 4 : 0 }}>
            {/* Section label — fades in with sidebar */}
            <div
              className="section-label"
              style={{
                marginTop: expanded && gi > 0 ? 12 : 0,
                marginBottom: expanded ? 6 : 0,
                maxHeight: expanded ? 20 : 0,
                overflow: 'hidden',
                opacity: expanded ? 1 : 0,
                transition: 'opacity 0.18s, max-height 0.25s, margin 0.25s',
              }}
            >
              {group.label}
            </div>

            {group.items.map(item => {
              const isActive = pathname === item.href;
              const badge = getBadge(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!expanded ? item.label : undefined}
                  className={`nav-link${isActive ? ' active' : ''}`}
                  onMouseEnter={() => router.prefetch(item.href)}
                  style={{
                    justifyContent: expanded ? 'flex-start' : 'center',
                    gap: expanded ? 10 : 0,
                    padding: expanded ? '9px 12px' : '10px 0',
                    transition: 'background 0.15s, color 0.15s, border-color 0.15s, padding 0.25s, gap 0.25s',
                    position: 'relative',
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span style={fadeLabel}>{item.label}</span>
                  {expanded && badge && <span className={`nav-badge ${badge.cls}`}>{badge.text}</span>}
                  {!expanded && badge && (
                    <span style={{
                      position: 'absolute', top: 6, right: 9,
                      width: 7, height: 7, borderRadius: '50%',
                      background: badge.cls === 'red' ? 'var(--red)' : 'var(--teal-light)',
                      boxShadow: `0 0 5px ${badge.cls === 'red' ? 'var(--red)' : 'var(--teal)'}`,
                    }} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Client context — hidden when collapsed */}
        <div style={{
          marginTop: 0,
          maxHeight: expanded ? '200px' : '0px',
          opacity: expanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'opacity 0.18s, max-height 0.3s',
        }}>
          <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)', marginTop: 12 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Contexte client</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.values(CLIENT_CONTEXTS).map(c => {
                const isActive = activeClient?.ref === c.ref;
                return (
                  <button
                    key={c.ref}
                    onClick={() => setActiveClient(isActive ? null : c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 7,
                      border: `1px solid ${isActive ? c.color + '55' : 'rgba(255,255,255,.06)'}`,
                      background: isActive ? c.color + '15' : 'transparent',
                      color: isActive ? c.color : 'var(--gray)',
                      fontSize: 12, fontWeight: isActive ? 600 : 400, cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'left', width: '100%', transition: 'all .15s',
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: isActive ? c.color : 'rgba(255,255,255,.2)', flexShrink: 0 }} />
                    {c.name}
                    {isActive && <span style={{ marginLeft: 'auto', fontSize: 11 }}>actif</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* User */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid rgba(255,255,255,.06)',
        display: 'flex',
        alignItems: 'center',
        gap: expanded ? 10 : 0,
        justifyContent: expanded ? 'flex-start' : 'center',
        padding: expanded ? '14px 12px' : '14px 0',
        transition: 'padding 0.25s, gap 0.25s',
      }}>
        <div className="avatar" style={{ flexShrink: 0 }}>T</div>
        <div style={{ ...fadeLabel, maxWidth: expanded ? '100px' : '0px', flex: expanded ? 1 : undefined }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--white)' }}>Thibault</div>
          <div style={{ fontSize: 11, color: 'var(--gray-dim)' }}>CEO — Lumi</div>
        </div>
        <div style={{
          opacity: expanded ? 1 : 0,
          maxWidth: expanded ? '28px' : '0px',
          overflow: 'hidden',
          transition: `opacity 0.18s ${expanded ? '0.1s' : '0s'}, max-width 0.25s`,
          flexShrink: 0,
        }}>
          <button
            onClick={handleSignOut}
            title="Se déconnecter"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-dim)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color .15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-dim)')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
