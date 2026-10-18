import type { Component } from 'vue';
import { Globe, LayoutGrid, Search } from '@lucide/vue';
import { cuisinesOf, flagUrl, rankMatches, type MealIndexEntry } from './mealIndex';

export interface PaletteOption {
  label: string;
  to: string;
  kind?: string;
  image?: string;
  icon?: Component;
}

const MAX_PLACES = 3;
const MAX_MEALS = 5;

// Without a query the palette lists the pages; while typing it shows the matching pages,
// categories, cuisines and meals, and ends with a full search for the text.
export const commandPaletteOptions = (
  pages: PaletteOption[],
  meals: MealIndexEntry[],
  query: string,
): PaletteOption[] => {
  const term = query.trim();
  if (!term) return pages;

  const categories = [...new Set(meals.map(meal => meal.strCategory).filter(Boolean) as string[])];
  return [
    ...rankMatches(pages, term, page => page.label, pages.length),
    ...rankMatches(categories, term, name => name, MAX_PLACES).map(name => ({
      kind: 'Category',
      label: name,
      to: `/categories/${encodeURIComponent(name)}`,
      icon: LayoutGrid,
    })),
    ...rankMatches(cuisinesOf(meals), term, cuisine => cuisine.country, MAX_PLACES).map(cuisine => ({
      kind: 'Cuisine',
      label: cuisine.country,
      to: `/cuisines/${encodeURIComponent(cuisine.country)}`,
      image: cuisine.countryCode ? flagUrl(cuisine.countryCode) : undefined,
      icon: Globe,
    })),
    ...rankMatches(meals, term, meal => meal.strMeal, MAX_MEALS).map(meal => ({
      kind: 'Meal',
      label: meal.strMeal,
      to: `/meals/${meal.idMeal}`,
      image: `${meal.strMealThumb}/small`,
    })),
    { label: `Search meals for “${term}”`, to: `/meals?q=${encodeURIComponent(term)}`, icon: Search },
  ];
};

// Arrow keys move through the options and wrap around at both ends.
export const stepIndex = (current: number, step: number, count: number) =>
  count ? (current + step + count) % count : -1;
