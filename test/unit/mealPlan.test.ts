import { describe, expect, it } from 'vitest';
import {
  addToPlan,
  mealPlanText,
  mealsAt,
  moveInPlan,
  removeFromPlan,
  uniquePlannedMeals,
} from '../../app/utils/mealPlan';

const meal = (idMeal: string, strMeal: string) => ({
  idMeal,
  strMeal,
  strMealThumb: `https://example.com/${idMeal}.jpg`,
  strCategory: 'Chicken',
  strCountry: 'Japan',
});
const teriyaki = meal('1', 'Teriyaki');
const pasta = meal('2', 'Pasta');

describe('meal plan', () => {
  it('adds meals to a day and slot, not twice in the same place', () => {
    let plan = addToPlan([], 0, 'Dinner', teriyaki);
    plan = addToPlan(plan, 0, 'Dinner', pasta);
    plan = addToPlan(plan, 0, 'Dinner', teriyaki);
    plan = addToPlan(plan, 3, 'Lunch', teriyaki);
    expect(mealsAt(plan, 0, 'Dinner').map(entry => entry.meal.strMeal)).toEqual(['Teriyaki', 'Pasta']);
    expect(mealsAt(plan, 3, 'Lunch')).toHaveLength(1);
    expect(mealsAt(plan, 0, 'Lunch')).toEqual([]);
  });

  it('stores only the card fields of a meal', () => {
    const plan = addToPlan([], 0, 'Lunch', { ...teriyaki, strInstructions: 'Cook.' } as typeof teriyaki);
    expect(plan[0]!.meal).toEqual(teriyaki);
  });

  it('moves and removes a planned meal', () => {
    const plan = addToPlan(addToPlan([], 0, 'Dinner', teriyaki), 1, 'Lunch', pasta);
    const moved = moveInPlan(plan, plan[0]!, 4, 'Lunch');
    expect(mealsAt(moved, 0, 'Dinner')).toEqual([]);
    expect(mealsAt(moved, 4, 'Lunch').map(entry => entry.meal.strMeal)).toEqual(['Teriyaki']);
    expect(removeFromPlan(moved, moved[0]!)).toHaveLength(1);
  });

  it('moving onto the same meal in the target slot keeps one', () => {
    const plan = addToPlan(addToPlan([], 0, 'Dinner', teriyaki), 1, 'Dinner', teriyaki);
    expect(moveInPlan(plan, plan[0]!, 1, 'Dinner')).toHaveLength(1);
  });

  it('lists each planned meal once', () => {
    const plan = addToPlan(addToPlan(addToPlan([], 0, 'Dinner', teriyaki), 2, 'Lunch', teriyaki), 2, 'Lunch', pasta);
    expect(uniquePlannedMeals(plan).map(planned => planned.strMeal)).toEqual(['Teriyaki', 'Pasta']);
  });

  it('writes the plan as text by day, skipping empty days', () => {
    const plan = addToPlan(addToPlan(addToPlan([], 2, 'Dinner', pasta), 2, 'Lunch', teriyaki), 0, 'Dinner', pasta);
    expect(mealPlanText(plan)).toBe('Monday\n- Dinner: Pasta\nWednesday\n- Lunch: Teriyaki\n- Dinner: Pasta');
  });
});
