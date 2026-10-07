<template>
  <header class="surface-dark bg-bay-900 text-bay-50">
    <div class="container mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3">
      <nuxt-link to="/" class="flex items-center gap-2.5 rounded-lg">
        <img src="/favicon.svg" class="h-9 w-9" alt="" />
        <span class="font-display text-2xl font-bold tracking-tight text-white">Feast Finder</span>
      </nuxt-link>

      <SearchBar class="order-last w-full md:order-none md:w-auto md:max-w-md md:flex-1" @search="search" />

      <div class="flex items-center gap-1">
        <ThemeToggle />
        <div ref="menu" class="relative xl:hidden" @keydown.esc="showDropdown = false">
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-bay-700 px-3 py-2 font-medium text-bay-50 hover:bg-bay-800"
            aria-controls="mobile-menu"
            :aria-expanded="showDropdown"
            @click="showDropdown = !showDropdown"
          >
            Menu
            <MenuIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <ul
            v-show="showDropdown"
            id="mobile-menu"
            class="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl bg-bay-950 py-2 shadow-xl ring-1 ring-bay-800"
          >
            <li v-for="link in allLinks" :key="link.to">
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

        <nav class="hidden xl:block" aria-label="Main">
          <ul class="flex items-center gap-1">
            <li v-for="link in links" :key="link.to">
              <nuxt-link
                :to="link.to"
                class="block rounded-lg px-3 py-2 font-medium transition-colors hover:bg-bay-800 hover:text-white"
                :class="isActive(link.to) ? 'text-saffron' : 'text-bay-100'"
              >
                {{ link.label }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/random"
                title="Surprise me"
                class="flex rounded-lg p-2 transition-colors hover:bg-bay-800 hover:text-white"
                :class="isActive('/random') ? 'text-saffron' : 'text-bay-100'"
              >
                <Shuffle class="h-5 w-5" aria-hidden="true" />
                <span class="sr-only">Surprise me</span>
              </nuxt-link>
            </li>
            <li>
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
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  Carrot,
  Globe,
  Heart,
  Info,
  LayoutGrid,
  Menu as MenuIcon,
  ShoppingBasket,
  Shuffle,
  UtensilsCrossed,
} from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const showDropdown = ref(false);
const menu = useTemplateRef<HTMLElement>('menu');
onClickOutside(menu, () => (showDropdown.value = false));

const links = [
  { to: '/meals', label: 'Meals', icon: UtensilsCrossed },
  { to: '/ingredients', label: 'Ingredients', icon: Carrot },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/cuisines', label: 'Cuisines', icon: Globe },
  { to: '/favourites', label: 'Favourites', icon: Heart },
  { to: '/about', label: 'About', icon: Info },
];
const allLinks = [
  ...links.slice(0, 5),
  { to: '/shopping-list', label: 'Shopping list', icon: ShoppingBasket },
  { to: '/random', label: 'Surprise me', icon: Shuffle },
  links[5]!,
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
