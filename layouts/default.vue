<template>
  <div class="flex flex-col min-h-screen bg-gray-200">
    <AppHeader />
    <main id="main" class="flex-1 mb-6">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: title => (title && title !== 'Feast Finder' ? `${title} · Feast Finder` : 'Feast Finder'),
});
</script>
