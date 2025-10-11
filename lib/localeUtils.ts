// lib/localeUtils.ts
// Utilitaires pour détecter langue / pays, obtenir drapeau emoji, monnaie et prefix téléphonique.
// Extend la table ci-dessous au besoin.

type LocaleInfo = {
  countryCode: string;      // ex: 'BJ'
  currencyCode: string;     // ex: 'XOF'
  currencySymbol?: string;  // ex: 'Fr' or 'FCFA' (optional)
  phonePrefix?: string;     // ex: '+229'
  currencyLabel?: string;   // label lisible
};

const FALLBACK: LocaleInfo = {
  countryCode: 'US',
  currencyCode: 'USD',
  currencySymbol: '$',
  phonePrefix: '+1',
  currencyLabel: 'USD'
};

// Small mapping — ajoute ou adapte selon besoin
const LOCALE_TABLE: Record<string, LocaleInfo> = {
  // West Africa / XOF (CFA franc BCEAO)
  BJ: { countryCode: 'BJ', currencyCode: 'XOF', currencySymbol: 'FCFA', phonePrefix: '+229', currencyLabel: 'FCFA (XOF)' },
  NE: { countryCode: 'NE', currencyCode: 'XOF', currencySymbol: 'FCFA', phonePrefix: '+227', currencyLabel: 'FCFA (XOF)' },
  TG: { countryCode: 'TG', currencyCode: 'XOF', currencySymbol: 'FCFA', phonePrefix: '+228', currencyLabel: 'FCFA (XOF)' },
  CI: { countryCode: 'CI', currencyCode: 'XOF', currencySymbol: 'FCFA', phonePrefix: '+225', currencyLabel: 'FCFA (XOF)' },
  SN: { countryCode: 'SN', currencyCode: 'XOF', currencySymbol: 'FCFA', phonePrefix: '+221', currencyLabel: 'FCFA (XOF)' },

  // Common countries
  FR: { countryCode: 'FR', currencyCode: 'EUR', currencySymbol: '€', phonePrefix: '+33', currencyLabel: 'Euro (EUR)' },
  BE: { countryCode: 'BE', currencyCode: 'EUR', currencySymbol: '€', phonePrefix: '+32', currencyLabel: 'Euro (EUR)' },
  US: { countryCode: 'US', currencyCode: 'USD', currencySymbol: '$', phonePrefix: '+1', currencyLabel: 'USD' },
  GB: { countryCode: 'GB', currencyCode: 'GBP', currencySymbol: '£', phonePrefix: '+44', currencyLabel: 'GBP' },
  DE: { countryCode: 'DE', currencyCode: 'EUR', currencySymbol: '€', phonePrefix: '+49', currencyLabel: 'Euro (EUR)' },
  CM: { countryCode: 'CM', currencyCode: 'XAF', currencySymbol: 'FCFA', phonePrefix: '+237', currencyLabel: 'FCFA (XAF)' },
  // ... ajoute d'autres pays que tu cibles
};

// Convert ISO country code -> regional indicator symbols for emoji flag
export function countryCodeToFlagEmoji(code?: string) {
  if (!code) return '';
  const upper = code.toUpperCase();
  // A -> 0x1F1E6
  const OFFSET = 0x1F1E6;
  return Array.from(upper).map(c => String.fromCodePoint(OFFSET + c.charCodeAt(0) - 65)).join('');
}

// try to extract region/country from navigator/lang
export function detectUserCountryCode(): string | null {
  // 1) navigator.language (ex: "fr-BJ" or "fr-BE")
  if (typeof navigator !== 'undefined') {
    const nav = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toString();
    if (nav.includes('-')) {
      const parts = nav.split('-');
      const region = parts[1].toUpperCase();
      if (region.length === 2) return region;
    }
  }
  // 2) fallback to undefined (server-side or unknown)
  return null;
}

export function getLocaleInfoForCountry(countryCode?: string) : LocaleInfo {
  if (!countryCode) return FALLBACK;
  const info = LOCALE_TABLE[countryCode.toUpperCase()];
  return info ?? FALLBACK;
}
