import { ref } from 'vue';
import axios from 'axios';
import type { Category } from '@/types/Category';

export const useCategories = () => {
  const categories = ref<Category[] | null>(null);
  const loading = ref<boolean>(true);
  const error = ref<string | null>(null);

  const URL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

  const getCategories = async (limit: number = 0) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(URL);
      const results = response.data.categories ?? [];
      categories.value = limit > 0 ? results.sort(() => Math.random() - 0.5).slice(0, limit) : results;
    } catch (err: any) {
      error.value = err.message;
      categories.value = null;
    } finally {
      loading.value = false;
    }
  };

  return { categories, loading, error, getCategories };
};
