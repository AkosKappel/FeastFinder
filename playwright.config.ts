import { defineConfig, devices } from '@playwright/test';

// End-to-end tests run against the generated static site (`npm run generate` first),
// with TheMealDB and the meal index mocked in test/e2e/mocks.ts.
export default defineConfig({
  testDir: 'test/e2e',
  // Axe scans are slow on a cold, busy machine.
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173/FeastFinder/',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node test/e2e/server.mjs',
    url: 'http://localhost:4173/FeastFinder/',
    reuseExistingServer: !process.env.CI,
  },
});
