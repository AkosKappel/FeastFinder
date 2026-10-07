<template>
  <div class="container mx-auto px-4">
    <h1 class="mt-8 flex items-center gap-3 text-3xl font-semibold">
      <img v-if="countryCode" :src="flagUrl(countryCode)" alt="" width="40" height="40" class="h-10 w-10" />
      {{ country }} cuisine
    </h1>
    <MealList
      :meals="meals && countryMeals"
      :loading="pending"
      :error="Boolean(error)"
      :page-size="24"
      :empty-message="`No meals from ${country} yet.`"
      @retry="refresh()"
    />
    <nuxt-link to="/cuisines" class="mb-8 inline-flex items-center gap-1 text-gray-700 hover:text-orange-700">
      <ArrowLeft class="h-4 w-4" aria-hidden="true" />
      All cuisines
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue';

const route = useRoute();
const country = computed(() => route.params.country as string);

useHead({ title: () => `${country.value} cuisine` });

const { data: meals, pending, error, refresh } = useAsyncData('meal-index', () => loadMealIndex());
const countryMeals = computed(() => (meals.value ?? []).filter(meal => meal.strCountry === country.value));
const countryCode = computed(() => countryMeals.value[0]?.countryCode ?? null);
</script>
