// sw.js - Service Worker for DIGITAL FOB • OPS TERMINAL (Red/Yellow/Green Military Theme)
const CACHE_NAME = 'digital-fob-military-v10';   // Bumped version for the new design

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=VT323&display=swap',
  'https://assets.mixkit.co/sfx/preview/296/296.mp3',
  'https://assets.mixkit.co/sfx/preview/143/143.mp3',
  'https://i.imgur.com/m3hwL.jpg'   // Your background image
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Military Cyberpunk v8');
  event.waitUntil(
    caches.open(v10)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Skip external APIs that must stay live
  if (event.request.method !== 'GET' || 
      event.request.url.includes('rss2json.com') || 
      event.request.url.includes('platform.twitter.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});

console.log('[SW] DIGITAL FOB Military Terminal service worker active');
