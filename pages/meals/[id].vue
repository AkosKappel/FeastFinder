<template>
  <div>
    <LoadingSpinner v-if="loading" title="Loading meal details..." />
    <MealDetails v-else-if="meal" :meal="meal" />
    <section v-else class="container mx-auto px-4 py-8 text-center">
      <h2 class="text-3xl font-semibold mb-4">Meal not found</h2>
      <p class="text-lg text-gray-500">No meal found with ID {{ mealId }}.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const mealId = computed(() => route.params.id as string);
const { meal, getMeal, loading } = useMealById();

onMounted(() => {
  getMeal(mealId.value);
});
</script>
