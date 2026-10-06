<template>
  <section class="container mx-auto px-4 my-8" :aria-busy="props.loading">
    <component :is="props.headingTag" v-if="props.title" class="text-3xl font-semibold mb-4">{{
      props.title
    }}</component>
    <div v-if="props.allowFilter" class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-wrap gap-1" role="group" aria-label="Filter by first letter">
        <button
          v-for="letter in ALPHABET"
          :key="letter"
          type="button"
          class="h-9 w-9 rounded text-base font-semibold uppercase transition-colors"
          :class="activeLetter === letter ? 'bg-orange-700 text-white' : 'text-gray-700 hover:bg-white'"
          :aria-pressed="activeLetter === letter"
          @click="activeLetter = activeLetter === letter ? '' : letter"
        >
          {{ letter }}
        </button>
      </div>
      <div class="relative w-full lg:w-64">
        <label for="ingredient-filter" class="sr-only">Filter ingredients</label>
        <input
          id="ingredient-filter"
          v-model="filter"
          type="search"
          autocomplete="off"
          class="w-full rounded-lg py-2 pl-4 pr-9 font-medium text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-orange-700 [&::-webkit-search-cancel-button]:hidden"
          placeholder="Filter ingredients..."
          @keydown.esc="filter = ''"
        />
        <button
          v-if="filter"
          type="button"
          class="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:text-gray-900"
          aria-label="Clear filter"
          @click="filter = ''"
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
    <ErrorMessage v-if="props.error" @retry="$emit('retry')" />
    <CardGridSkeleton v-else-if="props.loading || !props.ingredients" :count="props.skeletonCount" />
    <template v-else-if="paginatedIngredients.length">
      <p v-if="props.allowFilter" class="mb-4 text-gray-600" aria-live="polite">
        {{ filteredIngredients.length }} ingredients
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <BrowseCard
          v-for="ingredient in paginatedIngredients"
          :key="ingredient.idIngredient"
          :title="ingredient.strIngredient"
          :image="ingredient.strThumb ? ingredientImageUrl(ingredient.strThumb, 'medium') : placeholderImage"
          :description="ingredient.strDescription"
          :to="`/ingredients/${encodeURIComponent(ingredient.strIngredient)}`"
        />
      </div>
    </template>
    <p v-else class="text-lg text-gray-600" aria-live="polite">No ingredients found.</p>
    <nav
      v-if="!props.loading && totalPages > 1"
      class="mt-6 flex items-center justify-center gap-2"
      aria-label="Ingredient pages"
    >
      <button
        type="button"
        :disabled="page === 1"
        class="inline-flex items-center gap-1 rounded bg-white px-4 py-2 shadow hover:bg-gray-100 disabled:opacity-50"
        @click="currentPage = page - 1"
      >
        <ChevronLeft class="h-4 w-4" aria-hidden="true" />
        Previous
      </button>
      <span class="px-4 py-2">Page {{ page }} of {{ totalPages }}</span>
      <button
        type="button"
        :disabled="page === totalPages"
        class="inline-flex items-center gap-1 rounded bg-white px-4 py-2 shadow hover:bg-gray-100 disabled:opacity-50"
        @click="currentPage = page + 1"
      >
        Next
        <ChevronRight class="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, X } from '@lucide/vue';
import type { Ingredient } from '@/types/Ingredient';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const ITEMS_PER_PAGE = 12;
const placeholderImage = `${useRuntimeConfig().app.baseURL}meal-placeholder.png`;

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  headingTag: {
    type: String as PropType<'h1' | 'h2'>,
    default: 'h2',
  },
  ingredients: {
    type: Array as PropType<Ingredient[] | null>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  skeletonCount: {
    type: Number,
    default: 12,
  },
  allowFilter: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['retry']);

// Filter, letter and page live in the URL, so back/forward and shared links keep them.
const route = useRoute();
const router = useRouter();

const queryParam = (key: string) => {
  const value = route.query[key];
  return typeof value === 'string' ? value : '';
};

const updateQuery = (changes: Record<string, string>) =>
  router.replace({ query: withoutEmptyValues({ ...route.query, ...changes }) });

const activeLetter = computed({
  get: () => queryParam('letter'),
  set: letter => updateQuery({ letter, page: '' }),
});

const filter = computed({
  get: () => queryParam('filter'),
  set: value => updateQuery({ filter: value, page: '' }),
});

const currentPage = computed({
  get: () => Math.max(1, Number.parseInt(queryParam('page'), 10) || 1),
  set: value => updateQuery({ page: value > 1 ? String(value) : '' }),
});

const filteredIngredients = computed(() => {
  const searchTerm = filter.value.trim().toLowerCase();

  return (props.ingredients ?? [])
    .filter(ingredient => {
      const name = ingredient.strIngredient.toLowerCase();
      return (!activeLetter.value || name.startsWith(activeLetter.value)) && name.includes(searchTerm);
    })
    .sort((a, b) => a.strIngredient.localeCompare(b.strIngredient));
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredIngredients.value.length / ITEMS_PER_PAGE)));
const page = computed(() => Math.min(currentPage.value, totalPages.value));

const paginatedIngredients = computed(() => {
  const start = (page.value - 1) * ITEMS_PER_PAGE;
  return filteredIngredients.value.slice(start, start + ITEMS_PER_PAGE);
});
</script>
