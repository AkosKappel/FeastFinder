<template>
  <LoadingSpinner v-if="ingredients === null" :title="`Loading ${props.title.toLowerCase()}...`" />
  <section v-else class="container mx-auto px-4 my-8">
    <div class="flex justify-between flex-wrap">
      <h2 v-if="props.title" class="text-3xl font-semibold mb-4">
        {{ props.title }}
      </h2>
      <div class="flex items-center space-x-2 mb-4">
        <span v-for="letter in alphabet" :key="letter">
          <button
            class="text-lg font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-600"
            :class="{ 'text-orange-500 dark:text-orange-400': activeLetter === letter }"
            @click="activeLetter = letter === activeLetter ? '' : letter"
          >
            {{ letter.toUpperCase() }}
          </button>
        </span>
      </div>
      <div v-show="props.allowFilter" class="flex mb-4">
        <input
          v-model="search"
          type="text"
          class="w-full sm:w-64 px-4 py-2 rounded-lg shadow focus:outline-none focus:shadow-outline text-gray-600 font-medium"
          placeholder="Filter ingredients..."
        />
      </div>
    </div>
    <div v-if="filteredIngredients?.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <IngredientCard
        v-for="ingredient in filteredIngredients"
        :key="ingredient.idIngredient"
        :ingredient="ingredient"
      />
    </div>
    <p v-else class="text-lg text-gray-500">No ingredients found.</p>
  </section>
</template>

<script setup lang="ts">
import type { Ingredient } from '@/types/Ingredient';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const activeLetter = ref('');
const search = ref('');

const filteredIngredients = computed(() => {
  if (!props.ingredients) {
    return [];
  }

  const searchTerm = search.value.toLowerCase();

  const visibleIngredients = props.ingredients?.filter(ingredient => {
    const ingredientName = ingredient.strIngredient.toLowerCase();

    const startsWithLetter = activeLetter.value ? ingredientName.startsWith(activeLetter.value) : true;
    const includesSearchTerm = ingredientName.includes(searchTerm);

    return startsWithLetter && includesSearchTerm;
  });

  return visibleIngredients.sort((a, b) => a.strIngredient.localeCompare(b.strIngredient));
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
