'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ClientHeader({ clientName }: { clientName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push('/client/login');
    router.refresh();
  }

  const links = [
    { href: '/client', label: 'Projets' },
    { href: '/client/factures', label: 'Factures' },
  ];

  return (
    <header style={{
      height: 56, borderBottom: '1px solid rgba(255,255,255,.06)',
      background: 'var(--night-2)', display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 50,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, background: '#0B1120',
          border: '1.5px solid #0D9488', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 13, fontWeight: 800,
          color: '#0D9488', fontFamily: 'var(--font-jakarta)',
        }}>L</div>
        <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 14 }}>
          Espace Client
        </span>
      </div>

      <nav style={{ display: 'flex', gap: 4 }}>
        {links.map(link => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--teal-light)' : 'var(--gray)',
              background: active ? 'rgba(13,148,136,.12)' : 'transparent',
              textDecoration: 'none', transition: 'all .15s',
              border: `1px solid ${active ? 'rgba(13,148,136,.25)' : 'transparent'}`,
            }}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--gray)' }}>{clientName}</span>
        <button onClick={logout} style={{
          padding: '5px 14px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,.08)', background: 'transparent',
          color: 'var(--gray)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all .15s',
        }}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}
