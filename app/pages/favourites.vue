<template>
  <div class="container mx-auto px-4">
    <section class="my-8">
      <h1 class="mb-4 text-3xl font-semibold">Favourites</h1>
      <MealGrid v-if="favourites.length" :meals="favourites" />
      <EmptyState
        v-else
        :icon="Heart"
        message="Tap the heart on any meal to keep it here. Favourites are saved in this browser, no account needed."
        action-to="/meals"
        action-label="Browse meals"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { Heart } from '@lucide/vue';

useHead({ title: 'Favourites' });

const { favourites } = useFavourites();
</script>
