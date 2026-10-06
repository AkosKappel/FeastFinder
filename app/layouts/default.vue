<template>
  <div class="flex flex-col min-h-screen bg-gray-200">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
    >
      Skip to content
    </a>
    <AppHeader class="print:hidden" />
    <main id="main" class="flex-1 mb-6">
      <slot />
    </main>
    <AppFooter class="print:hidden" />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: title => (title && title !== 'Feast Finder' ? `${title} · Feast Finder` : 'Feast Finder'),
});
</script>
