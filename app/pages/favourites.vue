<template>
  <div class="container mx-auto px-4">
    <MealList
      title="Favourites"
      :meals="favourites"
      empty-message="No favourites yet. Tap the heart on any meal to save it here; favourites stay in this browser."
    />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Favourites' });

const { favourites } = useFavourites();
</script>
