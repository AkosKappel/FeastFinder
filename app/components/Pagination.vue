<template>
  <nav v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-2" :aria-label="label">
    <button
      type="button"
      :disabled="page === 1"
      class="inline-flex items-center gap-1 rounded-xl bg-surface px-4 py-2 font-medium shadow-xs ring-1 ring-line hover:bg-tint-soft disabled:opacity-50"
      @click="goTo(page - 1)"
    >
      <ChevronLeft class="h-4 w-4" aria-hidden="true" />
      Previous
    </button>
    <span class="px-4 py-2">Page {{ page }} of {{ totalPages }}</span>
    <button
      type="button"
      :disabled="page === totalPages"
      class="inline-flex items-center gap-1 rounded-xl bg-surface px-4 py-2 font-medium shadow-xs ring-1 ring-line hover:bg-tint-soft disabled:opacity-50"
      @click="goTo(page + 1)"
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

// The router keeps the scroll position when only the query changes, so start the new page at the top.
const goTo = async (target: number) => {
  page.value = target;
  await nextTick();
  window.scrollTo({ top: 0 });
};
</script>
