<template>
  <section class="container mx-auto px-4 my-8" :aria-busy="props.loading">
    <SectionHeading v-if="props.title" :title="props.title" :tag="props.headingTag" :more-to="props.moreTo" />
    <div v-if="props.allowFilter" class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <LetterFilter v-model="activeLetter" />
      <FilterInput v-model="filter" label="Filter ingredients" />
    </div>
    <ErrorMessage v-if="props.error" @retry="$emit('retry')" />
    <CardGridSkeleton v-else-if="props.loading || !props.ingredients" :count="props.skeletonCount" />
    <template v-else-if="paginatedIngredients.length">
      <p v-if="props.allowFilter" class="mb-4 text-gray-600" aria-live="polite">
        {{ countLabel(filteredIngredients.length, 'ingredient') }}
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
    <Pagination v-if="!props.loading" v-model="page" :total-pages="totalPages" label="Ingredient pages" />
  </section>
</template>

<script setup lang="ts">
import type { Ingredient } from '@/types/Ingredient';

const ITEMS_PER_PAGE = 12;
const { placeholder: placeholderImage } = usePlaceholderImage();

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  headingTag: {
    type: String as PropType<'h1' | 'h2'>,
    default: 'h2',
  },
  moreTo: {
    type: String,
    default: '',
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
const activeLetter = useQueryParam('letter', { resets: ['page'] });
const filter = useQueryParam('filter', { resets: ['page'] });
const currentPage = usePageParam();

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
const page = computed({
  get: () => Math.min(currentPage.value, totalPages.value),
  set: value => (currentPage.value = value),
});

const paginatedIngredients = computed(() => {
  const start = (page.value - 1) * ITEMS_PER_PAGE;
  return filteredIngredients.value.slice(start, start + ITEMS_PER_PAGE);
});
</script>
