<template>
  <header class="flex flex-wrap justify-between items-center gap-y-3 p-4 bg-white dark:bg-gray-900">
    <div class="flex space-x-4 ml-4 my-1">
      <nuxt-link to="/" class="flex items-center">
        <component :is="route.path === '/' ? 'h1' : 'span'" class="text-2xl font-bold whitespace-nowrap">Feast Finder</component>
      </nuxt-link>
    </div>
    <SearchBar class="order-last w-full md:order-none md:w-auto md:flex-1 md:max-w-md" @search="search" />

    <div class="relative lg:hidden" @keydown.esc="showDropdown = false">
      <button
        class="flex items-center px-3 py-2 border rounded text-gray-500 hover:text-orange-700"
        aria-controls="mobile-menu"
        :aria-expanded="showDropdown"
        @click="showDropdown = !showDropdown"
      >
        <span class="mr-1">Menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
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
      </ul>
    </div>

    <nav class="hidden lg:block mr-4 my-1" aria-label="Main">
      <ul class="flex space-x-4">
        <li v-for="link in links" :key="link.to" class="mx-1">
          <nuxt-link :to="link.to" :class="linkClass(link.to)">{{ link.label }}</nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const showDropdown = ref(false);

const links = [
  { to: '/meals', label: 'Meals' },
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/categories', label: 'Categories' },
  { to: '/random', label: 'Surprise me' },
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
