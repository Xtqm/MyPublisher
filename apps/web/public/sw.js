// MyPublisher Service Worker
// Sub-phase 0A: minimal registration. Offline caching logic comes in later phases.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
