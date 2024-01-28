<template>
  <div class="container mx-auto px-4 min-h-screen">
    <MealList title="Recommended Meals" :meals="meals" />
    <CategoryList title="Food Categories" :categories="categories" />
    <IngredientList title="Best Ingredients" :ingredients="ingredients" />
  </div>
</template>

<script setup lang="ts">
const { meals, getMeals } = useRandomMeals();
const { categories, getCategories } = useCategories();
const { ingredients, getIngredients } = useIngredients();

onMounted(async () => {
  await getMeals(4);
  await getCategories(4);
  await getIngredients(4);
});
</script>
