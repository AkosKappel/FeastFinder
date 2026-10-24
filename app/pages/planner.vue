<template>
  <div class="container mx-auto px-4">
    <section class="my-8">
      <h1 class="mb-2 text-3xl font-semibold">Meal planner</h1>
      <p class="mb-6 text-gray-600">
        Plan lunch and dinner for the week. The plan is saved in this browser, no account needed.
      </p>

      <ol class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <li
          v-for="(dayName, day) in PLAN_DAYS"
          :key="dayName"
          class="rounded-2xl bg-surface p-4 shadow-xs ring-1 ring-line print:break-inside-avoid print:shadow-none"
        >
          <h2 class="mb-3 text-xl font-semibold">{{ dayName }}</h2>
          <section v-for="slot in PLAN_SLOTS" :key="slot" class="mt-3 first:mt-0" :aria-label="`${dayName} ${slot}`">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-sm font-semibold tracking-wide text-gray-600 uppercase">{{ slot }}</h3>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-accent hover:bg-orange-50 print:hidden"
                :aria-label="`Add a meal to ${dayName} ${slot}`"
                @click="openPicker(day, slot)"
              >
                <Plus class="h-4 w-4" aria-hidden="true" />
                Add
              </button>
            </div>
            <ul v-if="mealsAt(plan, day, slot).length" class="mt-1 space-y-2">
              <li
                v-for="entry in mealsAt(plan, day, slot)"
                :key="entry.meal.idMeal"
                class="flex items-start gap-3 rounded-xl bg-tint-soft p-2"
              >
                <img
                  :src="`${entry.meal.strMealThumb}/small`"
                  alt=""
                  width="48"
                  height="48"
                  class="h-12 w-12 shrink-0 rounded-lg object-cover"
                  @error="onImageError"
                />
                <div class="min-w-0 flex-1">
                  <nuxt-link :to="`/meals/${entry.meal.idMeal}`" class="font-medium hover:text-accent hover:underline">
                    {{ entry.meal.strMeal }}
                  </nuxt-link>
                  <div class="mt-1 flex flex-wrap items-center gap-1 print:hidden">
                    <nuxt-link
                      :to="`/meals/${entry.meal.idMeal}?cook`"
                      class="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-sm text-gray-700 hover:bg-orange-50 hover:text-accent"
                      :aria-label="`Cook ${entry.meal.strMeal}`"
                    >
                      <ChefHat class="h-4 w-4" aria-hidden="true" />
                      Cook
                    </nuxt-link>
                    <select
                      class="rounded-lg border-0 bg-transparent py-1 pr-7 pl-1.5 text-sm text-gray-700 hover:bg-orange-50"
                      :aria-label="`Move ${entry.meal.strMeal}`"
                      @change="moveTo(entry, $event)"
                    >
                      <option value="" selected disabled>Move to…</option>
                      <template v-for="(targetDay, targetIndex) in PLAN_DAYS" :key="targetDay">
                        <option
                          v-for="targetSlot in PLAN_SLOTS"
                          :key="targetSlot"
                          :value="`${targetIndex}:${targetSlot}`"
                          :disabled="targetIndex === day && targetSlot === slot"
                        >
                          {{ targetDay }} {{ targetSlot.toLowerCase() }}
                        </option>
                      </template>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  class="shrink-0 rounded-lg p-1.5 text-gray-600 hover:bg-orange-50 hover:text-accent print:hidden"
                  :aria-label="`Remove ${entry.meal.strMeal} from ${dayName} ${slot}`"
                  @click="remove(entry)"
                >
                  <X class="h-5 w-5" aria-hidden="true" />
                </button>
              </li>
            </ul>
            <p v-else class="mt-1 text-sm text-gray-500">Nothing planned</p>
          </section>
        </li>
      </ol>

      <div v-if="plan.length" class="mt-6 flex flex-wrap items-center gap-2 print:hidden">
        <button type="button" :class="actionClass" :disabled="adding" @click="addWeekToShoppingList">
          <ShoppingBasket class="h-5 w-5" aria-hidden="true" />
          Add week to shopping list
        </button>
        <button type="button" :class="actionClass" @click="share">
          <component :is="copied ? Check : canShare ? Share2 : Copy" class="h-5 w-5" aria-hidden="true" />
          {{ copied ? 'Copied' : canShare ? 'Share' : 'Copy plan' }}
        </button>
        <button type="button" :class="actionClass" @click="print">
          <Printer class="h-5 w-5" aria-hidden="true" />
          Print
        </button>
        <button type="button" :class="actionClass" @click="confirmClear">
          <Trash2 class="h-5 w-5" aria-hidden="true" />
          Clear week
        </button>
      </div>
      <p class="mt-3 text-gray-700 print:hidden" role="status">
        <template v-if="shoppingStatus === 'done'">
          Ingredients added to your
          <nuxt-link to="/shopping-list" class="font-medium text-accent underline">shopping list</nuxt-link>.
        </template>
        <template v-else-if="shoppingStatus === 'failed'">
          Some recipes could not be loaded. Check your connection and try again.
        </template>
      </p>
    </section>

    <PlanMealPicker v-model:open="picking" :title="pickerTitle" @pick="meal => add(target.day, target.slot, meal)" />
  </div>
</template>

<script setup lang="ts">
import { Check, ChefHat, Copy, Plus, Printer, Share2, ShoppingBasket, Trash2, X } from '@lucide/vue';
import type { PlannedMeal, PlanSlot } from '@/utils/mealPlan';

useHead({ title: 'Meal planner' });

const { plan, add, move, remove, clear } = useMealPlan();
const shoppingList = useShoppingList();
const { onImageError } = usePlaceholderImage();

const actionClass =
  'inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 font-medium text-gray-800 shadow-xs ring-1 ring-line hover:bg-orange-50 disabled:opacity-60';

const picking = ref(false);
const target = ref<{ day: number; slot: PlanSlot }>({ day: 0, slot: 'Dinner' });
const pickerTitle = computed(() => `${PLAN_DAYS[target.value.day]} ${target.value.slot.toLowerCase()}`);
const openPicker = (day: number, slot: PlanSlot) => {
  target.value = { day, slot };
  picking.value = true;
};

const moveTo = (entry: PlannedMeal, event: Event) => {
  const [day, slot] = (event.target as HTMLSelectElement).value.split(':');
  move(entry, Number(day), slot as PlanSlot);
};

// Planned meals keep only their card fields, so the recipes are loaded (from the cache when opened before).
const adding = ref(false);
const shoppingStatus = ref<'done' | 'failed' | null>(null);
const addWeekToShoppingList = async () => {
  adding.value = true;
  shoppingStatus.value = null;
  try {
    const meals = await Promise.all(uniquePlannedMeals(plan.value).map(meal => mealDb.getMeal(meal.idMeal)));
    shoppingList.items.value = addMealsToShoppingList(
      shoppingList.items.value,
      meals
        .filter(meal => meal !== null)
        .map(meal => ({ meal: meal.strMeal, ingredients: getIngredientsFromMeal(meal) })),
    );
    shoppingStatus.value = 'done';
  } catch {
    shoppingStatus.value = 'failed';
  } finally {
    adding.value = false;
  }
};

const { share: shareNatively, isSupported: canShare } = useShare();
const { copy, copied } = useClipboard({ copiedDuring: 2000 });
const share = async () => {
  const text = `Meal plan\n${mealPlanText(plan.value)}`;
  if (!canShare.value) return copy(text);
  try {
    await shareNatively({ title: 'Meal plan', text });
  } catch {
    // The user closed the share sheet.
  }
};

const print = () => window.print();

const confirmClear = () => {
  if (window.confirm('Remove all meals from this week?')) clear();
};
</script>
