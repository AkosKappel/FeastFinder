<template>
  <div ref="root" class="relative w-full max-w-xl">
    <label :for="inputId" class="sr-only">Add an ingredient</label>
    <Search
      class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
      aria-hidden="true"
    />
    <input
      :id="inputId"
      v-model="term"
      role="combobox"
      autocomplete="off"
      enterkeyhint="done"
      placeholder="Add an ingredient, e.g. chicken"
      aria-autocomplete="list"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
      class="w-full rounded-xl border-0 bg-white py-3.5 pl-12 pr-4 text-lg text-ink shadow-sm ring-1 ring-bay-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
      @focus="open = true"
      @input="onInput"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="choose(activeIndex >= 0 ? matches[activeIndex] : term)"
      @keydown.esc="close"
    />
    <ul
      v-show="open && matches.length"
      :id="listId"
      role="listbox"
      aria-label="Matching ingredients"
      class="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl bg-white py-1.5 shadow-xl ring-1 ring-bay-100"
    >
      <li
        v-for="(name, index) in matches"
        :id="optionId(index)"
        :key="name"
        role="option"
        :aria-selected="index === activeIndex"
        class="flex cursor-pointer items-center gap-3 px-3 py-2 capitalize"
        :class="index === activeIndex ? 'bg-bay-50 text-bay-900' : 'text-ink'"
        @mousedown.prevent="choose(name)"
        @mousemove="activeIndex = index"
      >
        <img :src="ingredientThumbUrl(name, 'small')" alt="" width="32" height="32" class="h-8 w-8 object-contain" />
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@lucide/vue';

const props = defineProps<{ options: string[]; exclude: string[] }>();
const emit = defineEmits<{ select: [name: string]; unknown: [name: string] }>();

const MAX_MATCHES = 8;

const inputId = useId();
const listId = useId();
const optionId = (index: number) => `${listId}-option-${index}`;

const term = ref('');
const open = ref(false);
const activeIndex = ref(-1);
const root = useTemplateRef<HTMLElement>('root');
onClickOutside(root, () => (open.value = false));

// Names that start with the typed text come first, then names that contain it.
const matches = computed(() => {
  const query = term.value.trim().toLowerCase();
  if (!query) return [];
  const available = props.options.filter(name => !props.exclude.includes(name) && name.includes(query));
  return [
    ...available.filter(name => name.startsWith(query)),
    ...available.filter(name => !name.startsWith(query)),
  ].slice(0, MAX_MATCHES);
});

const onInput = () => {
  open.value = true;
  activeIndex.value = matches.value.length ? 0 : -1;
};

const move = (step: number) => {
  if (!matches.value.length) return;
  open.value = true;
  activeIndex.value = (activeIndex.value + step + matches.value.length) % matches.value.length;
};

const close = () => {
  open.value = false;
  activeIndex.value = -1;
};

const choose = (value: string | undefined) => {
  const name = value?.trim().toLowerCase();
  if (!name) return;
  if (!props.options.includes(name)) {
    emit('unknown', name);
    return;
  }
  emit('select', name);
  term.value = '';
  close();
};
</script>
