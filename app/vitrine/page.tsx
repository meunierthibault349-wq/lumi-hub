import VitrineClient from './VitrineClient';

export default function VitrinePage() {
  return (
    <div className="vitrine-page">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Inter:wght@300;400;500&family=Plus+Jakarta+Sans:wght@400;700;800&display=swap"
      />

      <VitrineClient />

      <a href="#main-content" className="skip-link">Aller au contenu principal</a>

      {/* BANDEAU TOP */}
      <div className="topbar" id="topbar">
        <div className="topbar__inner">
          <span className="topbar__text">
            <strong>Diagnostic Digital 360° offert</strong> — on analyse votre présence et vos 3 priorités, sans engagement.
          </span>
          <a className="topbar__cta" href="#contact">
            Je réserve
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <button className="topbar__close" id="topbarClose" aria-label="Fermer le bandeau">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
      </div>
      <button className="topbar-restore" id="topbarRestore" aria-label="Afficher le bandeau">▲ Offre</button>

      {/* HEADER */}
      <header className="header" id="header">
        <div className="wrap header__inner">
          <a className="brand" href="#top" aria-label="Lumi — accueil">
            <div className="brand__icon-wrap">
              <div className="brand__icon-inner">
                <svg className="brand__mark" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="5" y="3" width="3.2" height="12" rx="1" fill="#0D9488"/>
                  <rect x="5" y="12.2" width="10" height="2.8" rx="1" fill="#0D9488"/>
                </svg>
              </div>
            </div>
            <div className="brand__text">
              <span className="brand__wordmark">LUMI</span>
              <span className="brand__tagline">Stratégie digitale</span>
            </div>
          </a>
          <nav className="nav" aria-label="Navigation principale">
            <ul className="nav__links">
              <li><a href="#top">Accueil</a></li>
              <li><a href="#equipe">L&apos;équipe</a></li>
              <li><a href="#offres">Nos offres</a></li>
              <li><a href="#methode">Méthode</a></li>
              <li><a href="#resultats">Résultats</a></li>
            </ul>
            <a className="btn btn--primary" href="#contact">
              Réserver un appel
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
          </nav>
          <button className="nav__toggle" id="navToggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="drawer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>
      </header>

      {/* DRAWER MOBILE */}
      <nav className="drawer" id="drawer" aria-label="Navigation mobile" aria-hidden="true">
        <button className="drawer__close" id="drawerClose" aria-label="Fermer le menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <a href="#top" data-close="">Accueil</a>
        <a href="#equipe" data-close="">L&apos;équipe</a>
        <a href="#offres" data-close="">Nos offres</a>
        <a href="#methode" data-close="">Méthode</a>
        <a href="#resultats" data-close="">Résultats</a>
        <a className="btn btn--primary" href="#contact" data-close="">Réserver un appel</a>
      </nav>

      <main id="top" aria-label="Contenu principal">
        <a id="main-content" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

        {/* HERO */}
        <section className="hero" data-screen-label="Hero">
          <div className="aurora" aria-hidden="true"><span className="b1"/><span className="b2"/><span className="b3"/></div>
          <div className="grid-overlay" aria-hidden="true"/>
          <div className="wrap hero__inner">

            {/* Variante 1 — Aurora split (active via data-hero="1" sur html) */}
            <div className="hero-variant hero-variant--1">
              <div className="hv1">
                <div className="hv1__copy">
                  <span className="badge-pill" data-reveal=""><span className="tag">Lumi</span> Cabinet de conseil opérationnel</span>
                  <h1 data-reveal="" style={{ ['--d' as string]: '80ms' }}>Le partenaire digital qui conseille <span className="glow">et exécute.</span></h1>
                  <p className="hero__sub" data-reveal="" style={{ ['--d' as string]: '160ms' }}>Stratégie digitale, développement web et automatisation IA. Un seul interlocuteur, de l&apos;idée au résultat mesurable — sans sous-traitance, sans intermédiaire.</p>
                  <div className="hero__team-pill" data-reveal="" style={{ ['--d' as string]: '200ms' }}>
                    <div className="avatar-stack">
                      <svg className="agent-svg" data-agent="web" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Dev Web" style={{ zIndex: 5 }}>
                        <defs><linearGradient id="gb-web-sm" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                        <rect width="48" height="48" rx="14" fill="url(#gb-web-sm)"/>
                        <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                        <circle cx="18" cy="20" r="3.5" fill="#0D9488"/>
                        <circle cx="30" cy="20" r="3.5" fill="#0D9488"/>
                        <path d="M18 28 Q24 33 30 28" stroke="#0D9488" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      </svg>
                      <svg className="agent-svg" data-agent="editorial" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Editorial" style={{ zIndex: 4 }}>
                        <defs><linearGradient id="gb-ed-sm" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                        <rect width="48" height="48" rx="14" fill="url(#gb-ed-sm)"/>
                        <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                        <circle cx="18" cy="20" r="3.5" fill="#5DCAA5"/>
                        <circle cx="30" cy="20" r="3.5" fill="#5DCAA5"/>
                        <path d="M18 28 Q24 33 30 28" stroke="#5DCAA5" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      </svg>
                      <svg className="agent-svg" data-agent="seo" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent SEO" style={{ zIndex: 3 }}>
                        <defs><linearGradient id="gb-seo-sm" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                        <rect width="48" height="48" rx="14" fill="url(#gb-seo-sm)"/>
                        <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                        <circle cx="18" cy="20" r="3.5" fill="#5DCAA5"/>
                        <circle cx="30" cy="20" r="3.5" fill="#5DCAA5"/>
                        <path d="M18 28 Q24 32 30 28" stroke="#5DCAA5" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      </svg>
                      <svg className="agent-svg" data-agent="analytics" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Analytics" style={{ zIndex: 2 }}>
                        <defs><linearGradient id="gb-ana-sm" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                        <rect width="48" height="48" rx="14" fill="url(#gb-ana-sm)"/>
                        <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                        <circle cx="18" cy="20" r="3.5" fill="#0D9488"/>
                        <circle cx="30" cy="20" r="3.5" fill="#0D9488"/>
                        <path d="M18 28 Q24 32 30 28" stroke="#0D9488" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      </svg>
                      <svg className="agent-svg" data-agent="account" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Account" style={{ zIndex: 1 }}>
                        <defs><linearGradient id="gb-acc-sm" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                        <rect width="48" height="48" rx="14" fill="url(#gb-acc-sm)"/>
                        <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                        <circle cx="18" cy="20" r="3.5" fill="#5DCAA5"/>
                        <circle cx="30" cy="20" r="3.5" fill="#5DCAA5"/>
                        <path d="M18 28 Q24 32 30 28" stroke="#5DCAA5" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span>+ 28 agents IA dans votre équipe</span>
                  </div>
                  <div className="hero__cta" data-reveal="" style={{ ['--d' as string]: '280ms' }}>
                    <a className="btn btn--primary btn--lg" href="#offres">Découvrir nos offres
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </a>
                    <a className="btn btn--ghost btn--lg" href="#methode">Notre méthode</a>
                  </div>
                  <div className="hero__meta" data-reveal="" style={{ ['--d' as string]: '320ms' }}>
                    <div className="stat"><strong>~5h<span style={{ fontSize: '15px', color: 'var(--text-dim)' }}>/sem.</span></strong><span>économisées dès le mois 1</span></div>
                    <div className="stat"><strong>2–4 sem.</strong><span>pour un site en ligne</span></div>
                    <div className="stat"><strong>1 seul</strong><span>interlocuteur, 3 expertises</span></div>
                  </div>
                </div>

                {/* Composition orbitale */}
                <div className="hv1__visual" data-reveal="" style={{ ['--d' as string]: '160ms' }} data-parallax="0.06">
                  <div className="hero-orbital">
                    {/* Anneau 1 — 5 agents */}
                    <div className="orbit-ring orbit-ring--1">
                      <div className="orbit-agent">
                        <svg className="agent-svg" data-agent="web" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Dev Web">
                          <defs><linearGradient id="gb-web" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                          <rect width="48" height="48" rx="14" fill="url(#gb-web)"/>
                          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                          <circle cx="17" cy="20" r="3.5" fill="#0D9488"/><circle cx="31" cy="20" r="3.5" fill="#0D9488"/>
                          <path d="M17 27 Q24 33 31 27" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          <path d="M36 38 l3-3-3-3" stroke="#0D9488" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5"/>
                        </svg>
                      </div>
                      <div className="orbit-agent">
                        <svg className="agent-svg" data-agent="editorial" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Editorial">
                          <defs><linearGradient id="gb-ed" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                          <rect width="48" height="48" rx="14" fill="url(#gb-ed)"/>
                          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                          <circle cx="17" cy="20" r="3.5" fill="#5DCAA5"/><circle cx="31" cy="20" r="3.5" fill="#5DCAA5"/>
                          <path d="M17 27 Q24 33 31 27" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          <line x1="16" y1="37" x2="32" y2="37" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                        </svg>
                      </div>
                      <div className="orbit-agent">
                        <svg className="agent-svg" data-agent="instagram" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Instagram">
                          <defs><linearGradient id="gb-ig" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                          <rect width="48" height="48" rx="14" fill="url(#gb-ig)"/>
                          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                          <circle cx="17" cy="20" r="3.5" fill="#E1306C"/><circle cx="31" cy="20" r="3.5" fill="#E1306C"/>
                          <path d="M17 27 Q24 33 31 27" stroke="#E1306C" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          <rect x="18" y="35" width="12" height="8" rx="2.5" stroke="#E1306C" strokeWidth="1.5" fill="none" opacity=".5"/>
                        </svg>
                      </div>
                      <div className="orbit-agent">
                        <svg className="agent-svg" data-agent="linkedin" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent LinkedIn">
                          <defs><linearGradient id="gb-li" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                          <rect width="48" height="48" rx="14" fill="url(#gb-li)"/>
                          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                          <circle cx="17" cy="20" r="3.5" fill="#0A66C2"/><circle cx="31" cy="20" r="3.5" fill="#0A66C2"/>
                          <path d="M17 27 Q24 33 31 27" stroke="#0A66C2" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          <circle cx="18" cy="37" r="2" fill="#0A66C2" opacity=".5"/>
                        </svg>
                      </div>
                      <div className="orbit-agent">
                        <svg className="agent-svg" data-agent="seo" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent SEO">
                          <defs><linearGradient id="gb-seo" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                          <rect width="48" height="48" rx="14" fill="url(#gb-seo)"/>
                          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                          <circle cx="17" cy="20" r="3.5" fill="#5DCAA5"/><circle cx="31" cy="20" r="3.5" fill="#5DCAA5"/>
                          <path d="M17 27 Q24 33 31 27" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          <circle cx="20" cy="37" r="3" stroke="#5DCAA5" strokeWidth="1.5" fill="none" opacity=".5"/>
                          <line x1="22.5" y1="39.5" x2="26" y2="43" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                        </svg>
                      </div>
                    </div>

                    {/* Anneau 2 — 4 agents */}
                    <div className="orbit-ring orbit-ring--2">
                      <div className="orbit-agent">
                        <svg className="agent-svg" data-agent="analytics" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Analytics">
                          <defs><linearGradient id="gb-anl" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                          <rect width="48" height="48" rx="14" fill="url(#gb-anl)"/>
                          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                          <circle cx="17" cy="20" r="3.5" fill="#0D9488"/><circle cx="31" cy="20" r="3.5" fill="#0D9488"/>
                          <path d="M17 27 Q24 32 31 27" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          <polyline points="15,43 19,38 23,41 27,36 33,33" stroke="#0D9488" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
                        </svg>
                      </div>
                      <div className="orbit-agent">
                        <svg className="agent-svg" data-agent="gmb" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Google Maps">
                          <defs><linearGradient id="gb-gmb" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                          <rect width="48" height="48" rx="14" fill="url(#gb-gmb)"/>
                          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                          <circle cx="17" cy="20" r="3.5" fill="#EF9F27"/><circle cx="31" cy="20" r="3.5" fill="#EF9F27"/>
                          <path d="M17 27 Q24 33 31 27" stroke="#EF9F27" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          <path d="M24 34 Q24 34 24 38" stroke="#EF9F27" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                          <circle cx="24" cy="32" r="2.5" stroke="#EF9F27" strokeWidth="1.5" fill="none" opacity=".5"/>
                        </svg>
                      </div>
                      <div className="orbit-agent">
                        <svg className="agent-svg" data-agent="meta-ads" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Meta Ads">
                          <defs><linearGradient id="gb-ma" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                          <rect width="48" height="48" rx="14" fill="url(#gb-ma)"/>
                          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                          <circle cx="17" cy="20" r="3.5" fill="#EF9F27"/><circle cx="31" cy="20" r="3.5" fill="#EF9F27"/>
                          <path d="M17 27 Q24 33 31 27" stroke="#EF9F27" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          <path d="M16 37 L20 33 L24 37 L28 33 L32 37" stroke="#EF9F27" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
                        </svg>
                      </div>
                      <div className="orbit-agent">
                        <svg className="agent-svg" data-agent="account" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Account Manager">
                          <defs><linearGradient id="gb-acm" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                          <rect width="48" height="48" rx="14" fill="url(#gb-acm)"/>
                          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0B1120"/>
                          <circle cx="17" cy="20" r="3.5" fill="#5DCAA5"/><circle cx="31" cy="20" r="3.5" fill="#5DCAA5"/>
                          <path d="M17 27 Q24 33 31 27" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          <path d="M20 37 a4 4 0 0 1 8 0" stroke="#5DCAA5" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5"/>
                        </svg>
                      </div>
                    </div>

                    {/* Centre — Thibault */}
                    <div className="hero-orbital__center">
                      <svg className="agent-svg" data-agent="thibault" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-label="Thibault — Fondateur">
                        <defs>
                          <linearGradient id="gb-thibault" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#EF9F27"/>
                            <stop offset="1" stopColor="#0D9488"/>
                          </linearGradient>
                        </defs>
                        <rect width="96" height="96" rx="22" fill="url(#gb-thibault)"/>
                        <rect x="2.5" y="2.5" width="91" height="91" rx="20" fill="#0B1120"/>
                        <circle cx="48" cy="48" r="28" stroke="#EF9F27" strokeWidth="1" strokeDasharray="4 3" opacity=".35"/>
                        <circle cx="37" cy="42" r="5" fill="#EF9F27"/>
                        <circle cx="59" cy="42" r="5" fill="#EF9F27"/>
                        <path d="M36 56 Q48 66 60 56" stroke="#EF9F27" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                        <rect x="30" y="74" width="36" height="14" rx="7" fill="#EF9F27" opacity=".15"/>
                        <text x="48" y="84" fontFamily="Inter,sans-serif" fontSize="7" fontWeight="700" fill="#EF9F27" textAnchor="middle" opacity=".9">FONDATEUR</text>
                      </svg>
                    </div>
                  </div>

                  {/* Float cards */}
                  <div className="float-card float-card--a">
                    <span className="ic amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 7v5l3 3"/></svg></span>
                    <span><small>Disponibilité</small><b>24 h / 24 — 7 j / 7</b></span>
                  </div>
                  <div className="float-card float-card--b">
                    <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
                    <span><small>Équipe complète</small><b>17 agents IA dédiés</b></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PILIERS */}
        <section className="section section--tight" id="piliers">
          <div className="wrap">
            <div className="section-head" data-reveal="">
              <span className="eyebrow">Ce qui nous rend uniques</span>
              <h2>Conseil et exécution, dans le même cabinet.</h2>
              <p>Ni grande agence trop chère, ni freelance mono-discipline. Lumi occupe l&apos;espace précis entre les deux.</p>
            </div>
            <div className="promise-grid">
              <div className="promise" data-reveal="">
                <div className="promise__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/></svg></div>
                <h3>Business-first</h3>
                <p>Chaque action est liée à un objectif commercial mesurable. Pas de contenu décoratif.</p>
              </div>
              <div className="promise" data-reveal="" style={{ ['--d' as string]: '100ms' }}>
                <div className="promise__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"/></svg></div>
                <h3>Conseil + exécution</h3>
                <p>On ne fait pas que recommander — on livre. De la stratégie jusqu&apos;à la mise en ligne.</p>
              </div>
              <div className="promise" data-reveal="" style={{ ['--d' as string]: '200ms' }}>
                <div className="promise__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/></svg></div>
                <h3>Accessible TPE/PME</h3>
                <p>Des offres pensées pour les budgets de petites structures, sans compromis sur la qualité.</p>
              </div>
              <div className="promise" data-reveal="" style={{ ['--d' as string]: '300ms' }}>
                <div className="promise__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg></div>
                <h3>Récurrence</h3>
                <p>Le modèle retainer crée une relation long terme. Un partenaire, pas une prestation jetable.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FONDATEURS */}
        <section className="section section--tight" id="fondateurs">
          <div className="wrap">
            <div className="section-head" data-reveal="">
              <span className="eyebrow">Qui sommes-nous</span>
              <h2>Le fondateur + 17 agents IA.</h2>
              <p>Thibault pose la stratégie. Les agents exécutent. Vous récoltez les résultats.</p>
            </div>
            <div className="founder-solo">
              <div className="founder--human" data-reveal="">
                <span className="founder-badge founder-badge--human">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Fondateur
                </span>
                <div className="founder__head">
                  <svg className="agent-svg" data-agent="thibault" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-label="Thibault — Fondateur" style={{ flexShrink: 0 }}>
                    <defs>
                      <linearGradient id="gb-thibault-f" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#EF9F27"/>
                        <stop offset="1" stopColor="#0D9488"/>
                      </linearGradient>
                    </defs>
                    <rect width="96" height="96" rx="22" fill="url(#gb-thibault-f)"/>
                    <rect x="2.5" y="2.5" width="91" height="91" rx="20" fill="#0B1120"/>
                    <circle cx="48" cy="48" r="28" stroke="#EF9F27" strokeWidth="1" strokeDasharray="4 3" opacity=".3"/>
                    <circle cx="37" cy="42" r="5" fill="#EF9F27"/>
                    <circle cx="59" cy="42" r="5" fill="#EF9F27"/>
                    <path d="M36 56 Q48 66 60 56" stroke="#EF9F27" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <rect x="30" y="74" width="36" height="14" rx="7" fill="#EF9F27" opacity=".15"/>
                    <text x="48" y="84" fontFamily="Inter,sans-serif" fontSize="7" fontWeight="700" fill="#EF9F27" textAnchor="middle" opacity=".9">FONDATEUR</text>
                  </svg>
                  <div style={{ paddingTop: '6px' }}>
                    <h3>Thibault</h3>
                    <div className="role" style={{ color: 'var(--amber)' }}>Stratégie · Business Dev · Marketing</div>
                  </div>
                </div>
                <ul className="founder__list">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Master 2 Marketing &amp; Stratégie — INSEEC Business School</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Business Development B2B — Michelin Group</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>CRM Salesforce &amp; méthode SIPAC, pilotage OKRs</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Stratégie éditoriale, growth &amp; A/B testing</li>
                </ul>
              </div>

              <div className="founder--agents" data-reveal="" style={{ ['--d' as string]: '120ms' }}>
                <span className="founder-badge founder-badge--ai">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M9 4h6"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>
                  Équipe IA — actifs 24h/24
                </span>
                <div className="agents-preview-grid">
                  <div className="agent-preview-item">
                    <svg className="agent-svg" data-agent="web" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Dev Web" style={{ flexShrink: 0 }}>
                      <defs><linearGradient id="gb-web-fnd" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                      <rect width="48" height="48" rx="13" fill="url(#gb-web-fnd)"/>
                      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                      <circle cx="17" cy="20" r="3.5" fill="#0D9488"/><circle cx="31" cy="20" r="3.5" fill="#0D9488"/>
                      <path d="M17 27 Q24 33 31 27" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      <path d="M33 37 l3-3-3-3" stroke="#0D9488" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5"/>
                    </svg>
                    <div className="agent-preview-info"><div className="name">Dev Web</div><div className="power">Sites qui convertissent</div></div>
                  </div>
                  <div className="agent-preview-item">
                    <svg className="agent-svg" data-agent="seo" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent SEO" style={{ flexShrink: 0 }}>
                      <defs><linearGradient id="gb-seo-fnd" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                      <rect width="48" height="48" rx="13" fill="url(#gb-seo-fnd)"/>
                      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                      <circle cx="17" cy="20" r="3.5" fill="#5DCAA5"/><circle cx="31" cy="20" r="3.5" fill="#5DCAA5"/>
                      <path d="M17 27 Q24 33 31 27" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      <circle cx="19" cy="38" r="3.5" stroke="#5DCAA5" strokeWidth="1.5" fill="none" opacity=".5"/>
                      <line x1="21.5" y1="40.5" x2="25" y2="44" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                    </svg>
                    <div className="agent-preview-info"><div className="name">SEO</div><div className="power">Position 1 Google</div></div>
                  </div>
                  <div className="agent-preview-item">
                    <svg className="agent-svg" data-agent="analytics" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Analytics" style={{ flexShrink: 0 }}>
                      <defs><linearGradient id="gb-anl-fnd" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                      <rect width="48" height="48" rx="13" fill="url(#gb-anl-fnd)"/>
                      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                      <circle cx="17" cy="20" r="3.5" fill="#0D9488"/><circle cx="31" cy="20" r="3.5" fill="#0D9488"/>
                      <path d="M17 27 Q24 32 31 27" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      <polyline points="14,44 18,39 22,42 26,37 32,34" stroke="#0D9488" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
                    </svg>
                    <div className="agent-preview-info"><div className="name">Analytics</div><div className="power">Chiffres en temps réel</div></div>
                  </div>
                  <div className="agent-preview-item">
                    <svg className="agent-svg" data-agent="account" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Agent Account Manager" style={{ flexShrink: 0 }}>
                      <defs><linearGradient id="gb-acm-fnd" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                      <rect width="48" height="48" rx="13" fill="url(#gb-acm-fnd)"/>
                      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                      <circle cx="17" cy="20" r="3.5" fill="#5DCAA5"/><circle cx="31" cy="20" r="3.5" fill="#5DCAA5"/>
                      <path d="M17 27 Q24 33 31 27" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      <path d="M20 38 a4 4 0 0 1 8 0" stroke="#5DCAA5" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5"/>
                    </svg>
                    <div className="agent-preview-info"><div className="name">Account Mgr</div><div className="power">Vos clients restent</div></div>
                  </div>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-dim)', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>Thibault pilote la stratégie. Les agents exécutent. Un seul interlocuteur humain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ÉQUIPE */}
        <section className="section" id="equipe">
          <div className="wrap">
            <div className="section-head" data-reveal="">
              <span className="eyebrow">L&apos;équipe Lumi</span>
              <h2>28 agents IA. Actifs 24 h/24, 7 j/7.</h2>
              <p>Chaque client Lumi dispose d&apos;une équipe complète de spécialistes IA dédiés. Pas de sous-traitance. Pas d&apos;intermédiaire.</p>
            </div>

            <div className="section-equipe-stats" data-reveal="">
              <div className="equipe-stat">
                <strong data-counter="28" data-suffix="">28</strong>
                <span>agents actifs</span>
              </div>
              <div className="equipe-stat">
                <strong data-counter="24" data-suffix="h">24h</strong>
                <span>disponibilité continue</span>
              </div>
              <div className="equipe-stat">
                <strong data-counter="3" data-suffix="">3</strong>
                <span>pôles d&apos;expertise</span>
              </div>
            </div>

            {/* Pôle Clients */}
            <div className="agents-pole" data-reveal="">
              <div className="agents-pole__label agents-pole__label--teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.5 8.5 0 0 1 12 3a8.38 8.38 0 0 1 9 8.5z"/></svg>
                Pôle Clients
              </div>
              <div className="agents-grid">
                <article className="agent-card" aria-label="Dev Web — Construit des sites qui convertissent pendant que tu dors.">
                  <svg className="agent-svg" data-agent="web" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-web" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-web)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#0D9488"/><circle cx="52" cy="33" r="5.5" fill="#0D9488"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#0D9488" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M57 65 l4-4-4-4" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".5"/>
                    <path d="M53 65 l4-4-4-4" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".3"/>
                  </svg>
                  <div className="agent-card__name">Dev Web</div>
                  <div className="agent-card__power">Construit des sites qui convertissent pendant que tu dors.</div>
                </article>

                <article className="agent-card" aria-label="Éditorial — Pense à 3 mois d'avance. Toujours.">
                  <svg className="agent-svg" data-agent="editorial" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-ed" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-ed)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#5DCAA5"/><circle cx="52" cy="33" r="5.5" fill="#5DCAA5"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#5DCAA5" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <line x1="24" y1="63" x2="56" y2="63" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
                    <line x1="24" y1="68" x2="44" y2="68" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" opacity=".3"/>
                  </svg>
                  <div className="agent-card__name">Éditorial</div>
                  <div className="agent-card__power">Pense à 3 mois d&apos;avance. Toujours.</div>
                </article>

                <article className="agent-card" aria-label="Instagram — Postée à 8h02. Déjà 47 likes.">
                  <svg className="agent-svg" data-agent="instagram" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-ig" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-ig)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#C13584"/><circle cx="52" cy="33" r="5.5" fill="#C13584"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#C13584" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <rect x="28" y="60" width="24" height="14" rx="4" stroke="#C13584" strokeWidth="2" fill="none" opacity=".5"/>
                    <circle cx="40" cy="67" r="3" stroke="#C13584" strokeWidth="1.5" fill="none" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">Instagram</div>
                  <div className="agent-card__power">Postée à 8h02. Déjà 47 likes.</div>
                </article>

                <article className="agent-card" aria-label="Facebook — Le seul à avoir compris l'algorithme.">
                  <svg className="agent-svg" data-agent="facebook" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-fb" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-fb)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#1877F2"/><circle cx="52" cy="33" r="5.5" fill="#1877F2"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#1877F2" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M40 58 L40 72 M36 62 L44 62" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">Facebook</div>
                  <div className="agent-card__power">Le seul à avoir compris l&apos;algorithme.</div>
                </article>

                <article className="agent-card" aria-label="LinkedIn — Transforme tes dirigeants en thought leaders.">
                  <svg className="agent-svg" data-agent="linkedin" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-li" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-li)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#0A66C2"/><circle cx="52" cy="33" r="5.5" fill="#0A66C2"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#0A66C2" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <circle cx="29" cy="63" r="3.5" fill="#0A66C2" opacity=".5"/>
                    <rect x="34" y="59" width="2.5" height="11" rx="1" fill="#0A66C2" opacity=".5"/>
                    <path d="M38 64 Q38 60 43 60 Q48 60 48 64 L48 70" stroke="#0A66C2" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">LinkedIn</div>
                  <div className="agent-card__power">Transforme tes dirigeants en thought leaders.</div>
                </article>

                <article className="agent-card" aria-label="TikTok — Dans la tendance avant qu'elle soit tendance.">
                  <svg className="agent-svg" data-agent="tiktok" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-tt" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-tt)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#5DCAA5"/><circle cx="52" cy="33" r="5.5" fill="#5DCAA5"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#5DCAA5" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M36 58 L36 72 M36 58 Q36 55 40 55 Q44 55 44 59 Q44 63 40 63 Q36 63 36 67 Q36 72 40 72 Q44 72 44 68" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">TikTok</div>
                  <div className="agent-card__power">Dans la tendance avant qu&apos;elle soit tendance.</div>
                </article>

                <article className="agent-card" aria-label="Google Maps — Maître des étoiles Google. 5/5.">
                  <svg className="agent-svg" data-agent="gmb" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-gmb" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-gmb)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#EF9F27"/><circle cx="52" cy="33" r="5.5" fill="#EF9F27"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#EF9F27" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <circle cx="40" cy="63" r="5" stroke="#EF9F27" strokeWidth="2" fill="none" opacity=".5"/>
                    <path d="M40 68 L40 73" stroke="#EF9F27" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">Google Maps</div>
                  <div className="agent-card__power">Maître des étoiles Google. 5/5.</div>
                </article>

                <article className="agent-card" aria-label="Email Mkt — Ses emails n'atterrissent jamais en spam.">
                  <svg className="agent-svg" data-agent="email" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-em" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-em)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#0aab98"/><circle cx="52" cy="33" r="5.5" fill="#0aab98"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#0aab98" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <rect x="24" y="59" width="32" height="14" rx="3.5" stroke="#0aab98" strokeWidth="2" fill="none" opacity=".5"/>
                    <path d="M24 62 L40 70 L56 62" stroke="#0aab98" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">Email Mkt</div>
                  <div className="agent-card__power">Ses emails n&apos;atterrissent jamais en spam.</div>
                </article>

                <article className="agent-card" aria-label="SEO — Parle Google couramment. Sans accent.">
                  <svg className="agent-svg" data-agent="seo" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-seo" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-seo)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#5DCAA5"/><circle cx="52" cy="33" r="5.5" fill="#5DCAA5"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#5DCAA5" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <circle cx="35" cy="65" r="6" stroke="#5DCAA5" strokeWidth="2" fill="none" opacity=".5"/>
                    <line x1="39.5" y1="69.5" x2="45" y2="75" stroke="#5DCAA5" strokeWidth="2.2" strokeLinecap="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">SEO</div>
                  <div className="agent-card__power">Parle Google couramment. Sans accent.</div>
                </article>

                <article className="agent-card" aria-label="Meta Ads — Chaque euro dépensé, fructifié x3.">
                  <svg className="agent-svg" data-agent="meta-ads" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-ma" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-ma)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#089080"/><circle cx="52" cy="33" r="5.5" fill="#089080"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#089080" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M22 72 L28 62 L34 68 L40 58 L46 64 L52 54 L58 60" stroke="#089080" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">Meta Ads</div>
                  <div className="agent-card__power">Chaque euro dépensé, fructifié x3.</div>
                </article>

                <article className="agent-card" aria-label="Google Ads — Position 1. Sans discussion.">
                  <svg className="agent-svg" data-agent="google-ads" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-ga" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-ga)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#EF9F27"/><circle cx="52" cy="33" r="5.5" fill="#EF9F27"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#EF9F27" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M40 56 L40 74 M32 64 L48 64" stroke="#EF9F27" strokeWidth="2.5" strokeLinecap="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">Google Ads</div>
                  <div className="agent-card__power">Position 1. Sans discussion.</div>
                </article>
              </div>
            </div>

            {/* Pôle Commercial */}
            <div className="agents-pole" data-reveal="" style={{ ['--d' as string]: '80ms' }}>
              <div className="agents-pole__label agents-pole__label--amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Pôle Commercial
              </div>
              <div className="agents-grid">
                <article className="agent-card" aria-label="Prospection — Trouve tes clients avant qu'ils le sachent.">
                  <svg className="agent-svg" data-agent="prospect" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-pr" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-pr)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#5DCAA5"/><circle cx="52" cy="33" r="5.5" fill="#5DCAA5"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#5DCAA5" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <circle cx="34" cy="64" r="5" stroke="#5DCAA5" strokeWidth="2" fill="none" opacity=".5"/>
                    <circle cx="46" cy="64" r="5" stroke="#5DCAA5" strokeWidth="2" fill="none" opacity=".3"/>
                    <path d="M37 62 L43 62" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
                  </svg>
                  <div className="agent-card__name">Prospection</div>
                  <div className="agent-card__power">Trouve tes clients avant qu&apos;ils le sachent.</div>
                </article>

                <article className="agent-card" aria-label="Devis — Brief → proposition en 10 minutes.">
                  <svg className="agent-svg" data-agent="devis" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-dv" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-dv)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#EF9F27"/><circle cx="52" cy="33" r="5.5" fill="#EF9F27"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#EF9F27" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <rect x="27" y="57" width="26" height="18" rx="3.5" stroke="#EF9F27" strokeWidth="2" fill="none" opacity=".5"/>
                    <line x1="31" y1="63" x2="49" y2="63" stroke="#EF9F27" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                    <line x1="31" y1="68" x2="43" y2="68" stroke="#EF9F27" strokeWidth="1.5" strokeLinecap="round" opacity=".3"/>
                  </svg>
                  <div className="agent-card__name">Devis</div>
                  <div className="agent-card__power">Brief → proposition en 10 minutes.</div>
                </article>
              </div>
            </div>

            {/* Pôle Opérations */}
            <div className="agents-pole" data-reveal="" style={{ ['--d' as string]: '160ms' }}>
              <div className="agents-pole__label agents-pole__label--mint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                Pôle Opérations
              </div>
              <div className="agents-grid">
                <article className="agent-card" aria-label="Analytics — Les chiffres n'ont aucun secret pour lui.">
                  <svg className="agent-svg" data-agent="analytics" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-anl" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-anl)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#0D9488"/><circle cx="52" cy="33" r="5.5" fill="#0D9488"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#0D9488" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <polyline points="22,74 28,65 34,70 42,59 50,64 58,53" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">Analytics</div>
                  <div className="agent-card__power">Les chiffres n&apos;ont aucun secret pour lui.</div>
                </article>

                <article className="agent-card" aria-label="Account Mgr — Tes clients restent. C'est son obsession.">
                  <svg className="agent-svg" data-agent="account" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-acm" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-acm)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#5DCAA5"/><circle cx="52" cy="33" r="5.5" fill="#5DCAA5"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#5DCAA5" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <circle cx="40" cy="65" r="5.5" stroke="#5DCAA5" strokeWidth="2" fill="none" opacity=".5"/>
                    <path d="M30 74 Q30 68 40 68 Q50 68 50 74" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".4"/>
                  </svg>
                  <div className="agent-card__name">Account Mgr</div>
                  <div className="agent-card__power">Tes clients restent. C&apos;est son obsession.</div>
                </article>

                <article className="agent-card" aria-label="Onboarding — Premier jour parfait. À chaque mission.">
                  <svg className="agent-svg" data-agent="onboard" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-ob" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-ob)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#EF9F27"/><circle cx="52" cy="33" r="5.5" fill="#EF9F27"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#EF9F27" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M28 72 L34 66 L40 70 L46 62 L52 66 L58 60" stroke="#EF9F27" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
                    <circle cx="58" cy="60" r="3" fill="#EF9F27" opacity=".6"/>
                  </svg>
                  <div className="agent-card__name">Onboarding</div>
                  <div className="agent-card__power">Premier jour parfait. À chaque mission.</div>
                </article>

                <article className="agent-card" aria-label="Finance — Surveille le MRR comme d'autres comptent leurs pas.">
                  <svg className="agent-svg" data-agent="finance" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <defs><linearGradient id="ag-fin" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="80" height="80" rx="18" fill="url(#ag-fin)"/>
                    <rect x="2" y="2" width="76" height="76" rx="17" fill="#0B1120"/>
                    <circle cx="28" cy="33" r="5.5" fill="#0D9488"/><circle cx="52" cy="33" r="5.5" fill="#0D9488"/>
                    <path d="M27 45 Q40 55 53 45" stroke="#0D9488" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M40 56 L40 74 M34 60 L46 60 M35 64 L45 64 M36 68 L44 68" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" opacity=".5"/>
                  </svg>
                  <div className="agent-card__name">Finance</div>
                  <div className="agent-card__power">Surveille le MRR comme d&apos;autres comptent leurs pas.</div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* OFFRES */}
        <section className="section" id="offres">
          <div className="wrap">
            <div className="section-head" data-reveal="">
              <span className="eyebrow">Nos offres</span>
              <h2>Un pack mensuel. Des résultats mesurables.</h2>
              <p>Trois niveaux d&apos;accompagnement — vous commencez là où vous en êtes, vous évoluez au rythme de vos résultats.</p>
            </div>
            <div className="offers-grid">
              <article className="offer" data-reveal="">
                <div className="offer__num">01</div>
                <div className="offer__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.5 8.5 0 0 1 12 3a8.38 8.38 0 0 1 9 8.5z"/></svg></div>
                <h3>Pack Présence</h3>
                <p className="offer__desc">Poser des fondations solides : site, fiche Google et premier réseau social. L&apos;essentiel pour exister en ligne et être trouvé.</p>
                <ul className="offer__list">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Site vitrine 3–5 pages inclus (one-shot 1 500 €)</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Google Business Profile : 4 posts / mois</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>1 réseau social : 8 posts / mois</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Point mensuel 30 min + rapport synthétique</li>
                </ul>
                <div className="offer__foot">
                  <span className="offer__price">Mensuel · engagement 6 mois<b>490 €/mois</b></span>
                  <a className="link-arrow" href="#contact" aria-label="En parler — Pack Présence">En parler<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                </div>
              </article>

              <article className="offer offer--featured" data-reveal="" style={{ ['--d' as string]: '120ms' }}>
                <span className="offer__tag">Le plus demandé</span>
                <div className="offer__num">02</div>
                <div className="offer__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M7 21h10"/></svg></div>
                <h3>Pack Croissance</h3>
                <p className="offer__desc">Accélérer la visibilité et convertir le trafic en clients. Site optimisé, deux réseaux actifs, SEO local.</p>
                <ul className="offer__list">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Site vitrine avancé ou e-commerce (2 500–4 200 €)</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Google Business Profile hebdo + gestion des avis</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>2 réseaux sociaux : 12 posts / mois</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>SEO local + rapport mensuel détaillé</li>
                </ul>
                <div className="offer__foot">
                  <span className="offer__price">Mensuel · engagement 6 mois<b>890 €/mois</b></span>
                  <a className="link-arrow" href="#contact" aria-label="En parler — Pack Croissance">En parler<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                </div>
              </article>

              <article className="offer" data-reveal="" style={{ ['--d' as string]: '240ms' }}>
                <div className="offer__num">03</div>
                <div className="offer__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                <h3>Pack Acquisition</h3>
                <p className="offer__desc">Dominer votre marché local. Pub payante, trois réseaux, reporting avancé et réactivité maximale.</p>
                <ul className="offer__list">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Tout le Pack Croissance inclus</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>3 réseaux sociaux : 16 posts / mois</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>1 campagne pub : Meta Ads ou Google Ads</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Reporting avancé + réactivité sous 24 h</li>
                </ul>
                <div className="offer__foot">
                  <span className="offer__price">Mensuel · engagement 6 mois<b>1 490 €/mois</b></span>
                  <a className="link-arrow" href="#contact" aria-label="En parler — Pack Acquisition">En parler<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* MÉTHODE */}
        <section className="section" id="methode">
          <div className="wrap">
            <div className="section-head" data-reveal="">
              <span className="eyebrow">Notre méthode</span>
              <h2>Du diagnostic au partenariat — sans risque.</h2>
              <p>Chaque étape a un ROI mesurable, indépendamment de la suivante. Vous voyez les résultats avant de vous engager.</p>
            </div>
            <div className="method">
              <div className="mstep" data-reveal="">
                <div className="mstep__agents" aria-hidden="true">
                  <svg className="agent-svg" data-agent="analytics" width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <defs><linearGradient id="ms1a" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="48" height="48" rx="13" fill="url(#ms1a)"/><rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                    <circle cx="17" cy="20" r="3.5" fill="#0D9488"/><circle cx="31" cy="20" r="3.5" fill="#0D9488"/>
                    <path d="M17 27 Q24 32 31 27" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <polyline points="14,43 18,38 22,41 26,36 32,33" stroke="#0D9488" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
                  </svg>
                  <svg className="agent-svg" data-agent="seo" width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <defs><linearGradient id="ms1b" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="48" height="48" rx="13" fill="url(#ms1b)"/><rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                    <circle cx="17" cy="20" r="3.5" fill="#5DCAA5"/><circle cx="31" cy="20" r="3.5" fill="#5DCAA5"/>
                    <path d="M17 27 Q24 33 31 27" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <circle cx="20" cy="37" r="3" stroke="#5DCAA5" strokeWidth="1.5" fill="none" opacity=".5"/>
                    <line x1="22.5" y1="39.5" x2="26" y2="43" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                  </svg>
                </div>
                <div className="mstep__top"><span className="mstep__num">01</span><span className="mstep__when">1 à 2 jours</span></div>
                <h3>Diagnostic Digital 360°</h3>
                <p>On analyse votre présence digitale complète : site, réseaux, SEO, concurrents. Vous repartez avec un rapport actionnable — que vous travailliez avec nous ou non.</p>
              </div>
              <div className="mstep" data-reveal="" style={{ ['--d' as string]: '120ms' }}>
                <div className="mstep__agents" aria-hidden="true">
                  <svg className="agent-svg" data-agent="web" width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <defs><linearGradient id="ms2a" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="48" height="48" rx="13" fill="url(#ms2a)"/><rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                    <circle cx="17" cy="20" r="3.5" fill="#0D9488"/><circle cx="31" cy="20" r="3.5" fill="#0D9488"/>
                    <path d="M17 27 Q24 33 31 27" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M36 38 l3-3-3-3" stroke="#0D9488" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5"/>
                  </svg>
                  <svg className="agent-svg" data-agent="editorial" width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <defs><linearGradient id="ms2b" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="48" height="48" rx="13" fill="url(#ms2b)"/><rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                    <circle cx="17" cy="20" r="3.5" fill="#5DCAA5"/><circle cx="31" cy="20" r="3.5" fill="#5DCAA5"/>
                    <path d="M17 27 Q24 33 31 27" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <line x1="16" y1="37" x2="32" y2="37" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                  </svg>
                </div>
                <div className="mstep__top"><span className="mstep__num">02</span><span className="mstep__when">1 à 4 semaines</span></div>
                <h3>Mission one-shot ciblée</h3>
                <p>Sur la base du diagnostic, on démarre par une mission concrète : refonte du site, pack automatisation ou stratégie Social Media. Les résultats avant l&apos;engagement.</p>
              </div>
              <div className="mstep" data-reveal="" style={{ ['--d' as string]: '240ms' }}>
                <div className="mstep__agents" aria-hidden="true">
                  <svg className="agent-svg" data-agent="account" width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <defs><linearGradient id="ms3a" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="48" height="48" rx="13" fill="url(#ms3a)"/><rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                    <circle cx="17" cy="20" r="3.5" fill="#5DCAA5"/><circle cx="31" cy="20" r="3.5" fill="#5DCAA5"/>
                    <path d="M17 27 Q24 33 31 27" stroke="#5DCAA5" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M20 37 a4 4 0 0 1 8 0" stroke="#5DCAA5" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5"/>
                  </svg>
                  <svg className="agent-svg" data-agent="finance" width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <defs><linearGradient id="ms3b" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0D9488"/><stop offset="1" stopColor="#EF9F27"/></linearGradient></defs>
                    <rect width="48" height="48" rx="13" fill="url(#ms3b)"/><rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                    <circle cx="17" cy="20" r="3.5" fill="#0D9488"/><circle cx="31" cy="20" r="3.5" fill="#0D9488"/>
                    <path d="M17 27 Q24 32 31 27" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M24 34 L24 44 M20 37 L28 37" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                  </svg>
                </div>
                <div className="mstep__top"><span className="mstep__num">03</span><span className="mstep__when">dès le mois 2</span></div>
                <h3>Retainer mensuel</h3>
                <p>Une fois la valeur prouvée, on entre dans un partenariat mensuel : accompagnement continu, optimisations, nouveaux axes. Tarif fixe et prévisible.</p>
              </div>
            </div>
            <div className="method-rule" data-reveal="">
              <span className="badge">La règle d&apos;or Lumi</span>
              <blockquote>« Ne jamais démarrer un retainer sans avoir d&apos;abord prouvé notre valeur sur une mission concrète. »</blockquote>
            </div>
          </div>
        </section>

        {/* COMPÉTENCES */}
        <section className="section section--tight" id="competences">
          <div className="wrap">
            <div className="section-head" data-reveal="">
              <span className="eyebrow">Ce qu&apos;on maîtrise</span>
              <h2>Une stack rodée, jamais surfacturée.</h2>
            </div>
            <div className="skills">
              <div className="skill-group" data-reveal="">
                <div className="skill-group__label">
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg></span>
                  <h3>Web &amp; Design</h3>
                </div>
                <div className="tags"><span className="tag-chip">Webflow</span><span className="tag-chip">WordPress</span><span className="tag-chip">Figma</span><span className="tag-chip">HTML / CSS</span><span className="tag-chip">JavaScript</span><span className="tag-chip">SEO local</span></div>
              </div>
              <div className="skill-group" data-reveal="">
                <div className="skill-group__label">
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.5 8.5 0 0 1 12 3a8.38 8.38 0 0 1 9 8.5z"/></svg></span>
                  <h3>Social Media</h3>
                </div>
                <div className="tags"><span className="tag-chip">Stratégie éditoriale</span><span className="tag-chip">Instagram</span><span className="tag-chip">TikTok</span><span className="tag-chip">LinkedIn B2B</span><span className="tag-chip">Meta Ads</span><span className="tag-chip">Reporting</span></div>
              </div>
              <div className="skill-group" data-reveal="">
                <div className="skill-group__label">
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M9 4h6"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg></span>
                  <h3>Automatisation &amp; IA</h3>
                </div>
                <div className="tags"><span className="tag-chip">Make</span><span className="tag-chip">Zapier</span><span className="tag-chip">Brevo</span><span className="tag-chip">Tally</span><span className="tag-chip">Chatbots IA</span><span className="tag-chip">WhatsApp Business</span></div>
              </div>
              <div className="skill-group" data-reveal="">
                <div className="skill-group__label">
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></span>
                  <h3>Outils &amp; analytics</h3>
                </div>
                <div className="tags"><span className="tag-chip">Salesforce</span><span className="tag-chip">HubSpot</span><span className="tag-chip">Plausible</span><span className="tag-chip">Stripe</span><span className="tag-chip">Henrri</span><span className="tag-chip">Notion</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* RÉSULTATS */}
        <section className="section" id="resultats">
          <div className="wrap">
            <div className="section-head" data-reveal="">
              <span className="eyebrow">Résultats terrain</span>
              <h2>Des chiffres, pas des promesses.</h2>
              <p>Tous les résultats ci-dessous sont issus de missions réelles.</p>
            </div>
            <div className="kpi-row">
              <div className="kpi" data-reveal=""><strong>~5h</strong><span>économisées / semaine dès le mois 1</span></div>
              <div className="kpi" data-reveal="" style={{ ['--d' as string]: '90ms' }}><strong>−35%</strong><span>de no-shows avec les rappels auto</span></div>
              <div className="kpi" data-reveal="" style={{ ['--d' as string]: '180ms' }}><strong>+23</strong><span>demandes de contact le 1ᵉʳ mois</span></div>
              <div className="kpi" data-reveal="" style={{ ['--d' as string]: '270ms' }}><strong>1</strong><span>interlocuteur, du brief à la livraison</span></div>
            </div>
            <div className="results">
              <div className="result" data-reveal="">
                <div className="result__client">
                  <span className="dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
                  <div><div className="name">Fleuriste — Lyon</div><div className="sec">Site vitrine + SEO local</div></div>
                </div>
                <ul className="result__list">
                  <li><span className="ar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span className="txt"><b>23 demandes</b> de contact le 1ᵉʳ mois (vs 0 avant le nouveau site)</span></li>
                  <li><span className="ar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span className="txt"><b>Page 1 Google Maps</b> sur « fleuriste Lyon » dès la 6ᵉ semaine</span></li>
                  <li><span className="ar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span className="txt">Chargement <b>7 s → 1,8 s</b> après optimisation</span></li>
                </ul>
              </div>
              <div className="result" data-reveal="" style={{ ['--d' as string]: '120ms' }}>
                <div className="result__client">
                  <span className="dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
                  <div><div className="name">Cabinet RH — Lyon</div><div className="sec">Stratégie Social Media · 90 jours</div></div>
                </div>
                <ul className="result__list">
                  <li><span className="ar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span className="txt"><b>+4 200 impressions</b> / mois sur LinkedIn dès le 2ᵉ mois</span></li>
                  <li><span className="ar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span className="txt"><b>11 leads qualifiés</b> générés en 90 jours</span></li>
                  <li><span className="ar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span className="txt"><b>3 nouveaux clients</b> signés, directement attribuables aux contenus</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL + FORMULAIRE */}
        <section className="section final-cta" id="contact">
          <div className="glow-bed" aria-hidden="true"/>
          <div className="wrap final-cta__inner">
            <h2 data-reveal="">Commencez sans prendre le moindre risque.</h2>
            <p data-reveal="" style={{ ['--d' as string]: '120ms' }}>Un Diagnostic Digital 360° suffit : on analyse votre présence complète et on identifie vos 3 priorités. Vous repartez avec un rapport actionnable — que vous travailliez avec nous ou non.</p>
            <p className="micro" data-reveal="" style={{ ['--d' as string]: '160ms' }}>1 à 2 jours · votre seul investissement : 1 h de brief initial</p>

            {/* Conveyor belt agents */}
            <div className="conveyor-wrap" aria-hidden="true" data-reveal="" style={{ ['--d' as string]: '180ms' }}>
              <div className="conveyor-track">
                {[
                  { id: 'cv-web', agent: 'web', c1: '#0D9488', c2: '#EF9F27', eye: '#0D9488' },
                  { id: 'cv-seo', agent: 'seo', c1: '#0D9488', c2: '#EF9F27', eye: '#5DCAA5' },
                  { id: 'cv-ig', agent: 'instagram', c1: '#0D9488', c2: '#EF9F27', eye: '#C13584' },
                  { id: 'cv-anl', agent: 'analytics', c1: '#0D9488', c2: '#EF9F27', eye: '#0D9488' },
                  { id: 'cv-li', agent: 'linkedin', c1: '#0D9488', c2: '#EF9F27', eye: '#0A66C2' },
                  { id: 'cv-fin', agent: 'finance', c1: '#0D9488', c2: '#EF9F27', eye: '#0D9488' },
                ].flatMap((a, i) => [false, true].map((isDupe) => (
                  <svg key={`${a.id}-${isDupe ? 'b' : 'a'}`} data-agent={a.agent} width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
                    {!isDupe && <defs><linearGradient id={a.id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={a.c1}/><stop offset="1" stopColor={a.c2}/></linearGradient></defs>}
                    <rect width="48" height="48" rx="13" fill={`url(#${a.id})`}/>
                    <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0B1120"/>
                    <circle cx="17" cy="20" r="3.5" fill={a.eye}/><circle cx="31" cy="20" r="3.5" fill={a.eye}/>
                    <path d="M17 27 Q24 33 31 27" stroke={a.eye} strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                )))}
              </div>
            </div>
            <p data-reveal="" style={{ ['--d' as string]: '200ms', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-dim)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '32px' }}>Toute l&apos;équipe Lumi travaille pour vous, dès le premier jour</p>

            <div className="contact-form" data-reveal="" style={{ ['--d' as string]: '220ms' }}>
              <form name="diagnostic">
                <p style={{ display: 'none' }}><input name="bot-field" /></p>

                <div className="contact-form__grid">
                  <div className="contact-form__field">
                    <label htmlFor="prenom">Prénom *</label>
                    <input type="text" id="prenom" name="prenom" placeholder="Thibault" required />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" placeholder="contact@monentreprise.fr" required />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="telephone">Téléphone</label>
                    <input type="tel" id="telephone" name="telephone" placeholder="06 00 00 00 00" />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="besoin">Votre besoin principal *</label>
                    <select id="besoin" name="besoin" required defaultValue="">
                      <option value="" disabled>Choisir…</option>
                      <option value="site-web">Site web vitrine</option>
                      <option value="social-media">Communication &amp; Social Media</option>
                      <option value="automatisation-ia">Automatisation IA &amp; Outils</option>
                      <option value="strategie-globale">Stratégie digitale globale</option>
                      <option value="autre">Autre / Je ne sais pas encore</option>
                    </select>
                  </div>
                  <div className="contact-form__field contact-form__field--full">
                    <label htmlFor="message">Décrivez votre situation en 2-3 phrases</label>
                    <textarea id="message" name="message" placeholder="Mon activité, ma problématique actuelle, ce que j'attends de ce diagnostic…"/>
                  </div>
                </div>

                <div className="contact-form__submit">
                  <span className="contact-form__note">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Aucun démarchage — réponse sous 24 h
                  </span>
                  <button type="submit" className="btn btn--primary btn--lg">
                    Réserver mon Diagnostic 360°
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </button>
                </div>
              </form>
              <div className="form-success" id="formSuccess">
                ✓ Demande reçue — on revient vers vous sous 24 h.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <div className="footer__brand">
              <a className="brand" href="#top" aria-label="Lumi — accueil">
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
              </a>
              <p>Cabinet de conseil opérationnel — stratégie digitale, développement web et automatisation IA pour les TPE/PME et commerces de ville.</p>
            </div>
            <div className="footer__cols">
              <div className="footer__col">
                <h4>Nos axes</h4>
                <ul>
                  <li><a href="#offres">Communication &amp; Social Media</a></li>
                  <li><a href="#offres">Développement Web &amp; Design</a></li>
                  <li><a href="#offres">Automatisation IA &amp; Outils</a></li>
                </ul>
              </div>
              <div className="footer__col">
                <h4>Cabinet</h4>
                <ul>
                  <li><a href="#fondateurs">Thibault &amp; l&apos;équipe</a></li>
                  <li><a href="#methode">Notre méthode</a></li>
                  <li><a href="#resultats">Résultats terrain</a></li>
                </ul>
              </div>
              <div className="footer__col">
                <h4>Contact</h4>
                <ul>
                  <li><a href="mailto:contact@lumi-site.fr" rel="noopener">contact@lumi-site.fr</a></li>
                  <li><a href="#contact">Diagnostic Digital 360°</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <span>Lumi © 2026 · Thibault Meunier · Vichy, France</span>
            <span style={{ display: 'flex', gap: '22px', flexWrap: 'wrap' }}>
              <a href="/vitrine/mentions-legales" style={{ color: 'inherit' }}>Mentions légales</a>
              <a href="/vitrine/politique-confidentialite" style={{ color: 'inherit' }}>Politique de confidentialité</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
