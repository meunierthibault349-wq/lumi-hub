import type { Metadata } from 'next';
import './vitrine.css';

export const metadata: Metadata = {
  title: 'Lumi — Stratégie digitale, Web & IA pour TPE/PME',
  description: 'Lumi est un cabinet de conseil en stratégie digitale, développement web et automatisation IA. 28 agents IA spécialisés. Un seul interlocuteur humain.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Lumi',
    title: 'Lumi — Stratégie digitale, Web & IA pour TPE/PME',
    description: 'Lumi est un cabinet de conseil en stratégie digitale, développement web et automatisation IA. 28 agents IA spécialisés. Un seul interlocuteur humain.',
  },
};

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0B1120', color: '#F8FFFE', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {children}
    </div>
  );
}
