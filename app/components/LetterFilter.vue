<template>
  <div class="flex flex-wrap gap-1" role="group" :aria-label="label">
    <button
      v-for="letter in ALPHABET"
      :key="letter"
      type="button"
      class="h-9 w-9 rounded text-base font-semibold uppercase transition-colors"
      :class="model === letter ? 'bg-orange-700 text-white' : 'text-gray-700 hover:bg-white'"
      :aria-pressed="model === letter"
      @click="model = model === letter ? '' : letter"
    >
      {{ letter }}
    </button>
  </div>
</template>

<script setup lang="ts">
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

defineProps({
  label: {
    type: String,
    default: 'Filter by first letter',
  },
});

const model = defineModel<string>({ required: true });
</script>
