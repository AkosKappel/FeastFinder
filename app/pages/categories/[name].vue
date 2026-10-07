<template>
  <div class="container mx-auto px-4">
    <MealList
      heading-tag="h1"
      :title="`${category} meals`"
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
const category = computed(() => route.params.name as string);

useHead({ title: () => `${category.value} meals` });
useSeoMeta({ description: () => `${category.value} recipes with ingredients and step-by-step instructions.` });

const {
  data: meals,
  pending,
  error,
  refresh,
} = useAsyncData('category-meals', () => mealDb.mealsByCategory(category.value), { watch: [category] });
</script>
