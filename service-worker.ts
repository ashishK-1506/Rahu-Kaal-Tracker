/// <reference lib="webworker" />

const SERVICE_WORKER_CACHE_NAME = 'rahu-tracker-v1';
const SERVICE_WORKER_ASSETS = [
  '/',
  '/index.html',
  // In a built React app, main.js/chunk.js would be here. 
  // For this generated code block, we just ensure the SW exists for PWA criteria.
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(SERVICE_WORKER_CACHE_NAME).then((cache) => {
      return cache.addAll(SERVICE_WORKER_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Since we don't have a backend to trigger 'push' events, 
// this listener handles any push events if they were to happen.
self.addEventListener('push', (event: any) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Rahu Kaal Update';
  const options = {
    body: data.body || 'Check the app for today\'s timings.',
    icon: '/icon.png',
    badge: '/badge.png'
  };

  event.waitUntil(
    (self as any).registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  event.waitUntil(
    (self as any).clients.openWindow('/')
  );
});