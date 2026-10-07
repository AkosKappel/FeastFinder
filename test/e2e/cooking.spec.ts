import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { mockApi } from './mocks';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('measures switch between units and stay switched', async ({ page }) => {
  await page.goto('meals/52772');
  const ingredients = page.getByRole('region', { name: 'Ingredients' });
  await expect(ingredients.getByText('3/4 cup')).toBeVisible();

  await ingredients.getByText('Metric').click();
  await expect(ingredients.getByText('180 ml')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('region', { name: 'Ingredients' }).getByText('180 ml')).toBeVisible();
});

test('ingredients still needed go on the shopping list', async ({ page }) => {
  await page.goto('meals/52772');
  await page.getByRole('checkbox', { name: 'Got water' }).check();
  await page.getByRole('button', { name: 'Add the rest to shopping list' }).click();
  await page.getByRole('link', { name: 'shopping list', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Shopping list', level: 1 })).toBeVisible();
  await expect(page.getByText('2 items to buy', { exact: true })).toBeVisible();
  await expect(page.getByText('3/4 cup for Teriyaki Chicken Casserole')).toBeVisible();
  await expect(page.getByText('water', { exact: true })).toHaveCount(0);

  await page.getByRole('checkbox', { name: /Salt/ }).check();
  await expect(page.getByText('1 item to buy', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove bought' }).click();
  await expect(page.getByRole('checkbox')).toHaveCount(1);

  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.filter(violation => violation.impact === 'serious' || violation.impact === 'critical')).toEqual([]);
});

test('a timer starts from a step and rings when done', async ({ page }) => {
  await page.clock.install();
  await page.goto('meals/52772');

  await page.getByRole('button', { name: 'Start a 35 minutes timer' }).click();
  const panel = page.getByRole('list', { name: 'Cooking timers' });
  await expect(panel.getByText('35:00')).toBeVisible();

  // The page clock keeps ticking in real time between steps, so the countdown can be a second off.
  const countdown = panel.getByText(/^\d+:\d\d$/);
  await page.clock.fastForward('10:00');
  await expect(countdown).toHaveText(/^2[45]:\d\d$/);
  await page.getByRole('button', { name: /Pause the 35 minutes timer/ }).click();
  const paused = await countdown.textContent();
  await page.clock.fastForward('10:00');
  await expect(countdown).toHaveText(paused!);

  await page.getByRole('button', { name: /Resume the 35 minutes timer/ }).click();
  await page.clock.fastForward('25:01');
  await expect(panel.getByRole('alert')).toHaveText('Done');

  // Timers stay on screen while browsing other pages.
  await page.getByRole('link', { name: 'Cuisine: Japan' }).click();
  await expect(page.getByRole('heading', { name: 'Japan cuisine' })).toBeVisible();
  await expect(panel.getByText('Teriyaki Chicken Casserole')).toBeVisible();
});

test('reading aloud can jump between steps', async ({ page }) => {
  // A stand-in for the browser's speech synthesis that never finishes a step on its own.
  await page.addInitScript(() => {
    const spoken: string[] = [];
    Object.assign(window, { spoken });
    class Utterance {
      onstart?: () => void;
      constructor(public text: string) {}
    }
    const queue: Utterance[] = [];
    Object.assign(window, { SpeechSynthesisUtterance: Utterance });
    // speechSynthesis is a read-only getter, so it has to be redefined.
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak: (utterance: Utterance) => {
          queue.push(utterance);
          if (queue.length === 1) {
            spoken.push(utterance.text);
            utterance.onstart?.();
          }
        },
        cancel: () => (queue.length = 0),
        pause: () => {},
        resume: () => {},
      },
    });
  });
  await page.goto('meals/52772');
  const current = page.locator('li[aria-current="step"]');

  await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
  await expect(current).toContainText('Preheat oven');

  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(current).toContainText('Combine soy sauce');
  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(current).toContainText('Bake for 35 minutes');
  await expect(page.getByRole('button', { name: 'Next step' })).toBeDisabled();

  await page.getByRole('button', { name: 'Previous step' }).click();
  await expect(current).toContainText('Combine soy sauce');

  await page.getByRole('button', { name: 'Read aloud from step 1' }).click();
  await expect(current).toContainText('Preheat oven');
  expect(await page.evaluate(() => (window as unknown as { spoken: string[] }).spoken)).toEqual([
    'Preheat oven to 350° F.',
    'Combine soy sauce and water.',
    'Bake for 35 minutes.',
    'Combine soy sauce and water.',
    'Preheat oven to 350° F.',
  ]);
});

test('cooking mode shows one step at a time', async ({ page }) => {
  await page.goto('meals/52772');
  await page.getByRole('button', { name: 'Cooking mode' }).click();

  const dialog = page.getByRole('dialog', { name: 'Teriyaki Chicken Casserole' });
  await expect(dialog.getByRole('heading', { name: 'Gather the ingredients' })).toBeVisible();

  await dialog.getByRole('button', { name: 'Start cooking' }).click();
  await expect(dialog.getByText('Step 1 of 3')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByText('Step 3 of 3')).toBeVisible();
  await expect(dialog.getByText('Bake for 35 minutes.')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Start a 35 minutes timer' })).toBeVisible();

  await dialog.getByRole('checkbox', { name: 'Step done' }).check();
  await dialog.getByRole('button', { name: 'Finish' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('checkbox', { name: 'Bake for 35 minutes.' })).toBeChecked();
});
