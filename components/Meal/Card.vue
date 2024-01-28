<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
  >
    <nuxt-img
      :src="meal.strMealThumb"
      :alt="meal.strMeal"
      class="w-full h-48 object-cover object-center"
      placeholder="/meal-placeholder.png"
    />
    <div class="p-4 flex flex-col justify-between">
      <div class="mb-1">
        <h2 class="text-xl font-semibold mb-2">{{ meal.strMeal }}</h2>
        <p v-if="meal.strCategory" class="text-gray-600 mb-2">Category: {{ meal.strCategory }}</p>
        <p v-if="meal.strArea" class="text-gray-600 mb-2">Area: {{ meal.strArea }}</p>
      </div>
      <nuxt-link
        :to="'/meals/' + meal.idMeal"
        class="block text-center bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600"
        :meal="meal"
      >
        View Details
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Meal } from '@/types/Meal';

defineProps({
  meal: {
    type: Object as PropType<Meal>,
    required: true,
  },
});
</script>
