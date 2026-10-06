# Feast Finder

[![Build, test and deploy](https://github.com/AkosKappel/FeastFinder/actions/workflows/nuxtjs.yml/badge.svg)](https://github.com/AkosKappel/FeastFinder/actions/workflows/nuxtjs.yml)
![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)

Feast Finder is a web application for finding recipes by meal name, ingredient or food category. Each meal shows its ingredients, step-by-step instructions and a video when available. Recipe data comes from [TheMealDB API](https://www.themealdb.com/api.php).

**Live demo:** https://akoskappel.github.io/FeastFinder/

## Features

- Search meals by name
- Browse meals by category or by ingredient
- Filter the ingredient list by name or first letter
- Meal details with ingredients, measures, instructions and video link
- Loading skeletons, error states with retry, and works on phones

## Examples

### Home Page

![Home Page](./screenshots/homepage.jpg)

### Search by Ingredient

![Search by Ingredient](./screenshots/choco.png)

### Meal Details

![Meal Details](./screenshots/bigmac.png)

## Tech stack

- [Nuxt 4](https://nuxt.com/) with Vue 3 and TypeScript, rendered in the browser as a static single-page app
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vitest](https://vitest.dev/) for unit tests
- GitHub Actions and GitHub Pages for CI and hosting

API responses are cached in memory for 30 minutes and identical requests are merged, so browsing back and forth does not call the API again.

## Getting started

Requires Node.js 22 or 24.

```bash
npm install
npm run dev
```

| Script              | What it does                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Start the development server on http://localhost:3000/FeastFinder/ |
| `npm test`          | Run the unit tests                                                 |
| `npm run typecheck` | Type-check the project                                             |
| `npm run generate`  | Build the static site into `.output/public`                        |

## Deployment

Every push to `main` runs [the workflow](.github/workflows/nuxtjs.yml): type check, unit tests, `nuxt generate` with the `github_pages` preset, then deployment to GitHub Pages. The generated `404.html` loads the app for any path, so links to meals, categories and ingredients work directly.

## Credits

Recipe data and images: [TheMealDB](https://www.themealdb.com/), using its free test API key for educational use.
