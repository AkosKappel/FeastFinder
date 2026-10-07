<template>
  <div class="container mx-auto max-w-5xl px-4 py-10">
    <header class="text-center">
      <h1 class="text-4xl font-bold md:text-5xl">About Feast Finder</h1>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-700">
        A recipe finder for the question "what should I cook today?". Search by meal name, browse by ingredient,
        category or cuisine, and follow the recipe step by step.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <nuxt-link
          to="/meals"
          class="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-5 py-2.5 font-semibold text-white hover:bg-orange-800"
        >
          <UtensilsCrossed class="h-5 w-5" aria-hidden="true" />
          Browse meals
        </nuxt-link>
        <a
          href="https://github.com/AkosKappel/FeastFinder"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-gray-800 shadow-xs hover:bg-orange-50"
        >
          <Code class="h-5 w-5" aria-hidden="true" />
          Source code
        </a>
      </div>
    </header>

    <section class="mt-14" aria-labelledby="features-heading">
      <h2 id="features-heading" class="mb-6 text-2xl font-semibold">What it does</h2>
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="feature in features" :key="feature.title" class="rounded-lg bg-white p-5 shadow-xs">
          <component :is="feature.icon" class="h-7 w-7 text-orange-700" aria-hidden="true" />
          <h3 class="mt-3 text-lg font-semibold">{{ feature.title }}</h3>
          <p class="mt-1 text-gray-700">{{ feature.text }}</p>
        </li>
      </ul>
    </section>

    <section class="mt-14 grid gap-8 md:grid-cols-2" aria-labelledby="how-heading">
      <div>
        <h2 id="how-heading" class="mb-4 text-2xl font-semibold">How it works</h2>
        <ul class="space-y-3 text-gray-700">
          <li v-for="point in howItWorks" :key="point" class="flex gap-3">
            <Check class="mt-1 h-5 w-5 shrink-0 text-orange-700" aria-hidden="true" />
            <span>{{ point }}</span>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mb-4 text-2xl font-semibold">Built with</h2>
        <ul class="flex flex-wrap gap-2">
          <li v-for="tool in stack" :key="tool.name">
            <a
              :href="tool.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block rounded-full bg-white px-4 py-1.5 font-medium text-gray-800 shadow-xs hover:text-orange-700"
            >
              {{ tool.name }}
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section class="mt-14 rounded-lg bg-white p-6 shadow-xs md:p-8" aria-labelledby="author-heading">
      <h2 id="author-heading" class="text-2xl font-semibold">Who made it</h2>
      <p class="mt-3 text-gray-700">
        Feast Finder is a portfolio project by Ákos Kappel. It started in January 2024 and was rebuilt in 2026 on Nuxt 4
        with tests, accessibility improvements and a new design.
      </p>
      <div class="mt-5 flex flex-wrap gap-3">
        <a
          v-for="link in authorLinks"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-800 hover:bg-orange-50"
        >
          <ExternalLink class="h-4 w-4" aria-hidden="true" />
          {{ link.label }}
        </a>
      </div>
    </section>

    <section class="mt-14" aria-labelledby="data-heading">
      <h2 id="data-heading" class="mb-3 text-2xl font-semibold">Data and limits</h2>
      <p class="text-gray-700">
        All recipes, photos and ingredient images come from
        <a
          href="https://www.themealdb.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-orange-800 underline"
          >TheMealDB</a
        >, a free, community-built recipe database. Feast Finder uses its public test key, which is meant for
        development and education. Recipes are in English, measures are as written by the contributors, and some meals
        have no video or source link.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Check, Code, ExternalLink, Heart, Search, Share2, Smartphone, UtensilsCrossed, Volume2 } from '@lucide/vue';

useHead({ title: 'About' });

const features = [
  {
    icon: Search,
    title: 'Search and browse',
    text: 'Find meals by name, or browse by ingredient, category and cuisine.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Step-by-step recipes',
    text: 'Ingredients with measures, numbered steps and the cooking video when there is one.',
  },
  {
    icon: Volume2,
    title: 'Read aloud',
    text: 'Hands full? Let the browser read the instructions and follow the highlighted step.',
  },
  {
    icon: Heart,
    title: 'Favourites',
    text: 'Save meals with one tap. They stay in your browser, no account needed.',
  },
  {
    icon: Share2,
    title: 'Share and print',
    text: 'Send a recipe with your phone’s share sheet, copy the link, or print a clean copy.',
  },
  {
    icon: Smartphone,
    title: 'Works everywhere',
    text: 'Designed for phones and desktops, usable with a keyboard and screen readers.',
  },
];

const howItWorks = [
  'A static single-page app built with Nuxt and hosted on GitHub Pages.',
  'Recipe data is loaded in your browser from TheMealDB and cached for 30 minutes, so browsing back and forth is instant.',
  'No accounts and no tracking. Favourites are stored only in this browser.',
  'Every change is type-checked, tested and deployed automatically by GitHub Actions.',
];

const stack = [
  { name: 'Nuxt 4', href: 'https://nuxt.com/' },
  { name: 'Vue 3', href: 'https://vuejs.org/' },
  { name: 'TypeScript', href: 'https://www.typescriptlang.org/' },
  { name: 'Tailwind CSS', href: 'https://tailwindcss.com/' },
  { name: 'VueUse', href: 'https://vueuse.org/' },
  { name: 'Lucide icons', href: 'https://lucide.dev/' },
  { name: 'Vitest', href: 'https://vitest.dev/' },
  { name: 'GitHub Pages', href: 'https://pages.github.com/' },
];

const authorLinks = [
  { label: 'GitHub', href: 'https://github.com/AkosKappel' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/%C3%A1kos-kappel-b53344220' },
];
</script>
