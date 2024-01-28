<template>
  <LoadingSpinner v-if="ingredients === null" :title="`Loading ${title.toLowerCase()}...`" />
  <section v-else class="container mx-auto px-4 py-8">
    <h2 v-if="title" class="text-3xl font-semibold mb-4">
      {{ title }}
    </h2>
    <div v-if="ingredients.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <IngredientCard v-for="ingredient in ingredients" :key="ingredient.idIngredient" :ingredient="ingredient" />
    </div>
    <p v-else class="text-lg text-gray-500">No ingredients found.</p>
  </section>
</template>

<script setup lang="ts">
import type { Ingredient } from '@/types/Ingredient';

defineProps({
  title: {
    type: String,
    default: '',
  },
  ingredients: {
    type: Array as PropType<Ingredient[] | null>,
    default: null,
  },
});
</script>
