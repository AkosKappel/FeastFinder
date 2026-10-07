<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-bay-100 transition-shadow duration-300 focus-within:ring-2 focus-within:ring-orange-600 hover:shadow-lg"
  >
    <img
      :src="`${meal.strMealThumb}/medium`"
      :srcset="mealImageSrcset(meal.strMealThumb)"
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      alt=""
      class="aspect-[4/3] w-full bg-bay-100 object-cover object-center transition-transform duration-300 motion-safe:group-hover:scale-105"
      loading="lazy"
      @error="onImageError"
    />
    <div class="flex flex-1 items-start justify-between gap-2 p-4">
      <div>
        <component :is="headingTag" class="mb-2 text-lg font-semibold leading-snug">
          <nuxt-link :to="`/meals/${meal.idMeal}`" class="after:absolute after:inset-0 focus:outline-hidden">
            {{ meal.strMeal }}
          </nuxt-link>
        </component>
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

const headingTag = useCardHeading();

defineProps<{ meal: MealPreview }>();

const { onImageError } = usePlaceholderImage();
</script>
