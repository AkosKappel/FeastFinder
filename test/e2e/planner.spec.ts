import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { mockApi } from './mocks';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('meals are planned from the meal page and the planner, moved and removed', async ({ page }) => {
  await page.goto('meals/52772');
  await page.getByRole('button', { name: 'Add to plan' }).click();
  const dialog = page.getByRole('dialog', { name: 'Add to meal plan' });
  await dialog.getByRole('radio', { name: 'Lunch' }).check();
  await dialog.getByRole('button', { name: 'Tuesday' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'In your plan' })).toBeVisible();

  await page.goto('planner');
  const tuesdayLunch = page.getByRole('region', { name: 'Tuesday Lunch' });
  await expect(tuesdayLunch.getByRole('link', { name: 'Teriyaki Chicken Casserole', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Add a meal to Friday Dinner' }).click();
  const picker = page.getByRole('dialog', { name: 'Friday dinner' });
  await picker.getByRole('searchbox', { name: 'Find a meal' }).fill('cur');
  await picker.getByRole('button', { name: 'Green Curry' }).click();
  await expect(page.getByRole('region', { name: 'Friday Dinner' }).getByText('Green Curry')).toBeVisible();

  const { violations } = await new AxeBuilder({ page }).analyze();
  const serious = violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(serious.map(violation => `${violation.id}: ${violation.help}`)).toEqual([]);

  await tuesdayLunch.getByRole('combobox', { name: 'Move Teriyaki Chicken Casserole' }).selectOption('Sunday dinner');
  await expect(tuesdayLunch.getByText('Nothing planned')).toBeVisible();
  const sundayDinner = page.getByRole('region', { name: 'Sunday Dinner' });
  await expect(sundayDinner.getByText('Teriyaki Chicken Casserole')).toBeVisible();

  await sundayDinner.getByRole('button', { name: /^Remove Teriyaki/ }).click();
  await expect(sundayDinner.getByText('Nothing planned')).toBeVisible();

  // The plan survives a reload.
  await page.reload();
  await expect(page.getByRole('region', { name: 'Friday Dinner' }).getByText('Green Curry')).toBeVisible();
});

test('the week goes on the shopping list and a planned meal opens in cooking mode', async ({ page }) => {
  await page.goto('planner');
  await page.evaluate(() => {
    const meal = (idMeal: string, strMeal: string) => ({ idMeal, strMeal, strMealThumb: 'x', strCategory: null });
    localStorage.setItem(
      'feast-finder:meal-plan',
      JSON.stringify([
        { day: 0, slot: 'Dinner', meal: meal('52772', 'Teriyaki Chicken Casserole') },
        { day: 2, slot: 'Lunch', meal: meal('52000', 'Garlic Pasta') },
        { day: 4, slot: 'Lunch', meal: meal('52772', 'Teriyaki Chicken Casserole') },
      ]),
    );
  });
  await page.reload();

  await page.getByRole('button', { name: 'Add week to shopping list' }).click();
  await page.getByRole('status').getByRole('link', { name: 'shopping list' }).click();
  await expect(page.getByRole('heading', { name: 'Shopping list', level: 1 })).toBeVisible();
  // Both meals share their mocked ingredients, so each is listed once with both meals.
  await expect(page.getByText('3 items to buy', { exact: true })).toBeVisible();
  await expect(page.getByText('for Teriyaki Chicken Casserole · for Garlic Pasta')).toBeVisible();

  await page.goto('planner');
  await page.getByRole('link', { name: 'Cook Garlic Pasta' }).click();
  await expect(page.getByRole('dialog', { name: 'Garlic Pasta' })).toBeVisible();
  await expect(page).toHaveURL(/\/meals\/52000$/);
});
