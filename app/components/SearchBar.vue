<template>
  <form ref="form" role="search" class="flex items-center" @submit.prevent="submit">
    <label for="meal-search" class="sr-only">Search meals</label>
    <div class="relative w-full">
      <Search
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        aria-hidden="true"
      />
      <input
        id="meal-search"
        ref="inputEl"
        v-model="input"
        type="search"
        role="combobox"
        enterkeyhint="search"
        autocomplete="off"
        placeholder="Search meals, e.g. pasta"
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        :aria-expanded="showSuggestions"
        :aria-activedescendant="activeIndex >= 0 ? `search-suggestion-${activeIndex}` : undefined"
        class="block w-full rounded-xl border-0 bg-surface py-2.5 pl-9 pr-9 text-ink placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-saffron focus:ring-offset-0 [&::-webkit-search-cancel-button]:hidden"
        @focus="onFocus"
        @input="open = true"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter="onEnter"
        @keydown.esc="onEscape"
      />
      <button
        v-if="input"
        type="button"
        class="absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-gray-500 hover:text-gray-900"
        aria-label="Clear search"
        @click="clear"
      >
        <X class="h-4 w-4" aria-hidden="true" />
      </button>
      <ul
        v-show="showSuggestions"
        id="search-suggestions"
        role="listbox"
        aria-label="Suggestions"
        class="absolute z-40 mt-2 max-h-96 w-full overflow-y-auto rounded-xl bg-surface py-1.5 text-ink shadow-xl ring-1 ring-line"
      >
        <li
          v-for="(suggestion, index) in suggestions"
          :id="`search-suggestion-${index}`"
          :key="suggestion.to"
          role="option"
          :aria-selected="index === activeIndex"
          class="flex cursor-pointer items-center gap-3 px-3 py-2"
          :class="index === activeIndex && 'bg-tint-soft'"
          @mousedown.prevent="go(suggestion)"
          @mousemove="activeIndex = index"
        >
          <img
            :src="suggestion.image"
            alt=""
            width="32"
            height="32"
            class="h-8 w-8 shrink-0 rounded-md object-cover"
            :class="suggestion.kind === 'Ingredient' && 'object-contain'"
          />
          <span class="min-w-0 flex-1 truncate" :class="suggestion.kind === 'Ingredient' && 'capitalize'">
            {{ suggestion.label }}
          </span>
          <span class="text-xs text-gray-600">{{ suggestion.kind }}</span>
        </li>
      </ul>
    </div>
    <button
      type="submit"
      class="ms-2 rounded-xl bg-orange-700 p-3 text-white hover:bg-orange-600 focus-visible:ring-saffron focus-visible:ring-offset-bay-900"
    >
      <Search class="h-4 w-4" aria-hidden="true" />
      <span class="sr-only">Search</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { Search, X } from '@lucide/vue';
import type { MealIndexEntry } from '@/utils/mealIndex';

const emit = defineEmits<{ search: [query: string] }>();

const MAX_MEALS = 5;
const MAX_INGREDIENTS = 3;

const route = useRoute();
const router = useRouter();
const input = ref('');
const inputEl = useTemplateRef<HTMLInputElement>('inputEl');
const form = useTemplateRef<HTMLFormElement>('form');

// The box always shows the search that is in the URL, and empties when leaving the results.
watch(
  () => route.query.q,
  q => (input.value = typeof q === 'string' ? q : ''),
  { immediate: true },
);

const open = ref(false);
const activeIndex = ref(-1);
const typed = refDebounced(input, 150);
onClickOutside(form, () => close());

// Suggestions come from the meal index, loaded on first focus so pages that never search skip it.
const meals = shallowRef<MealIndexEntry[]>([]);
const ingredientNames = computed(() => ingredientNamesOf(meals.value));
const onFocus = () => {
  open.value = true;
  if (!meals.value.length)
    loadMealIndex().then(
      index => (meals.value = index),
      () => {},
    );
};

const suggestions = computed(() => [
  ...rankMatches(meals.value, typed.value, meal => meal.strMeal, MAX_MEALS).map(meal => ({
    kind: 'Meal',
    label: meal.strMeal,
    image: `${meal.strMealThumb}/small`,
    to: `/meals/${meal.idMeal}`,
  })),
  ...rankMatches(ingredientNames.value, typed.value, name => name, MAX_INGREDIENTS).map(name => ({
    kind: 'Ingredient',
    label: name,
    image: ingredientThumbUrl(name, 'small'),
    to: `/ingredients/${encodeURIComponent(name)}`,
  })),
]);
const showSuggestions = computed(() => open.value && suggestions.value.length > 0);
watch(suggestions, () => (activeIndex.value = -1));

const close = () => {
  open.value = false;
  activeIndex.value = -1;
};

const move = (step: number) => {
  if (!suggestions.value.length) return;
  open.value = true;
  const count = suggestions.value.length;
  activeIndex.value = (activeIndex.value + step + count) % count;
};

const go = (suggestion: { to: string }) => {
  close();
  inputEl.value?.blur();
  router.push(suggestion.to);
};

// Enter opens the highlighted suggestion; without one it runs a normal search.
const onEnter = (event: KeyboardEvent) => {
  const suggestion = showSuggestions.value ? suggestions.value[activeIndex.value] : undefined;
  if (!suggestion) return;
  event.preventDefault();
  go(suggestion);
};

const onEscape = () => {
  if (showSuggestions.value) close();
  else input.value = '';
};

const submit = () => {
  close();
  emit('search', input.value.trim());
};

const clear = () => {
  input.value = '';
  inputEl.value?.focus();
};
</script>
