<template>
  <main class="container mx-auto px-4 min-h-screen">
    <MealList :title="`${category} meals`" :meals="meals" :error="error" @retry="getMeals(category)" />
  </main>
</template>

<script setup lang="ts">
import { useMealsByCategory } from '@/composables/useMeals';

const route = useRoute();
const { meals, error, getMeals } = useMealsByCategory();

const category = computed(() => route.params.name as string);

useHead({ title: () => `${category.value} meals` });

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
