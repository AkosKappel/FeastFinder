import { ref } from 'vue';
import axios from 'axios';
import type { Category } from '~/types/Category';

export const useCategories = () => {
  const categories = ref<Category[] | null>(null);
  const loading = ref<boolean>(true);
  const error = ref<string | null>(null);

  const URL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

  const getCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(URL);
      categories.value = response.data.categories ?? [];
    } catch (err: any) {
      error.value = err.message;
      categories.value = null;
    } finally {
      loading.value = false;
    }
  };

  return { categories, loading, error, getCategories };
};
