<template>
  <form role="search" class="flex items-center" @submit.prevent="submit">
    <label for="meal-search" class="sr-only">Search meals</label>
    <div class="relative w-full">
      <Search
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        aria-hidden="true"
      />
      <input
        id="meal-search"
        ref="inputEl"
        v-model="input"
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        placeholder="Search meals, e.g. pasta"
        class="block w-full rounded-xl border-0 bg-white py-2.5 pl-9 pr-9 text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-0 [&::-webkit-search-cancel-button]:hidden"
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
      class="ms-2 rounded-xl bg-orange-700 p-3 text-white hover:bg-orange-600 focus-visible:ring-saffron focus-visible:ring-offset-bay-900"
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
