<template>
  <section class="my-8" :aria-busy="loading">
    <SectionHeading v-if="title" :title="title" :tag="headingTag" :more-to="moreTo" />
    <ErrorMessage v-if="error" @retry="$emit('retry')" />
    <CardGridSkeleton v-else-if="loading || !categories" :count="skeletonCount" />
    <div v-else-if="categories.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <BrowseCard
        v-for="category in categories"
        :key="category.idCategory"
        :title="category.strCategory"
        :image="category.strCategoryThumb"
        :description="category.strCategoryDescription"
        :to="`/categories/${encodeURIComponent(category.strCategory)}`"
      />
    </div>
    <p v-else class="text-lg text-gray-600">No categories found.</p>
  </section>
</template>

<script setup lang="ts">
import type { Category } from '@/types/Category';

defineProps({
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
  categories: {
    type: Array as PropType<Category[] | null>,
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
});

defineEmits(['retry']);
</script>
