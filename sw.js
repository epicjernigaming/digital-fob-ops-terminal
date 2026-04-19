const CACHE_NAME = 'digital-fob-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/background.jpg',
  '/favicon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
