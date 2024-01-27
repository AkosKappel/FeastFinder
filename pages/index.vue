<template>
  <main class="container mx-auto px-4 py-8">
    <MealsList title="Recommended Meals" :meals="meals" />
  </main>
</template>

<script setup lang="ts">
import type { Meal } from '@/types/Meal';

// const { meals: recommendedMeals, getMeals: getRecommendedMeals } = useRandomMeals();

// onMounted(() => {
//   getRecommendedMeals(4);
// });

const emptyMeal: Meal = {
  idMeal: '52780',
  strMeal: 'Potato Gratin with Chicken',
  strDrinkAlternate: null,
  strCategory: 'Chicken',
  strArea: 'Unknown',
  strInstructions:
    "15 minute potato gratin with chicken and bacon greens: a gratin always seems more effort and more indulgent than ordinary boiled or roasts, but it doesn't have to take 45mins, it's nice for a change and you can control the calorie content by going with full fat to low fat creme fraiche. (It's always tastes better full fat though obviously!) to serve 4: use 800g of potatoes, finely slice and boil in a pan for about 5-8 mins till firmish, not soft. Finely slice 3 onions and place in an oven dish with 2 tblsp of olive oil and 100ml of chicken stock. Cook till the onions are soft then drain the potatoes and pour onto the onions. Season and spoon over cream or creme fraiche till all is covered but not swimming. Grate Parmesan over the top then finish under the grill till nicely golden. serve with chicken and bacon, peas and spinach.",
  strMealThumb: 'https://www.themealdb.com/images/media/meals/qwrtut1468418027.jpg',
  strTags: null,
  strYoutube: 'https://www.youtube.com/watch?v=p3u8eiy3yHI',
  strIngredient1: 'Potatoes',
  strIngredient2: 'Onions',
  strIngredient3: 'Olive Oil',
  strIngredient4: 'Chicken Stock',
  strIngredient5: 'Creme Fraiche',
  strIngredient6: 'Parmesan',
  strIngredient7: 'Chicken Breasts',
  strIngredient8: 'Bacon',
  strIngredient9: 'Spinach',
  strIngredient10: 'Peas',
  strIngredient11: '',
  strIngredient12: '',
  strIngredient13: '',
  strIngredient14: '',
  strIngredient15: '',
  strIngredient16: null,
  strIngredient17: null,
  strIngredient18: null,
  strIngredient19: null,
  strIngredient20: null,
  strMeasure1: '800g',
  strMeasure2: '3',
  strMeasure3: '2 tblsp',
  strMeasure4: '100ml',
  strMeasure5: '1 pot',
  strMeasure6: 'Topping',
  strMeasure7: '4',
  strMeasure8: '4',
  strMeasure9: 'Topping',
  strMeasure10: 'Topping',
  strMeasure11: '',
  strMeasure12: '',
  strMeasure13: '',
  strMeasure14: '',
  strMeasure15: '',
  strMeasure16: null,
  strMeasure17: null,
  strMeasure18: null,
  strMeasure19: null,
  strMeasure20: null,
  strSource: 'https://www.instagram.com/p/BHxR7hYBJ6P',
  strImageSource: null,
  strCreativeCommonsConfirmed: null,
  dateModified: null,
};

const meals = ref<Meal[]>([
  {
    ...emptyMeal,
    idMeal: '1',
    strMeal: 'Spaghetti Carbonara',
    strCategory: 'Pasta',
    strArea: 'Italian',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/xz4a7t1505338319.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '2',
    strMeal: 'Chicken Tikka Masala',
    strCategory: 'Chicken',
    strArea: 'Indian',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '3',
    strMeal: 'Egg Drop Soup',
    strCategory: 'Soup',
    strArea: 'Chinese',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/1529446352.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '4',
    strMeal: 'Spicy Arrabiata Penne',
    strCategory: 'Vegetarian',
    strArea: 'Italian',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '5',
    strMeal: 'Cajun spiced fish tacos',
    strCategory: 'Seafood',
    strArea: 'Mexican',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '6',
    strMeal: 'Kafteji',
    strCategory: 'Vegetarian',
    strArea: 'Tunisian',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/1bsv1q1560459826.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '7',
    strMeal: 'Kapsalon',
    strCategory: 'Other',
    strArea: 'Dutch',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/sxysrt1468240488.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '8',
    strMeal: 'Köttbullar',
    strCategory: 'Beef',
    strArea: 'Swedish',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '9',
    strMeal: 'Poutine',
    strCategory: 'Other',
    strArea: 'Canadian',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '10',
    strMeal: 'Lasagne',
    strCategory: 'Pasta',
    strArea: 'Italian',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg',
  },
  {
    ...emptyMeal,
    idMeal: '11',
    strMeal: 'Timbits',
    strCategory: 'Dessert',
    strArea: 'Canadian',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/txsupu1511815755.jpg',
  },
]);
</script>
