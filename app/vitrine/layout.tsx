import type { Metadata } from 'next';
import './vitrine.css';

export const metadata: Metadata = {
  title: 'Lumi — Stratégie digitale, Web & IA pour TPE/PME',
  description: 'Lumi est un cabinet de conseil en stratégie digitale, développement web et automatisation IA. 28 agents IA spécialisés. Un seul interlocuteur humain.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://lumi-site.fr',
    siteName: 'Lumi',
    title: 'Lumi — Stratégie digitale, Web & IA pour TPE/PME',
    description: 'Lumi est un cabinet de conseil en stratégie digitale, développement web et automatisation IA. 28 agents IA spécialisés. Un seul interlocuteur humain.',
  },
};

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Inter:wght@300;400;500&family=Plus+Jakarta+Sans:wght@400;700;800&display=swap"
      />
      <div style={{ minHeight: '100vh', background: '#0B1120', color: '#F8FFFE', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
      </div>
    </>
  );
}
