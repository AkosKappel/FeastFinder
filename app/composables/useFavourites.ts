import type { MealPreview } from '@/types/Meal';

// Only the fields a card needs are stored, so the favourites page works without API calls.
// useLocalStorage also keeps other open tabs in sync through the storage event.
export const useFavourites = () => {
  const favourites = useLocalStorage<MealPreview[]>('feast-finder:favourites', []);

  const isFavourite = (id: string) => favourites.value.some(meal => meal.idMeal === id);

  const toggleFavourite = (meal: MealPreview) => {
    if (isFavourite(meal.idMeal)) {
      favourites.value = favourites.value.filter(saved => saved.idMeal !== meal.idMeal);
    } else {
      const { idMeal, strMeal, strMealThumb, strCategory, strArea } = meal;
      favourites.value = [{ idMeal, strMeal, strMealThumb, strCategory, strArea }, ...favourites.value];
    }
  };

  return { favourites, isFavourite, toggleFavourite };
};
