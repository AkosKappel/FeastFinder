# Feast Finder

[![Build, test and deploy](https://github.com/AkosKappel/FeastFinder/actions/workflows/nuxtjs.yml/badge.svg)](https://github.com/AkosKappel/FeastFinder/actions/workflows/nuxtjs.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/e2e-Playwright-2EAD33?logo=playwright&logoColor=white)

Feast Finder is a web application for finding recipes by meal name, ingredient, food category or cuisine. Each meal shows its ingredients, step-by-step instructions and a video when available. Recipe data comes from [TheMealDB API](https://www.themealdb.com/api.php).

**Live demo:** https://akoskappel.github.io/FeastFinder/

![Home page](./screenshots/home.webp)

## Features

- Search meals by name or browse them by first letter, category, ingredient or cuisine (63 countries with flags), or get a random meal
- What's in my fridge: pick several ingredients and find meals that use all of them, or all but one
- Meal pages with ingredient images, numbered steps and the embedded cooking video
- Cooking mode: one step at a time in large text, fullscreen (Fullscreen API), with the screen kept on (Screen Wake Lock API), arrow keys and swipes
- Timers from the cooking times in the steps, with sound (Web Audio API), vibration and a notification (Notifications API) when done
- Read aloud (Web Speech API) with the current step highlighted, jumps to the next or previous step, or start from any step
- Cooking checklist for ingredients and steps, and a shopping list that merges ingredients from several meals, to copy or share
- Measures as written, in metric or in US units
- Favourites saved in the browser, sharing via the Web Share API or the clipboard, print-friendly recipes
- Light and dark theme (following the system or chosen), works offline for pages and recipes you have opened before, installable as an app
- Filters, letters and pages kept in the URL, loading skeletons, error states with retry, a 404 page
- Keyboard and screen reader friendly (Lighthouse accessibility 100, checked in CI), works on phones

| Meal page                             | On a phone, dark theme                                 |
| ------------------------------------- | ------------------------------------------------------ |
| ![Meal page](./screenshots/meal.webp) | ![Meal page on a phone](./screenshots/meal-phone.webp) |

![Cooking mode with a running timer](./screenshots/cooking-mode.webp)

![What's in my fridge](./screenshots/fridge.webp)

## Tech stack

- [Nuxt 4](https://nuxt.com/) with Vue 3 and TypeScript, rendered in the browser as a static single-page app
- [Tailwind CSS 4](https://tailwindcss.com/) with the theme defined in CSS, [Lucide](https://lucide.dev/) icons, self-hosted fonts from [Fontsource](https://fontsource.org/)
- [VueUse](https://vueuse.org/) for browser APIs (local storage, share, clipboard, wake lock, online status)
- [Vitest](https://vitest.dev/) unit tests, [Playwright](https://playwright.dev/) end-to-end tests with [axe](https://github.com/dequelabs/axe-core) accessibility checks, ESLint and Prettier
- GitHub Actions and GitHub Pages for CI and hosting

## How it works

- **Data:** API responses are cached in memory for 30 minutes and identical requests are merged, so browsing back and forth does not call the API again. At build time a script also collects every meal into a small index (`public/data/meals.json`, about 50 kB compressed). Browsing by letter or country, searching and the fridge run on this index, because the free API cannot filter by several ingredients and many meals have no area set.
- **Offline:** a small service worker (`public/sw.js`) keeps the app shell, built assets, recipe data and images, so pages you have visited open without a connection.
- **Hosting:** GitHub Pages serves static files only. Every meal, category and cuisine gets a prerendered copy of the app shell, so their links return 200 and can be indexed; other paths load the app from `404.html`.
- **SEO:** canonical URLs, page descriptions, `Recipe` structured data on meal pages, a sitemap built with the meal index, and a link preview image.

## Getting started

Requires Node.js 22 or 24.

```bash
npm install
npm run dev
```

| Script                | What it does                                                         |
| --------------------- | -------------------------------------------------------------------- |
| `npm run dev`         | Start the development server on http://localhost:3000/FeastFinder/   |
| `npm run lint`        | Lint the code with ESLint                                            |
| `npm run typecheck`   | Type-check the project                                               |
| `npm test`            | Run the unit tests                                                   |
| `npm run test:e2e`    | Run the end-to-end tests against the generated site                  |
| `npm run lighthouse`  | Run Lighthouse on the generated site and check the score budget      |
| `npm run format`      | Format the code with Prettier (`format:check` only checks)           |
| `npm run generate`    | Build the meal index, the sitemap and the static site into `.output` |
| `npm run data:update` | Rebuild the meal index and the sitemap                               |

## Testing

- **Unit tests** (`test/unit`, Vitest): helpers, the API client with mocked responses, the meal index search and the SEO data.
- **End-to-end tests** (`test/e2e`, Playwright): run on the generated site, served the way GitHub Pages serves it, in a desktop and a phone browser. TheMealDB is mocked, so the tests are fast and stable. They cover search, meal pages, favourites, the fridge, paging, timers (with a fake clock), read aloud (with a fake speech engine), cooking mode, units, the shopping list, error and 404 states, and run axe accessibility checks in the light and dark theme.
- **Lighthouse** (`lighthouserc.json`, Lighthouse CI): desktop runs on five pages of the generated site. CI fails below 100 for accessibility and SEO, 95 for best practices and 70 for performance (the home page waits for random meals and photos from TheMealDB, so its score varies); the reports are kept as a workflow artifact.

```bash
npm run generate
npx playwright install chromium
npm run test:e2e
```

## Deployment

Every push to `main` and a weekly schedule run [the workflow](.github/workflows/nuxtjs.yml): format check, lint, type check, unit tests, `nuxt generate` with the `github_pages` preset, end-to-end tests, the Lighthouse budget, then deployment to GitHub Pages. The weekly run refreshes the meal index with new recipes.

## Credits

Recipe data and images: [TheMealDB](https://www.themealdb.com/), using its free test API key for educational use.

## License

[MIT](LICENSE) © Ákos Kappel
