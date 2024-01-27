<template>
  <div>
    {{ meal.strMeal }}
  </div>
</template>

<script setup lang="ts">
import type { Meal } from '@/types/Meal';

const props = defineProps({
  meal: {
    type: Object as PropType<Meal>,
    required: true,
  },
});

onMounted(() => {
  console.log(props.meal);
});

const meal = ref(props.meal);
</script>
