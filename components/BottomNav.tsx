'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  {
    href: '/morning', label: 'Morning',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  },
  {
    href: '/taches', label: 'Tâches', badge: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    href: '/agents', label: 'Agents',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><circle cx="18" cy="8" r="2"/><circle cx="6" cy="8" r="2"/></svg>,
  },
  {
    href: '/chrono', label: 'Chrono',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>,
  },
  {
    href: '/finances', label: 'Finances',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {NAV.map(item => (
        <Link key={item.href} href={item.href} className={`bottom-nav-item${pathname === item.href ? ' active' : ''}`}>
          {item.icon}
          <span>{item.label}</span>
          {item.badge && <span className="bottom-nav-badge">!</span>}
        </Link>
      ))}
    </nav>
  );
}
