import { describe, expect, it } from 'vitest';
import { commandPaletteOptions, stepIndex } from '../../app/utils/commandPalette';
import type { MealIndexEntry } from '../../app/utils/mealIndex';

const meal = (idMeal: string, strMeal: string, strCategory: string, strCountry: string, countryCode: string) =>
  ({
    idMeal,
    strMeal,
    strMealThumb: `https://img/${idMeal}.jpg`,
    strCategory,
    strCountry,
    countryCode,
    ingredients: [],
  }) as MealIndexEntry;

const meals = [
  meal('1', 'Garlic Pasta', 'Pasta', 'Italy', 'it'),
  meal('2', 'Pastel de Nata', 'Dessert', 'Portugal', 'pt'),
  meal('3', 'Green Curry', 'Chicken', 'Thailand', 'th'),
];
const pages = [
  { label: 'Meals', to: '/meals' },
  { label: 'Favourites', to: '/favourites' },
];

describe('commandPaletteOptions', () => {
  it('lists the pages without a query', () => {
    expect(commandPaletteOptions(pages, meals, '  ')).toEqual(pages);
  });

  it('shows matching pages, categories, cuisines and meals, then a full search', () => {
    const options = commandPaletteOptions(pages, meals, 'past');
    expect(options.map(option => [option.kind, option.label, option.to])).toEqual([
      ['Category', 'Pasta', '/categories/Pasta'],
      ['Meal', 'Pastel de Nata', '/meals/2'],
      ['Meal', 'Garlic Pasta', '/meals/1'],
      [undefined, 'Search meals for “past”', '/meals?q=past'],
    ]);
    expect(options[1]!.image).toBe('https://img/2.jpg/small');
  });

  it('finds pages and cuisines, and encodes the search', () => {
    const options = commandPaletteOptions(pages, meals, 'tha');
    expect(options[0]).toMatchObject({ kind: 'Cuisine', label: 'Thailand', to: '/cuisines/Thailand' });
    expect(options[0]!.image).toContain('/th.png');
    expect(commandPaletteOptions(pages, meals, 'fav')[0]).toMatchObject({ label: 'Favourites' });
    expect(commandPaletteOptions(pages, [], 'mac & cheese').at(-1)!.to).toBe('/meals?q=mac%20%26%20cheese');
  });
});

describe('stepIndex', () => {
  it('wraps around at both ends', () => {
    expect(stepIndex(2, 1, 3)).toBe(0);
    expect(stepIndex(0, -1, 3)).toBe(2);
    expect(stepIndex(-1, 1, 3)).toBe(0);
    expect(stepIndex(0, 1, 0)).toBe(-1);
  });
});
