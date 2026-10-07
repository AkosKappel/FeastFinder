<template>
  <div class="container mx-auto px-4 py-6 motion-safe:animate-pulse" aria-hidden="true">
    <div class="mb-4 h-5 w-16 rounded-sm bg-bay-100"></div>
    <div class="h-12 w-2/3 rounded-sm bg-bay-100 md:w-1/3"></div>
    <div class="mt-4 flex gap-2">
      <div v-for="n in 3" :key="`chip-${n}`" class="h-7 w-24 rounded-full bg-bay-100"></div>
    </div>
    <div class="mt-4 mb-6 flex gap-2">
      <div v-for="n in 3" :key="`action-${n}`" class="h-11 w-24 rounded-xl bg-bay-100"></div>
    </div>
    <div class="grid gap-8 lg:grid-cols-5">
      <div class="aspect-[4/3] rounded-2xl bg-bay-100 lg:col-span-3"></div>
      <div class="space-y-3 lg:col-span-2">
        <div class="h-7 w-40 rounded-sm bg-bay-100"></div>
        <div v-for="n in 8" :key="`ingredient-${n}`" class="h-12 rounded-sm bg-bay-50"></div>
      </div>
    </div>
    <div class="mt-10 space-y-3">
      <div class="h-7 w-40 rounded-sm bg-bay-100"></div>
      <div v-for="n in 5" :key="`step-${n}`" class="h-16 rounded-2xl bg-bay-50"></div>
    </div>
  </div>
  <span class="sr-only">Loading meal details...</span>
</template>
