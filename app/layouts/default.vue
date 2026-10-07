<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
    >
      Skip to content
    </a>
    <AppHeader class="print:hidden" />
    <p
      v-if="!online"
      role="status"
      class="flex items-center justify-center gap-2 bg-bay-800 px-4 py-2 text-center text-sm text-white print:hidden"
    >
      <WifiOff class="h-4 w-4 shrink-0" aria-hidden="true" />
      You are offline. Favourites still work; recipes load again when you are back online.
    </p>
    <!-- Short pages still fill the screen, so the footer starts below the fold. -->
    <main id="main" class="mb-10 min-h-[calc(100svh-8rem)] flex-1">
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
