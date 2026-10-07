import { describe, expect, it } from 'vitest';
import type { Meal } from '../../app/types/Meal';
import {
  firstLetters,
  countLabel,
  formatMealTags,
  hostnameOf,
  getIngredientsFromMeal,
  ingredientImageUrl,
  mealImageSrcset,
  pickRandom,
  splitInstructions,
  withoutEmptyValues,
  youtubeVideoId,
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

describe('splitInstructions', () => {
  it('splits lines and removes step headings and numbering', () => {
    expect(splitInstructions('STEP 1\r\nPreheat the oven.\r\n\r\nstep 2:\n2. Mix the flour.\n3) Bake.')).toEqual([
      'Preheat the oven.',
      'Mix the flour.',
      'Bake.',
    ]);
  });

  it('keeps numbers that are part of the text', () => {
    expect(splitInstructions('350 grams of flour go in first.')).toEqual(['350 grams of flour go in first.']);
    expect(splitInstructions('2-3 minutes per side.\nSTEP 4 - Serve.')).toEqual(['2-3 minutes per side.', 'Serve.']);
  });

  it('returns no steps without instructions', () => {
    expect(splitInstructions(null)).toEqual([]);
  });
});

describe('youtubeVideoId', () => {
  it('reads watch and short links', () => {
    expect(youtubeVideoId('https://www.youtube.com/watch?v=4aZr5hZXP_s')).toBe('4aZr5hZXP_s');
    expect(youtubeVideoId('https://youtu.be/4aZr5hZXP_s')).toBe('4aZr5hZXP_s');
  });

  it('rejects anything else', () => {
    expect(youtubeVideoId('https://www.youtube.com/watch?v=bad')).toBeNull();
    expect(youtubeVideoId('not a url')).toBeNull();
    expect(youtubeVideoId(null)).toBeNull();
  });
});

describe('hostnameOf', () => {
  it('shows the site name without www', () => {
    expect(hostnameOf('https://www.bbcgoodfood.com/recipes/x')).toBe('bbcgoodfood.com');
  });
});

describe('countLabel', () => {
  it('uses the singular only for one', () => {
    expect(countLabel(1, 'meal')).toBe('1 meal');
    expect(countLabel(0, 'meal')).toBe('0 meals');
    expect(countLabel(3, 'country', 'countries')).toBe('3 countries');
  });
});

describe('firstLetters', () => {
  it('lists each lowercase first letter once', () => {
    expect(firstLetters(['Apple', 'apricot', ' Banana', ''])).toEqual(['a', 'b']);
  });
});
