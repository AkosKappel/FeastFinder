<template>
  <!-- closedby gives light dismiss where supported; the click on the backdrop covers Safari. -->
  <dialog
    ref="dialog"
    aria-label="Quick find"
    closedby="any"
    class="mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-xl bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/50"
    @close="open = false"
    @click.self="open = false"
  >
    <form role="search" class="border-b border-line focus-within:border-orange-600" @submit.prevent="openActive">
      <label class="flex items-center gap-3 px-4">
        <Search class="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
        <span class="sr-only">Page, category, cuisine or meal</span>
        <input
          v-model="query"
          type="search"
          role="combobox"
          autofocus
          autocomplete="off"
          enterkeyhint="go"
          placeholder="Jump to a page or find a meal"
          aria-autocomplete="list"
          aria-controls="command-palette-list"
          aria-expanded="true"
          :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
          class="w-full border-0 bg-transparent py-4 text-ink placeholder:text-gray-500 focus:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-search-cancel-button]:hidden"
          @keydown.down.prevent="activeIndex = stepIndex(activeIndex, 1, options.length)"
          @keydown.up.prevent="activeIndex = stepIndex(activeIndex, -1, options.length)"
        />
      </label>
    </form>
    <ul id="command-palette-list" role="listbox" aria-label="Results" class="max-h-80 overflow-y-auto p-2">
      <li v-for="(option, index) in options" :key="option.to" role="presentation">
        <nuxt-link
          :id="optionId(index)"
          :to="option.to"
          role="option"
          tabindex="-1"
          :aria-selected="index === activeIndex"
          class="flex items-center gap-3 rounded-lg px-3 py-2 aria-selected:bg-tint-soft aria-selected:text-bay-900 dark:aria-selected:text-bay-50"
          @click="open = false"
          @mousemove="activeIndex = index"
        >
          <img
            v-if="option.image"
            :src="option.image"
            alt=""
            width="32"
            height="32"
            class="h-8 w-8 shrink-0 rounded-md"
            :class="option.kind === 'Meal' ? 'object-cover' : 'object-contain'"
          />
          <component :is="option.icon" v-else class="h-8 w-8 shrink-0 p-1.5 text-orange-700" aria-hidden="true" />
          <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
          <span v-if="option.kind" class="text-xs text-gray-600">{{ option.kind }}</span>
        </nuxt-link>
      </li>
    </ul>
    <p
      class="border-t border-line px-4 py-2 text-xs text-gray-600 [&_kbd]:rounded-sm [&_kbd]:border [&_kbd]:border-line-strong [&_kbd]:px-1 [&_kbd]:font-sans"
    >
      <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to close
    </p>
  </dialog>
</template>

<script setup lang="ts">
import { Search } from '@lucide/vue';
import type { MealIndexEntry } from '@/utils/mealIndex';

const open = useCommandPalette();
const router = useRouter();
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const query = ref('');
const activeIndex = ref(-1);

const pages = [...exploreLinks, aboutLink];
const meals = shallowRef<MealIndexEntry[]>([]);
const options = computed(() => commandPaletteOptions(pages, meals.value, query.value));
watch(options, () => (activeIndex.value = options.value.length ? 0 : -1), { immediate: true });

const optionId = (index: number) => `command-palette-option-${index}`;
watch(activeIndex, async index => {
  await nextTick();
  document.getElementById(optionId(index))?.scrollIntoView({ block: 'nearest' });
});

useEventListener(document, 'keydown', event => {
  if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    open.value = !open.value;
  }
});

watch(open, isOpen => {
  if (!isOpen) {
    dialog.value?.close();
    return;
  }
  query.value = '';
  activeIndex.value = 0;
  dialog.value?.showModal();
  // The meal index is shared with the header search, so it loads at most once per visit.
  if (!meals.value.length)
    loadMealIndex().then(
      index => (meals.value = index),
      () => {},
    );
});

const openActive = () => {
  const option = options.value[activeIndex.value];
  if (!option) return;
  open.value = false;
  router.push(option.to);
};
</script>
