/* ATLAS v0.0.23 · Fase 3.4: registro no bloqueante del shell offline. */
(() => {
  'use strict';

  // Service Worker requiere un origen seguro. En file:// ATLAS mantiene el modo existente.
  const supported = 'serviceWorker' in navigator &&
    (location.protocol === 'https:' || (location.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)));

  let registration = null;
  let error = null;
  let status = supported ? 'pending' : 'unavailable';

  function snapshot() {
    return Object.freeze({ supported, status, controlled: Boolean(navigator.serviceWorker?.controller), error });
  }

  async function register() {
    if (!supported) return null;
    try {
      // Ruta relativa a la raíz de ATLAS, funciona en Pages /nombre-repo/.
      registration = await navigator.serviceWorker.register('./service-worker.js', { scope: './', updateViaCache: 'none' });
      status = 'registered';
      error = null;
      return registration;
    } catch (cause) {
      error = cause?.message || String(cause);
      status = 'error';
      console.warn('[ATLAS] Caché offline no disponible:', error);
      return null;
    }
  }

  window.ATLASOffline = Object.freeze({ register, status: snapshot });
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
})();
