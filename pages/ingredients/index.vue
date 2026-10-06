<template>
  <main class="container mx-auto px-4 min-h-screen">
    <IngredientList
      title="Ingredients"
      :ingredients="ingredients"
      :error="error"
      :allow-filter="true"
      @retry="getIngredients()"
    />
  </main>
</template>

<script setup lang="ts">
import { useIngredients } from '@/composables/useIngredients';

const { ingredients, error, getIngredients } = useIngredients();

useHead({ title: 'Ingredients' });

onMounted(async () => {
  await getIngredients();
});
</script>
