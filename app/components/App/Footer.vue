<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="mx-auto w-full max-w-screen-xl px-4 py-10 lg:py-12">
      <div class="grid grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div class="col-span-2 md:col-span-1">
          <nuxt-link to="/" class="inline-flex items-center gap-3">
            <img src="/meal-icon.png" class="h-9 w-9" alt="" />
            <span class="text-2xl font-semibold text-white">Feast Finder</span>
          </nuxt-link>
          <p class="mt-4 max-w-sm">
            Find your next meal by name, ingredient, category or cuisine, then cook it step by step.
          </p>
          <div class="mt-6 flex gap-3">
            <a
              v-for="profile in profiles"
              :key="profile.label"
              :href="profile.href"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full bg-gray-800 p-2.5 text-gray-300 transition-colors hover:bg-orange-700 hover:text-white"
            >
              <svg
                class="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                :viewBox="profile.viewBox"
              >
                <path fill-rule="evenodd" clip-rule="evenodd" :d="profile.icon" />
              </svg>
              <span class="sr-only">{{ profile.label }}</span>
            </a>
          </div>
        </div>

        <nav v-for="group in linkGroups" :key="group.title" :aria-label="group.title">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{{ group.title }}</h2>
          <ul class="space-y-3">
            <li v-for="link in group.links" :key="link.label">
              <nuxt-link v-if="link.to" :to="link.to" class="inline-flex items-center gap-2 hover:text-white">
                <component :is="link.icon" class="h-4 w-4 text-orange-400" aria-hidden="true" />
                {{ link.label }}
              </nuxt-link>
              <a
                v-else
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 hover:text-white"
              >
                <component :is="link.icon" class="h-4 w-4 text-orange-400" aria-hidden="true" />
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div
        class="mt-10 flex flex-col gap-4 border-t border-gray-800 pt-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          © {{ year }} Ákos Kappel. Recipe data and images from
          <a
            href="https://www.themealdb.com/"
            class="underline hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
            >TheMealDB</a
          >.
        </p>
        <button type="button" class="inline-flex items-center gap-1 self-start hover:text-white" @click="scrollToTop">
          <ArrowUp class="h-4 w-4" aria-hidden="true" />
          Back to top
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  ArrowUp,
  Carrot,
  Code,
  Database,
  Globe,
  Heart,
  Info,
  LayoutGrid,
  Refrigerator,
  Shuffle,
  UtensilsCrossed,
} from '@lucide/vue';

const year = new Date().getFullYear();

const profiles = [
  {
    label: 'GitHub profile',
    href: 'https://github.com/AkosKappel',
    viewBox: '0 0 20 20',
    icon: 'M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z',
  },
  {
    label: 'LinkedIn profile',
    href: 'https://www.linkedin.com/in/%C3%A1kos-kappel-b53344220',
    viewBox: '0 0 24 24',
    icon: 'M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5ZM8 19H5V8h3v11ZM6.5 6.73a1.76 1.76 0 1 1 0-3.53 1.76 1.76 0 0 1 0 3.53ZM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.76c1.4-2.59 7-2.78 7 2.47V19Z',
  },
];

const linkGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Meals', to: '/meals', icon: UtensilsCrossed },
      { label: 'Ingredients', to: '/ingredients', icon: Carrot },
      { label: 'Categories', to: '/categories', icon: LayoutGrid },
      { label: 'Cuisines', to: '/cuisines', icon: Globe },
      { label: "What's in my fridge?", to: '/fridge', icon: Refrigerator },
      { label: 'Surprise me', to: '/random', icon: Shuffle },
      { label: 'Favourites', to: '/favourites', icon: Heart },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'About', to: '/about', icon: Info },
      { label: 'Source code', href: 'https://github.com/AkosKappel/FeastFinder', icon: Code },
      { label: 'TheMealDB API', href: 'https://www.themealdb.com/api.php', icon: Database },
    ],
  },
];

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
</script>
