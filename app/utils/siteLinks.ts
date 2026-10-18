import {
  Carrot,
  Globe,
  Heart,
  Info,
  LayoutGrid,
  Refrigerator,
  ShoppingBasket,
  Shuffle,
  UtensilsCrossed,
} from '@lucide/vue';

// The app's own pages, listed in the footer and offered in the command palette.
export const exploreLinks = [
  { label: 'Meals', to: '/meals', icon: UtensilsCrossed },
  { label: 'Ingredients', to: '/ingredients', icon: Carrot },
  { label: 'Categories', to: '/categories', icon: LayoutGrid },
  { label: 'Cuisines', to: '/cuisines', icon: Globe },
  { label: "What's in my fridge?", to: '/fridge', icon: Refrigerator },
  { label: 'Surprise me', to: '/random', icon: Shuffle },
  { label: 'Favourites', to: '/favourites', icon: Heart },
  { label: 'Shopping list', to: '/shopping-list', icon: ShoppingBasket },
];

export const aboutLink = { label: 'About', to: '/about', icon: Info };
