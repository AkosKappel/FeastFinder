import { ref } from 'vue';
import axios from 'axios';
import type { Ingredient } from '@/types/Ingredient';

export const useIngredients = () => {
  const ingredients = ref<Ingredient[] | null>(null);
  const loading = ref<boolean>(true);
  const error = ref<string | null>(null);

  const URL = 'https://www.themealdb.com/api/json/v1/1/list.php?i=list';

  const getIngredients = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(URL);
      // add strIngredientThumb to each ingredient
      ingredients.value = (response.data.meals ?? []).map((ingredient: Ingredient) => ({
        ...ingredient,
        strIngredientThumb: `https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`,
      }));
    } catch (err: any) {
      error.value = err.message;
      ingredients.value = null;
    } finally {
      loading.value = false;
    }
  };

  return { ingredients, loading, error, getIngredients };
};
