<template>
  <div class="container mx-auto px-4">
    <MealList
      heading-tag="h1"
      :title="`${area} meals`"
      :meals="meals"
      :loading="pending"
      :error="Boolean(error)"
      @retry="refresh()"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const area = computed(() => route.params.name as string);

useHead({ title: () => `${area.value} meals` });

const {
  data: meals,
  pending,
  error,
  refresh,
} = useAsyncData('area-meals', () => mealDb.mealsByArea(area.value), {
  watch: [area],
});
</script>
