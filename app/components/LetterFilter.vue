<template>
  <div
    class="flex gap-1 overflow-x-auto rounded-xl bg-surface p-1.5 shadow-xs ring-1 ring-line [scrollbar-width:thin]"
    role="group"
    :aria-label="label"
  >
    <button
      type="button"
      :class="buttonClass(model === '')"
      class="px-3"
      :aria-pressed="model === ''"
      @click="model = ''"
    >
      All
    </button>
    <button
      v-for="letter in ALPHABET"
      :key="letter"
      type="button"
      class="w-9 uppercase"
      :class="buttonClass(model === letter, !isAvailable(letter))"
      :disabled="!isAvailable(letter) && model !== letter"
      :aria-pressed="model === letter"
      @click="model = model === letter ? '' : letter"
    >
      {{ letter }}
    </button>
  </div>
</template>

<script setup lang="ts">
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

const props = defineProps({
  label: {
    type: String,
    default: 'Filter by first letter',
  },
  // Letters that have at least one item; the others are shown but cannot be picked.
  available: {
    type: Array as PropType<string[] | null>,
    default: null,
  },
});

const model = defineModel<string>({ required: true });

const isAvailable = (letter: string) => !props.available || props.available.includes(letter);

const buttonClass = (active: boolean, empty = false) => [
  'h-9 shrink-0 rounded-lg font-semibold transition-colors',
  active ? 'bg-bay-900 text-white' : empty ? 'text-gray-400' : 'text-ink hover:bg-tint-soft',
];
</script>
