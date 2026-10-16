<template>
  <div class="container mx-auto px-4 py-6" aria-hidden="true">
    <!-- Only the grey blocks pulse: the stand-in photo stays steady. -->
    <div class="motion-safe:animate-pulse">
      <div class="mb-4 h-5 w-16 rounded-sm bg-tint"></div>
      <div class="h-12 w-2/3 rounded-sm bg-tint md:w-1/3"></div>
      <div class="mt-4 flex gap-2">
        <div v-for="n in 3" :key="`chip-${n}`" class="h-7 w-24 rounded-full bg-tint"></div>
      </div>
      <div class="mt-4 mb-6 flex gap-2">
        <div v-for="n in 3" :key="`action-${n}`" class="h-11 w-24 rounded-xl bg-tint"></div>
      </div>
    </div>
    <div class="grid gap-8 lg:grid-cols-5">
      <!-- The opened card's photo stands in until the meal loads, so the morph has a target. -->
      <img
        v-if="image"
        :src="`${image}/medium`"
        alt=""
        class="aspect-[4/3] w-full rounded-2xl object-cover lg:col-span-3"
        :style="MEAL_PHOTO_TRANSITION"
      />
      <div v-else class="aspect-[4/3] rounded-2xl bg-tint motion-safe:animate-pulse lg:col-span-3"></div>
      <div class="space-y-3 motion-safe:animate-pulse lg:col-span-2">
        <div class="h-7 w-40 rounded-sm bg-tint"></div>
        <div v-for="n in 8" :key="`ingredient-${n}`" class="h-12 rounded-sm bg-tint-soft"></div>
      </div>
    </div>
    <div class="mt-10 space-y-3 motion-safe:animate-pulse">
      <div class="h-7 w-40 rounded-sm bg-tint"></div>
      <div v-for="n in 5" :key="`step-${n}`" class="h-16 rounded-2xl bg-tint-soft"></div>
    </div>
  </div>
  <span class="sr-only">Loading meal details...</span>
</template>

<script setup lang="ts">
defineProps<{ image?: string }>();
</script>
