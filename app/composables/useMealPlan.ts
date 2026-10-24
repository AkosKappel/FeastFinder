import type { MealPreview } from '@/types/Meal';
import type { PlannedMeal, PlanSlot } from '@/utils/mealPlan';

// Saved in this browser and kept in sync across tabs, like favourites.
export const useMealPlan = () => {
  const plan = useLocalStorage<PlannedMeal[]>('feast-finder:meal-plan', []);

  const add = (day: number, slot: PlanSlot, meal: MealPreview) => (plan.value = addToPlan(plan.value, day, slot, meal));
  const move = (entry: PlannedMeal, day: number, slot: PlanSlot) =>
    (plan.value = moveInPlan(plan.value, entry, day, slot));
  const remove = (entry: PlannedMeal) => (plan.value = removeFromPlan(plan.value, entry));
  const clear = () => (plan.value = []);
  const isPlanned = (id: string) => plan.value.some(entry => entry.meal.idMeal === id);

  return { plan, add, move, remove, clear, isPlanned };
};
