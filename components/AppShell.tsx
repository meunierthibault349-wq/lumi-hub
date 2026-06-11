'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { ClientContextProvider } from './ClientContextProvider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/auth') || pathname?.startsWith('/client');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <ClientContextProvider>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      <BottomNav />
    </ClientContextProvider>
  );
}
