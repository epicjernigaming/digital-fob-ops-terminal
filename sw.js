// sw.js - Service Worker for DIGITAL FOB • OPS TERMINAL
const CACHE_NAME = 'digital-fob-ops-terminal-v5';  // Updated version (bump this when you make changes)

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json',
  // Core assets
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=VT323&display=swap',
  // Sound files (fallback if needed)
  'https://assets.mixkit.co/sfx/preview/296/296.mp3',
  'https://assets.mixkit.co/sfx/preview/143/143.mp3'
];

// Install event - Cache important files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing new version:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())  // Activate immediately
  );
});

// Activate event - Clean up old caches
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
    }).then(() => self.clients.claim())  // Take control of all pages immediately
  );
});

// Fetch event - Serve from cache when offline, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and external API calls (like RSS proxy and Twitter)
  if (event.request.method !== 'GET' || 
      event.request.url.includes('api.rss2json.com') || 
      event.request.url.includes('platform.twitter.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request).then((networkResponse) => {
          // Cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return networkResponse;
        }).catch(() => {
          // Offline fallback (could show a custom offline page in future)
          console.log('[Service Worker] Offline - serving from cache if possible');
        });
      })
  );
});

console.log('[Service Worker] DIGITAL FOB Ops Terminal service worker registered');
