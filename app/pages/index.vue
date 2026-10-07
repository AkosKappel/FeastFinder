<template>
  <div class="container mx-auto px-4">
    <section
      class="mx-4 mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-700 to-orange-900 px-6 py-12 text-white shadow-lg md:px-12 md:py-16"
    >
      <h1 class="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">Find your next favourite meal</h1>
      <p class="mt-4 max-w-xl text-lg text-orange-50">
        Recipes from around the world, with step-by-step instructions you can listen to while you cook.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <nuxt-link
          to="/meals"
          class="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-orange-800 hover:bg-orange-50"
        >
          <UtensilsCrossed class="h-5 w-5" aria-hidden="true" />
          Browse meals
        </nuxt-link>
        <nuxt-link
          v-for="action in actions"
          :key="action.to"
          :to="action.to"
          class="inline-flex items-center gap-2 rounded-lg border border-white/60 px-5 py-2.5 font-semibold hover:bg-white/10"
        >
          <component :is="action.icon" class="h-5 w-5" aria-hidden="true" />
          {{ action.label }}
        </nuxt-link>
      </div>
    </section>
    <MealList
      title="Recommended Meals"
      more-to="/meals"
      :meals="meals"
      :loading="mealsPending"
      :error="Boolean(mealsError)"
      :skeleton-count="4"
      @retry="refreshMeals()"
    />
    <CategoryList
      title="Food Categories"
      more-to="/categories"
      :categories="categories"
      :loading="categoriesPending"
      :error="Boolean(categoriesError)"
      :skeleton-count="4"
      @retry="refreshCategories()"
    />
    <IngredientList
      title="Best Ingredients"
      more-to="/ingredients"
      :ingredients="ingredients"
      :loading="ingredientsPending"
      :error="Boolean(ingredientsError)"
      :skeleton-count="4"
      @retry="refreshIngredients()"
    />
  </div>
</template>

<script setup lang="ts">
import { Globe, Refrigerator, Shuffle, UtensilsCrossed } from '@lucide/vue';

const actions = [
  { to: '/random', label: 'Surprise me', icon: Shuffle },
  { to: '/fridge', label: "What's in my fridge?", icon: Refrigerator },
  { to: '/cuisines', label: 'Cuisines', icon: Globe },
];

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
