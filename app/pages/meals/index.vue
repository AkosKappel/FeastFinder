<template>
  <div class="container mx-auto px-4">
    <MealList
      heading-tag="h1"
      :title="title"
      :meals="meals"
      :loading="pending"
      :error="Boolean(error)"
      @retry="refresh()"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const query = computed(() => (route.query.q as string | undefined) ?? '');
const title = computed(() => (query.value ? `Results for ${query.value}` : 'Meals'));

useHead({ title });

const {
  data: meals,
  pending,
  error,
  refresh,
} = useAsyncData('search-meals', () => mealDb.searchMeals(query.value), {
  watch: [query],
});
</script>
