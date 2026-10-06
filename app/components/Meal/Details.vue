<template>
  <section class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-semibold mb-8 text-center text-orange-600">
      {{ meal.strMeal }}
    </h1>

    <div class="flex flex-col md:flex-row md:mx-8 gap-4">
      <div class="flex-1 md:w-2/3 w-full">
        <img
          :src="meal.strMealThumb"
          :alt="meal.strMeal"
          width="700"
          height="700"
          fetchpriority="high"
          class="w-full h-auto rounded-lg bg-gray-300"
        />
      </div>
      <div class="flex-1 md:ml-8 md:w-1/3 w-full">
        <p v-if="meal.strCategory" class="mb-2 font-semibold">
          Category:
          <span class="text-gray-500 font-normal">{{ meal.strCategory }}</span>
        </p>
        <p v-if="meal.strArea" class="mb-2 font-semibold">
          Area:
          <span class="text-gray-500 font-normal">{{ meal.strArea }}</span>
        </p>
        <p v-if="meal.strTags" class="mb-2 font-semibold">
          Tags:
          <span class="text-gray-500 font-normal">{{ formatMealTags(meal) }}</span>
        </p>
        <p v-if="meal.strMealAlternate" class="mb-2 font-semibold">
          Also known as:
          <span class="text-gray-500 font-normal">{{ meal.strMealAlternate }}</span>
        </p>
        <p v-if="meal.strYoutube" class="mb-2 font-semibold">
          Video:
          <a :href="meal.strYoutube" target="_blank" rel="noopener noreferrer" class="text-gray-500 font-normal hover:underline">
            {{ meal.strYoutube }}
          </a>
        </p>
        <p v-if="meal.strSource" class="mb-2 font-semibold">
          Source:
          <a :href="meal.strSource" target="_blank" rel="noopener noreferrer" class="text-gray-500 font-normal">{{ meal.strSource }}</a>
        </p>
        <h3 class="text-xl font-semibold mt-3 mb-2">Ingredients:</h3>
        <ul class="list-disc list-inside ml-4">
          <li v-for="ingredient in getIngredientsFromMeal(meal)" :key="ingredient.name" class="my-1">
            {{ ingredient.name }}
            <span v-if="ingredient.measure" class="italic text-gray-600 font-normal">({{ ingredient.measure }})</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="meal.strInstructions" class="mt-2 md:m-8">
      <h2 class="text-2xl font-semibold mb-2">Instructions</h2>
      <p class="whitespace-pre-line">{{ meal.strInstructions }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Meal } from '@/types/Meal';
import { getIngredientsFromMeal, formatMealTags } from '@/utils/helpers';

defineProps({
  meal: {
    type: Object as PropType<Meal>,
    required: true,
  },
});
</script>
