const CACHE_NAME = 'digital-fob-v3';   // ← changed from v2 or v1 to v3

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(v4).then(cache => {
      return cache.addAll([
        '/index.html',
        '/favicon.png',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
