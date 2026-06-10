import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST() {
  // Guard: ne seed que si la table clients est vide
  const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true });
  if (count && count > 0) {
    return NextResponse.json({ message: 'Données déjà présentes, seed ignoré.' }, { status: 200 });
  }

  // ── CLIENTS ──
  await supabase.from('clients').insert([
    {
      id: 'CLT-001',
      name: '100P Location',
      full_name: 'TYT03 — Jean Charles Taret',
      sector: 'Location voiture sans permis — national, 100% en ligne',
      color: '#8B1E2F',
      pack: 'Pack Starter',
      mrr: 490,
      status: 'actif',
      contact: 'Jean Charles Taret',
      email: 'taret.jean-charles@orange.fr',
      last_contact: '8 juin 2026',
      pending: [
        { text: 'Valider formellement le logo système v1.0', owner: 'client' },
        { text: 'Push du site 100p-location sur repo GitHub privé', owner: 'lumi' },
        { text: 'Remplacer FORM_ID_PLACEHOLDER (créer compte Formspree)', owner: 'lumi' },
        { text: 'Créer og-100p.jpg (1200×630px)', owner: 'lumi' },
        { text: 'Convertir PNG en WebP (4 images)', owner: 'lumi' },
        { text: 'Construire proposition outils IA rôtisserie/volaillerie', owner: 'lumi' },
      ],
      notes: [
        "Jean Charles gère 3 activités : 100P Location (en ligne) + Rôtisserie + Volaillerie (marché de Vichy).",
        "Les outils IA pour les activités alimentaires sont un angle d'upsell fort — Pack IA sur devis, min. 1 500 €.",
        "Site production-ready (PWA, SEO, accessibilité WCAG AA, responsive iOS).",
      ],
      vehicles: null,
    },
    {
      id: 'CLT-002',
      name: 'BeLoc',
      full_name: 'BeLoc — Location Véhicules Premium',
      sector: 'Location véhicules luxe & premium — Auvergne-Rhône-Alpes',
      color: '#C9A96E',
      pack: 'Pack Visibilité',
      mrr: 890,
      status: 'attente_client',
      contact: 'À compléter',
      email: 'À compléter',
      last_contact: '8 juin 2026',
      pending: [
        { text: 'Récupérer vraies photos RS3 et Golf 8R', owner: 'client' },
        { text: 'Récupérer infos légales (SIRET, mentions, CGV)', owner: 'client' },
        { text: 'Récupérer URL définitive du site', owner: 'client' },
        { text: 'Récupérer numéro WhatsApp réel', owner: 'client' },
        { text: 'Récupérer compte Formspree', owner: 'client' },
        { text: 'Récupérer GA4 Measurement ID', owner: 'client' },
        { text: 'Récupérer Meta Pixel ID', owner: 'client' },
        { text: 'Valider choix logo parmi les 6 concepts', owner: 'client' },
        { text: 'Envoyer la facture de juin (Pack Visibilité 890 €)', owner: 'lumi' },
        { text: 'Remplacer [NOM GÉRANT] dans le devis et le CDC', owner: 'lumi' },
      ],
      notes: [
        "Agence récente en plein développement. Cible particuliers et pros en AuRA cherchant un véhicule premium.",
        "Upsell naturel : Pack Performance (1 490 €/mois) avec campagnes Meta Ads et Google Ads.",
        "Devis DEV-2026-BeLoc-01 (4 500 € HT) + Pack Visibilité 890 €/mois signé.",
      ],
      vehicles: [
        { model: 'Audi RS3', year: 2025 },
        { model: 'Golf 8R', year: 2025 },
        { model: 'Golf 8', year: 2025 },
        { model: 'Clio 6 Alpine', year: 2026 },
        { model: 'Clio 5', year: 2025 },
      ],
    },
  ]);

  // ── PROJECTS ──
  await supabase.from('projects').insert([
    {
      id: 'PRJ-2026-001',
      title: 'Site Internet 100P Location',
      client_id: 'CLT-001',
      client: '100P Location',
      client_color: '#8B1E2F',
      status: 'livré',
      progress: 100,
      priority: 'normale',
      ref: 'DEV-2026-100P-01',
      devis: '1 400 € one-shot',
      deadline: '08 juin 2026',
      summary: 'Site production-ready livré en 3 passes expertes (SEO, accessibilité, mobile). Reste Formspree ID et og-image à fournir par le client.',
      livrables: [
        { icon: '🌐', type: 'site', name: 'Site HTML complet' },
        { icon: '🎨', type: 'design', name: 'Logo système v1.0' },
      ],
      agents: ['web-developer-lumi', 'mobile-web-developer'],
    },
    {
      id: 'PRJ-2026-002',
      title: 'Stratégie Digitale 100P',
      client_id: 'CLT-001',
      client: '100P Location',
      client_color: '#8B1E2F',
      status: 'en_cours',
      progress: 40,
      priority: 'normale',
      ref: 'Abonnement signé',
      devis: '490 €/mois',
      deadline: '08 juillet 2026',
      summary: 'Calendrier éditorial Instagram juillet 2026 généré (13 posts). SEO local et GMB à démarrer.',
      livrables: [],
      agents: ['instagram-content-strategist', 'lumi-seo', 'lumi-google-my-business'],
    },
    {
      id: 'PRJ-2026-003',
      title: 'Outil IA Rôtisserie & Volaillerie',
      client_id: 'CLT-001',
      client: 'TYT03 — Jean Charles Taret',
      client_color: '#8B1E2F',
      status: 'demarrage',
      progress: 10,
      priority: 'basse',
      ref: 'Devis à construire',
      devis: '~1 500 € estimé',
      deadline: '31 juillet 2026',
      summary: "Piste identifiée : outil IA gestion stocks, commandes et recettes pour le marché couvert de Vichy. Devis à construire.",
      livrables: [],
      agents: ['lumi-devis'],
    },
    {
      id: 'PRJ-2026-004',
      title: 'Site Internet Marchand + Stratégie Digitale',
      client_id: 'CLT-002',
      client: 'BeLoc',
      client_color: '#C9A96E',
      status: 'en_attente_client',
      progress: 90,
      priority: 'haute',
      ref: 'DEV-2026-BeLoc-01',
      devis: '4 500 € + 890 €/mois',
      deadline: '15 juin 2026 ⚠',
      summary: "Dossier de livraison complet envoyé (devis 4 500 € + CDC 10 sections). En attente retours recette. 12 infos requises de BeLoc avant mise en ligne.",
      livrables: [
        { icon: '📁', type: 'dossier', name: 'Dossier de livraison' },
        { icon: '🌐', type: 'site', name: 'Site BeLoc (local)' },
        { icon: '🎨', type: 'design', name: 'Logo système v1.0' },
        { icon: '📋', type: 'devis', name: 'Devis DEV-2026-BeLoc-01' },
      ],
      agents: ['web-developer-lumi', 'mobile-web-developer', 'lumi-devis'],
    },
  ]);

  // ── INVOICES ──
  await supabase.from('invoices').insert([
    { id: 'F001', client: '100P Location', client_color: '#8B1E2F', description: 'Site Internet 100P Location', amount: 1400, date: 'juin 2026', status: 'encaisse' },
    { id: 'F002', client: 'BeLoc', client_color: '#C9A96E', description: 'Site Internet Marchand BeLoc — Pack Dev', amount: 4500, date: 'juin 2026', status: 'en_attente' },
    { id: 'F003', client: 'BeLoc', client_color: '#C9A96E', description: 'Pack Visibilité — juin 2026', amount: 890, date: 'juin 2026', status: 'a_faire' },
    { id: 'F004', client: '100P Location', client_color: '#8B1E2F', description: 'Pack Starter — juin 2026', amount: 490, date: 'juin 2026', status: 'encaisse' },
    { id: 'F005', client: 'TYT03 — Jean Charles Taret', client_color: '#8B1E2F', description: 'Outil IA Rôtisserie — devis à construire', amount: 1500, date: 'juil. 2026', status: 'a_faire' },
  ]);

  // ── MILESTONES ──
  await supabase.from('milestones').insert([
    { title: 'BeLoc — Livraison site marchand', date: '2026-06-15', color: '#f87171', client_color: '#C9A96E' },
    { title: '100P — Calendrier éditorial juillet', date: '2026-06-15', color: '#EF9F27', client_color: '#8B1E2F' },
    { title: 'Point mensuel clients', date: '2026-06-25', color: '#5DCAA5', client_color: '#5DCAA5' },
    { title: 'Outil IA Rôtisserie — livraison estimée', date: '2026-07-31', color: '#5DCAA5', client_color: '#8B1E2F' },
  ]);

  return NextResponse.json({ message: 'Seed réussi — 2 clients, 4 projets, 5 factures, 4 jalons insérés.' });
}
