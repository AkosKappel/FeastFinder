<template>
  <div class="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <component :is="tag" class="text-3xl font-semibold">{{ title }}</component>
    <nuxt-link
      v-if="moreTo"
      :to="moreTo"
      class="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
    >
      {{ moreLabel }}
      <ArrowRight class="h-4 w-4" aria-hidden="true" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String as PropType<'h1' | 'h2'>,
    default: 'h2',
  },
  moreTo: {
    type: String,
    default: '',
  },
  moreLabel: {
    type: String,
    default: 'See all',
  },
});
</script>
