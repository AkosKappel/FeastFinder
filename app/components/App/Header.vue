<template>
  <header class="flex flex-wrap justify-between items-center gap-y-3 p-4 bg-white">
    <div class="flex space-x-4 ml-4 my-1">
      <nuxt-link to="/" class="flex items-center gap-2">
        <img src="/favicon.svg" class="h-8 w-8" alt="" />
        <span class="text-2xl font-bold whitespace-nowrap">Feast Finder</span>
      </nuxt-link>
    </div>
    <SearchBar class="order-last w-full md:order-none md:w-auto md:flex-1 md:max-w-md" @search="search" />

    <div ref="menu" class="relative xl:hidden" @keydown.esc="showDropdown = false">
      <button
        class="flex items-center px-3 py-2 border rounded text-gray-500 hover:text-orange-700"
        aria-controls="mobile-menu"
        :aria-expanded="showDropdown"
        @click="showDropdown = !showDropdown"
      >
        <span class="mr-1">Menu</span>
        <MenuIcon class="h-5 w-5" aria-hidden="true" />
      </button>
      <ul
        v-show="showDropdown"
        id="mobile-menu"
        class="absolute right-0 z-40 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
      >
        <li v-for="link in links" :key="link.to">
          <nuxt-link :to="link.to" class="block px-4 py-2 hover:bg-gray-100" :class="linkClass(link.to)">
            {{ link.label }}
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/random" class="block px-4 py-2 hover:bg-gray-100" :class="linkClass('/random')">
            Surprise me
          </nuxt-link>
        </li>
      </ul>
    </div>

    <nav class="hidden xl:block mr-4 my-1" aria-label="Main">
      <ul class="flex items-center space-x-4">
        <li v-for="link in links" :key="link.to" class="mx-1">
          <nuxt-link :to="link.to" :class="linkClass(link.to)">{{ link.label }}</nuxt-link>
        </li>
        <li class="mx-1">
          <nuxt-link to="/random" title="Surprise me" :class="linkClass('/random')" class="flex items-center">
            <Shuffle class="h-5 w-5" aria-hidden="true" />
            <span class="sr-only">Surprise me</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { Menu as MenuIcon, Shuffle } from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const showDropdown = ref(false);
const menu = useTemplateRef<HTMLElement>('menu');
onClickOutside(menu, () => (showDropdown.value = false));

const links = [
  { to: '/meals', label: 'Meals' },
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/categories', label: 'Categories' },
  { to: '/cuisines', label: 'Cuisines' },
  { to: '/favourites', label: 'Favourites' },
  { to: '/about', label: 'About' },
];

watch(
  () => route.fullPath,
  () => (showDropdown.value = false),
);

const linkClass = (path: string) =>
  route.path.startsWith(path) ? 'text-lg text-orange-700' : 'text-lg text-gray-600 hover:text-orange-700';

const search = (query: string) => {
  router.push(query ? { path: '/meals', query: { q: query } } : '/meals');
};
</script>
