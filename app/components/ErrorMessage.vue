<template>
  <div role="alert" class="flex flex-col items-center justify-center gap-4 my-8 min-h-60 text-center">
    <p class="text-2xl font-semibold">{{ title }}</p>
    <p class="text-lg text-gray-600">{{ message }}</p>
    <button
      class="px-4 py-2 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition-all duration-300 ease-in-out"
      @click="$emit('retry')"
    >
      Try again
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Something went wrong',
  },
  message: {
    type: String,
    default: 'The recipe service could not be reached. Check your connection and try again.',
  },
});

defineEmits(['retry']);
</script>
