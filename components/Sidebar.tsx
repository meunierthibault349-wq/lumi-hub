'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
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
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    href: '/agents', label: 'Agents IA', badge: { text: '20', cls: 'teal' },
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><circle cx="18" cy="8" r="2"/><circle cx="6" cy="8" r="2"/></svg>,
  },
  {
    href: '/finances', label: 'Finances', badge: { text: '1 380 €', cls: 'teal' },
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

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
      <div style={{ padding: '20px 12px 8px' }}>
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
