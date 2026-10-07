<template>
  <section aria-labelledby="ingredients-heading">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 id="ingredients-heading" class="text-2xl font-semibold">Ingredients</h2>
      <UnitToggle />
    </div>
    <ul class="divide-y divide-bay-50 overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-bay-100">
      <li v-for="ingredient in ingredients" :key="ingredient.name" class="flex items-center">
        <label class="flex shrink-0 cursor-pointer items-center self-stretch pr-1 pl-3 print:hidden">
          <input
            v-model="gathered"
            type="checkbox"
            :value="ingredient.name"
            class="h-5 w-5 accent-orange-700"
            :aria-label="`Got ${ingredient.name}`"
          />
        </label>
        <nuxt-link
          :to="`/ingredients/${encodeURIComponent(ingredient.name)}`"
          class="flex flex-1 items-center gap-3 px-3 py-2 hover:bg-orange-50"
          :class="gathered.includes(ingredient.name) && 'text-gray-500 line-through'"
        >
          <img
            :src="ingredientThumbUrl(ingredient.name, 'small')"
            alt=""
            width="40"
            height="40"
            loading="lazy"
            class="h-10 w-10 shrink-0 object-contain"
          />
          <span class="capitalize">{{ ingredient.name }}</span>
          <span v-if="ingredient.measure" class="ml-auto text-right text-gray-600">
            {{ convertMeasure(ingredient.measure, units) }}
          </span>
        </nuxt-link>
      </li>
    </ul>

    <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 print:hidden">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-gray-800 shadow-xs ring-1 ring-bay-100 hover:bg-orange-50"
        @click="addMissing"
      >
        <ShoppingBasket class="h-5 w-5" aria-hidden="true" />
        {{ gathered.length ? 'Add the rest to shopping list' : 'Add to shopping list' }}
      </button>
      <p v-if="added" role="status" class="flex items-center gap-1 text-gray-700">
        <Check class="h-4 w-4 text-bay-600" aria-hidden="true" />
        On your
        <nuxt-link to="/shopping-list" class="font-semibold text-orange-800 underline">shopping list</nuxt-link>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check, ShoppingBasket } from '@lucide/vue';
import type { MealIngredient } from '@/utils/helpers';

const props = defineProps<{ ingredients: MealIngredient[]; meal: string }>();
const gathered = defineModel<string[]>('gathered', { required: true });

const units = useUnitSystem();
const shoppingList = useShoppingList();
const added = computed(() => shoppingList.hasMeal(props.meal));

// What is already ticked off is in the kitchen, so only the rest goes on the list.
const addMissing = () =>
  shoppingList.add(
    props.meal,
    props.ingredients.filter(ingredient => !gathered.value.includes(ingredient.name)),
  );
</script>
