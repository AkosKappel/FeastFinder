<template>
  <section v-if="meals.length" class="container mx-auto px-4 py-8">
    <h2 v-if="title" class="text-3xl font-semibold mb-4">
      {{ title }}
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <MealCard v-for="meal in meals" :key="meal.idMeal" :meal="meal" />
    </div>
  </section>
  <LoadingSpinner v-else :title="`Loading ${title.toLowerCase()}...`" />
</template>

<script setup lang="ts">
import type { Meal } from '@/types/Meal';

defineProps({
  title: {
    type: String,
    default: '',
  },
  meals: {
    type: Array as PropType<Meal[]>,
    default: [],
  },
});
</script>
