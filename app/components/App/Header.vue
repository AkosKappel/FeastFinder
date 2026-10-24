<template>
  <header class="surface-dark bg-bay-900 text-bay-50">
    <div class="container mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3">
      <nuxt-link to="/" class="flex items-center gap-2.5 rounded-lg">
        <img src="/favicon.svg" class="h-9 w-9" alt="" />
        <span class="font-display text-2xl font-bold tracking-tight text-white">Feast Finder</span>
      </nuxt-link>

      <SearchBar class="order-last w-full md:order-none md:w-auto md:max-w-md md:flex-1" @search="search" />

      <div class="flex items-center gap-1">
        <nav class="hidden lg:block" aria-label="Main">
          <ul class="flex items-center gap-1">
            <li v-for="link in mainLinks" :key="link.to">
              <nuxt-link
                :to="link.to"
                class="block rounded-lg px-3 py-2 font-medium transition-colors hover:bg-bay-800 hover:text-white"
                :class="isActive(link.to) ? 'text-saffron' : 'text-bay-100'"
              >
                {{ link.label }}
              </nuxt-link>
            </li>
          </ul>
        </nav>
        <!-- Phones get every page here ("Menu"); wider screens only the pages not in the bar ("More"). -->
        <div ref="menu" class="relative" @keydown.esc="showDropdown = false">
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg border border-bay-700 p-2 font-medium sm:px-3 hover:bg-bay-800 lg:border-0"
            :class="moreLinks.some(link => isActive(link.to)) ? 'lg:text-saffron' : 'text-bay-100'"
            aria-controls="site-menu"
            :aria-expanded="showDropdown"
            @click="showDropdown = !showDropdown"
          >
            <span class="sr-only sm:not-sr-only lg:hidden">Menu</span>
            <span class="hidden lg:inline">More</span>
            <MenuIcon class="h-5 w-5 lg:hidden" aria-hidden="true" />
            <ChevronDown class="hidden h-4 w-4 lg:block" aria-hidden="true" />
          </button>
          <ul
            v-show="showDropdown"
            id="site-menu"
            class="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl bg-bay-950 py-2 shadow-xl ring-1 ring-bay-800"
          >
            <li
              v-for="link in [...mainLinks, ...moreLinks]"
              :key="link.to"
              :class="mainLinks.includes(link) && 'lg:hidden'"
            >
              <nuxt-link
                :to="link.to"
                class="flex items-center gap-3 px-4 py-2.5 hover:bg-bay-800"
                :class="isActive(link.to) ? 'text-saffron' : 'text-bay-50'"
              >
                <component :is="link.icon" class="h-5 w-5 opacity-80" aria-hidden="true" />
                {{ link.label }}
              </nuxt-link>
            </li>
          </ul>
        </div>
        <nuxt-link
          to="/shopping-list"
          title="Shopping list"
          class="relative flex rounded-lg p-2 transition-colors hover:bg-bay-800 hover:text-white"
          :class="isActive('/shopping-list') ? 'text-saffron' : 'text-bay-100'"
        >
          <ShoppingBasket class="h-5 w-5" aria-hidden="true" />
          <span class="sr-only">Shopping list, {{ countLabel(toBuy, 'item') }} to buy</span>
          <span
            v-if="toBuy"
            class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron px-1 text-xs font-bold text-bay-950"
            aria-hidden="true"
          >
            {{ toBuy }}
          </span>
        </nuxt-link>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  CalendarDays,
  Carrot,
  ChevronDown,
  Globe,
  Heart,
  Info,
  LayoutGrid,
  Menu as MenuIcon,
  Refrigerator,
  ShoppingBasket,
  Shuffle,
  UtensilsCrossed,
} from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const showDropdown = ref(false);
const menu = useTemplateRef<HTMLElement>('menu');
onClickOutside(menu, () => (showDropdown.value = false));

// The pages used most stay in the bar; the rest go under More. The shopping list has its own icon.
const mainLinks = [
  { to: '/meals', label: 'Meals', icon: UtensilsCrossed },
  { to: '/planner', label: 'Planner', icon: CalendarDays },
  { to: '/favourites', label: 'Favourites', icon: Heart },
];
const moreLinks = [
  { to: '/ingredients', label: 'Ingredients', icon: Carrot },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/cuisines', label: 'Cuisines', icon: Globe },
  { to: '/fridge', label: "What's in my fridge?", icon: Refrigerator },
  { to: '/random', label: 'Surprise me', icon: Shuffle },
  { to: '/about', label: 'About', icon: Info },
];

const { toBuy } = useShoppingList();

watch(
  () => route.fullPath,
  () => (showDropdown.value = false),
);

const isActive = (path: string) => route.path.startsWith(path);

const search = (query: string) => {
  router.push(query ? { path: '/meals', query: { q: query } } : '/meals');
};
</script>
