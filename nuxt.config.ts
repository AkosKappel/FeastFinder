// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import { indexPaths } from './scripts/site-routes.mjs';

const baseURL = '/FeastFinder/';
const siteUrl = `https://akoskappel.github.io${baseURL}`;

// Each meal, category and cuisine gets its own copy of the app shell, so GitHub Pages answers those
// links with 200 instead of the 404 fallback and search engines index them. The meal index is built
// before `nuxt generate` (see scripts/build-meal-index.mjs).
const indexRoutes = () => {
  try {
    const { meals } = JSON.parse(readFileSync('public/data/meals.json', 'utf8'));
    return indexPaths(meals).map(path => `/${path}`);
  } catch {
    return [];
  }
};
const description =
  'Find recipes by meal name, ingredient, category or cuisine, with ingredients and step-by-step instructions.';

export default defineNuxtConfig({
  compatibilityDate: '2026-10-06',
  devtools: { enabled: true },
  // GitHub Pages serves static files only: render in the browser so the generated 404.html
  // fallback can boot the app on any deep link, e.g. /meals/52772.
  ssr: false,
  modules: ['@vueuse/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/tailwind.css'],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: { public: { siteUrl } },
  nitro: { prerender: { routes: indexRoutes() } },
  app: {
    baseURL,
    buildAssetsDir: 'assets',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Feast Finder',
      meta: [
        { name: 'description', content: description },
        { name: 'theme-color', content: '#17332c' },
        // Link previews come from this static HTML: chat apps and social sites do not run the app.
        { property: 'og:site_name', content: 'Feast Finder' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Feast Finder' },
        { property: 'og:description', content: description },
        { property: 'og:image', content: `${siteUrl}og-image.jpg` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Feast Finder: what are we cooking today?' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        { rel: 'icon', href: `${baseURL}favicon.ico`, sizes: '32x32' },
        { rel: 'apple-touch-icon', href: `${baseURL}apple-touch-icon.png` },
        { rel: 'manifest', href: `${baseURL}site.webmanifest` },
      ],
      // Applies the saved theme (see ThemeToggle.vue) before the app renders, so dark mode does not flash.
      script: [
        {
          innerHTML:
            "try{var t=localStorage.getItem('feast-finder:theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}",
        },
      ],
    },
  },
});
