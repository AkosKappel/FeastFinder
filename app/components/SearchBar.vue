<template>
  <form role="search" class="flex items-center md:mx-3" @submit.prevent="submit">
    <label for="meal-search" class="sr-only">Search meals</label>
    <div class="relative w-full">
      <Search class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
      <input
        id="meal-search"
        ref="inputEl"
        v-model="input"
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        placeholder="Search meals, e.g. pasta"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-8 pr-9 text-sm text-gray-900 focus:border-orange-600 focus:ring-orange-600 [&::-webkit-search-cancel-button]:hidden"
        @keydown.esc="clear"
      />
      <button
        v-if="input"
        type="button"
        class="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:text-gray-900"
        aria-label="Clear search"
        @click="clear"
      >
        <X class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
    <button
      type="submit"
      class="ms-2 rounded-lg border border-orange-700 bg-orange-700 p-2.5 text-white hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300"
    >
      <Search class="h-4 w-4" aria-hidden="true" />
      <span class="sr-only">Search</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { Search, X } from '@lucide/vue';

const emit = defineEmits<{ search: [query: string] }>();

const route = useRoute();
const input = ref('');
const inputEl = useTemplateRef<HTMLInputElement>('inputEl');

// The box always shows the search that is in the URL, and empties when leaving the results.
watch(
  () => route.query.q,
  q => (input.value = typeof q === 'string' ? q : ''),
  { immediate: true },
);

const submit = () => emit('search', input.value.trim());

const clear = () => {
  input.value = '';
  inputEl.value?.focus();
};
</script>
