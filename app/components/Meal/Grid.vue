<template>
  <div v-if="meals.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <MealCard v-for="meal in meals" :key="meal.idMeal" :meal="meal" />
  </div>
  <EmptyState v-else :icon="SearchX" :message="emptyMessage" />
</template>

<script setup lang="ts">
import { SearchX } from '@lucide/vue';
import type { MealPreview } from '@/types/Meal';

defineProps({
  meals: {
    type: Array as PropType<MealPreview[]>,
    required: true,
  },
  emptyMessage: {
    type: String,
    default: 'No meals found.',
  },
});
</script>
