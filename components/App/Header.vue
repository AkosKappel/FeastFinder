<template>
  <header class="flex justify-between items-center p-4 bg-white dark:bg-gray-900">
    <div class="flex space-x-4 ml-4 my-1">
      <nuxt-link to="/" class="flex items-center">
        <h1 class="text-2xl font-bold whitespace-nowrap dark:text-orange-500">Feast Finder</h1>
      </nuxt-link>
    </div>
    <SearchBar @search="search" />

    <div class="md:hidden">
      <button
        class="flex items-center px-3 py-2 border rounded text-gray-500 hover:text-orange-500"
        @click="showDropdown = !showDropdown"
      >
        <span class="mr-1">Menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <ul v-show="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
        <li class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <nuxt-link to="/meals" :class="activeLinkClass('/meals')"> Meals </nuxt-link>
        </li>
        <li class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <nuxt-link to="/ingredients" :class="activeLinkClass('/ingredients')"> Ingredients </nuxt-link>
        </li>
        <li class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <nuxt-link to="/categories" :class="activeLinkClass('/categories')"> Categories </nuxt-link>
        </li>
        <li class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <nuxt-link to="/about" :class="activeLinkClass('/about')"> About </nuxt-link>
        </li>
      </ul>
    </div>

    <ul class="hidden md:flex space-x-4 mr-4 my-1">
      <li class="mx-1">
        <nuxt-link to="/meals" :class="activeLinkClass('/meals')"> Meals </nuxt-link>
      </li>
      <li class="mx-1">
        <nuxt-link to="/ingredients" :class="activeLinkClass('/ingredients')"> Ingredients </nuxt-link>
      </li>
      <li class="mx-1">
        <nuxt-link to="/categories" :class="activeLinkClass('/categories')"> Categories </nuxt-link>
      </li>
      <li class="mx-1">
        <nuxt-link to="/about" :class="activeLinkClass('/about')"> About </nuxt-link>
      </li>
    </ul>
  </header>
</template>

<script setup lang="ts">
const router = useRouter();
const showDropdown = ref(false);

const activeLinkClass = (path: string) => {
  return (
    'text-lg font-inter text-gray-400 hover:text-orange-500' +
    (router.currentRoute.value.path === path ? ' text-orange-500' : '')
  );
};

const search = (input: string) => {
  router.push({ path: '/meals', query: { q: input } });
};
</script>
