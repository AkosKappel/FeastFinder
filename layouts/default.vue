<template>
  <div class="flex flex-col min-h-screen bg-gray-200">
    <AppHeader />
    <main class="min-h-screen mb-6">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
