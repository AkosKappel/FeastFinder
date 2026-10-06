<template>
  <div class="container mx-auto px-4">
    <MealList
      :title="`Meals including ${ingredient}`"
      :meals="meals"
      :loading="pending"
      :error="Boolean(error)"
      @retry="refresh()"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const ingredient = computed(() => route.params.name as string);

useHead({ title: () => `Meals including ${ingredient.value}` });

const { data: meals, pending, error, refresh } = useAsyncData(
  'ingredient-meals',
  () => mealDb.mealsByIngredient(ingredient.value),
  { watch: [ingredient] },
);
</script>
