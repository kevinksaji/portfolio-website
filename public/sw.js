// Service Worker for Portfolio Website with automatic updates
const CACHE_NAME = `portfolio-v${Date.now()}`; // Dynamic cache name for each deployment
const urlsToCache = [
  '/',
  '/about',
  '/experience',
  '/blog',
  '/contact',
  '/chat',
  '/kevin-headshot.jpg',
  '/kevin-floorball-homepage.jpg',
  '/kevin-family.jpg',
  '/kevinksaji_resume.pdf'
];

// Install event - cache resources with new cache name
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// Fetch event - serve from cache when possible, but check for updates
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          // Check for updates in the background
          fetch(event.request).then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              // Update cache with fresh content
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, fetchResponse.clone());
              });
            }
          }).catch(() => {
            // Network failed, keep using cached version
          });
          return response;
        }
        // No cache, fetch from network
        return fetch(event.request);
      })
  );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

