<template>
  <div class="container mx-auto max-w-3xl px-4">
    <section class="my-8">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-3xl font-semibold">Shopping list</h1>
        <UnitToggle v-if="items.length" />
      </div>

      <template v-if="items.length">
        <p class="mb-4 text-gray-600" aria-live="polite">{{ countLabel(toBuy, 'item') }} to buy</p>
        <ul class="divide-y divide-line-soft overflow-hidden rounded-2xl bg-surface shadow-xs ring-1 ring-line">
          <li v-for="item in sortedItems" :key="item.name" class="flex items-center gap-3 px-3 py-2">
            <label class="flex flex-1 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                :checked="item.bought"
                class="h-5 w-5 shrink-0 accent-orange-700"
                @change="toggleBought(item.name)"
              />
              <img
                :src="ingredientThumbUrl(item.name, 'small')"
                alt=""
                width="40"
                height="40"
                loading="lazy"
                class="h-10 w-10 shrink-0 object-contain"
              />
              <span class="min-w-0" :class="item.bought && 'text-gray-500 line-through'">
                <span class="block font-medium capitalize">{{ item.name }}</span>
                <span class="block text-sm text-gray-600">
                  {{ item.needs.map(describeNeed).join(' · ') }}
                </span>
              </span>
            </label>
            <button
              type="button"
              class="shrink-0 rounded-lg p-2 text-gray-600 hover:bg-orange-50 hover:text-accent"
              :aria-label="`Remove ${item.name}`"
              @click="remove(item.name)"
            >
              <X class="h-5 w-5" aria-hidden="true" />
            </button>
          </li>
        </ul>

        <div class="mt-4 flex flex-wrap gap-2">
          <button v-if="toBuy" type="button" :class="actionClass" @click="share">
            <component :is="copied ? Check : canShare ? Share2 : Copy" class="h-5 w-5" aria-hidden="true" />
            {{ copied ? 'Copied' : canShare ? 'Share' : 'Copy list' }}
          </button>
          <button v-if="toBuy < items.length" type="button" :class="actionClass" @click="clearBought">
            <ListChecks class="h-5 w-5" aria-hidden="true" />
            Remove bought
          </button>
          <button type="button" :class="actionClass" @click="confirmClear">
            <Trash2 class="h-5 w-5" aria-hidden="true" />
            Clear list
          </button>
        </div>
      </template>
      <EmptyState
        v-else
        :icon="ShoppingBasket"
        message="Open a recipe and add its ingredients. Ingredients from several meals are merged, and the list stays in this browser."
        action-to="/meals"
        action-label="Browse meals"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { Check, Copy, ListChecks, Share2, ShoppingBasket, Trash2, X } from '@lucide/vue';
import type { ShoppingItem } from '@/utils/shoppingList';

useHead({ title: 'Shopping list' });

const { items, toBuy, toggleBought, remove, clearBought, clear } = useShoppingList();
const units = useUnitSystem();

// Still to buy first; ticking an item moves it down without reordering the rest.
const sortedItems = computed(() => [...items.value].sort((a, b) => Number(a.bought) - Number(b.bought)));

const describeNeed = (need: ShoppingItem['needs'][number]) =>
  need.measure ? `${convertMeasure(need.measure, units.value)} for ${need.meal}` : `for ${need.meal}`;

const actionClass =
  'inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 font-medium text-gray-800 shadow-xs ring-1 ring-line hover:bg-orange-50';

const { share: shareNatively, isSupported: canShare } = useShare();
const { copy, copied } = useClipboard({ copiedDuring: 2000 });
const share = async () => {
  const text = `Shopping list\n${shoppingListText(items.value)}`;
  if (!canShare.value) return copy(text);
  try {
    await shareNatively({ title: 'Shopping list', text });
  } catch {
    // The user closed the share sheet.
  }
};

const confirmClear = () => {
  if (window.confirm('Remove everything from the shopping list?')) clear();
};
</script>
