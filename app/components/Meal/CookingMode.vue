<template>
  <!-- Native modal dialog for the focus trap and Escape; shown fullscreen where the browser allows it. -->
  <dialog
    ref="dialog"
    class="m-0 h-dvh max-h-none w-screen max-w-none bg-sage p-0 text-ink backdrop:bg-black/60"
    :aria-labelledby="titleId"
    @close="onClose"
    @keydown="onKeydown"
  >
    <div class="flex h-full flex-col">
      <header class="surface-dark flex items-center gap-3 bg-bay-900 px-4 py-3 text-white">
        <div class="min-w-0 flex-1">
          <p class="text-sm text-bay-100" aria-live="polite">{{ positionLabel }}</p>
          <h2 :id="titleId" class="truncate text-xl font-bold">{{ meal.strMeal }}</h2>
        </div>
        <template v-if="readAloud.isSupported.value">
          <button
            v-if="readAloud.status.value === 'playing'"
            type="button"
            :class="headerButtonClass"
            @click="readAloud.pause()"
          >
            <Pause class="h-5 w-5" aria-hidden="true" />
            <span class="hidden sm:inline">Pause</span>
          </button>
          <button
            v-else-if="readAloud.status.value === 'paused'"
            type="button"
            :class="headerButtonClass"
            @click="readAloud.resume()"
          >
            <Play class="h-5 w-5" aria-hidden="true" />
            <span class="hidden sm:inline">Resume</span>
          </button>
          <button v-else type="button" :class="headerButtonClass" @click="readAloud.play(Math.max(current, 0))">
            <Volume2 class="h-5 w-5" aria-hidden="true" />
            <span class="hidden sm:inline">Read aloud</span>
          </button>
        </template>
        <button type="button" :class="headerButtonClass" @click="dialog?.close()">
          <X class="h-5 w-5" aria-hidden="true" />
          <span class="hidden sm:inline">Exit</span>
          <span class="sr-only sm:hidden">Exit cooking mode</span>
        </button>
      </header>
      <div class="h-1.5 bg-bay-800" aria-hidden="true">
        <div class="h-full bg-saffron transition-[width]" :style="{ width: `${progress}%` }"></div>
      </div>

      <div ref="body" class="flex-1 overflow-y-auto">
        <div class="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-6 py-8">
          <template v-if="current === -1">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 class="text-3xl font-bold md:text-4xl">Gather the ingredients</h3>
              <UnitToggle />
            </div>
            <ul class="grid gap-2 sm:grid-cols-2">
              <li v-for="ingredient in ingredients" :key="ingredient.name">
                <label
                  class="flex cursor-pointer items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-lg shadow-xs ring-1 ring-line"
                >
                  <input
                    v-model="gathered"
                    type="checkbox"
                    :value="ingredient.name"
                    class="h-6 w-6 accent-orange-700"
                  />
                  <span class="capitalize" :class="gathered.includes(ingredient.name) && 'text-gray-500 line-through'">
                    {{ ingredient.name }}
                  </span>
                  <span v-if="ingredient.measure" class="ml-auto text-right text-gray-600">
                    {{ convertMeasure(ingredient.measure, units) }}
                  </span>
                </label>
              </li>
            </ul>
          </template>
          <template v-else>
            <p class="mb-4 font-display text-xl font-semibold text-accent">Step {{ current + 1 }}</p>
            <p
              class="text-2xl leading-relaxed md:text-4xl md:leading-snug"
              :class="done.includes(current) && 'text-gray-500'"
            >
              {{ steps[current] }}
            </p>
            <MealStepTimers :step="steps[current]!" :index="current" :meal="meal" large class="mt-8" />
            <label class="mt-8 inline-flex cursor-pointer items-center gap-3 self-start text-lg font-medium">
              <input v-model="done" type="checkbox" :value="current" class="h-6 w-6 accent-orange-700" />
              Step done
            </label>
          </template>
          <CookingTimers class="mt-8" />
        </div>
      </div>

      <footer class="flex items-center justify-between gap-3 border-t border-line bg-surface px-4 py-3">
        <button type="button" :class="secondaryButtonClass" :disabled="current === -1" @click="go(current - 1)">
          <ChevronLeft class="h-6 w-6" aria-hidden="true" />
          Back
        </button>
        <p class="hidden text-sm text-gray-600 md:block">Arrow keys or swipe to move between steps</p>
        <button v-if="current < steps.length - 1" type="button" :class="primaryButtonClass" @click="go(current + 1)">
          {{ current === -1 ? 'Start cooking' : 'Next step' }}
          <ChevronRight class="h-6 w-6" aria-hidden="true" />
        </button>
        <button v-else type="button" :class="primaryButtonClass" @click="dialog?.close()">
          <Check class="h-6 w-6" aria-hidden="true" />
          Finish
        </button>
      </footer>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { Check, ChevronLeft, ChevronRight, Pause, Play, Volume2, X } from '@lucide/vue';
import type { Meal } from '@/types/Meal';
import type { MealIngredient } from '@/utils/helpers';

const props = defineProps<{
  meal: Meal;
  steps: string[];
  ingredients: MealIngredient[];
  readAloud: ReturnType<typeof useReadAloud>;
}>();
const open = defineModel<boolean>('open', { required: true });
const done = defineModel<number[]>('done', { required: true });
const gathered = defineModel<string[]>('gathered', { required: true });

const headerButtonClass =
  'inline-flex items-center gap-2 rounded-xl bg-bay-800 px-3 py-2.5 font-semibold hover:bg-bay-700';
const navButtonClass = 'inline-flex items-center gap-2 rounded-xl px-5 py-3 text-lg font-semibold';
const secondaryButtonClass = `${navButtonClass} bg-surface ring-1 ring-line-strong disabled:opacity-40`;
const primaryButtonClass = `${navButtonClass} bg-orange-700 text-white hover:bg-orange-600`;

const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const body = useTemplateRef<HTMLElement>('body');
const titleId = useId();
const units = useUnitSystem();

// -1 is the ingredients overview before the first step.
const current = ref(-1);
const positionLabel = computed(() =>
  current.value === -1 ? 'Ingredients' : `Step ${current.value + 1} of ${props.steps.length}`,
);
const progress = computed(() => ((current.value + 1) / props.steps.length) * 100);

const { isSupported: canKeepScreenOn, request: keepScreenOn, release: releaseScreen } = useWakeLock();

watch(open, isOpen => {
  if (!isOpen || dialog.value?.open) return;
  // Continue where the voice is, or start with the ingredients.
  current.value = props.readAloud.currentStep.value;
  dialog.value?.showModal();
  // Phones without element fullscreen (iPhone) still get the dialog over the whole screen.
  dialog.value?.requestFullscreen?.().catch(() => {});
  if (canKeepScreenOn.value) keepScreenOn('screen').catch(() => {});
});

const onClose = () => {
  open.value = false;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  releaseScreen();
};

const go = (index: number) => {
  const target = Math.min(Math.max(index, -1), props.steps.length - 1);
  if (target === current.value) return;
  current.value = target;
  body.value?.scrollTo({ top: 0 });
  // While reading aloud, the voice jumps along.
  if (props.readAloud.status.value !== 'idle' && target >= 0) props.readAloud.play(target);
};

// And the screen follows the voice.
watch(
  () => props.readAloud.currentStep.value,
  step => {
    if (open.value && step >= 0) current.value = step;
  },
);

const onKeydown = (event: KeyboardEvent) => {
  // Arrow keys still move between the unit options and inside form fields.
  if (event.target instanceof HTMLInputElement) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown') go(current.value + 1);
  else if (event.key === 'ArrowLeft' || event.key === 'PageUp') go(current.value - 1);
  else return;
  event.preventDefault();
};

useSwipe(body, {
  onSwipeEnd: (_, direction) => {
    if (direction === 'left') go(current.value + 1);
    else if (direction === 'right') go(current.value - 1);
  },
});
</script>
