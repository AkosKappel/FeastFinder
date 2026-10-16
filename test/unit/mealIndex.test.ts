import { describe, expect, it } from 'vitest';
import {
  cuisinesOf,
  ingredientNamesOf,
  matchIngredients,
  mealsFromLocale,
  popularIngredients,
  rankMatches,
  searchMealIndex,
  type MealIndexEntry,
} from '../../app/utils/mealIndex';

const meal = (strMeal: string, strCountry: string | null, ingredients: string[] = []): MealIndexEntry => ({
  idMeal: strMeal,
  strMeal,
  strMealThumb: '',
  strCountry,
  countryCode: strCountry ? strCountry.slice(0, 2).toLowerCase() : null,
  ingredients,
});

const meals = [
  meal('Apple Pie', 'United Kingdom', ['apple', 'flour', 'butter']),
  meal('Arrabiata', 'Italy', ['penne', 'tomato', 'garlic']),
  meal('Bruschetta', 'Italy', ['bread', 'tomato', 'garlic']),
  meal('Mystery Stew', null, ['water']),
];

describe('cuisinesOf', () => {
  it('counts meals per country, sorted by name, skipping meals without a country', () => {
    expect(cuisinesOf(meals)).toEqual([
      { country: 'Italy', countryCode: 'it', mealCount: 2 },
      { country: 'United Kingdom', countryCode: 'un', mealCount: 1 },
    ]);
  });
});

describe('searchMealIndex', () => {
  it('filters by text anywhere in the name and by first letter', () => {
    expect(searchMealIndex(meals, { query: 'PIE' }).map(m => m.strMeal)).toEqual(['Apple Pie']);
    expect(searchMealIndex(meals, { letter: 'a' }).map(m => m.strMeal)).toEqual(['Apple Pie', 'Arrabiata']);
    expect(searchMealIndex(meals, { query: 'ta', letter: 'b' }).map(m => m.strMeal)).toEqual(['Bruschetta']);
  });

  it('returns everything without filters', () => {
    expect(searchMealIndex(meals)).toHaveLength(4);
  });
});

describe('matchIngredients', () => {
  const names = (list: MealIndexEntry[]) => list.map(m => m.strMeal);

  it('splits meals into complete matches and meals missing one ingredient', () => {
    const { complete, missingOne } = matchIngredients(meals, ['Tomato', 'garlic', 'bread']);
    expect(names(complete)).toEqual(['Bruschetta']);
    expect(names(missingOne)).toEqual(['Arrabiata']);
  });

  it('has no near matches for a single ingredient and nothing without a selection', () => {
    expect(matchIngredients(meals, ['tomato']).missingOne).toEqual([]);
    expect(matchIngredients(meals, [])).toEqual({ complete: [], missingOne: [] });
  });
});

describe('ingredientNamesOf', () => {
  it('lists every ingredient once, sorted', () => {
    expect(ingredientNamesOf(meals)).toEqual([
      'apple',
      'bread',
      'butter',
      'flour',
      'garlic',
      'penne',
      'tomato',
      'water',
    ]);
  });
});

describe('popularIngredients', () => {
  it('orders ingredients by how many meals use them, then by name', () => {
    expect(popularIngredients(meals, 3)).toEqual(['garlic', 'tomato', 'apple']);
  });
});

describe('rankMatches', () => {
  const names = ['Bread', 'Apple Bread', 'Breadcrumbs', 'Butter'];
  const same = (name: string) => name;

  it('puts names starting with the query first and caps the count', () => {
    expect(rankMatches(names, ' bread', same, 10)).toEqual(['Bread', 'Breadcrumbs', 'Apple Bread']);
    expect(rankMatches(names, 'bread', same, 2)).toEqual(['Bread', 'Breadcrumbs']);
  });

  it('returns nothing for an empty query', () => {
    expect(rankMatches(names, '  ', same, 10)).toEqual([]);
  });
});

describe('mealsFromLocale', () => {
  const names = (locale: string) => mealsFromLocale(meals, locale).map(m => m.strMeal);

  it('matches the region of the locale, or the likeliest region of a bare language', () => {
    expect(names('it-IT')).toEqual(['Arrabiata', 'Bruschetta']);
    expect(names('it')).toEqual(['Arrabiata', 'Bruschetta']);
  });

  it('returns nothing for a region without meals or an invalid locale', () => {
    expect(names('sk-SK')).toEqual([]);
    expect(names('not a locale')).toEqual([]);
  });
});
