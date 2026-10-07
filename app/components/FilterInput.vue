<template>
  <div class="relative w-full sm:max-w-sm">
    <label :for="id" class="sr-only">{{ label }}</label>
    <Search
      class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
      aria-hidden="true"
    />
    <input
      :id="id"
      v-model="model"
      type="search"
      autocomplete="off"
      class="w-full rounded-xl border-0 bg-white py-2.5 pl-9 pr-9 text-ink shadow-sm ring-1 ring-bay-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 [&::-webkit-search-cancel-button]:hidden"
      :placeholder="`${label}...`"
      @keydown.esc="model = ''"
    />
    <button
      v-if="model"
      type="button"
      class="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:text-gray-900"
      :aria-label="`Clear: ${label}`"
      @click="model = ''"
    >
      <X class="h-4 w-4" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Search, X } from '@lucide/vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
});

const model = defineModel<string>({ required: true });
const id = useId();
</script>
