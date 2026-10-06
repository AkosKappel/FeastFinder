<template>
  <button
    type="button"
    class="inline-flex items-center justify-center gap-2 rounded-full p-2 transition-colors"
    :class="active ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-600'"
    :aria-pressed="active"
    :aria-label="withLabel ? undefined : `Save ${meal.strMeal} to favourites`"
    @click.prevent="toggleFavourite(meal)"
  >
    <Heart class="h-5 w-5" :fill="active ? 'currentColor' : 'none'" aria-hidden="true" />
    <span v-if="withLabel">{{ active ? 'Saved' : 'Save' }}</span>
  </button>
</template>

<script setup lang="ts">
import { Heart } from '@lucide/vue';
import type { MealPreview } from '@/types/Meal';

const props = defineProps<{ meal: MealPreview; withLabel?: boolean }>();

const { isFavourite, toggleFavourite } = useFavourites();
const active = computed(() => isFavourite(props.meal.idMeal));
</script>
