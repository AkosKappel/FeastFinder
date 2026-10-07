import { describe, expect, it } from 'vitest';
import type { Meal } from '../../app/types/Meal';
import { mealDescription, recipeJsonLd } from '../../app/utils/seo';

const meal = {
  idMeal: '52772',
  strMeal: 'Teriyaki Chicken Casserole',
  strArea: 'Japanese',
  strCategory: 'Chicken',
  strTags: 'Meat,Casserole',
  strMealThumb: 'https://www.themealdb.com/images/media/meals/teriyaki.jpg',
  strInstructions: 'Preheat the oven.\r\nBake for 35 minutes.',
  strIngredient1: 'Soy sauce',
  strMeasure1: '3/4 cup',
  strIngredient2: 'Salt',
  strMeasure2: ' ',
} as unknown as Meal;

describe('mealDescription', () => {
  it('names the cuisine, category and size of the recipe', () => {
    expect(mealDescription(meal)).toBe(
      'Japanese Chicken recipe with 2 ingredients and 2 steps: Teriyaki Chicken Casserole.',
    );
  });

  it('works without area, category or instructions', () => {
    const plain = { ...meal, strArea: null, strCategory: null, strInstructions: null, strIngredient2: null };
    expect(mealDescription(plain)).toBe('Recipe with 1 ingredient: Teriyaki Chicken Casserole.');
  });
});

describe('recipeJsonLd', () => {
  it('lists ingredients with measures and instructions as steps', () => {
    const recipe = recipeJsonLd(meal);
    expect(recipe['@type']).toBe('Recipe');
    expect(recipe.recipeIngredient).toEqual(['3/4 cup Soy sauce', 'Salt']);
    expect(recipe.recipeInstructions).toEqual([
      { '@type': 'HowToStep', text: 'Preheat the oven.' },
      { '@type': 'HowToStep', text: 'Bake for 35 minutes.' },
    ]);
    expect(recipe.recipeCuisine).toBe('Japanese');
  });
});
