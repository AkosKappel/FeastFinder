export default defineNuxtPlugin(() => {
  // Not in development: a cached build would hide code changes.
  if (import.meta.dev || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register(`${useRuntimeConfig().app.baseURL}sw.js`).catch(error => {
    console.warn('Service worker registration failed', error);
  });
});
