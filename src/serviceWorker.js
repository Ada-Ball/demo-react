// src/serviceWorker.js
const CACHE_NAME = 'pwa-login-cache-v1';
const urlsToCache = [
  '/my-app/',  // เพิ่ม repository name
  '/my-app/index.html',
  '/my-app/static/css/main.css',
  '/my-app/static/js/main.js'
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
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});