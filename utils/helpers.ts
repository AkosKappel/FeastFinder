import type { Meal } from '@/types/Meal';

export const formatMealTags = (meal: Meal) => {
  if (!meal.strTags) return '';
  return meal.strTags
    .split(',')
    .map((tag: string) => tag.trim().toLowerCase())
    .filter((tag: string) => tag)
    .join(', ');
};

export const getIngredientsFromMeal = (meal: Meal | any) => {
  interface MealIngredient {
    name: string;
    measure: string;
  }

  const ingredients: MealIngredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredientName = meal[`strIngredient${i}`];
    const ingredientMeasure = meal[`strMeasure${i}`];

    if (ingredientName && ingredientMeasure) {
      ingredients.push({
        name: ingredientName,
        measure: ingredientMeasure,
      });
    }
  }

  return ingredients;
};
