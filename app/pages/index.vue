<template>
  <div>
    <section class="surface-dark bg-bay-900 text-white">
      <div class="container mx-auto grid items-center gap-10 px-4 pb-14 pt-10 lg:grid-cols-[3fr_2fr] md:pb-20 md:pt-14">
        <div>
          <h1 class="max-w-xl text-4xl font-bold leading-[1.05] md:text-6xl">What are we cooking today?</h1>
          <p class="mt-5 max-w-lg text-lg text-bay-100">
            Pick a dish, gather the ingredients and follow the steps. The page can read them out while your hands are
            busy.
          </p>
          <div class="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <nuxt-link
              to="/meals"
              class="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-700 px-5 py-3 font-semibold text-white hover:bg-orange-600 focus-visible:ring-offset-bay-900"
            >
              <UtensilsCrossed class="h-5 w-5" aria-hidden="true" />
              Browse meals
            </nuxt-link>
            <nuxt-link
              v-for="action in actions"
              :key="action.to"
              :to="action.to"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-bay-800 px-4 py-3 text-center font-semibold leading-tight text-bay-50 last:col-span-2 sm:px-5 hover:bg-bay-700 focus-visible:ring-offset-bay-900"
            >
              <component :is="action.icon" class="h-5 w-5 text-saffron" aria-hidden="true" />
              {{ action.label }}
            </nuxt-link>
          </div>
        </div>

        <!-- Today's picks as a stack of plates: the one bold element of the page. -->
        <ul v-if="meals?.length" class="relative hidden h-72 lg:block" aria-label="Today's picks">
          <li
            v-for="(meal, index) in meals.slice(0, 3)"
            :key="meal.idMeal"
            class="absolute w-56 transition-transform duration-300 hover:z-10 motion-safe:hover:-translate-y-2 lg:w-64"
            :class="plateClasses[index]"
          >
            <nuxt-link :to="`/meals/${meal.idMeal}`" class="block rounded-2xl" :aria-label="meal.strMeal">
              <img
                :src="`${meal.strMealThumb}/medium`"
                alt=""
                width="350"
                height="350"
                class="aspect-square w-full rounded-2xl object-cover shadow-2xl ring-4 ring-bay-900"
              />
            </nuxt-link>
          </li>
        </ul>
      </div>
    </section>

    <div class="container mx-auto px-4">
      <MealList
        title="Recommended meals"
        more-to="/meals"
        :meals="meals"
        :loading="mealsPending"
        :error="Boolean(mealsError)"
        :skeleton-count="4"
        @retry="refreshMeals()"
      />
      <CategoryList
        title="Food categories"
        more-to="/categories"
        :categories="categories"
        :loading="categoriesPending"
        :error="Boolean(categoriesError)"
        :skeleton-count="4"
        @retry="refreshCategories()"
      />
      <IngredientList
        title="Ingredients to explore"
        more-to="/ingredients"
        :ingredients="ingredients"
        :loading="ingredientsPending"
        :error="Boolean(ingredientsError)"
        :skeleton-count="4"
        @retry="refreshIngredients()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Globe, Refrigerator, Shuffle, UtensilsCrossed } from '@lucide/vue';

// Cards sit under the h2 sections of this page.
provideCardHeading('h3');

const plateClasses = ['left-0 top-6 -rotate-6', 'left-1/4 top-0 rotate-3', 'right-0 top-16 -rotate-2'];

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
