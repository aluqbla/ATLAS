/* ATLAS v0.0.29 · Fase 3.4: caché estática de la aplicación; sin datos deportivos. */
'use strict';
const CACHE_NAME = 'atlas-reconstruccion-shell-v0.0.29';
const CACHE_PREFIX = 'atlas-reconstruccion-shell-';
const SHELL = [
  './', './index.html', './prueba-offline.html',
  './prueba-integridad.html', './js/data/test-integridad.js',
  './assets/ATLAS.jpeg',
  './css/tokens.css', './css/base.css', './css/components.css',
  './css/navigation.css', './css/today.css', './css/activities.css',
  './css/plan.css', './css/evolution.css', './css/profile.css',
  './css/canonical.css', './css/empty.css',
  './js/navigation.js', './js/views.js',
  './js/data/db.js', './js/data/repositories.js',
  './js/data/init.js', './js/data/offline.js'
];
const ALLOWED_PATHS = new Set(SHELL.map(path => new URL(path, self.registration.scope).pathname));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  if (!ALLOWED_PATHS.has(url.pathname)) return;
  // No almacenar parámetros, peticiones de API ni páginas desconocidas.
  if (url.search) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, {ignoreSearch: false});
    if (cached) return cached;
    return fetch(request);
  })());
});
