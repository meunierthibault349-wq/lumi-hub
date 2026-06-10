'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClientContext } from '@/components/ClientContextProvider';
import { CLIENT_CONTEXTS } from '@/lib/client-contexts';

const NAV = [
  {
    href: '/morning', label: 'Morning', badge: null,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  },
  {
    href: '/', label: 'Dashboard', badge: null,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    href: '/projets', label: 'Projets', badge: { text: '4', cls: '' },
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18"/><circle cx="6" cy="7" r="1.5" fill="currentColor"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="6" cy="17" r="1.5" fill="currentColor"/></svg>,
  },
  {
    href: '/taches', label: 'Tâches', badge: { text: '9', cls: 'red' },
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    href: '/clients', label: 'Clients', badge: { text: '2', cls: '' },
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    href: '/pipeline', label: 'Pipeline', badge: { text: '2', cls: '' },
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    href: '/agents', label: 'Agents IA', badge: { text: '20', cls: 'teal' },
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><circle cx="18" cy="8" r="2"/><circle cx="6" cy="8" r="2"/></svg>,
  },
  {
    href: '/livrables', label: 'Livrables', badge: null,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    href: '/finances', label: 'Finances', badge: { text: '1 380 €', cls: 'teal' },
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    href: '/chrono', label: 'Chrono', badge: null,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>,
  },
  {
    href: '/gmail', label: 'Gmail', badge: null,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
  {
    href: '/calendar', label: 'Agenda', badge: null,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { activeClient, setActiveClient } = useClientContext();

  return (
    <aside className="sidebar" style={{ width: 240, flexShrink: 0, background: 'var(--night-2)', borderRight: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="logo-icon"><span>L</span></div>
        <div>
          <div className="logo-wordmark">LUMI HUB</div>
          <span className="logo-sub">Cabinet de conseil</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: '20px 12px 8px', flex: 1, overflowY: 'auto' }}>
        <div className="section-label">Navigation</div>
        {NAV.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`nav-link${isActive ? ' active' : ''}`}>
              {item.icon}
              {item.label}
              {item.badge && <span className={`nav-badge ${item.badge.cls}`}>{item.badge.text}</span>}
            </Link>
          );
        })}

        {/* Contexte client */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Contexte client</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Object.values(CLIENT_CONTEXTS).map(c => {
              const isActive = activeClient?.ref === c.ref;
              return (
                <button
                  key={c.ref}
                  onClick={() => setActiveClient(isActive ? null : c)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 10px',
                    borderRadius: 7,
                    border: `1px solid ${isActive ? c.color + '55' : 'rgba(255,255,255,.06)'}`,
                    background: isActive ? c.color + '15' : 'transparent',
                    color: isActive ? c.color : 'var(--gray)',
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all .15s',
                  }}
                >
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: isActive ? c.color : 'rgba(255,255,255,.2)',
                    flexShrink: 0,
                  }} />
                  {c.name}
                  {isActive && <span style={{ marginLeft: 'auto', fontSize: 11 }}>actif</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User */}
      <div className="sidebar-user">
        <div className="avatar">T</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--white)' }}>Thibault</div>
          <div style={{ fontSize: 11, color: 'var(--gray-dim)' }}>CEO — Lumi</div>
        </div>
      </div>
    </aside>
  );
}
