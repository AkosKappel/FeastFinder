import type { Category } from '@/types/Category';
import type { Ingredient } from '@/types/Ingredient';
import type { Meal, MealPreview } from '@/types/Meal';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

// TheMealDB sends no cache headers and its data rarely changes, so responses are kept in memory
// for the whole visit. Storing the promise also merges concurrent requests for the same URL.
const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; response: Promise<unknown> }>();

export const clearMealDbCache = () => cache.clear();

export const fetchMealDb = <T>(path: string, { cached = true } = {}): Promise<T> => {
  const now = Date.now();
  const hit = cache.get(path);
  if (cached && hit && hit.expiresAt > now) {
    return hit.response as Promise<T>;
  }

  const response = $fetch<T>(path, { baseURL: API_BASE_URL });
  if (cached) {
    cache.set(path, { expiresAt: now + CACHE_TTL_MS, response });
    // Never keep a failure: the next call (e.g. "Try again") must hit the API.
    response.catch(() => cache.delete(path));
  }
  return response;
};

interface MealsResponse<T> {
  meals: T[] | null;
}

const filterMeals = async (filter: 'c' | 'i', value: string) => {
  const { meals } = await fetchMealDb<MealsResponse<MealPreview>>(`filter.php?${filter}=${encodeURIComponent(value)}`);
  return meals ?? [];
};

export const mealDb = {
  async getMeal(id: string) {
    const { meals } = await fetchMealDb<MealsResponse<Meal>>(`lookup.php?i=${encodeURIComponent(id)}`);
    return meals?.[0] ?? null;
  },

  async getRandomMeals(count: number) {
    const responses = await Promise.all(
      Array.from({ length: count }, () => fetchMealDb<MealsResponse<Meal>>('random.php', { cached: false })),
    );
    const meals = responses.flatMap(response => response.meals ?? []);
    return meals.filter((meal, index) => meals.findIndex(other => other.idMeal === meal.idMeal) === index);
  },

  async getCategories() {
    const { categories } = await fetchMealDb<{ categories: Category[] | null }>('categories.php');
    return categories ?? [];
  },

  async getIngredients() {
    const { meals } = await fetchMealDb<MealsResponse<Ingredient>>('list.php?i=list');
    return meals ?? [];
  },

  mealsByCategory: (category: string) => filterMeals('c', category),
  mealsByIngredient: (ingredient: string) => filterMeals('i', ingredient),
};
