<template>
  <!-- Finds a meal for one day and slot of the planner: matches from the meal index, or favourites before typing. -->
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    closedby="any"
    class="mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-xl bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/50"
    @close="open = false"
    @click.self="open = false"
  >
    <h2 :id="titleId" class="px-4 pt-4 text-lg font-semibold">{{ title }}</h2>
    <label class="mt-2 flex items-center gap-3 border-b border-line px-4 focus-within:border-orange-600">
      <Search class="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
      <span class="sr-only">Find a meal</span>
      <input
        ref="input"
        v-model="query"
        type="search"
        autocomplete="off"
        placeholder="Find a meal"
        class="w-full border-0 bg-transparent py-3 text-ink placeholder:text-gray-500 focus:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </label>
    <p v-if="!query.trim()" class="px-4 pt-3 text-sm text-gray-600">
      {{ favourites.length ? 'Your favourites' : 'Type the name of a meal.' }}
    </p>
    <ul class="max-h-80 overflow-y-auto p-2" aria-live="polite">
      <li v-for="meal in results" :key="meal.idMeal">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-tint-soft focus-visible:bg-tint-soft"
          @click="pick(meal)"
        >
          <img
            :src="`${meal.strMealThumb}/small`"
            alt=""
            width="40"
            height="40"
            class="h-10 w-10 shrink-0 rounded-md object-cover"
          />
          <span class="min-w-0 flex-1 truncate">{{ meal.strMeal }}</span>
          <Plus class="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        </button>
      </li>
      <li v-if="query.trim() && !results.length" class="px-3 py-2 text-gray-600">No meals for “{{ query.trim() }}”.</li>
    </ul>
  </dialog>
</template>

<script setup lang="ts">
import { Plus, Search } from '@lucide/vue';
import type { MealPreview } from '@/types/Meal';
import type { MealIndexEntry } from '@/utils/mealIndex';

defineProps<{ title: string }>();
const emit = defineEmits<{ pick: [meal: MealPreview] }>();
const open = defineModel<boolean>('open', { required: true });

const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const input = useTemplateRef<HTMLInputElement>('input');
const titleId = useId();
const query = ref('');
const { favourites } = useFavourites();

const meals = shallowRef<MealIndexEntry[]>([]);
const results = computed(() =>
  query.value.trim() ? rankMatches(meals.value, query.value, meal => meal.strMeal, 8) : favourites.value,
);

watch(open, isOpen => {
  if (!isOpen) return dialog.value?.close();
  query.value = '';
  dialog.value?.showModal();
  input.value?.focus();
  if (!meals.value.length)
    loadMealIndex().then(
      index => (meals.value = index),
      () => {},
    );
});

const pick = (meal: MealPreview) => {
  emit('pick', meal);
  open.value = false;
};
</script>
