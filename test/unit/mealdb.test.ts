import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearMealDbCache, fetchMealDb, mealDb } from '../../app/utils/mealdb';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('$fetch', fetchMock);
  clearMealDbCache();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe('fetchMealDb', () => {
  it('serves repeated and concurrent requests from one API call', async () => {
    fetchMock.mockResolvedValue({ categories: [] });

    await Promise.all([fetchMealDb('categories.php'), fetchMealDb('categories.php')]);
    await fetchMealDb('categories.php');

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not cache failures', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ categories: [] });

    await expect(fetchMealDb('categories.php')).rejects.toThrow('offline');
    await expect(fetchMealDb('categories.php')).resolves.toEqual({ categories: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('fetches again after the cache expires', async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValue({ categories: [] });

    await fetchMealDb('categories.php');
    vi.advanceTimersByTime(31 * 60 * 1000);
    await fetchMealDb('categories.php');

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('skips the cache when asked', async () => {
    fetchMock.mockResolvedValue({ meals: [] });

    await fetchMealDb('random.php', { cached: false });
    await fetchMealDb('random.php', { cached: false });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('mealDb', () => {
  it('encodes the search query and returns an empty list when nothing matches', async () => {
    fetchMock.mockResolvedValue({ meals: null });

    await expect(mealDb.searchMeals('mac & cheese')).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith('search.php?s=mac%20%26%20cheese', expect.anything());
  });

  it('returns null for an unknown meal', async () => {
    fetchMock.mockResolvedValue({ meals: null });

    await expect(mealDb.getMeal('0')).resolves.toBeNull();
  });

  it('removes duplicate random meals', async () => {
    fetchMock
      .mockResolvedValueOnce({ meals: [{ idMeal: '1' }] })
      .mockResolvedValueOnce({ meals: [{ idMeal: '1' }] })
      .mockResolvedValueOnce({ meals: [{ idMeal: '2' }] });

    const meals = await mealDb.getRandomMeals(3);

    expect(meals.map(meal => meal.idMeal)).toEqual(['1', '2']);
  });
});
