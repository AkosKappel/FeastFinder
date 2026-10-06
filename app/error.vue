<template>
  <NuxtLayout>
    <section class="container mx-auto flex flex-col items-center px-4 py-16 text-center">
      <p class="text-6xl font-bold text-orange-700">{{ error.statusCode }}</p>
      <h1 class="mt-4 text-3xl font-semibold">{{ notFound ? 'Page not found' : 'Something went wrong' }}</h1>
      <p class="mt-2 max-w-md text-gray-600">
        {{
          notFound
            ? 'This page does not exist. Search for a meal or start from the home page.'
            : 'An unexpected error occurred. Try again from the home page.'
        }}
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2 font-semibold text-white hover:bg-orange-800"
          @click="clearError({ redirect: '/' })"
        >
          <House class="h-5 w-5" aria-hidden="true" />
          Home
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-gray-800 shadow-sm hover:bg-orange-50"
          @click="clearError({ redirect: '/meals' })"
        >
          <Search class="h-5 w-5" aria-hidden="true" />
          Browse meals
        </button>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { House, Search } from '@lucide/vue';
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);

useHead({ title: () => (notFound.value ? 'Page not found' : 'Error') });
</script>
