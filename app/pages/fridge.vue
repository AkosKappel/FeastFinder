<template>
  <div class="container mx-auto px-4">
    <section class="my-8" :aria-busy="pending">
      <h1 class="text-4xl font-bold">What's in my fridge?</h1>
      <p class="mt-2 max-w-2xl text-lg text-gray-700">
        Add what you have at home. You get meals that use all of it, and meals that need just one more thing.
      </p>

      <ErrorMessage v-if="error" @retry="refresh()" />
      <template v-else>
        <div class="mt-6">
          <IngredientPicker
            :options="ingredientNames"
            :exclude="selected"
            @select="add"
            @unknown="name => (unknown = name)"
          />
          <p v-if="unknown" class="mt-2 text-red-700" role="alert">
            No recipe uses "{{ unknown }}". Try another spelling or pick a suggestion.
          </p>
        </div>

        <div v-if="selected.length" class="mt-5 flex flex-wrap items-center gap-2">
          <h2 class="sr-only">Your ingredients</h2>
          <button
            v-for="name in selected"
            :key="name"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full bg-bay-900 py-1.5 pl-4 pr-2.5 font-medium capitalize text-white hover:bg-bay-800"
            :aria-label="`Remove ${name}`"
            @click="remove(name)"
          >
            {{ name }}
            <X class="h-4 w-4 text-bay-200" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="px-2 py-1.5 font-medium text-gray-700 underline hover:text-ink"
            @click="selected = []"
          >
            Clear all
          </button>
        </div>

        <div v-if="suggestions.length" class="mt-5">
          <h2 class="mb-2 font-sans text-base font-semibold text-gray-700">Common ingredients</h2>
          <ul class="flex flex-wrap gap-2">
            <li v-for="name in suggestions" :key="name">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-full bg-white py-1.5 pl-2.5 pr-4 font-medium capitalize text-ink shadow-xs ring-1 ring-bay-100 hover:bg-bay-50"
                @click="add(name)"
              >
                <Plus class="h-4 w-4 text-orange-700" aria-hidden="true" />
                {{ name }}
              </button>
            </li>
          </ul>
        </div>

        <CardGridSkeleton v-if="pending" :count="4" class="mt-10" />
        <template v-else-if="selected.length">
          <h2 class="mb-4 mt-10 text-2xl font-semibold" aria-live="polite">
            {{ countLabel(matches.complete.length, 'meal') }} with everything
          </h2>
          <MealGrid :meals="matches.complete" empty-message="No meal uses all of these. Remove one to see more." />
          <template v-if="matches.missingOne.length">
            <h2 class="mb-4 mt-10 text-2xl font-semibold">
              {{ countLabel(matches.missingOne.length, 'meal') }} one ingredient short
            </h2>
            <MealGrid :meals="matches.missingOne" />
          </template>
        </template>
        <EmptyState
          v-else
          :icon="Refrigerator"
          message="Your matches show up here. Start with something you have plenty of, like rice or eggs."
          class="mt-10"
        />
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Plus, Refrigerator, X } from '@lucide/vue';

useHead({ title: "What's in my fridge?" });

const { data: meals, pending, error, refresh } = useAsyncData('meal-index', () => loadMealIndex());
const ingredientNames = computed(() => ingredientNamesOf(meals.value ?? []));

// Kept in the URL (?with=chicken,garlic) so a fridge can be bookmarked or shared.
const withParam = useQueryParam('with');
const selected = computed({
  get: () => withParam.value.split(',').filter(Boolean),
  set: names => (withParam.value = names.join(',')),
});

const suggestions = computed(() =>
  popularIngredients(meals.value ?? [], 14)
    .filter(name => !selected.value.includes(name))
    .slice(0, 10),
);

const unknown = ref('');

const add = (name: string) => {
  unknown.value = '';
  if (!selected.value.includes(name)) selected.value = [...selected.value, name];
};

const remove = (name: string) => (selected.value = selected.value.filter(selectedName => selectedName !== name));

const matches = computed(() => matchIngredients(meals.value ?? [], selected.value));
</script>
