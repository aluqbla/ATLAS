/* Fase 3.2 · Inicialización estructural; no carga, importa ni altera registros. */
(() => {
  'use strict';
  window.ATLASDatabase.open().catch((error) => {
    console.error('ATLAS: almacenamiento local no disponible.', error);
  });
})();
