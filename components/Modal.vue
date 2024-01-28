<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="$emit('close')">
    <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
      <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
      <p class="text-gray-700">{{ description }}</p>
      <div class="flex justify-end mt-4">
        <button
          class="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300 ease-in-out"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
});

defineEmits(['close']);
</script>
