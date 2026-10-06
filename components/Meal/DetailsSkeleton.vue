<template>
  <section class="container mx-auto px-4 py-8 motion-safe:animate-pulse" aria-hidden="true">
    <div class="h-9 w-2/3 md:w-1/3 mx-auto mb-8 rounded bg-gray-300"></div>
    <div class="flex flex-col md:flex-row md:mx-8 gap-4">
      <div class="flex-1 md:w-2/3 aspect-square rounded-lg bg-gray-300"></div>
      <div class="flex-1 md:ml-8 md:w-1/3 space-y-3">
        <div v-for="n in 3" :key="n" class="h-5 w-1/2 rounded bg-gray-300"></div>
        <div class="h-6 w-1/3 mt-6 rounded bg-gray-300"></div>
        <div v-for="n in 8" :key="`ingredient-${n}`" class="h-4 w-2/3 rounded bg-gray-200"></div>
      </div>
    </div>
    <div class="mt-8 md:m-8 space-y-3">
      <div class="h-7 w-40 rounded bg-gray-300"></div>
      <div v-for="n in 6" :key="`line-${n}`" class="h-4 rounded bg-gray-200"></div>
    </div>
  </section>
  <span class="sr-only">Loading meal details...</span>
</template>
