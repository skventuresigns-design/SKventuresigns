
/* S&K Billboard TEST offline cache.
   Caches the test player, playlist, and advertising images.
   Online image requests refresh the cache.
   Offline image requests use the last cached copy.
   Video caching is not enabled yet.
*/

const MEDIA_CACHE = 'sk-billboard-media-test-v1';
const APP_CACHE = 'sk-billboard-app-test-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const names = await caches.keys();

        await Promise.all(names
            .filter(name =>
                name.startsWith('sk-billboard-media-test-') &&
                name !== MEDIA_CACHE
            )
            .map(name => caches.delete(name)));

        await self.clients.claim();
    })());
});

// Receive requests to refresh and cache advertising images.
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

                // Always try to get the newest image.
                // A failed request leaves the old cached image intact.
                const response = await fetch(request);

                if (response.ok || response.type === 'opaque') {
                    await cache.put(request, response.clone());
                }
            } catch (error) {
                console.warn('Image cache refresh failed:', rawUrl, error);
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

// Handle billboard page, playlist, and image requests.
self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();

    // Offline startup for the TEST billboard page.
    if (request.mode === 'navigate' &&
        path.endsWith('/billboard-test.html')) {

        event.respondWith((async () => {
            const cache = await caches.open(APP_CACHE);
            const pageKey = new URL(
                '/Billboard-test.html',
                self.location.origin
            ).href;

            try {
                const response = await fetch(request);

                if (response.ok) {
                    await cache.put(pageKey, response.clone());
                }

                return response;
            } catch (error) {
                const savedPage = await cache.match(pageKey);

                if (savedPage) return savedPage;

                return new Response(
                    'Billboard test page has not been cached yet.',
                    { status: 503 }
                );
            }
        })());

        return;
    }

    // Save the TEST playlist as an additional offline backup.
    if (path.endsWith('/playlist-test.json')) {
        event.respondWith((async () => {
            const cache = await caches.open(APP_CACHE);
            const playlistKey = new URL(
                '/playlist-test.json',
                self.location.origin
            ).href;

            try {
                const response = await fetch(request);

                if (response.ok) {
                    await cache.put(playlistKey, response.clone());
                }

                return response;
            } catch (error) {
                const savedPlaylist = await cache.match(playlistKey);

                if (savedPlaylist) return savedPlaylist;

                return new Response(
                    'No saved test playlist is available.',
                    { status: 503 }
                );
            }
        })());

        return;
    }

    // Online: use the newest image and update the cache.
    // Offline: use the last successfully cached image.
    if (request.destination === 'image') {
        event.respondWith((async () => {
            const cache = await caches.open(MEDIA_CACHE);

            try {
                const response = await fetch(request);

                if (response.ok || response.type === 'opaque') {
                    await cache.put(request, response.clone());
                    return response;
                }

                const cached = await cache.match(request);
                return cached || response;

            } catch (error) {
                const cached = await cache.match(request);

                if (cached) return cached;

                return new Response(
                    'Image is not available offline.',
                    { status: 503 }
                );
            }
        })());
    }
});
