<template>
  <main class="container mx-auto px-4 min-h-screen">
    <MealList :title="`Meals including ${ingredient}`" :meals="meals" :error="error" @retry="getMeals(ingredient)" />
  </main>
</template>

<script setup lang="ts">
import { useMealsByIngredient } from '@/composables/useMeals';

const route = useRoute();
const { meals, error, getMeals } = useMealsByIngredient();

const ingredient = computed(() => route.params.name as string);

useHead({ title: () => `Meals including ${ingredient.value}` });

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
