<template>
  <ErrorMessage v-if="error" class="container mx-auto px-4" @retry="pickMeal" />
  <MealDetailsSkeleton v-else />
</template>

<script setup lang="ts">
useHead({ title: 'Random meal' });

const error = ref(false);

// A link target of its own, so "Surprise me" works from anywhere and the back button skips it.
const pickMeal = async () => {
  error.value = false;
  try {
    const [meal] = await mealDb.getRandomMeals(1);
    if (!meal) throw new Error('No random meal returned');
    await navigateTo(`/meals/${meal.idMeal}`, { replace: true });
  } catch {
    error.value = true;
  }
};

onMounted(pickMeal);
</script>
