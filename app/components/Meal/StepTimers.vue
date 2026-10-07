<template>
  <ul v-if="durations.length" class="flex flex-wrap gap-2 print:hidden" aria-label="Timers">
    <li v-for="duration in durations" :key="duration.label">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full font-medium tabular-nums ring-1"
        :class="[
          large ? 'px-5 py-3 text-xl' : 'px-3 py-1.5 text-sm',
          timerFor(duration)
            ? 'bg-bay-900 text-white ring-bay-900'
            : 'bg-surface text-gray-800 ring-line-strong hover:bg-orange-50',
        ]"
        :aria-label="buttonLabel(duration)"
        @click="toggle(duration)"
      >
        <component :is="iconFor(duration)" :class="large ? 'h-6 w-6' : 'h-4 w-4'" aria-hidden="true" />
        {{ textFor(duration) }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { BellRing, Pause, Timer } from '@lucide/vue';
import type { StepDuration } from '@/utils/durations';

const props = defineProps<{
  step: string;
  index: number;
  meal: { idMeal: string; strMeal: string };
  large?: boolean;
}>();

const { find, start, pause, resume, remaining } = useCookingTimers();
const durations = computed(() => findDurations(props.step));

const timerFor = (duration: StepDuration) => find(props.meal.idMeal, props.index, duration.label);

const textFor = (duration: StepDuration) => {
  const timer = timerFor(duration);
  if (!timer) return duration.label;
  return timer.done ? 'Done' : formatCountdown(remaining(timer));
};
const iconFor = (duration: StepDuration) => {
  const timer = timerFor(duration);
  if (timer?.done) return BellRing;
  return timer && !timer.endsAt ? Pause : Timer;
};
const buttonLabel = (duration: StepDuration) => {
  const timer = timerFor(duration);
  if (!timer) return `Start a ${duration.label} timer`;
  if (timer.done) return `${duration.label} timer is done`;
  const left = formatCountdown(remaining(timer));
  return timer.endsAt
    ? `Pause the ${duration.label} timer, ${left} left`
    : `Resume the ${duration.label} timer, ${left} left`;
};

const toggle = (duration: StepDuration) => {
  const timer = timerFor(duration);
  if (!timer) {
    start({ ...duration, meal: props.meal.strMeal, mealId: props.meal.idMeal, step: props.index });
  } else if (timer.endsAt) {
    pause(timer);
  } else {
    resume(timer);
  }
};
</script>
