import { describe, expect, it } from 'vitest';
import { cuisinesOf, mealsWithAllIngredients, searchMealIndex, type MealIndexEntry } from '../../app/utils/mealIndex';

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

describe('mealsWithAllIngredients', () => {
  it('keeps meals that contain every selected ingredient', () => {
    expect(mealsWithAllIngredients(meals, ['Tomato', 'garlic']).map(m => m.strMeal)).toEqual([
      'Arrabiata',
      'Bruschetta',
    ]);
    expect(mealsWithAllIngredients(meals, ['tomato', 'bread']).map(m => m.strMeal)).toEqual(['Bruschetta']);
  });
});
