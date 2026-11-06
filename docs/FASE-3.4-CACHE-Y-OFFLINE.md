# Fase 3.4 — Caché y funcionamiento sin conexión (ATLAS v0.0.23)

**Base:** v0.0.22 validada. **Alcance:** conservar accesibles los archivos estáticos de la aplicación después de una primera visita conectada. No se conectan las vistas a IndexedDB ni se simulan datos Garmin.

## Implementación

- `service-worker.js`: caché de shell versionada (`atlas-shell-0.0.23`) con instalación atómica. Incluye `index.html`, CSS, JavaScript y logotipo; se limita al ámbito de la aplicación en GitHub Pages.
- `js/data/offline.js`: registro no bloqueante desde la portada. Compatible con repositorios publicados bajo subrutas, sin URLs absolutas. No registra Service Worker bajo `file://`.
- `index.html`: carga de `offline.js` antes de `app.js`. No se modifican las vistas ni el diseño.
- `js/app.js`: cambia únicamente el número de versión (0.0.23). `js/data/model.json`: cambia únicamente el estado documental.
- `tests/offline.html`: comprobación no destructiva del caché mediante navegador.

## Comportamiento y límites

1. La primera apertura requiere conexión y un origen seguro (HTTPS de GitHub Pages o localhost). Si no se puede descargar uno de los archivos, la instalación completa del Service Worker se rechaza, evitando dejar una versión aparentemente lista pero incompleta.
2. Tras instalación, el HTML de inicio y los recursos del shell se sirven desde la misma versión de la caché. Las siguientes versiones activan la nueva caché cuando dejan de estar abiertas las pestañas de la versión anterior; no se fuerza la activación con `skipWaiting`.
3. Sólo las solicitudes GET de archivos estáticos explícitamente enumerados y pertenecientes al ámbito local son interceptadas. No hay cacheo de Garmin, APIs, Worker, credenciales o solicitudes externas.
4. El Service Worker puede ser desalojado por el navegador o perder su caché por falta de espacio. La experiencia offline es de *mejor esfuerzo*, no almacenamiento garantizado.
5. Los 14 almacenes IndexedDB y repositorios de la Fase 3.3 no se modifican, y **los datos DEMO no se guardan**. La disponibilidad real de datos deportivos offline dependerá de su futura integración en las fases de Garmin/importación, sin anticiparla aquí.
6. `file://` continúa funcionando con la interfaz DEMO como antes, pero sin Service Worker. No se garantiza que una apertura nueva de GitHub Pages sin conexión funcione si nunca se instaló el shell.

## Verificación manual (GitHub Pages)

1. Desplegar el ZIP, abrir `index.html` online y recorrer las cinco pestañas (deben conservar DEMO).
2. Esperar la instalación y abrir `tests/offline.html`; pulsar **Comprobar caché** y verificar recursos presentes.
3. Cerrar todas las pestañas de ATLAS; volver a abrir ATLAS online y luego desactivar la red en las herramientas del navegador. Recargar la portada y recorrer las cinco pestañas. Las pantallas DEMO y el logo deben seguir visibles.
4. Reactivar la red; comprobar que la navegación continúa y que las páginas de pruebas previas de IndexedDB siguen accesibles.
5. Para probar actualizaciones posteriores, instalar una versión nueva, cerrar todas las pestañas de la anterior y comprobar que aparece su versión sin mezclas.

**No incluye:** caché de datos deportivos ni lógica de lecturas offline desde IndexedDB, sincronización, publicaciones o migraciones adicionales.
