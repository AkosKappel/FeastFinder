<template>
  <main class="container mx-auto px-4 min-h-screen">
    <MealList :title="`${category} meals`" :meals="meals" />
  </main>
</template>

<script setup lang="ts">
import { useMealsByCategory } from '@/composables/useMeals';

const route = useRoute();
const { meals, getMeals } = useMealsByCategory();

const category = computed(() => route.params.name as string);

watch(
  () => category.value,
  async newCategory => {
    if (newCategory) {
      await getMeals(newCategory as string);
    }
  },
  { immediate: true },
);
</script>
