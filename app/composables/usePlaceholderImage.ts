// Swaps a broken remote image for the local placeholder (once, so a missing placeholder cannot loop).
export const usePlaceholderImage = () => {
  const placeholder = `${useRuntimeConfig().app.baseURL}meal-placeholder.png`;

  const onImageError = (event: Event) => {
    const image = event.target as HTMLImageElement;
    if (image.dataset.fallback) return;
    image.dataset.fallback = 'true';
    image.removeAttribute('srcset');
    image.src = placeholder;
  };

  return { placeholder, onImageError };
};
