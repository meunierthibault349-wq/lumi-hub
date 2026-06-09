import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Lumi Hub',
  description: 'Cabinet de conseil Lumi — Espace de travail centralisé',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${inter.variable} h-full`}>
      <body
        className="h-full flex overflow-hidden"
        style={{ background: 'var(--night)', color: 'var(--white)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
