'use client';

import { useEffect, useRef } from 'react';

export default function VitrineClient() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const root = document.documentElement;
    root.classList.add('js');
    root.setAttribute('data-hero', '1');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Header collant ---- */
    const header = document.getElementById('header');
    function onScroll() {
      if (!header) return;
      if (window.scrollY > 12) header.classList.add('is-stuck');
      else header.classList.remove('is-stuck');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- Reveal au scroll ---- */
    let revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    function revealAll() { revealEls.forEach((el) => el.classList.add('in')); }

    if (reduceMotion) {
      revealAll();
    } else {
      const checkReveal = () => {
        const trigger = window.innerHeight * 0.92;
        revealEls = revealEls.filter((el) => {
          if (el.getBoundingClientRect().top < trigger) {
            el.classList.add('in');
            return false;
          }
          return true;
        });
      };
      window.addEventListener('scroll', checkReveal, { passive: true });
      window.addEventListener('resize', checkReveal);
      checkReveal();
      const revealTimer = setTimeout(revealAll, 1600);
      const heroTimer = setTimeout(() => {
        const s = document.createElement('style');
        s.textContent = '.js .vitrine-page .hero [data-reveal]{transition:none !important;}';
        document.head.appendChild(s);
      }, 1500);

      return () => {
        clearTimeout(revealTimer);
        clearTimeout(heroTimer);
        window.removeEventListener('scroll', checkReveal);
        window.removeEventListener('resize', checkReveal);
        window.removeEventListener('scroll', onScroll);
      };
    }

    /* ---- Parallax léger ---- */
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    if (!reduceMotion && parallaxEls.length) {
      let ticking = false;
      function applyParallax() {
        const vh = window.innerHeight;
        parallaxEls.forEach((el) => {
          if (getComputedStyle(el).display === 'none') { el.style.transform = ''; return; }
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const delta = (center - vh / 2) / vh;
          const strength = parseFloat(el.getAttribute('data-parallax') ?? '0.05') || 0.05;
          el.style.transform = `translate3d(0,${(-delta * vh * strength).toFixed(1)}px,0)`;
        });
        ticking = false;
      }
      window.addEventListener('scroll', () => {
        if (!ticking) { window.requestAnimationFrame(applyParallax); ticking = true; }
      }, { passive: true });
      window.addEventListener('resize', applyParallax);
      applyParallax();
    }

    /* ---- Bandeau top ---- */
    const topbar = document.getElementById('topbar');
    const topbarClose = document.getElementById('topbarClose');
    const topbarRestore = document.getElementById('topbarRestore');
    const headerEl = document.getElementById('header');

    function closeTopbar() {
      topbar?.classList.add('is-hidden');
      headerEl?.classList.add('topbar-closed');
      topbarRestore?.classList.add('visible');
      try { sessionStorage.setItem('topbar-closed', '1'); } catch (_) {}
    }
    function openTopbar() {
      topbar?.classList.remove('is-hidden');
      headerEl?.classList.remove('topbar-closed');
      topbarRestore?.classList.remove('visible');
      try { sessionStorage.removeItem('topbar-closed'); } catch (_) {}
    }
    topbarClose?.addEventListener('click', closeTopbar);
    topbarRestore?.addEventListener('click', openTopbar);
    try { if (sessionStorage.getItem('topbar-closed')) closeTopbar(); } catch (_) {}

    /* ---- Formulaire de contact ---- */
    const contactForm = document.querySelector<HTMLFormElement>('form[name="diagnostic"]');
    const formSuccess = document.getElementById('formSuccess');
    if (contactForm && formSuccess) {
      const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const data = new FormData(contactForm);
        const btn = contactForm.querySelector<HTMLButtonElement>('button[type="submit"]');
        if (btn) btn.disabled = true;
        try {
          await fetch('/api/contact', { method: 'POST', body: data });
        } catch (_) { /* affichage succès même en cas d'erreur réseau */ }
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
      };
      contactForm.addEventListener('submit', handleSubmit);
    }

    /* ---- Compteurs animés section équipe ---- */
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const counterEls = Array.from(document.querySelectorAll<HTMLElement>('[data-counter]'));
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          counterObserver.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          const target = parseInt(el.getAttribute('data-counter') ?? '0', 10);
          const suffix = el.getAttribute('data-suffix') ?? '';
          const duration = 900;
          let start: number | null = null;
          function step(ts: number) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.5 });
      counterEls.forEach((el) => counterObserver.observe(el));
    }

    /* ---- Menu mobile ---- */
    const toggle = document.getElementById('navToggle');
    const drawer = document.getElementById('drawer');
    const drawerClose = document.getElementById('drawerClose');

    function openDrawer() {
      drawer?.classList.add('open');
      drawer?.setAttribute('aria-hidden', 'false');
      toggle?.setAttribute('aria-expanded', 'true');
      drawerClose?.focus();
    }
    function closeDrawer() {
      drawer?.classList.remove('open');
      drawer?.setAttribute('aria-hidden', 'true');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.focus();
    }
    toggle?.addEventListener('click', openDrawer);
    drawerClose?.addEventListener('click', closeDrawer);
    drawer?.querySelectorAll<HTMLElement>('[data-close]').forEach((a) => {
      a.addEventListener('click', closeDrawer);
    });
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && drawer?.classList.contains('open')) closeDrawer();
    }
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return null;
}
