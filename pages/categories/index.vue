<template>
  <main class="container mx-auto px-4 min-h-screen">
    <CategoryList title="Meal Categories" :categories="categories" />
  </main>
</template>

<script setup lang="ts">
import { useCategories } from '@/composables/useCategories';

const { categories, getCategories } = useCategories();

onMounted(async () => {
  await getCategories();
});
</script>
