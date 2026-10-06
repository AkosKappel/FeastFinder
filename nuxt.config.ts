// https://nuxt.com/docs/api/configuration/nuxt-config
const baseURL = '/FeastFinder/';

export default defineNuxtConfig({
  compatibilityDate: '2026-10-06',
  devtools: { enabled: true },
  // GitHub Pages serves static files only: render in the browser so the generated 404.html
  // fallback can boot the app on any deep link, e.g. /meals/52772.
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  // CSS nesting is unused; skipping its plugin avoids a resolve warning with Tailwind 3 on Nuxt 4.
  postcss: { plugins: { 'tailwindcss/nesting': false } },
  app: {
    baseURL,
    buildAssetsDir: 'assets',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Feast Finder',
      meta: [
        {
          name: 'description',
          content: 'Find recipes by meal name, ingredient or food category, with ingredients and step-by-step instructions.',
        },
        { name: 'theme-color', content: '#f97316' },
        { property: 'og:site_name', content: 'Feast Finder' },
        { property: 'og:type', content: 'website' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: `${baseURL}favicon.ico` }],
    },
  },
});
