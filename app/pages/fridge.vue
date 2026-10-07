<template>
  <div class="container mx-auto px-4">
    <section class="my-8" :aria-busy="pending">
      <h1 class="mb-2 text-3xl font-semibold">What's in my fridge?</h1>
      <p class="mb-6 max-w-2xl text-gray-600">
        Add the ingredients you have and find meals that use all of them, plus meals that need just one more thing.
      </p>

      <form class="flex max-w-xl gap-2" @submit.prevent="add(draft)">
        <label for="fridge-ingredient" class="sr-only">Ingredient</label>
        <input
          id="fridge-ingredient"
          v-model="draft"
          list="fridge-ingredients"
          autocomplete="off"
          enterkeyhint="done"
          placeholder="e.g. chicken, garlic, rice"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-700 focus:ring-orange-700"
        />
        <datalist id="fridge-ingredients">
          <option v-for="name in ingredientNames" :key="name" :value="name" />
        </datalist>
        <button
          type="submit"
          class="inline-flex shrink-0 items-center gap-1 rounded-lg bg-orange-700 px-4 py-2 font-semibold text-white hover:bg-orange-800"
        >
          <Plus class="h-5 w-5" aria-hidden="true" />
          Add
        </button>
      </form>
      <p v-if="unknown" class="mt-2 text-sm text-red-700" role="alert">
        No meal uses "{{ unknown }}". Pick a suggestion from the list.
      </p>

      <ul v-if="selected.length" class="mt-4 flex flex-wrap gap-2" aria-label="Selected ingredients">
        <li v-for="name in selected" :key="name">
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-full bg-orange-700 py-1 pl-3 pr-2 capitalize text-white hover:bg-orange-800"
            :aria-label="`Remove ${name}`"
            @click="remove(name)"
          >
            {{ name }}
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </li>
        <li>
          <button type="button" class="px-2 py-1 text-gray-700 underline hover:text-orange-700" @click="selected = []">
            Clear all
          </button>
        </li>
      </ul>

      <ErrorMessage v-if="error" @retry="refresh()" />
      <CardGridSkeleton v-else-if="pending" :count="4" class="mt-8" />
      <template v-else-if="selected.length">
        <h2 class="mb-4 mt-10 text-2xl font-semibold" aria-live="polite">
          {{ countLabel(matches.complete.length, 'meal') }} with everything
        </h2>
        <MealGrid :meals="matches.complete" empty-message="No meal uses all of these. Try removing one." />
        <template v-if="matches.missingOne.length">
          <h2 class="mb-4 mt-10 text-2xl font-semibold">One ingredient short ({{ matches.missingOne.length }})</h2>
          <MealGrid :meals="matches.missingOne" />
        </template>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Plus, X } from '@lucide/vue';

useHead({ title: "What's in my fridge?" });

const { data: meals, pending, error, refresh } = useAsyncData('meal-index', () => loadMealIndex());
const ingredientNames = computed(() => ingredientNamesOf(meals.value ?? []));

// Kept in the URL (?with=chicken,garlic) so a fridge can be bookmarked or shared.
const withParam = useQueryParam('with');
const selected = computed({
  get: () => withParam.value.split(',').filter(Boolean),
  set: names => (withParam.value = names.join(',')),
});

const draft = ref('');
const unknown = ref('');

const add = (value: string) => {
  const name = value.trim().toLowerCase();
  if (!name) return;
  if (!ingredientNames.value.includes(name)) {
    unknown.value = name;
    return;
  }
  unknown.value = '';
  draft.value = '';
  if (!selected.value.includes(name)) selected.value = [...selected.value, name];
};

const remove = (name: string) => (selected.value = selected.value.filter(selectedName => selectedName !== name));

const matches = computed(() => matchIngredients(meals.value ?? [], selected.value));
</script>
