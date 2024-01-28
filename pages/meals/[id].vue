<template>
  <div>
    <LoadingSpinner v-if="loading" title="Loading meal details..." />
    <section v-else-if="meal" class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-semibold mb-8 text-center">
        {{ meal.strMeal }}
      </h1>

      <div class="flex flex-col md:flex-row md:mx-8 gap-4">
        <div class="flex-1 md:w-2/3 w-2x1">
          <img :src="meal.strMealThumb" :alt="meal.strMeal" class="rounded-lg" />
        </div>
        <div class="flex-1 md:ml-8 md:w-1/3 w-full">
          <p v-if="meal.strCategory" class="mb-2 font-semibold">
            Category:
            <span class="text-gray-500 font-normal">{{ meal.strCategory }}</span>
          </p>
          <p v-if="meal.strArea" class="mb-2 font-semibold">
            Area:
            <span class="text-gray-500 font-normal">{{ meal.strArea }}</span>
          </p>
          <p v-if="meal.strTags" class="mb-2 font-semibold">
            Tags:
            <span class="text-gray-500 font-normal">{{ formatMealTags(meal) }}</span>
          </p>
          <p v-if="meal.strDrinkAlternate" class="mb-2 font-semibold">
            Drink Alternate:
            <span class="text-gray-500 font-normal">{{ meal.strDrinkAlternate }}</span>
          </p>
          <p v-if="meal.strYoutube" class="mb-2 font-semibold">
            Video:
            <a :href="meal.strYoutube" target="_blank" class="text-gray-500 font-normal hover:underline">
              {{ meal.strYoutube }}
            </a>
          </p>
          <p v-if="meal.strSource" class="mb-2 font-semibold">
            Source:
            <a :href="meal.strSource" target="_blank" class="text-gray-500 font-normal">{{ meal.strSource }}</a>
          </p>
          <h3 class="text-xl font-semibold mt-3 mb-2">Ingredients:</h3>
          <ul class="list-disc list-inside ml-4">
            <li v-for="ingredient in getIngredientsFromMeal(meal)" :key="ingredient.name" class="my-1">
              {{ ingredient.name }}
              <span class="italic text-gray-600 font-normal">({{ ingredient.measure }})</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="meal.strInstructions" class="mt-2 md:m-8">
        <h2 class="text-2xl font-semibold mb-2">Instructions</h2>
        <p>{{ meal.strInstructions }}</p>
      </div>
    </section>
    <section v-else class="container mx-auto px-4 py-8 text-center">
      <h2 class="text-3xl font-semibold mb-4">Meal not found</h2>
      <p class="text-lg text-gray-500">No meal found with ID {{ mealId }}.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getIngredientsFromMeal, formatMealTags } from '@/utils/helpers';

const route = useRoute();
const mealId = computed(() => route.params.id as string);
const { meal, getMeal, loading } = useMealById();

onMounted(() => {
  getMeal(mealId.value);
});
</script>
