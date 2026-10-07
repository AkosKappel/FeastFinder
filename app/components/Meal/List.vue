<template>
  <section class="my-8" :aria-busy="loading">
    <SectionHeading v-if="title" :title="title" :tag="headingTag" :more-to="moreTo" />
    <ErrorMessage v-if="error" @retry="$emit('retry')" />
    <CardGridSkeleton v-else-if="loading || !meals" :count="skeletonCount" />
    <template v-else>
      <p v-if="pageSize" class="mb-4 text-gray-600" aria-live="polite">{{ countLabel(meals.length, 'meal') }}</p>
      <MealGrid :meals="pageOfMeals" :empty-message="emptyMessage" />
      <Pagination v-if="pageSize" v-model="page" :total-pages="totalPages" label="Meal pages" />
    </template>
  </section>
</template>

<script setup lang="ts">
import type { MealPreview } from '@/types/Meal';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  headingTag: {
    type: String as PropType<'h1' | 'h2'>,
    default: 'h2',
  },
  moreTo: {
    type: String,
    default: '',
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
  // Shows the meal count and splits the list into pages kept in the URL; 0 shows every meal.
  pageSize: {
    type: Number,
    default: 0,
  },
});

defineEmits(['retry']);

const currentPage = usePageParam();
const totalPages = computed(() =>
  props.pageSize ? Math.max(1, Math.ceil((props.meals?.length ?? 0) / props.pageSize)) : 1,
);
const page = computed({
  get: () => Math.min(currentPage.value, totalPages.value),
  set: value => (currentPage.value = value),
});
const pageOfMeals = computed(() => {
  const meals = props.meals ?? [];
  return props.pageSize ? meals.slice((page.value - 1) * props.pageSize, page.value * props.pageSize) : meals;
});
</script>
