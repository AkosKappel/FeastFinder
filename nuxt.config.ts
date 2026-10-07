// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

const baseURL = '/FeastFinder/';

export default defineNuxtConfig({
  compatibilityDate: '2026-10-06',
  devtools: { enabled: true },
  // GitHub Pages serves static files only: render in the browser so the generated 404.html
  // fallback can boot the app on any deep link, e.g. /meals/52772.
  ssr: false,
  modules: ['@vueuse/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/tailwind.css'],
  vite: { plugins: [tailwindcss()] },
  app: {
    baseURL,
    buildAssetsDir: 'assets',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Feast Finder',
      meta: [
        {
          name: 'description',
          content:
            'Find recipes by meal name, ingredient or food category, with ingredients and step-by-step instructions.',
        },
        { name: 'theme-color', content: '#17332c' },
        { property: 'og:site_name', content: 'Feast Finder' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        { rel: 'icon', href: `${baseURL}favicon.ico`, sizes: '32x32' },
        { rel: 'apple-touch-icon', href: `${baseURL}apple-touch-icon.png` },
        { rel: 'manifest', href: `${baseURL}site.webmanifest` },
      ],
    },
  },
});
