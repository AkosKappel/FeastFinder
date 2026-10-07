import { describe, expect, it } from 'vitest';
import {
  cuisinesOf,
  ingredientNamesOf,
  matchIngredients,
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
