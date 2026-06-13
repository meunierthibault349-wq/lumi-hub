import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions légales — Lumi',
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="vitrine-page">
      <header className="header is-stuck" id="header">
        <div className="wrap header__inner">
          <Link className="brand" href="/" aria-label="Lumi — accueil">
            <div className="brand__icon-wrap">
              <div className="brand__icon-inner">
                <svg className="brand__mark" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="5" y="3" width="3.2" height="12" rx="1" fill="#0D9488"/>
                  <rect x="5" y="12.2" width="10" height="2.8" rx="1" fill="#0D9488"/>
                </svg>
              </div>
            </div>
            <div className="brand__text">
              <span className="brand__wordmark">LUMI</span>
              <span className="brand__tagline">Stratégie digitale</span>
            </div>
          </Link>
        </div>
      </header>

      <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="wrap" style={{ maxWidth: '720px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Mentions légales</h1>
          <p style={{ color: 'var(--text-dim)', marginBottom: '48px', fontSize: '14px' }}>Conformément aux articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 (LCEN)</p>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>Éditeur du site</h2>
            <p>Lumi — entreprise individuelle</p>
            <p>Dirigeant : Thibault Meunier</p>
            <p>Siège social : Vichy, France</p>
            <p>Email : <a href="mailto:contact@lumi-site.fr" style={{ color: 'var(--teal)' }}>contact@lumi-site.fr</a></p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>Hébergement</h2>
            <p>Vercel Inc.</p>
            <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
            <p><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>vercel.com</a></p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>Propriété intellectuelle</h2>
            <p>L&apos;ensemble des contenus présents sur ce site (textes, images, graphismes, logo, icônes) est la propriété exclusive de Lumi, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>Données personnelles</h2>
            <p>Les données collectées via le formulaire de contact (prénom, email, téléphone) sont utilisées exclusivement pour répondre à votre demande. Elles ne sont pas transmises à des tiers. Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données en contactant <a href="mailto:contact@lumi-site.fr" style={{ color: 'var(--teal)' }}>contact@lumi-site.fr</a>.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>Cookies</h2>
            <p>Ce site n&apos;utilise aucun cookie de traçage ou de publicité. Les données de navigation ne sont pas collectées à des fins analytiques.</p>
          </section>

          <Link href="/" style={{ color: 'var(--teal)', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Retour au site
          </Link>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__bottom">
            <span>Lumi © 2026 · Thibault Meunier · Vichy, France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
