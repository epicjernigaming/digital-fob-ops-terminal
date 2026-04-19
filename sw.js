// sw.js - Service Worker for DIGITAL FOB • OPS TERMINAL (Replaced Cyberpunk Theme)
const CACHE_NAME = 'digital-fob-replaced-v6';   // Updated version - bump when making changes

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json',
  // Core CDNs
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=VT323&display=swap',
  // Sound files
  'https://assets.mixkit.co/sfx/preview/296/296.mp3',
  'https://assets.mixkit.co/sfx/preview/143/143.mp3'
];

// Install - Cache essential files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Replaced Cyberpunk version:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())   // Activate immediately
  );
});

// Activate - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating new version');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Serve cached files when offline, skip external APIs
self.addEventListener('fetch', (event) => {
  // Skip RSS proxy, Twitter embeds, and non-GET requests
  if (event.request.method !== 'GET' || 
      event.request.url.includes('rss2json.com') || 
      event.request.url.includes('platform.twitter.com') ||
      event.request.url.includes('steamstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        }).catch(() => {
          console.log('[Service Worker] Offline fallback for:', event.request.url);
        });
      })
  );
});

console.log('[Service Worker] DIGITAL FOB Replaced Cyberpunk theme service worker active');
