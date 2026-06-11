import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';

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
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${inter.variable} h-full`}>
      <body
        className="h-full flex overflow-hidden"
        style={{ color: 'var(--white)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
