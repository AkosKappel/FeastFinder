<template>
  <div class="container mx-auto px-4">
    <IngredientList
      heading-tag="h1"
      title="Ingredients"
      :ingredients="ingredients"
      :loading="pending"
      :error="Boolean(error)"
      :allow-filter="true"
      @retry="refresh()"
    />
    <nuxt-link
      to="/fridge"
      class="mb-8 flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <Refrigerator class="h-8 w-8 shrink-0 text-orange-700" aria-hidden="true" />
      <span>
        <span class="block font-semibold">Cook with what you have</span>
        <span class="text-gray-600">Pick several ingredients and find meals that use all of them.</span>
      </span>
      <ArrowRight class="ml-auto h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Refrigerator } from '@lucide/vue';

useHead({ title: 'Ingredients' });

const { data: ingredients, pending, error, refresh } = useAsyncData('ingredients', () => mealDb.getIngredients());
</script>
