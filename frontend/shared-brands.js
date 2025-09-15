// Shared brands configuration for both frontend and backend
// This ensures both systems use the exact same brand list

const ALL_BRANDS = [
  'ALPINO', 'AS-IT-IS', 'AVVATAR', 'AESTHETIC NUTRITION', 'BOLT', 'BPI', 'BEAST LIFE', 'DYMATIZE',
  'FAST AND UP', 'GASPARI', 'GAT', 'GNC', 'GHOST', 'HEALTH FARM', 'INTERNATIONAL PROTEIN', 'ISOPURE',
  'KAGED', 'KEVIN LEVRONE', 'LABRADA', 'MONSTER LAB', 'MUSCLE BLAZE', 'MUSCLETECH', 'MUTANT', 'MYFITNESS',
  'MYFITNESS PEANUT BUTTER', 'NEUHERBS', 'NAKPRO', 'ONE SCIENCE', 'ON (OPTIMUM NUTRITION)', 'POLE NUTRITION',
  'PROSUPPS', 'PINTOLA', 'RONNIE COLEMAN', 'RAW NUTRITION', 'RYSE', 'THE WHOLE TRUTH NUTRITION', 'WELLBEING',
  'XTEND', 'YOGABAR', 'RANBDS', 'APPLIED NUTRITION', 'BSN', 'DENIS JAMES', 'DEXTER JACKSON', 'EXALT',
  'INSANE LABZ', 'MHP', 'MI (MUSCLE IMPACT NUTRITION)', 'NOW', 'NUTREX', 'NUTRAMARC', 'REDCON',
  'RULE ONE', 'UNIVERSAL', 'ATOM', 'TRUE BASICS', 'CLOMA PHARMA', 'CENTRUM', 'CONDEMNED', 'MUSCLEMEDS', 
  'ULTIMATE NUTRITION', 'FA ICE HYDRO', 'ANDROPIQUE', 'CUREGARDEN', 'TATA 1MG', 'ACE BLEND', 'NATUREYZ', 
  'HEALTHYHEY NUTRITION', 'MIDUTY', 'WHATS UP WELLNESS', 'MYODROL', 'CARBAMIDE FORTE', 'BEAUTYWISE', 
  'FUEL ONE', 'NAKPRO PROTEIN'
];

// Brand slug mappings for URL routing
const BRAND_SLUG_MAPPINGS = {
  'AS-IT-IS': 'as-it-is',
  'ON (OPTIMUM NUTRITION)': 'on-optimum-nutrition',
  'MI (MUSCLE IMPACT NUTRITION)': 'mi-muscle-impact-nutrition'
};

// Reverse mapping for converting slugs back to brand names
const SLUG_TO_BRAND_MAPPINGS = {
  'as-it-is': 'AS-IT-IS',
  'on-optimum-nutrition': 'ON (OPTIMUM NUTRITION)',
  'mi-muscle-impact-nutrition': 'MI (MUSCLE IMPACT NUTRITION)',
  // Auto-generate mappings for all brands with parentheses
  'optimum-nutrition': 'ON (OPTIMUM NUTRITION)',
  'muscle-impact-nutrition': 'MI (MUSCLE IMPACT NUTRITION)'
};

// Function to convert brand name to URL slug
function getBrandSlug(brandName) {
  // Check for special mappings first
  if (BRAND_SLUG_MAPPINGS[brandName]) {
    return BRAND_SLUG_MAPPINGS[brandName];
  }
  
  // For other brands, remove parentheses and convert to slug
  return brandName.toLowerCase()
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing dashes
}

// Function to convert URL slug back to brand name
function getBrandFromSlug(slug) {
  // Check for special mappings first
  if (SLUG_TO_BRAND_MAPPINGS[slug]) {
    return SLUG_TO_BRAND_MAPPINGS[slug];
  }
  
  // Try to find exact match by generating slug for each brand
  for (const brand of ALL_BRANDS) {
    if (getBrandSlug(brand) === slug) {
      return brand;
    }
  }
  
  // Fallback: convert slug back to uppercase
  return slug.replace(/-/g, ' ').toUpperCase();
}

// ES Module exports
export {
  ALL_BRANDS,
  BRAND_SLUG_MAPPINGS,
  SLUG_TO_BRAND_MAPPINGS,
  getBrandSlug,
  getBrandFromSlug
};

// CommonJS export for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ALL_BRANDS,
    BRAND_SLUG_MAPPINGS,
    SLUG_TO_BRAND_MAPPINGS,
    getBrandSlug,
    getBrandFromSlug
  };
}