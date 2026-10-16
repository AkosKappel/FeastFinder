// The meal whose card was opened last. Its card photo and the meal page photo share a view
// transition name, so the browser morphs one into the other (nuxt.config: experimental.viewTransition).
// Only that one card gets the name: names must be unique on a page.
export const useMealTransition = () => useState<{ id: string; thumb: string } | null>('meal-transition', () => null);

export const MEAL_PHOTO_TRANSITION = { viewTransitionName: 'meal-photo' };
