import type { Page } from '@playwright/test';

const thumb = (id: string) => `https://www.themealdb.com/images/media/meals/${id}.jpg`;

export const teriyaki = {
  idMeal: '52772',
  strMeal: 'Teriyaki Chicken Casserole',
  strMealAlternate: null,
  strCategory: 'Chicken',
  strArea: 'Japanese',
  strCountry: 'Japan',
  strInstructions: 'Preheat oven to 350° F.\r\nCombine soy sauce and water.\r\nBake for 35 minutes.',
  strMealThumb: thumb('teriyaki'),
  strTags: 'Meat,Casserole',
  strYoutube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
  strSource: 'https://www.example.com/teriyaki',
  strImageSource: null,
  strIngredient1: 'soy sauce',
  strMeasure1: '3/4 cup',
  strIngredient2: 'water',
  strMeasure2: '1/2 cup',
  strIngredient3: 'Salt',
  strMeasure3: ' ',
};

const pasta = { ...teriyaki, idMeal: '52000', strMeal: 'Garlic Pasta', strCategory: 'Pasta', strCountry: 'Italy' };
const curry = { ...teriyaki, idMeal: '52001', strMeal: 'Green Curry', strCategory: 'Chicken', strCountry: 'Thailand' };

// A long category, to page through.
const desserts = Array.from({ length: 30 }, (_, i) => ({
  idMeal: String(53000 + i),
  strMeal: `Dessert ${i + 1}`,
  strMealThumb: thumb(`dessert-${i + 1}`),
}));

const categories = [
  { idCategory: '1', strCategory: 'Chicken', strCategoryThumb: thumb('chicken'), strCategoryDescription: 'Birds.' },
  { idCategory: '2', strCategory: 'Pasta', strCategoryThumb: thumb('pasta'), strCategoryDescription: 'Noodles.' },
];

const ingredients = [
  {
    idIngredient: '1',
    strIngredient: 'Chicken',
    strDescription: 'A bird.',
    strThumb: thumb('i-chicken'),
    strType: null,
  },
  { idIngredient: '2', strIngredient: 'Garlic', strDescription: null, strThumb: thumb('i-garlic'), strType: null },
  { idIngredient: '3', strIngredient: 'Rice', strDescription: null, strThumb: null, strType: null },
];

const indexEntry = (meal: typeof teriyaki, code: string, mealIngredients: string[]) => ({
  idMeal: meal.idMeal,
  strMeal: meal.strMeal,
  strMealThumb: meal.strMealThumb,
  strCategory: meal.strCategory,
  strArea: meal.strArea,
  strCountry: meal.strCountry,
  countryCode: code,
  ingredients: mealIngredients,
});

export const mealIndex = {
  generatedAt: '2026-10-07',
  meals: [
    indexEntry(pasta, 'it', ['pasta', 'garlic', 'olive oil']),
    indexEntry(curry, 'th', ['chicken', 'garlic', 'rice']),
    indexEntry(teriyaki, 'jp', ['soy sauce', 'water', 'chicken', 'rice']),
  ],
};

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);

/** Mocks TheMealDB, its images and the meal index. `failures` makes the first N API calls fail. */
export const mockApi = async (page: Page, { failures = 0 } = {}) => {
  let failuresLeft = failures;
  let randomCall = 0;

  await page.route('https://www.themealdb.com/api/**', route => {
    if (failuresLeft-- > 0) return route.abort('failed');

    const url = new URL(route.request().url());
    const endpoint = url.pathname.split('/').pop();
    const param = (name: string) => url.searchParams.get(name);
    const meals = (list: unknown[] | null) => route.fulfill({ json: { meals: list } });

    switch (endpoint) {
      case 'random.php':
        return meals([[teriyaki, pasta, curry][randomCall++ % 3]]);
      case 'lookup.php':
        return meals([teriyaki, pasta, curry].filter(meal => meal.idMeal === param('i')));
      case 'categories.php':
        return route.fulfill({ json: { categories } });
      case 'list.php':
        return meals(ingredients);
      case 'filter.php':
        if (param('c') === 'Dessert') return meals(desserts);
        return meals([teriyaki, curry].filter(meal => meal.strCategory === (param('c') ?? 'Chicken')));
      default:
        return meals(null);
    }
  });
  await page.route('https://www.themealdb.com/images/**', route =>
    route.fulfill({ body: PNG, contentType: 'image/png' }),
  );
  await page.route('https://www.youtube-nocookie.com/**', route => route.abort());
  await page.route('**/data/meals.json', route => route.fulfill({ json: mealIndex }));
};
