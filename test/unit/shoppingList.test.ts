import { describe, expect, it } from 'vitest';
import { addToShoppingList, shoppingListText } from '../../app/utils/shoppingList';

const teriyaki = [
  { name: 'Soy sauce', measure: '3/4 cup' },
  { name: 'Salt', measure: '' },
];
const pasta = [
  { name: 'soy sauce', measure: '2 tbsp' },
  { name: 'Spaghetti', measure: '500g' },
];

describe('addToShoppingList', () => {
  it('merges ingredients with the same name across meals', () => {
    const list = addToShoppingList(addToShoppingList([], 'Teriyaki', teriyaki), 'Pasta', pasta);
    expect(list.map(item => item.name)).toEqual(['Soy sauce', 'Salt', 'Spaghetti']);
    expect(list[0]!.needs).toEqual([
      { meal: 'Teriyaki', measure: '3/4 cup' },
      { meal: 'Pasta', measure: '2 tbsp' },
    ]);
  });

  it('does not add a meal twice and puts bought items back on the list when needed again', () => {
    const once = addToShoppingList([], 'Teriyaki', teriyaki);
    expect(addToShoppingList(once, 'Teriyaki', teriyaki)).toEqual(once);

    const bought = once.map(item => ({ ...item, bought: true }));
    const again = addToShoppingList(bought, 'Pasta', pasta);
    expect(again.find(item => item.name === 'Soy sauce')?.bought).toBe(false);
    expect(again.find(item => item.name === 'Salt')?.bought).toBe(true);
  });

  it('does not change the list it was given', () => {
    const list = addToShoppingList([], 'Teriyaki', teriyaki);
    const snapshot = structuredClone(list);
    addToShoppingList(list, 'Pasta', pasta);
    expect(list).toEqual(snapshot);
  });
});

describe('shoppingListText', () => {
  it('lists what is still to buy with all measures', () => {
    const list = addToShoppingList(addToShoppingList([], 'Teriyaki', teriyaki), 'Pasta', pasta);
    list[2]!.bought = true;
    expect(shoppingListText(list)).toBe('- Soy sauce: 3/4 cup + 2 tbsp\n- Salt');
  });
});
