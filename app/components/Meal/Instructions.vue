<template>
  <section aria-labelledby="instructions-heading">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 id="instructions-heading" class="text-2xl font-semibold">Instructions</h2>
      <div class="flex flex-wrap gap-2 print:hidden">
        <button type="button" :class="actionClass" @click="$emit('cook')">
          <ChefHat class="h-5 w-5" aria-hidden="true" />
          Cooking mode
        </button>
        <template v-if="readAloud.isSupported.value">
          <button v-if="readAloud.status.value === 'idle'" type="button" :class="actionClass" @click="readAloud.play()">
            <Volume2 class="h-5 w-5" aria-hidden="true" />
            Read aloud
          </button>
          <div v-else class="flex flex-wrap gap-2" role="group" aria-label="Reading aloud">
            <button
              type="button"
              :class="actionClass"
              :disabled="readAloud.currentStep.value <= 0"
              aria-label="Previous step"
              @click="readAloud.previous()"
            >
              <SkipBack class="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              v-if="readAloud.status.value === 'playing'"
              type="button"
              :class="actionClass"
              @click="readAloud.pause()"
            >
              <Pause class="h-5 w-5" aria-hidden="true" />
              Pause
            </button>
            <button v-else type="button" :class="actionClass" @click="readAloud.resume()">
              <Play class="h-5 w-5" aria-hidden="true" />
              Resume
            </button>
            <button
              type="button"
              :class="actionClass"
              :disabled="readAloud.currentStep.value >= steps.length - 1"
              aria-label="Next step"
              @click="readAloud.next()"
            >
              <SkipForward class="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" :class="actionClass" @click="readAloud.stop()">
              <Square class="h-5 w-5" aria-hidden="true" />
              Stop
            </button>
          </div>
        </template>
      </div>
    </div>

    <ol class="space-y-3">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="rounded-2xl shadow-xs ring-1 ring-line transition-colors"
        :class="readAloud.currentStep.value === index ? 'bg-orange-100' : 'bg-surface'"
        :aria-current="readAloud.currentStep.value === index ? 'step' : undefined"
      >
        <div class="flex items-start gap-2 p-3">
          <!-- The whole step ticks off; the number turns into a check mark. -->
          <label class="flex flex-1 cursor-pointer gap-4">
            <input v-model="done" type="checkbox" :value="index" class="peer sr-only" />
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold peer-focus-visible:ring-2 peer-focus-visible:ring-orange-600 peer-focus-visible:ring-offset-2"
              :class="done.includes(index) ? 'bg-tint text-bay-700 dark:text-bay-200' : 'bg-orange-700 text-white'"
              aria-hidden="true"
            >
              <Check v-if="done.includes(index)" class="h-5 w-5" />
              <template v-else>{{ index + 1 }}</template>
            </span>
            <span class="pt-1" :class="done.includes(index) && 'text-gray-500 line-through'">{{ step }}</span>
          </label>
          <button
            v-if="readAloud.isSupported.value"
            type="button"
            class="-my-1 shrink-0 rounded-lg p-2 text-gray-600 hover:bg-orange-50 hover:text-accent print:hidden"
            :aria-label="`Read aloud from step ${index + 1}`"
            @click="readAloud.play(index)"
          >
            <Volume2 class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <MealStepTimers :step="step" :index="index" :meal="meal" class="-mt-1 pr-3 pb-3 pl-15" />
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { Check, ChefHat, Pause, Play, SkipBack, SkipForward, Square, Volume2 } from '@lucide/vue';
import type { Meal } from '@/types/Meal';

defineProps<{
  meal: Meal;
  steps: string[];
  readAloud: ReturnType<typeof useReadAloud>;
}>();
defineEmits<{ cook: [] }>();
const done = defineModel<number[]>('done', { required: true });

const actionClass =
  'inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 font-medium text-gray-800 shadow-xs ring-1 ring-line hover:bg-orange-50 disabled:opacity-50';
</script>
