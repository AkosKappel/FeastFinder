<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" aria-hidden="true">
    <div v-for="n in count" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden motion-safe:animate-pulse">
      <div class="h-48 bg-gray-300"></div>
      <div class="p-4 space-y-3">
        <div class="h-5 w-3/4 rounded bg-gray-300"></div>
        <div class="h-4 w-1/2 rounded bg-gray-200"></div>
        <div class="h-10 rounded bg-gray-300"></div>
      </div>
    </div>
  </div>
  <span class="sr-only">Loading...</span>
</template>

<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 8,
  },
});
</script>
