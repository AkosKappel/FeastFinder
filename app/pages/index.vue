<template>
  <div class="container mx-auto px-4">
    <MealList
      title="Recommended Meals"
      :meals="meals"
      :loading="mealsPending"
      :error="Boolean(mealsError)"
      :skeleton-count="4"
      @retry="refreshMeals()"
    />
    <CategoryList
      title="Food Categories"
      :categories="categories"
      :loading="categoriesPending"
      :error="Boolean(categoriesError)"
      :skeleton-count="4"
      @retry="refreshCategories()"
    />
    <IngredientList
      title="Best Ingredients"
      :ingredients="ingredients"
      :loading="ingredientsPending"
      :error="Boolean(ingredientsError)"
      :skeleton-count="4"
      @retry="refreshIngredients()"
    />
  </div>
</template>

<script setup lang="ts">
const {
  data: meals,
  pending: mealsPending,
  error: mealsError,
  refresh: refreshMeals,
} = useAsyncData('home-meals', () => mealDb.getRandomMeals(4));

const {
  data: categories,
  pending: categoriesPending,
  error: categoriesError,
  refresh: refreshCategories,
} = useAsyncData('home-categories', async () => pickRandom(await mealDb.getCategories(), 4));

const {
  data: ingredients,
  pending: ingredientsPending,
  error: ingredientsError,
  refresh: refreshIngredients,
} = useAsyncData('home-ingredients', async () => pickRandom(await mealDb.getIngredients(), 4));
</script>
