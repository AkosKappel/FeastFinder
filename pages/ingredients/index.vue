<template>
  <main class="container mx-auto px-4 min-h-screen">
    <IngredientList title="Ingredients" :ingredients="ingredients" />
  </main>
</template>

<script setup lang="ts">
import { useIngredients } from '@/composables/useIngredients';

const { ingredients, getIngredients } = useIngredients();

onMounted(async () => {
  await getIngredients();
});
</script>
