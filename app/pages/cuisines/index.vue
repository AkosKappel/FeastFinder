<template>
  <div class="container mx-auto px-4">
    <section class="my-8" :aria-busy="pending">
      <h1 class="mb-2 text-3xl font-semibold">Cuisines</h1>
      <p class="mb-6 text-gray-600">
        Meals from {{ cuisines.length || 'many' }} countries. Pick one to see its dishes.
      </p>
      <ErrorMessage v-if="error" @retry="refresh()" />
      <div v-else-if="pending" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" aria-hidden="true">
        <div v-for="n in 15" :key="n" class="h-16 rounded-lg bg-white shadow-sm motion-safe:animate-pulse"></div>
      </div>
      <ul v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <li v-for="cuisine in cuisines" :key="cuisine.country">
          <nuxt-link
            :to="`/cuisines/${encodeURIComponent(cuisine.country)}`"
            class="flex h-full items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <img
              v-if="cuisine.countryCode"
              :src="flagUrl(cuisine.countryCode)"
              alt=""
              width="40"
              height="40"
              loading="lazy"
              class="h-10 w-10 shrink-0 object-contain"
            />
            <Globe v-else class="h-10 w-10 shrink-0 p-1.5 text-gray-500" aria-hidden="true" />
            <span>
              <span class="block font-semibold leading-tight">{{ cuisine.country }}</span>
              <span class="text-sm text-gray-600">{{ countLabel(cuisine.mealCount, 'meal') }}</span>
            </span>
          </nuxt-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Globe } from '@lucide/vue';

useHead({ title: 'Cuisines' });

const { data: meals, pending, error, refresh } = useAsyncData('meal-index', () => loadMealIndex());
const cuisines = computed(() => cuisinesOf(meals.value ?? []));
</script>
