<template>
  <div class="container mx-auto px-4 min-h-screen">
    <MealList title="Recommended Meals" :meals="meals" :error="mealsError" @retry="getMeals(4)" />
    <CategoryList
      title="Food Categories"
      :categories="categories"
      :error="categoriesError"
      @retry="getCategories(4)"
    />
    <IngredientList
      title="Best Ingredients"
      :ingredients="ingredients"
      :error="ingredientsError"
      @retry="getIngredients(4)"
    />
  </div>
</template>

<script setup lang="ts">
const { meals, error: mealsError, getMeals } = useRandomMeals();
const { categories, error: categoriesError, getCategories } = useCategories();
const { ingredients, error: ingredientsError, getIngredients } = useIngredients();

onMounted(async () => {
  await getMeals(4);
  await getCategories(4);
  await getIngredients(4);
});
</script>
