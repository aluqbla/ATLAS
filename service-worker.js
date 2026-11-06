/* ATLAS v0.0.23 · Fase 3.4: caché exclusivamente de archivos de aplicación. */
'use strict';

const SHELL_VERSION = '0.0.25';
const CACHE_PREFIX = 'atlas-shell-';
const CACHE_NAME = `${CACHE_PREFIX}${SHELL_VERSION}`;
// Todas las rutas relativas al ámbito del Worker; compatibles con repositorios de GitHub Pages.
const SHELL_FILES = Object.freeze([
  './', './index.html',
  './assets/atlas-wordmark.jpeg',
  './css/tokens.css', './css/base.css', './css/components.css',
  './css/navigation.css', './css/today.css', './css/activities.css',
  './css/plan.css', './css/refinement.css', './css/evolution.css', './css/profile.css',
  './js/data/database.js', './js/data/repositories.js', './js/data/model.json',
  './js/data/offline.js', './js/app.js', './js/today.js',
  './js/activities.js', './js/plan.js', './js/evolution.js', './js/profile.js'
]);
const SHELL_URLS = SHELL_FILES.map(file => new URL(file, self.registration.scope).href);
const SHELL_SET = new Set(SHELL_URLS);
const INDEX_URL = new URL('./index.html', self.registration.scope).href;

self.addEventListener('install', event => {
  // Instalación todo-o-nada: si falta un archivo, no activamos un shell incompleto.
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      await cache.addAll(SHELL_URLS);
    } catch (error) {
      await caches.delete(CACHE_NAME);
      throw error;
    }
    // Sin skipWaiting: una pestaña abierta nunca mezcla archivos de dos versiones.
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;

  if (request.mode === 'navigate') {
    // Sólo la portada usa el shell fijo de esta versión. Así no se mezcla HTML nuevo
    // con JS/CSS viejos si hay otra actualización esperando a que se cierren pestañas.
    const isAppHome = url.href === INDEX_URL || url.href === self.registration.scope;
    if (!isAppHome) return;
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(INDEX_URL);
      if (cached) return cached;
      try { return await fetch(request); }
      catch (_) { return Response.error(); }
    })());
    return;
  }

  // Únicamente recursos precargados. Nunca cachear solicitudes de Garmin, Worker ni datos API.
  if (!SHELL_SET.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(url.href);
    return cached || fetch(request);
  })());
});
