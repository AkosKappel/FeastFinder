<template>
  <div
    class="flex flex-col items-start gap-4 rounded-2xl border-2 border-dashed border-bay-200 p-6 sm:flex-row sm:items-center"
  >
    <component :is="icon" class="h-10 w-10 shrink-0 text-bay-600" aria-hidden="true" />
    <p class="text-gray-700">{{ message }}</p>
    <nuxt-link
      v-if="actionTo"
      :to="actionTo"
      class="shrink-0 rounded-xl bg-orange-700 px-4 py-2.5 font-semibold text-white hover:bg-orange-600 sm:ml-auto"
    >
      {{ actionLabel }}
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  message: string;
  actionTo?: string;
  actionLabel?: string;
}>();
</script>
