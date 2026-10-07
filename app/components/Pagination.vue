<template>
  <nav v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-2" :aria-label="label">
    <button
      type="button"
      :disabled="page === 1"
      class="inline-flex items-center gap-1 rounded-xl bg-white px-4 py-2 font-medium shadow-xs ring-1 ring-bay-100 hover:bg-bay-50 disabled:opacity-50"
      @click="page = page - 1"
    >
      <ChevronLeft class="h-4 w-4" aria-hidden="true" />
      Previous
    </button>
    <span class="px-4 py-2">Page {{ page }} of {{ totalPages }}</span>
    <button
      type="button"
      :disabled="page === totalPages"
      class="inline-flex items-center gap-1 rounded-xl bg-white px-4 py-2 font-medium shadow-xs ring-1 ring-bay-100 hover:bg-bay-50 disabled:opacity-50"
      @click="page = page + 1"
    >
      Next
      <ChevronRight class="h-4 w-4" aria-hidden="true" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';

defineProps({
  totalPages: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: 'Pages',
  },
});

const page = defineModel<number>({ required: true });
</script>
