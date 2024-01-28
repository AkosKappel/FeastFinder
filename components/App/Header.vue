<template>
  <header class="flex justify-between items-center p-4 bg-white dark:bg-gray-900">
    <div class="flex space-x-4 ml-4 my-1">
      <nuxt-link to="/" class="flex items-center">
        <h1 class="text-2xl font-bold whitespace-nowrap dark:text-orange-500">Feast Finder</h1>
      </nuxt-link>
    </div>
    <SearchBar @search="search" />
    <ul class="flex space-x-4 mr-4 my-1">
      <li class="mx-1 hidden md:block">
        <nuxt-link to="/meals" class="text-lg font-inter text-gray-400 hover:text-orange-500"> Meals </nuxt-link>
      </li>
      <li class="mx-1 hidden md:block">
        <nuxt-link to="/ingredients" class="text-lg font-inter text-gray-400 hover:text-orange-500"> Ingredients </nuxt-link>
      </li>
      <li class="mx-1 hidden md:block">
        <nuxt-link to="/categories" class="text-lg font-inter text-gray-400 hover:text-orange-500"> Categories </nuxt-link>
      </li>
      <li class="mx-1 hidden md:block">
        <nuxt-link to="/about" class="text-lg font-inter text-gray-400 hover:text-orange-500"> About </nuxt-link>
      </li>
    </ul>
  </header>
</template>

<script setup lang="ts">
const router = useRouter();

const search = (input: string) => {
  router.push({ path: '/meals', query: { q: input } });
};
</script>
