<template>
  <!-- Native modal dialog: focus trap, Escape to close and focus return come from the browser. -->
  <dialog
    ref="dialog"
    class="w-full max-w-2xl rounded-lg p-0 shadow-xl backdrop:bg-black/50"
    :aria-labelledby="titleId"
    @close="$emit('close')"
    @click.self="dialog?.close()"
  >
    <div class="p-6">
      <h2 :id="titleId" class="mb-4 text-2xl font-bold">{{ title }}</h2>
      <p class="whitespace-pre-line text-gray-700">{{ description }}</p>
      <div class="mt-4 flex justify-end">
        <button
          type="button"
          class="rounded-lg bg-orange-700 px-4 py-2 font-semibold text-white shadow-md hover:bg-orange-800"
          @click="dialog?.close()"
        >
          Close
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
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

const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const titleId = useId();

onMounted(() => dialog.value?.showModal());
</script>
