<template>
  <div class="container mx-auto px-4">
    <section class="my-8" :aria-busy="pending">
      <h1 class="mb-4 text-3xl font-semibold">{{ title }}</h1>
      <LetterFilter v-model="letter" label="Meals starting with" class="mb-6" />
      <ErrorMessage v-if="error" @retry="refresh()" />
      <CardGridSkeleton v-else-if="pending || !meals" />
      <template v-else>
        <p class="mb-4 text-gray-600" aria-live="polite">{{ results.length }} meals</p>
        <MealGrid :meals="pageOfResults" empty-message="No meals match. Try another name or letter." />
        <Pagination v-model="page" :total-pages="totalPages" label="Meal pages" />
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
const PAGE_SIZE = 24;

// Searching and browsing run on the meal index, so every keystroke and letter is instant.
const query = useQueryParam('q', { resets: ['page'] });
const letter = useQueryParam('letter', { resets: ['page'] });
const currentPage = usePageParam();

const title = computed(() => (query.value ? `Results for "${query.value}"` : 'Meals'));
useHead({ title });

const { data: meals, pending, error, refresh } = useAsyncData('meal-index', () => loadMealIndex());

const results = computed(() => searchMealIndex(meals.value ?? [], { query: query.value, letter: letter.value }));
const totalPages = computed(() => Math.max(1, Math.ceil(results.value.length / PAGE_SIZE)));
const page = computed({
  get: () => Math.min(currentPage.value, totalPages.value),
  set: value => (currentPage.value = value),
});
const pageOfResults = computed(() => results.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE));
</script>
