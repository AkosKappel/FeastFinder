import type { MealPreview } from '@/types/Meal';

export const PLAN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export const PLAN_SLOTS = ['Lunch', 'Dinner'] as const;
export type PlanSlot = (typeof PLAN_SLOTS)[number];

export interface PlannedMeal {
  /** Index into PLAN_DAYS, Monday is 0. */
  day: number;
  slot: PlanSlot;
  meal: MealPreview;
}

const isSamePlace = (entry: PlannedMeal, day: number, slot: PlanSlot, id: string) =>
  entry.day === day && entry.slot === slot && entry.meal.idMeal === id;

/** Adds a meal to a day and slot; a meal already planned there is not added twice. */
export const addToPlan = (plan: PlannedMeal[], day: number, slot: PlanSlot, meal: MealPreview) => {
  if (plan.some(entry => isSamePlace(entry, day, slot, meal.idMeal))) return plan;
  const { idMeal, strMeal, strMealThumb, strCategory, strCountry } = meal;
  return [...plan, { day, slot, meal: { idMeal, strMeal, strMealThumb, strCategory, strCountry } }];
};

export const removeFromPlan = (plan: PlannedMeal[], entry: PlannedMeal) =>
  plan.filter(other => !isSamePlace(other, entry.day, entry.slot, entry.meal.idMeal));

export const moveInPlan = (plan: PlannedMeal[], entry: PlannedMeal, day: number, slot: PlanSlot) =>
  addToPlan(removeFromPlan(plan, entry), day, slot, entry.meal);

/** Meals of one day and slot, in the order they were added. */
export const mealsAt = (plan: PlannedMeal[], day: number, slot: PlanSlot) =>
  plan.filter(entry => entry.day === day && entry.slot === slot);

/** Each planned meal once, however often it is planned. */
export const uniquePlannedMeals = (plan: PlannedMeal[]) => [
  ...new Map(plan.map(entry => [entry.meal.idMeal, entry.meal])).values(),
];

/** Plain text for copying or sharing, days without meals left out. */
export const mealPlanText = (plan: PlannedMeal[]) =>
  PLAN_DAYS.flatMap((dayName, day) => {
    const lines = PLAN_SLOTS.flatMap(slot => mealsAt(plan, day, slot).map(entry => `- ${slot}: ${entry.meal.strMeal}`));
    return lines.length ? [dayName, ...lines] : [];
  }).join('\n');
