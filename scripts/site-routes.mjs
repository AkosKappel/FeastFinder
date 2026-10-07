// Page paths of the site, relative to the base URL, for the sitemap and for prerendering.
const PAGES = ['', 'meals', 'ingredients', 'categories', 'cuisines', 'fridge', 'about'];

// Paths of every meal, category and cuisine in the meal index.
export const indexPaths = meals => [
  ...meals.map(meal => `meals/${meal.idMeal}`),
  ...new Set(meals.filter(meal => meal.strCategory).map(meal => `categories/${encodeURIComponent(meal.strCategory)}`)),
  ...new Set(meals.filter(meal => meal.strCountry).map(meal => `cuisines/${encodeURIComponent(meal.strCountry)}`)),
];

export const sitePaths = meals => [...PAGES, ...indexPaths(meals)];
