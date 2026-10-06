import type { Meal } from '@/types/Meal';

export interface MealIngredient {
  name: string;
  measure: string;
}

export const formatMealTags = (meal: Pick<Meal, 'strTags'>) => {
  if (!meal.strTags) return '';
  return meal.strTags
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag)
    .join(', ');
};

// The API stores ingredients in the numbered fields strIngredient1..20 and strMeasure1..20.
export const getIngredientsFromMeal = (meal: Meal) => {
  const ingredients: MealIngredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}` as keyof Meal]?.trim();
    const measure = meal[`strMeasure${i}` as keyof Meal]?.trim() ?? '';

    if (name) {
      ingredients.push({ name, measure });
    }
  }

  return ingredients;
};

// Fisher-Yates shuffle on a copy, then the first `count` items.
export const pickRandom = <T>(items: readonly T[], count: number) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, count);
};

// TheMealDB serves meal photos at 350, 500 and 700 px (the original), and ingredient images
// with -small and -medium suffixes, which saves most of the bandwidth on card grids.
export const mealImageSrcset = (thumbUrl: string) => `${thumbUrl}/medium 350w, ${thumbUrl}/large 500w, ${thumbUrl} 700w`;

export const ingredientImageUrl = (thumbUrl: string, size: 'small' | 'medium') =>
  thumbUrl.replace(/\.png$/, `-${size}.png`);

// Keeps URLs clean: `?filter=&page=` becomes nothing.
export const withoutEmptyValues = <T extends Record<string, unknown>>(query: T) =>
  Object.fromEntries(Object.entries(query).filter(([, value]) => value !== '' && value != null)) as Partial<T>;
