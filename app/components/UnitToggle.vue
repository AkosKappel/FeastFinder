<template>
  <fieldset class="inline-flex rounded-xl bg-surface p-1 text-sm shadow-xs ring-1 ring-line print:hidden">
    <legend class="sr-only">Units</legend>
    <label
      v-for="option in options"
      :key="option.value"
      class="cursor-pointer rounded-lg px-2.5 py-1 font-medium text-gray-700 has-checked:bg-bay-900 has-checked:text-white dark:has-checked:bg-bay-600 has-focus-visible:ring-2 has-focus-visible:ring-orange-600"
    >
      <input v-model="units" type="radio" :name="name" :value="option.value" class="sr-only" />
      {{ option.label }}
    </label>
  </fieldset>
</template>

<script setup lang="ts">
import type { UnitSystem } from '@/utils/units';

const units = useUnitSystem();
const name = useId();

const options: { value: UnitSystem; label: string }[] = [
  { value: 'original', label: 'As written' },
  { value: 'metric', label: 'Metric' },
  { value: 'us', label: 'US' },
];
</script>
