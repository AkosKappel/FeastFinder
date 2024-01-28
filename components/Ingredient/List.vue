<template>
  <LoadingSpinner v-if="ingredients === null" :title="`Loading ${props.title.toLowerCase()}...`" />
  <section v-else class="container mx-auto px-4 my-8">
    <div class="flex justify-between flex-wrap">
      <h2 v-if="props.title" class="text-3xl font-semibold mb-4">
        {{ props.title }}
      </h2>
      <div v-show="props.allowFilter" class="flex mb-4">
        <input
          v-model="search"
          type="text"
          class="w-full sm:w-64 px-4 py-2 rounded-lg shadow focus:outline-none focus:shadow-outline text-gray-600 font-medium"
          placeholder="Filter ingredients..."
        />
      </div>
    </div>
    <div v-if="ingredients?.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <IngredientCard v-for="ingredient in ingredients" :key="ingredient.idIngredient" :ingredient="ingredient" />
    </div>
    <p v-else class="text-lg text-gray-500">No ingredients found.</p>
  </section>
</template>

<script setup lang="ts">
import type { Ingredient } from '@/types/Ingredient';

const search = ref('');

const ingredients = computed(() => {
  if (search.value === '') {
    return props.ingredients;
  }

  const term = search.value.toLowerCase();
  return props.ingredients?.filter(ingredient => ingredient.strIngredient.toLowerCase().includes(term));
});

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  ingredients: {
    type: Array as PropType<Ingredient[] | null>,
    default: null,
  },
  allowFilter: {
    type: Boolean,
    default: false,
  },
});
</script>
