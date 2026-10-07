import type { MealPreview } from '@/types/Meal';

export interface MealIndexEntry extends MealPreview {
  strCountry: string | null;
  countryCode: string | null;
  ingredients: string[];
}

export interface Cuisine {
  country: string;
  countryCode: string | null;
  mealCount: number;
}

let index: Promise<MealIndexEntry[]> | null = null;

// Built by scripts/build-meal-index.mjs and shipped with the site; loaded once per visit.
export const loadMealIndex = () => {
  index ??= $fetch<{ meals: MealIndexEntry[] }>(`${useRuntimeConfig().app.baseURL}data/meals.json`)
    .then(data => data.meals)
    .catch(error => {
      index = null;
      throw error;
    });
  return index;
};

export const cuisinesOf = (meals: MealIndexEntry[]): Cuisine[] => {
  const cuisines = new Map<string, Cuisine>();
  for (const { strCountry, countryCode } of meals) {
    if (!strCountry) continue;
    const cuisine = cuisines.get(strCountry) ?? { country: strCountry, countryCode, mealCount: 0 };
    cuisine.mealCount++;
    cuisines.set(strCountry, cuisine);
  }
  return [...cuisines.values()].sort((a, b) => a.country.localeCompare(b.country));
};

export const searchMealIndex = (meals: MealIndexEntry[], { query = '', letter = '' } = {}) => {
  const term = query.trim().toLowerCase();
  return meals.filter(meal => {
    const name = meal.strMeal.toLowerCase();
    return (!letter || name.startsWith(letter)) && (!term || name.includes(term));
  });
};

// Meals using every selected ingredient, and (with two or more selected) meals missing just one.
export const matchIngredients = (meals: MealIndexEntry[], ingredients: string[]) => {
  const wanted = ingredients.map(ingredient => ingredient.toLowerCase());
  const complete: MealIndexEntry[] = [];
  const missingOne: MealIndexEntry[] = [];
  if (!wanted.length) return { complete, missingOne };

  for (const meal of meals) {
    const missing = wanted.filter(ingredient => !meal.ingredients.includes(ingredient)).length;
    if (missing === 0) complete.push(meal);
    else if (missing === 1 && wanted.length > 1) missingOne.push(meal);
  }
  return { complete, missingOne };
};

export const ingredientNamesOf = (meals: MealIndexEntry[]) =>
  [...new Set(meals.flatMap(meal => meal.ingredients))].sort((a, b) => a.localeCompare(b));

export const flagUrl = (countryCode: string) =>
  `https://www.themealdb.com/images/icons/flags/big/64/${countryCode}.png`;

export const popularIngredients = (meals: MealIndexEntry[], count: number) => {
  const uses = new Map<string, number>();
  for (const meal of meals) for (const name of meal.ingredients) uses.set(name, (uses.get(name) ?? 0) + 1);
  return [...uses.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, count)
    .map(([name]) => name);
};
