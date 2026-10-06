<template>
  <article class="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
    <h3 class="my-2 px-2 text-center text-xl font-semibold">{{ title }}</h3>
    <button
      v-if="description"
      type="button"
      class="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-700"
      :aria-label="`About ${title}`"
      @click="showModal = true"
    >
      <img :src="image" alt="" loading="lazy" class="h-48 w-full object-contain object-center" />
      <span
        class="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-gray-700 shadow group-hover:text-orange-700"
        aria-hidden="true"
      >
        <Info class="h-4 w-4" />
      </span>
    </button>
    <img v-else :src="image" alt="" loading="lazy" class="h-48 w-full object-contain object-center" />
    <div class="mt-auto p-4 text-center">
      <nuxt-link
        :to="to"
        class="inline-flex items-center gap-2 rounded bg-orange-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-800"
      >
        Show meals
        <ArrowRight class="h-4 w-4" aria-hidden="true" />
      </nuxt-link>
    </div>
  </article>
  <Modal v-if="showModal" :title="title" :description="description ?? ''" @close="showModal = false" />
</template>

<script setup lang="ts">
import { ArrowRight, Info } from '@lucide/vue';

defineProps<{
  title: string;
  image: string;
  description?: string | null;
  to: string;
}>();

const showModal = ref(false);
</script>
