import { describe, expect, it } from 'vitest';
import type { Meal } from '../../app/types/Meal';
import {
  formatMealTags,
  getIngredientsFromMeal,
  ingredientImageUrl,
  mealImageSrcset,
  pickRandom,
  withoutEmptyValues,
} from '../../app/utils/helpers';

const meal = (fields: Record<string, string | null>) => fields as unknown as Meal;

describe('getIngredientsFromMeal', () => {
  it('keeps ingredients without a measure and trims whitespace', () => {
    const result = getIngredientsFromMeal(
      meal({
        strIngredient1: ' Chicken ',
        strMeasure1: ' 2 ',
        strIngredient2: 'Salt',
        strMeasure2: ' ',
        strIngredient3: 'Pepper',
        strMeasure3: null,
      }),
    );

    expect(result).toEqual([
      { name: 'Chicken', measure: '2' },
      { name: 'Salt', measure: '' },
      { name: 'Pepper', measure: '' },
    ]);
  });

  it('skips empty ingredient slots', () => {
    const result = getIngredientsFromMeal(
      meal({ strIngredient1: '', strMeasure1: '1 cup', strIngredient2: null, strIngredient20: 'Water' }),
    );

    expect(result).toEqual([{ name: 'Water', measure: '' }]);
  });
});

describe('formatMealTags', () => {
  it('lowercases, trims and drops empty tags', () => {
    expect(formatMealTags({ strTags: 'Meat, Casserole,,' })).toBe('meat, casserole');
  });

  it('returns an empty string without tags', () => {
    expect(formatMealTags({ strTags: null })).toBe('');
  });
});

describe('pickRandom', () => {
  it('returns the requested number of distinct items without changing the input', () => {
    const items = [1, 2, 3, 4, 5, 6];
    const picked = pickRandom(items, 4);

    expect(picked).toHaveLength(4);
    expect(new Set(picked).size).toBe(4);
    expect(picked.every(item => items.includes(item))).toBe(true);
    expect(items).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('returns all items when asked for more than exist', () => {
    expect(pickRandom([1, 2], 5).sort()).toEqual([1, 2]);
  });
});

describe('image helpers', () => {
  it('lists the meal photo sizes for srcset', () => {
    expect(mealImageSrcset('https://x.test/a.jpg')).toBe(
      'https://x.test/a.jpg/medium 350w, https://x.test/a.jpg/large 500w, https://x.test/a.jpg 700w',
    );
  });

  it('points to the sized ingredient image', () => {
    expect(ingredientImageUrl('https://x.test/ingredients/chicken.png', 'medium')).toBe(
      'https://x.test/ingredients/chicken-medium.png',
    );
  });
});

describe('withoutEmptyValues', () => {
  it('drops empty strings and missing values but keeps the rest', () => {
    expect(withoutEmptyValues({ filter: '', letter: 'b', page: undefined, q: null, sort: '0' })).toEqual({
      letter: 'b',
      sort: '0',
    });
  });
});
