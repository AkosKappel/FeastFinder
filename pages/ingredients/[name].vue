<template>
  <main class="container mx-auto px-4 min-h-screen">
    <MealList :title="`Meals including ${ingredient}`" :meals="meals" />
  </main>
</template>

<script setup lang="ts">
import { useMealsByIngredient } from '@/composables/useMeals';

const route = useRoute();
const { meals, getMeals } = useMealsByIngredient();

const ingredient = computed(() => route.params.name as string);

watch(
  () => ingredient.value,
  async newIngredient => {
    if (newIngredient) {
      await getMeals(newIngredient as string);
    }
  },
  { immediate: true },
);
</script>
