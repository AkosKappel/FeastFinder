import type { MealIngredient } from './helpers';

export interface ShoppingItem {
  name: string;
  /** One entry per meal that needs the ingredient; measures are free text, so they are listed, not added up. */
  needs: { meal: string; measure: string }[];
  bought: boolean;
}

/** Adds a meal's ingredients, merging items with the same name. Adding the same meal twice changes nothing. */
export const addToShoppingList = (list: ShoppingItem[], meal: string, ingredients: MealIngredient[]) => {
  const items = list.map(item => ({ ...item, needs: [...item.needs] }));
  for (const { name, measure } of ingredients) {
    const existing = items.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (!existing) {
      items.push({ name, needs: [{ meal, measure }], bought: false });
    } else if (!existing.needs.some(need => need.meal === meal)) {
      existing.needs.push({ meal, measure });
      existing.bought = false;
    }
  }
  return items;
};

/** Plain text for copying or sharing: what is still to buy. */
export const shoppingListText = (list: ShoppingItem[]) =>
  list
    .filter(item => !item.bought)
    .map(item => {
      const measures = item.needs.map(need => need.measure).filter(Boolean);
      return measures.length ? `- ${item.name}: ${measures.join(' + ')}` : `- ${item.name}`;
    })
    .join('\n');
