<template>
  <main class="container mx-auto px-4 min-h-screen">
    <MealList :title="title" :meals="meals" />
  </main>
</template>

<script setup lang="ts">
import { useMeals } from '@/composables/useMeals';

const route = useRoute();
const { meals, getMeals } = useMeals();

const query = computed(() => route.query.q as string);
const category = computed(() => route.query.category as string); // TODO
const title = computed(() => (query.value ? `Results for ${query.value}` : 'Meals'));

watch(
  () => query.value,
  async newQuery => await getMeals(newQuery as string),
  { immediate: true },
);
</script>
