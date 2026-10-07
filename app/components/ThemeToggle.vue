<template>
  <button
    type="button"
    class="flex rounded-lg p-2 text-bay-100 transition-colors hover:bg-bay-800 hover:text-white"
    :title="`Theme: ${current.label}`"
    @click="store = next.value"
  >
    <component :is="current.icon" class="h-5 w-5" aria-hidden="true" />
    <span class="sr-only">Theme: {{ current.label }}. Switch to {{ next.label }}</span>
  </button>
</template>

<script setup lang="ts">
import { Monitor, Moon, Sun } from '@lucide/vue';

// Sets the dark or light class on <html>; "auto" follows the system. The inline script in
// nuxt.config.ts applies the saved choice before the app starts, so the page does not flash.
const { store } = useColorMode({ storageKey: 'feast-finder:theme' });

const modes = [
  { value: 'auto', label: 'system', icon: Monitor },
  { value: 'light', label: 'light', icon: Sun },
  { value: 'dark', label: 'dark', icon: Moon },
] as const;
const currentIndex = computed(() =>
  Math.max(
    0,
    modes.findIndex(mode => mode.value === store.value),
  ),
);
const current = computed(() => modes[currentIndex.value]!);
const next = computed(() => modes[(currentIndex.value + 1) % modes.length]!);
</script>
