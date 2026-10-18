// Shared with scripts/build-meal-index.mjs, so keep it free of Nuxt auto-imports.

// Country names the API uses that Intl.DisplayNames spells differently.
const COUNTRY_CODE_OVERRIDES: Record<string, string> = {
  'Antigua and Barbuda': 'ag',
  'Bosnia and Herzegovina': 'ba',
  'DR Congo': 'cd',
  'Hong Kong': 'hk',
  'Ivory Coast': 'ci',
  Myanmar: 'mm',
  Palestine: 'ps',
  'Republic of the Congo': 'cg',
  'Saint Lucia': 'lc',
  'Trinidad and Tobago': 'tt',
  Turkey: 'tr',
};

let codes: Map<string, string> | undefined;

const countryCodes = () => {
  const names = new Intl.DisplayNames(['en'], { type: 'region' });
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const found = new Map(Object.entries(COUNTRY_CODE_OVERRIDES));
  for (const first of letters) {
    for (const second of letters) {
      const code = first + second;
      const name = names.of(code);
      if (name && name !== code && !found.has(name)) found.set(name, code.toLowerCase());
    }
  }
  return found;
};

export const countryCodeOf = (country: string) => (codes ??= countryCodes()).get(country) ?? null;
