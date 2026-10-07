import type { Meal } from '@/types/Meal';
import { countLabel, getIngredientsFromMeal, splitInstructions } from './helpers';

// Search result snippet, e.g. "Japanese Chicken recipe with 9 ingredients and 6 steps: Teriyaki Chicken Casserole."
export const mealDescription = (meal: Meal) => {
  const kind = [meal.strArea, meal.strCategory].filter(Boolean).join(' ');
  const ingredients = getIngredientsFromMeal(meal).length;
  const steps = splitInstructions(meal.strInstructions).length;
  const parts = [countLabel(ingredients, 'ingredient'), steps && countLabel(steps, 'step')]
    .filter(Boolean)
    .join(' and ');
  return `${kind ? `${kind} recipe` : 'Recipe'} with ${parts}: ${meal.strMeal}.`;
};

// schema.org Recipe for Google's recipe results (https://developers.google.com/search/docs/appearance/structured-data/recipe).
// The video is left out: Google requires an upload date the API does not have.
export const recipeJsonLd = (meal: Meal) => ({
  '@context': 'https://schema.org',
  '@type': 'Recipe',
  name: meal.strMeal,
  image: [meal.strMealThumb],
  description: mealDescription(meal),
  recipeCategory: meal.strCategory ?? undefined,
  recipeCuisine: meal.strArea ?? undefined,
  keywords: meal.strTags ?? undefined,
  recipeIngredient: getIngredientsFromMeal(meal).map(({ name, measure }) => (measure ? `${measure} ${name}` : name)),
  recipeInstructions: splitInstructions(meal.strInstructions).map(text => ({ '@type': 'HowToStep', text })),
});
