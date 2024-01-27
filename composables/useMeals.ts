import { ref } from 'vue';
import axios from 'axios';
import type { Meal } from '~/types/Meal';

export const useFetchMeals = () => {
  const meals = ref<Meal[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

  const getMeals = async (query: string = '') => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(URL + query);
      meals.value = response.data.meals || [];
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { meals, loading, error, getMeals };
};

export const useRandomMeals = () => {
  const meals = ref<Meal[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const URL = 'https://www.themealdb.com/api/json/v1/1/random.php';

  const getMeals = async (n: number) => {
    loading.value = true;
    error.value = null;

    try {
      const responses = await Promise.all(Array.from({ length: n }, () => axios.get(URL)));
      meals.value = responses.map(response => response.data.meals[0]);
    } catch (err: any) {
      meals.value = [];
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { meals, loading, error, getMeals };
};
