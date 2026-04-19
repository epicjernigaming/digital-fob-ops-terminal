const CACHE_NAME = 'digital-fob-cache-v1';
const urlsToCache = [
  '/digital-fob-ops-terminal/',
  '/digital-fob-ops-terminal/index.html',
  '/digital-fob-ops-terminal/background.jpg',
  '/digital-fob-ops-terminal/favicon.png',
  '/digital-fob-ops-terminal/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=VT323&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Install - Cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Digital FOB: Caching core terminal files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Digital FOB: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch - Serve from cache when offline, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Optional: Return a fallback page if offline and nothing cached
        if (event.request.mode === 'navigate') {
          return caches.match('/digital-fob-ops-terminal/index.html');
        }
      })
  );
});
