<template>
  <LoadingSpinner v-if="meals === null" :title="`Loading ${title.toLowerCase()}...`" />
  <section v-else class="container mx-auto px-4 py-8">
    <h2 v-if="title" class="text-3xl font-semibold mb-4">
      {{ title }}
    </h2>
    <div v-if="meals.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <MealCard v-for="meal in meals" :key="meal.idMeal" :meal="meal" />
    </div>
    <p v-else class="text-lg text-gray-500">No meals found.</p>
  </section>
</template>

<script setup lang="ts">
import type { Meal } from '@/types/Meal';

defineProps({
  title: {
    type: String,
    default: '',
  },
  meals: {
    type: Array as PropType<Meal[] | null>,
    default: null,
  },
});
</script>
