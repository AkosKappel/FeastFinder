<template>
  <div>
    <ErrorMessage v-if="error" class="container mx-auto px-4" @retry="refresh()" />
    <MealDetailsSkeleton v-else-if="pending" />
    <MealDetails v-else-if="meal" :meal="meal" />
    <section v-else class="container mx-auto px-4 py-8 text-center">
      <h1 class="text-3xl font-semibold mb-4">Meal not found</h1>
      <p class="text-lg text-gray-500">No meal found with ID {{ mealId }}.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const mealId = computed(() => route.params.id as string);

const {
  data: meal,
  pending,
  error,
  refresh,
} = useAsyncData('meal', () => mealDb.getMeal(mealId.value), {
  watch: [mealId],
});

useHead({ title: () => meal.value?.strMeal ?? (pending.value || error.value ? null : 'Meal not found') });
useSeoMeta({
  description: () => (meal.value ? mealDescription(meal.value) : undefined),
  ogTitle: () => meal.value?.strMeal,
  ogDescription: () => (meal.value ? mealDescription(meal.value) : undefined),
  ogImage: () => meal.value?.strMealThumb,
});
useHead({
  script: () =>
    meal.value ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(recipeJsonLd(meal.value)) }] : [],
});
</script>
