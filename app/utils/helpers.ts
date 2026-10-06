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

export const ingredientThumbUrl = (name: string, size: 'small' | 'medium') =>
  `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}-${size}.png`;

// Instructions are free text: steps are separate lines, sometimes with "STEP 1" lines or "1." prefixes.
export const splitInstructions = (instructions: string | null) =>
  (instructions ?? '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !/^step\s*\d+[.:)]?$/i.test(line))
    .map(line => line.replace(/^(step\s*)?\d+(\s*[.:)]|\s+-)\s*/i, ''))
    .filter(Boolean);

export const youtubeVideoId = (url: string | null) => {
  if (!url) return null;
  try {
    const { hostname, pathname, searchParams } = new URL(url);
    const id = hostname === 'youtu.be' ? pathname.slice(1) : searchParams.get('v');
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
};

export const hostnameOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};
