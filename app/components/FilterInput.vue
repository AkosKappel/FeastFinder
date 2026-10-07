<template>
  <div class="relative w-full lg:w-64">
    <label :for="id" class="sr-only">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      type="search"
      autocomplete="off"
      class="w-full rounded-lg py-2 pl-4 pr-9 font-medium text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-orange-700 [&::-webkit-search-cancel-button]:hidden"
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
import { X } from '@lucide/vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
});

const model = defineModel<string>({ required: true });
const id = useId();
</script>
