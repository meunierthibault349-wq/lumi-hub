'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import NotifToast from './NotifToast';
import { ClientContextProvider } from './ClientContextProvider';
import { ToastProvider } from '@/context/ToastContext';
import AIAssistant from './AIAssistant';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/auth') || pathname?.startsWith('/client');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      <ClientContextProvider>
        <Sidebar />
        <main key={pathname} className="flex-1 flex flex-col overflow-hidden main-content page-enter">
          {children}
        </main>
        <BottomNav />
        <NotifToast />
        <AIAssistant />
      </ClientContextProvider>
    </ToastProvider>
  );
}
