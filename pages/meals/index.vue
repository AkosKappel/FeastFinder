<template>
  <main class="container mx-auto px-4 min-h-screen">
    <MealsList title="Meals" :meals="meals" />
  </main>
</template>

<script setup lang="ts">
const { meals, getMeals } = useFetchMeals();

onMounted(() => {
  getMeals();
});
</script>
