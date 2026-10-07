import type { MealIngredient } from '@/utils/helpers';
import type { ShoppingItem } from '@/utils/shoppingList';

// Saved in this browser and kept in sync across tabs, like favourites.
export const useShoppingList = () => {
  const items = useLocalStorage<ShoppingItem[]>('feast-finder:shopping-list', []);

  const add = (meal: string, ingredients: MealIngredient[]) => {
    items.value = addToShoppingList(items.value, meal, ingredients);
  };
  const toggleBought = (name: string) => {
    items.value = items.value.map(item => (item.name === name ? { ...item, bought: !item.bought } : item));
  };
  const remove = (name: string) => (items.value = items.value.filter(item => item.name !== name));
  const clearBought = () => (items.value = items.value.filter(item => !item.bought));
  const clear = () => (items.value = []);
  const hasMeal = (meal: string) => items.value.some(item => item.needs.some(need => need.meal === meal));
  const toBuy = computed(() => items.value.filter(item => !item.bought).length);

  return { items, add, toggleBought, remove, clearBought, clear, hasMeal, toBuy };
};
