<template>
  <main class="container mx-auto px-4 min-h-screen">
    <CategoryList title="Categories" :categories="categories" :error="error" @retry="getCategories()" />
  </main>
</template>

<script setup lang="ts">
import { useCategories } from '@/composables/useCategories';

const { categories, error, getCategories } = useCategories();

useHead({ title: 'Categories' });

onMounted(async () => {
  await getCategories();
});
</script>
