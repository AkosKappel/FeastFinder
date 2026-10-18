import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { mockApi } from './mocks';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('Ctrl+K opens the quick find, arrows pick a meal and Enter opens it', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Recommended meals' })).toBeVisible();

  await page.keyboard.press('Control+k');
  const palette = page.getByRole('dialog', { name: 'Quick find' });
  const input = palette.getByRole('combobox');
  await expect(input).toBeFocused();
  await expect(palette.getByRole('option', { name: 'Meals' })).toHaveAttribute('aria-selected', 'true');

  const { violations } = await new AxeBuilder({ page }).include('dialog[open]').analyze();
  const serious = violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(serious.map(violation => `${violation.id}: ${violation.help}`)).toEqual([]);

  await input.fill('cu');
  await expect(palette.getByRole('option', { name: /Green Curry/ })).toBeVisible();
  await expect(palette.getByRole('option').last()).toHaveText('Search meals for “cu”');

  await input.press('ArrowUp');
  await expect(palette.getByRole('option').last()).toHaveAttribute('aria-selected', 'true');
  await input.press('ArrowDown');
  await input.press('ArrowDown');
  await expect(palette.getByRole('option', { name: /Green Curry/ })).toHaveAttribute('aria-selected', 'true');
  await input.press('Enter');

  await expect(page).toHaveURL(/\/meals\/52001$/);
  await expect(page.getByRole('heading', { name: 'Green Curry', level: 1 })).toBeVisible();
  await expect(palette).toBeHidden();
});

test('the header button opens the quick find, Escape closes it and the last option searches', async ({ page }) => {
  await page.goto('./');
  const palette = page.getByRole('dialog', { name: 'Quick find' });

  await page.getByRole('button', { name: 'Quick find' }).click();
  await expect(palette).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(palette).toBeHidden();

  await page.keyboard.press('Control+k');
  await palette.getByRole('combobox').fill('garlic');
  await palette.getByRole('option', { name: 'Search meals for “garlic”' }).click();
  await expect(page).toHaveURL(/\/meals\?q=garlic$/);
  await expect(palette).toBeHidden();
});
