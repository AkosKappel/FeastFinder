<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" aria-hidden="true">
    <div
      v-for="n in count"
      :key="n"
      class="overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-bay-100 motion-safe:animate-pulse"
    >
      <div class="aspect-[4/3] bg-bay-100"></div>
      <div class="space-y-3 p-4">
        <div class="h-5 w-3/4 rounded-sm bg-bay-100"></div>
        <div class="h-4 w-1/2 rounded-sm bg-bay-50"></div>
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
