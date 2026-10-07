<template>
  <div class="flex flex-col min-h-screen bg-gray-200">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
    >
      Skip to content
    </a>
    <AppHeader class="print:hidden" />
    <p
      v-if="!online"
      role="status"
      class="flex items-center justify-center gap-2 bg-gray-800 px-4 py-2 text-center text-sm text-white print:hidden"
    >
      <WifiOff class="h-4 w-4 shrink-0" aria-hidden="true" />
      You are offline. Favourites still work; recipes load again when you are back online.
    </p>
    <main id="main" class="flex-1 mb-6">
      <slot />
    </main>
    <AppFooter class="print:hidden" />
  </div>
</template>

<script setup lang="ts">
import { WifiOff } from '@lucide/vue';

// Reload whatever failed while offline as soon as the connection is back.
const online = useOnline();
watch(online, isOnline => isOnline && refreshNuxtData());

useHead({
  titleTemplate: title => (title && title !== 'Feast Finder' ? `${title} · Feast Finder` : 'Feast Finder'),
});
</script>
