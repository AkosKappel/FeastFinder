// Builds public/data/meals.json: a small index of every meal (name, image, category, country and
// ingredient names). The free API cannot list meals by country reliably (many meals have no area)
// or filter by several ingredients, so those features work on this index instead.
// Also writes public/sitemap.xml with the main pages and every meal, category and cuisine.
// Runs before `npm run dev` (only when the file is missing) and before `npm run generate`.
import { access, mkdir, writeFile } from 'node:fs/promises';
import { sitePaths } from './site-routes.mjs';

const API = 'https://www.themealdb.com/api/json/v1/1/';
const OUTPUT = new URL('../public/data/meals.json', import.meta.url);
const SITEMAP = new URL('../public/sitemap.xml', import.meta.url);
const SITE_URL = 'https://akoskappel.github.io/FeastFinder/';

// Country names the API uses that Intl.DisplayNames spells differently.
const COUNTRY_CODE_OVERRIDES = {
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

const countryCodes = () => {
  const names = new Intl.DisplayNames(['en'], { type: 'region' });
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const codes = new Map(Object.entries(COUNTRY_CODE_OVERRIDES));
  for (const first of letters) {
    for (const second of letters) {
      const code = first + second;
      const name = names.of(code);
      if (name && name !== code && !codes.has(name)) codes.set(name, code.toLowerCase());
    }
  }
  return codes;
};

const fetchJson = async path => {
  // Retries network errors, HTTP errors and the occasional malformed body under load.
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(API + path);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === 3) throw new Error(`${path}: ${error.message}`, { cause: error });
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

if (process.argv.includes('--if-missing')) {
  try {
    await access(OUTPUT);
    process.exit(0);
  } catch {
    // Not built yet: continue.
  }
}

const codes = countryCodes();
const meals = new Map();

for (const letter of 'abcdefghijklmnopqrstuvwxyz0123456789') {
  const { meals: found } = await fetchJson(`search.php?f=${letter}`);
  for (const meal of found ?? []) meals.set(meal.idMeal, meal);
  // Be gentle with a free API.
  await new Promise(resolve => setTimeout(resolve, 150));
}

const unknownCountries = new Set();
const index = [...meals.values()]
  .map(meal => {
    const country = meal.strCountry?.trim() || null;
    const countryCode = country ? (codes.get(country) ?? null) : null;
    if (country && !countryCode) unknownCountries.add(country);

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const name = meal[`strIngredient${i}`]?.trim().toLowerCase();
      if (name && !ingredients.includes(name)) ingredients.push(name);
    }

    return {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal.trim(),
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strCountry: country,
      countryCode,
      ingredients,
    };
  })
  .sort((a, b) => a.strMeal.localeCompare(b.strMeal));

await mkdir(new URL('.', OUTPUT), { recursive: true });
await writeFile(OUTPUT, JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), meals: index }));

// Trailing slashes: every page is a folder with an index.html, and GitHub Pages redirects to the slash.
const urls = sitePaths(index).map(
  path => `  <url><loc>${SITE_URL}${path ? `${path.replaceAll('&', '&amp;')}/` : ''}</loc></url>`,
);
await writeFile(
  SITEMAP,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
);

console.log(`Wrote ${index.length} meals to ${OUTPUT.pathname} and ${urls.length} URLs to ${SITEMAP.pathname}`);
if (unknownCountries.size) {
  console.warn(`No country code for: ${[...unknownCountries].join(', ')}. Add them to COUNTRY_CODE_OVERRIDES.`);
}
