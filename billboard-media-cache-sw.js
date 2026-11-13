
/* S&K Billboard test media cache service worker.
   Caches image assets for offline playback.
   Video caching is not enabled in this first test build. */

const MEDIA_CACHE = 'sk-billboard-media-test-v1';

// Install the service worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate the service worker
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();

    await Promise.all(names
      .filter((name) =>
        name.startsWith('sk-billboard-media-test-') &&
        name !== MEDIA_CACHE
      )
      .map((name) => caches.delete(name)));

    await self.clients.claim();
  })());
});

// Receive the list of advertising images to cache
self.addEventListener('message', (event) => {
  if (!event.data ||
      event.data.type !== 'PRECACHE_BILLBOARD_IMAGES') return;

  const urls = Array.isArray(event.data.urls)
    ? event.data.urls : [];

  event.waitUntil((async () => {
    const cache = await caches.open(MEDIA_CACHE);

    for (const rawUrl of urls) {
      try {
        const url = new URL(rawUrl, self.location.href);

        if (!/^https?:$/.test(url.protocol)) continue;

        const request = new Request(url.href, {
          mode: 'no-cors',
          credentials: 'omit'
        });

        if (await cache.match(request)) continue;

        const response = await fetch(request);

        if (response.ok || response.type === 'opaque') {
          await cache.put(request, response);
        }

      } catch (error) {
        console.warn(
          'Billboard image cache failed:',
          rawUrl,
          error
        );
      }
    }

    const clients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    for (const client of clients) {
      client.postMessage({
        type: 'BILLBOARD_IMAGE_CACHE_COMPLETE'
      });
    }
  })());
});

// Intercept image requests and serve cached images when available
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET' ||
      request.destination !== 'image') return;

  event.respondWith((async () => {
    const cache = await caches.open(MEDIA_CACHE);
    const cached = await cache.match(request);

    if (cached) return cached;

    const response = await fetch(request);

    if (response.ok || response.type === 'opaque') {
      try {
        await cache.put(request, response.clone());
      } catch (error) {
        console.warn(
          'Could not store billboard image:',
          request.url,
          error
        );
      }
    }

    return response;
  })());
});
