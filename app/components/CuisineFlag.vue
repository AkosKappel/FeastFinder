<template>
  <img
    v-if="code && !failed"
    :src="flagUrl(code)"
    alt=""
    width="16"
    height="16"
    loading="lazy"
    class="h-4 w-4 shrink-0 object-contain"
    @error="failed = true"
  />
  <Globe v-else class="h-4 w-4 shrink-0" aria-hidden="true" />
</template>

<script setup lang="ts">
import { Globe } from '@lucide/vue';

const props = defineProps<{ country: string }>();

const code = computed(() => countryCodeOf(props.country));
const failed = ref(false);
</script>
