<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
    @click="showDescription"
  >
    <h2 class="text-xl font-semibold text-center my-2">{{ category.strCategory }}</h2>
    <nuxt-img
      :src="category.strCategoryThumb"
      :alt="category.strCategory"
      class="w-full h-48 object-cover object-center"
      placeholder="/meal-placeholder.png"
    />
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types/Category';

defineProps({
  category: {
    type: Object as PropType<Category>,
    required: true,
  },
});

const showDescription = () => {
  console.log('show description');
};
</script>
