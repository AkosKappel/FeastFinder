<template>
  <!-- Picks a day and slot for one meal, opened from the meal page. -->
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    closedby="any"
    class="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/50"
    @close="open = false"
    @click.self="open = false"
  >
    <div class="p-5">
      <h2 :id="titleId" class="text-xl font-semibold">Add to meal plan</h2>
      <p class="mt-1 text-gray-600">{{ meal.strMeal }}</p>

      <fieldset class="mt-4">
        <legend class="mb-2 font-medium">Meal</legend>
        <div class="flex gap-2">
          <label
            v-for="option in PLAN_SLOTS"
            :key="option"
            class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-line has-checked:bg-tint-soft has-checked:ring-orange-700"
          >
            <input v-model="slot" type="radio" name="plan-slot" :value="option" class="accent-orange-700" />
            {{ option }}
          </label>
        </div>
      </fieldset>

      <fieldset class="mt-4">
        <legend class="mb-2 font-medium">Day</legend>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button
            v-for="(dayName, day) in PLAN_DAYS"
            :key="dayName"
            type="button"
            class="rounded-lg bg-tint-soft px-3 py-2.5 font-medium ring-1 ring-line hover:bg-orange-50 hover:text-accent"
            @click="choose(day)"
          >
            {{ dayName }}
          </button>
        </div>
      </fieldset>

      <div class="mt-5 flex justify-end">
        <button type="button" class="rounded-lg px-4 py-2 font-medium hover:bg-orange-50" @click="open = false">
          Cancel
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { MealPreview } from '@/types/Meal';
import type { PlanSlot } from '@/utils/mealPlan';

const props = defineProps<{ meal: MealPreview }>();
const emit = defineEmits<{ added: [day: number, slot: PlanSlot] }>();
const open = defineModel<boolean>('open', { required: true });

const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const titleId = useId();
const slot = ref<PlanSlot>('Dinner');
const { add } = useMealPlan();

watch(open, isOpen => (isOpen ? dialog.value?.showModal() : dialog.value?.close()));

const choose = (day: number) => {
  add(day, slot.value, props.meal);
  emit('added', day, slot.value);
  open.value = false;
};
</script>
