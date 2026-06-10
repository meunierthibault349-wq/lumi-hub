export interface ClientContextData {
  ref: string;
  name: string;
  color: string;
  context: string;
}

export const CLIENT_CONTEXTS: Record<string, ClientContextData> = {
  '100P': {
    ref: '100P',
    name: '100P Location',
    color: '#8B1E2F',
    context: `CLIENT ACTIF : 100P Location (Jean Charles Taret — structure TYT03)
Activité : Location de voiture sans permis (Aixam, Chatenet, Topolino), 100% en ligne, national
Zone : France entière
Site Lumi : production-ready, 100p-location.fr (push GitHub en attente)
Pack actif : Stratégie digitale en cours
Livrables réalisés : Site vitrine complet (PWA, SEO, mobile-first, WCAG AA), stratégie Instagram juillet 2026 (13 posts), logo système v1.0 validé (100 crème #F4EFE3 + P bordeaux #8B1E2F, Inter 900, 8 variantes)
Mission élargie : outils IA pour rôtisserie/volaillerie artisanale au marché couvert de Vichy (upsell Pack IA, devis à construire)
Contact : Jean Charles Taret — taret.jean-charles@orange.fr
Points en suspens : validation logo par Jean Charles, push site GitHub, Formspree FORM_ID, images PNG à convertir en WebP`,
  },
  'BeLoc': {
    ref: 'BeLoc',
    name: 'BeLoc',
    color: '#C9A96E',
    context: `CLIENT ACTIF : BeLoc — Location véhicules luxe & premium
Type : 100% en ligne, sans agence physique, Auvergne-Rhône-Alpes
Pack actif : Pack Visibilité 890 €/mois + one-shot site marchand 4 500 € HT
Flotte : Audi RS3 2025, Golf 8R 2025, Golf 8 2025, Clio 6 Alpine 2026, Clio 5 2025
Site en cours : https://meunierthibault349-wq.github.io/beloc-site/
Livrables réalisés : site marchand complet (dark theme, tunnel réservation, FAQ, zones livraison, tarifs), audit final 25+ corrections, logo système (Space Grotesk 700, or #C9A96E, barre gradient), stratégie digitale lancement (4 canaux, plan 90j), devis DEV-2026-BeLoc-01 (4 500 € HT), cahier des charges CDC-2026-BeLoc-01, dossier livraison complet, brief client interactif
Statut : dossier livraison prêt, en attente retours recette client
Points en suspens : infos légales et contacts client, favicon, URL définitive, vraies photos RS3/Golf 8R, Stripe, GA4, Meta Pixel`,
  },
  'TYT03': {
    ref: 'TYT03',
    name: 'TYT03 / Rôtisserie',
    color: '#EF9F27',
    context: `CLIENT ACTIF : TYT03 / Barbak & Volailles — Rôtisserie & Volaillerie artisanale
Gérant : Jean Charles Taret (même que 100P Location — structure TYT03)
Activité : Rôtisserie artisanale + volaillerie, marché couvert de Vichy
Zone : Vichy et agglomération (03)
Pack : Outils IA sur devis (min. 1 500 €) — phase de cadrage
Livrables réalisés : programme fidélité client (interface caisse, dashboard analytics, système points)
Gamme produits : poulets rôtis entiers (12-14 €), demi (7-8 €), canards laqués (15-18 €), pintades (13-15 €), quiches/gratins (8-12 €), volailles entières (10-14 €)
Segments : familles Vichy, professionnels locaux, seniors, touristes estivaux
Objectifs : programme fidélité opérationnel, outil caisse simplifié, dashboard stats ventes`,
  },
};
