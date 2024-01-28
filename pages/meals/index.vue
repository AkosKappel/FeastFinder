<template>
  <main class="container mx-auto px-4 min-h-screen">
    <MealsList :title="title" :meals="meals" />
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const { meals, getMeals } = useFetchMeals();
const query = computed(() => route.query.q as string);
const title = computed(() => (query.value ? `Results for ${query.value}` : 'Meals'));

watch(
  () => query.value,
  async newQuery => await getMeals(newQuery as string),
  { immediate: true },
);
</script>
