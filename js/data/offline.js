/* ATLAS v0.0.24 · Fase 3.4: registro no bloqueante de caché estática. */
(() => {
  'use strict';
  // file:// no permite Service Workers. GitHub Pages o localhost sí.
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', {scope: './'}).catch(error => {
      console.warn('ATLAS: caché de aplicación no disponible.', error);
    });
  }, {once:true});
})();
