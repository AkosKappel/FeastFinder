<template>
  <div class="container mx-auto px-4">
    <IngredientList
      title="Ingredients"
      :ingredients="ingredients"
      :loading="pending"
      :error="Boolean(error)"
      :allow-filter="true"
      @retry="refresh()"
    />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Ingredients' });

const { data: ingredients, pending, error, refresh } = useAsyncData('ingredients', () => mealDb.getIngredients());
</script>
