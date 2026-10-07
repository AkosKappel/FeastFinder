<template>
  <div class="container mx-auto px-4">
    <MealList
      heading-tag="h1"
      :title="`Meals including ${ingredient}`"
      :meals="meals"
      :loading="pending"
      :error="Boolean(error)"
      :page-size="24"
      @retry="refresh()"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const ingredient = computed(() => route.params.name as string);

useHead({ title: () => `Meals including ${ingredient.value}` });
useSeoMeta({ description: () => `Recipes that use ${ingredient.value}, with step-by-step instructions.` });

const {
  data: meals,
  pending,
  error,
  refresh,
} = useAsyncData('ingredient-meals', () => mealDb.mealsByIngredient(ingredient.value), { watch: [ingredient] });
</script>
