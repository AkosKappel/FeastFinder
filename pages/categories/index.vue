<template>
  <main class="container mx-auto px-4 min-h-screen">
    <!-- TODO: add filter input bar -->
    <CategoryList title="Meal Categories" :categories="categories" />
  </main>
</template>

<script setup lang="ts">
import type { Category } from '@/types/Category';

const categories = ref<Category[] | null>(null);

onMounted(async () => {
  categories.value = [
    {
      idCategory: '1',
      strCategory: 'Beef',
      strCategoryThumb: 'https://www.themealdb.com/images/category/beef.png',
      strCategoryDescription:
        'Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times.[1] Beef is a source of high-quality protein and essential nutrients.[2]',
    },
    {
      idCategory: '2',
      strCategory: 'Chicken',
      strCategoryThumb: 'https://www.themealdb.com/images/category/chicken.png',
      strCategoryDescription:
        'Chicken is a type of domesticated fowl, a subspecies of the red junglefowl. It is one of the most common and widespread domestic animals, with a total population of more than 19 billion as of 2011.[1] Humans commonly keep chickens as a source of food (consuming both their meat and eggs) and, more rarely, as pets.',
    },
    {
      idCategory: '3',
      strCategory: 'Dessert',
      strCategoryThumb: 'https://www.themealdb.com/images/category/dessert.png',
      strCategoryDescription:
        'Dessert is a course that concludes a meal. The course usually consists of sweet foods, such as confections dishes or fruit, and possibly a beverage such as dessert wine or liqueur, however in the United States it may include coffee, cheeses, nuts, or other savory items regarded as a separate course elsewhere. In some parts of the world, such as much of central and western Africa, and most parts of China, there is no tradition of a dessert course to conclude a meal.\r\n\r\nThe term dessert can apply to many confections, such as biscuits, cakes, cookies, custards, gelatins, ice creams, pastries, pies, puddings, and sweet soups, and tarts. Fruit is also commonly found in dessert courses because of its naturally occurring sweetness. Some cultures sweeten foods that are more commonly savory to create desserts.',
    },
    {
      idCategory: '4',
      strCategory: 'Lamb',
      strCategoryThumb: 'https://www.themealdb.com/images/category/lamb.png',
      strCategoryDescription:
        'Lamb, hogget, and mutton are the meat of domestic sheep (species Ovis aries) at different ages.\r\n\r\nA sheep in its first year is called a lamb, and its meat is also called lamb. The meat of a juvenile sheep older than one year is hogget; outside the USA this is also a term for the living animal. The meat of an adult sheep is mutton, a term only used for the meat, not the living animals. The term mutton is almost always used to refer to goat meat in the Indian subcontinent.\r\n\r\n',
    },
  ];
});
// const { meals, getMeals } = useFetchMeals();
// const query = computed(() => route.query.q as string);
// const title = computed(() => (query.value ? `Results for ${query.value}` : 'Meals'));

// watch(
//   () => query.value,
//   async newQuery => await getMeals(newQuery as string),
//   { immediate: true },
// );
</script>
