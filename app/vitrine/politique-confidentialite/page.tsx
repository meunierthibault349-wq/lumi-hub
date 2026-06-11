import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Lumi',
  robots: { index: false },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="vitrine-page">
      <header className="header is-stuck" id="header">
        <div className="wrap header__inner">
          <Link className="brand" href="/vitrine" aria-label="Lumi — accueil">
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
          <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Politique de confidentialité</h1>
          <p style={{ color: 'var(--text-dim)', marginBottom: '48px', fontSize: '14px' }}>Dernière mise à jour : juin 2026 · Conforme au RGPD (Règlement UE 2016/679)</p>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>1. Responsable du traitement</h2>
            <p>Thibault Meunier — Lumi, Vichy, France</p>
            <p>Contact : <a href="mailto:contact@lumi-site.fr" style={{ color: 'var(--teal)' }}>contact@lumi-site.fr</a></p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>2. Données collectées</h2>
            <p>Via le formulaire de contact : prénom, adresse email, numéro de téléphone (optionnel), description du besoin.</p>
            <p style={{ marginTop: '12px' }}>Aucune donnée de navigation (cookies analytiques, pixels de tracking) n&apos;est collectée sur ce site.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>3. Finalité et base légale</h2>
            <p>Les données collectées sont utilisées exclusivement pour répondre à votre demande de contact (base légale : intérêt légitime / exécution d&apos;un contrat précontractuel). Elles ne sont pas utilisées à des fins de prospection commerciale sans votre consentement explicite.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>4. Durée de conservation</h2>
            <p>Les données sont conservées pendant la durée de la relation commerciale, puis archivées 3 ans à compter du dernier contact (délai de prescription légale). Elles sont ensuite supprimées.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>5. Destinataires</h2>
            <p>Les données ne sont partagées avec aucun tiers à des fins commerciales. Les prestataires techniques (hébergeur Vercel, service d&apos;envoi d&apos;emails) y accèdent dans le strict cadre de leur mission et sont soumis à des obligations de confidentialité.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>6. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '2' }}>
              <li>Droit d&apos;accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l&apos;effacement (&laquo; droit à l&apos;oubli &raquo;)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
            <p style={{ marginTop: '16px' }}>Pour exercer ces droits : <a href="mailto:contact@lumi-site.fr" style={{ color: 'var(--teal)' }}>contact@lumi-site.fr</a>. Réponse sous 30 jours. En cas de litige non résolu, vous pouvez saisir la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>CNIL</a>.</p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--mint)' }}>7. Sécurité</h2>
            <p>Les données sont transmises via HTTPS (TLS) et stockées sur des serveurs certifiés SOC 2 (Vercel). Des mesures techniques et organisationnelles appropriées sont mises en place pour protéger vos données contre tout accès non autorisé.</p>
          </section>

          <Link href="/vitrine" style={{ color: 'var(--teal)', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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
