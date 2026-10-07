<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-2xl bg-surface shadow-xs ring-1 ring-line transition-shadow duration-300 focus-within:ring-2 focus-within:ring-orange-600 hover:shadow-lg"
  >
    <img
      :src="image"
      alt=""
      loading="lazy"
      class="h-40 w-full object-contain p-4 transition-transform duration-300 motion-safe:group-hover:scale-105"
      @error="onImageError"
    />
    <div class="flex min-h-[3.5rem] items-center justify-between gap-2 border-t border-line-soft px-4 py-3">
      <component :is="headingTag" class="text-lg font-semibold leading-snug">
        <nuxt-link :to="to" class="after:absolute after:inset-0 focus:outline-hidden">{{ title }}</nuxt-link>
      </component>
      <button
        v-if="description"
        type="button"
        class="relative z-10 -mr-1.5 shrink-0 rounded-full p-1.5 text-gray-600 hover:bg-tint-soft hover:text-ink"
        :aria-label="`About ${title}`"
        @click="showModal = true"
      >
        <Info class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  </article>
  <Modal v-if="showModal" :title="title" :description="description ?? ''" @close="showModal = false" />
</template>

<script setup lang="ts">
import { Info } from '@lucide/vue';

const headingTag = useCardHeading();

defineProps<{
  title: string;
  image: string;
  description?: string | null;
  to: string;
}>();

const showModal = ref(false);
const { onImageError } = usePlaceholderImage();
</script>
