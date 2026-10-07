<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-orange-700"
  >
    <img
      :src="`${meal.strMealThumb}/medium`"
      :srcset="mealImageSrcset(meal.strMealThumb)"
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      alt=""
      class="h-48 w-full bg-gray-300 object-cover object-center transition-transform duration-300 motion-safe:group-hover:scale-105"
      loading="lazy"
    />
    <div class="flex flex-1 items-start justify-between gap-2 p-4">
      <div>
        <h3 class="mb-2 text-xl font-semibold">
          <nuxt-link :to="`/meals/${meal.idMeal}`" class="after:absolute after:inset-0 focus:outline-none">
            {{ meal.strMeal }}
          </nuxt-link>
        </h3>
        <p v-if="meal.strCategory || meal.strCountry" class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          <span v-if="meal.strCategory" class="inline-flex items-center gap-1">
            <Tag class="h-4 w-4" aria-hidden="true" />
            <span class="sr-only">Category:</span> {{ meal.strCategory }}
          </span>
          <span v-if="meal.strCountry" class="inline-flex items-center gap-1">
            <Globe class="h-4 w-4" aria-hidden="true" />
            <span class="sr-only">Cuisine:</span> {{ meal.strCountry }}
          </span>
        </p>
      </div>
      <FavouriteButton :meal="meal" class="relative z-10 -mr-2 -mt-1 shrink-0" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { Globe, Tag } from '@lucide/vue';
import type { MealPreview } from '@/types/Meal';

defineProps<{ meal: MealPreview }>();
</script>
