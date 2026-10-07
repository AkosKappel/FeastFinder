import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { mockApi } from './mocks';

const expectNoSeriousA11yIssues = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const serious = violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(serious.map(violation => `${violation.id}: ${violation.help}`)).toEqual([]);
};

const openMenuIfCollapsed = async (page: Page) => {
  const menuButton = page.getByRole('button', { name: 'Menu' });
  if (await menuButton.isVisible()) await menuButton.click();
};

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('home page shows recommended meals, categories and ingredients', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { name: 'Recommended meals' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Teriyaki Chicken Casserole' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Food categories' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Garlic', exact: true })).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test('search goes to the results and keeps the query in the URL', async ({ page }) => {
  await page.goto('./');

  await page.getByRole('searchbox', { name: 'Search meals' }).fill('garlic');
  await page.getByRole('searchbox', { name: 'Search meals' }).press('Enter');

  await expect(page).toHaveURL(/\/meals\?q=garlic$/);
  await expect(page.getByRole('heading', { name: 'Results for "garlic"', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Garlic Pasta' })).toBeVisible();
  await expect(page.getByText('1 meal', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Clear search' }).click();
  await page.getByRole('searchbox', { name: 'Search meals' }).press('Enter');
  await expect(page).toHaveURL(/\/meals$/);
  await expect(page.getByText('3 meals', { exact: true })).toBeVisible();
});

test('a meal opens from a direct link with steps, ingredients and actions', async ({ page }) => {
  await page.goto('meals/52772');

  await expect(page).toHaveTitle('Teriyaki Chicken Casserole · Feast Finder');
  await expect(page.getByRole('heading', { name: 'Teriyaki Chicken Casserole', level: 1 })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Bake for 35 minutes.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Salt/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Cuisine: Japan' })).toHaveAttribute('href', /\/cuisines\/Japan$/);

  await page.getByRole('checkbox', { name: 'Got Salt' }).check();
  await page.getByText('Bake for 35 minutes.').click();
  await expect(page.getByRole('checkbox', { name: 'Bake for 35 minutes.' })).toBeChecked();
  await expectNoSeriousA11yIssues(page);
});

test('long meal lists show a count and are split into pages', async ({ page }) => {
  await page.goto('categories/Dessert');

  await expect(page.getByText('30 meals', { exact: true })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(24);

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page).toHaveURL(/\/categories\/Dessert\?page=2$/);
  await expect(page.getByRole('article')).toHaveCount(6);
  await expect(page.getByRole('link', { name: 'Dessert 30' })).toBeVisible();
});

test('favourites are saved and listed', async ({ page }) => {
  await page.goto('meals/52772');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('button', { name: 'Saved' })).toHaveAttribute('aria-pressed', 'true');

  await openMenuIfCollapsed(page);
  await page.getByRole('link', { name: 'Favourites' }).first().click();

  await expect(page.getByRole('heading', { name: 'Favourites', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Teriyaki Chicken Casserole' })).toBeVisible();
});

test('a failed request shows an error that can be retried', async ({ page }) => {
  await page.unrouteAll();
  // $fetch retries a failed GET once, so two failures are needed to reach the error state.
  await mockApi(page, { failures: 2 });
  await page.goto('meals/52772');

  await expect(page.getByText('Something went wrong')).toBeVisible();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: 'Teriyaki Chicken Casserole', level: 1 })).toBeVisible();
});

test('unknown pages show the 404 page', async ({ page }) => {
  await page.goto('does-not-exist');

  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { name: 'Recommended meals' })).toBeVisible();
});

test('the fridge finds meals with all chosen ingredients', async ({ page }) => {
  await page.goto('fridge');

  const input = page.getByRole('combobox', { name: 'Add an ingredient' });
  for (const ingredient of ['garlic', 'rice']) {
    await input.fill(ingredient);
    await input.press('Enter');
  }

  await expect(page).toHaveURL(/with=garlic%2Crice|with=garlic,rice/);
  await expect(page.getByRole('heading', { name: '1 meal with everything' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Green Curry' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /one ingredient short/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Garlic Pasta' })).toBeVisible();
});

test('cuisines list countries and open their meals', async ({ page }) => {
  await page.goto('cuisines');

  await page.getByRole('link', { name: /Thailand/ }).click();
  await expect(page.getByRole('heading', { name: 'Thailand cuisine', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Green Curry' })).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test.describe('with the operating system in dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('pages keep readable contrast', async ({ page }) => {
    for (const path of ['./', 'meals/52772', 'about']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expectNoSeriousA11yIssues(page);
    }
  });
});
