// Couleur canonique par nom de client (correspondance exacte)
export const CLIENT_COLORS: Record<string, string> = {
  'BeLoc': '#C9A96E',
  '100P': '#8B1E2F',
  '100P Location': '#8B1E2F',
  'TYT03': '#EF9F27',
  'Lumi': '#0D9488',
};

// Mots-clés en minuscules pour matching email/texte libre (gmail, calendar)
export const CLIENT_COLOR_KEYWORDS: Record<string, string> = {
  '100p': '#8B1E2F',
  'beloc': '#C9A96E',
  'taret': '#8B1E2F',
  'tyt03': '#EF9F27',
};

// Palette de rotation pour la création d'un nouveau client
export const CLIENT_AUTO_PALETTE = ['#0D9488', '#EF9F27', '#5DCAA5', '#8B1E2F', '#C9A96E'];

// Fallback couleur Lumi
export const COLOR_DEFAULT = '#0D9488';
