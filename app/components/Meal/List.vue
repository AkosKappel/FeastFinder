<template>
  <section class="container mx-auto px-4 my-8" :aria-busy="loading">
    <component :is="headingTag" v-if="title" class="text-3xl font-semibold mb-4">{{ title }}</component>
    <ErrorMessage v-if="error" @retry="$emit('retry')" />
    <CardGridSkeleton v-else-if="loading || !meals" :count="skeletonCount" />
    <div v-else-if="meals.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <MealCard v-for="meal in meals" :key="meal.idMeal" :meal="meal" />
    </div>
    <p v-else class="text-lg text-gray-600">{{ emptyMessage }}</p>
  </section>
</template>

<script setup lang="ts">
import type { MealPreview } from '@/types/Meal';

defineProps({
  title: {
    type: String,
    default: '',
  },
  headingTag: {
    type: String as PropType<'h1' | 'h2'>,
    default: 'h2',
  },
  meals: {
    type: Array as PropType<MealPreview[] | null>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  skeletonCount: {
    type: Number,
    default: 8,
  },
  emptyMessage: {
    type: String,
    default: 'No meals found.',
  },
});

defineEmits(['retry']);
</script>
