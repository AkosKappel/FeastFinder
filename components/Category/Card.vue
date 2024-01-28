<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
  >
    <div @click="showModal = true" class="cursor-pointer">
      <h2 class="text-xl font-semibold text-center my-2">{{ category.strCategory }}</h2>
      <nuxt-img
        :src="category.strCategoryThumb"
        :alt="category.strCategory"
        :title="category.strCategory"
        loading="lazy"
        class="w-full h-48 object-cover object-center"
        placeholder="/meal-placeholder.png"
      />
    </div>
    <div class="flex flex-col w-max mx-auto p-4">
      <nuxt-link
        :to="`/categories/${category.strCategory}`"
        class="block text-center bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-all duration-300 ease-in-out"
      >
        Show Meals
      </nuxt-link>
    </div>
  </div>
  <Modal
    v-if="showModal"
    :title="category.strCategory"
    :description="category.strCategoryDescription"
    @close="showModal = false"
  />
</template>

<script setup lang="ts">
import type { Category } from '@/types/Category';

const showModal = ref(false);

defineProps({
  category: {
    type: Object as PropType<Category>,
    required: true,
  },
});
</script>
