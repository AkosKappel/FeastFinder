// Offline support and faster repeat visits. Pages: network first, falling back to the cached app
// shell (the app renders every route in the browser). Built assets: cache first, their names change
// with every build. Recipe data: stale-while-revalidate. Images: cache first, capped.
// The worker only sees requests once it controls the page, so offline use starts from the second visit.
const VERSION = 'v1';
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const DATA = `data-${VERSION}`;
const IMAGES = `images-${VERSION}`;
const BASE = new URL('./', self.location).pathname;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.add(BASE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const current = [SHELL, ASSETS, DATA, IMAGES];
  event.waitUntil(
    caches
      .keys()
      .then(names => Promise.all(names.filter(name => !current.includes(name)).map(name => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

// Keeps a cache from growing without bound by dropping its oldest entries.
const putCapped = async (cacheName, request, response, maxEntries) => {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map(key => cache.delete(key)));
};

const networkFirstPage = async request => {
  try {
    const response = await fetch(request);
    // Every page is the same app shell; GitHub Pages sends deep links with status 404, so store the
    // body as a plain 200. Keeping the latest shell keeps it in step with the assets in the cache.
    if (response.ok || response.status === 404) {
      const shell = new Response(await response.clone().blob(), { headers: response.headers });
      await putCapped(SHELL, BASE, shell, 1);
    }
    return response;
  } catch {
    return (await caches.match(BASE)) ?? Response.error();
  }
};

const cacheFirst = async (request, cacheName, maxEntries) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // Opaque responses (cross-origin images) have status 0 but are still usable.
  if (response.ok || response.type === 'opaque') await putCapped(cacheName, request, response.clone(), maxEntries);
  return response;
};

const staleWhileRevalidate = async (request, event) => {
  const cached = await caches.match(request);
  const update = fetch(request).then(async response => {
    if (response.ok) await putCapped(DATA, request, response.clone(), 300);
    return response;
  });
  if (cached) {
    event.waitUntil(update.catch(() => {}));
    return cached;
  }
  return update;
};

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(request));
  } else if (url.origin === self.location.origin && url.pathname.startsWith(`${BASE}assets/`)) {
    event.respondWith(cacheFirst(request, ASSETS, 100));
  } else if (
    url.pathname.endsWith('/data/meals.json') ||
    (url.hostname === 'www.themealdb.com' && url.pathname.startsWith('/api/'))
  ) {
    // random.php must stay random.
    if (!url.pathname.endsWith('/random.php')) event.respondWith(staleWhileRevalidate(request, event));
  } else if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGES, 300));
  }
});
