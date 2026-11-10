# 🧭 ATLAS — Fase 3.4 · Caché y funcionamiento sin conexión

**Fecha:** 10-11-2026. **Versión candidata:** v0.0.23. **Base exclusiva:** v0.0.22 (validada por el usuario). **Estado:** pendiente de validación manual. No sobrescribir la v0.0.22.

## Alcance estricto

Se añade **un Service Worker nativo** (`sw.js`) con caché versionada de archivos estáticos para poder recargar la interfaz ya instalada sin red. Se registra desde `js/data/offline.js`, sin bloquear la aplicación. La caché `atlas-reconstruccion-shell-v0.0.23` contiene únicamente el HTML, CSS, scripts propios, logotipo y página de comprobación sin conexión. Al instalar una versión nueva precarga sus recursos y, una vez activada, elimina **únicamente** las cachés de ATLAS con prefijo `atlas-reconstruccion-shell-` de otras versiones. No borra cachés ajenas.

**Los datos deportivos NO se duplican en Cache Storage:** IndexedDB v1 y los repositorios de la 3.3 continúan como única persistencia local de registros. No se modifica ninguna tabla ni se introduce nueva migración. Las vistas mantienen su estado vacío, pues todavía no les corresponde consumir datos. La caché no simula Garmin ni aporta datos inexistentes.

**Límites:** el Service Worker sólo intercepta recursos de la aplicación incluidos en la lista estática y peticiones GET sin parámetros del mismo origen. No intercepta URLs desconocidas, peticiones con query string, escrituras ni futuras peticiones a APIs. No se implementan estrategias de sincronización ni importación ni funcionalidades de la Fase 4. Si el navegador purga el almacenamiento, o el usuario borra datos del sitio, la disponibilidad offline no está garantizada. El primer acceso/instalación sí necesita conexión. `file://` no admite Service Workers: se requiere GitHub Pages o localhost (contexto seguro).

## Archivos modificados

- `index.html`: una línea para cargar `js/data/offline.js`; ningún cambio de elementos o estilos.
- `sw.js`: nuevo, precaché de recursos propios, política de caché estática y limpieza exclusivamente de versiones anteriores de ATLAS.
- `js/data/offline.js`: registro sin bloquear la UI, únicamente cuando hay contexto seguro y soporte.
- `prueba-offline.html`: página de comprobación sin datos de demostración. También se guarda para permitir recarga offline.
- Este documento.

**Sin cambios:** `db.js`, `repositories.js`, `views.js`, `navigation.js`, demás JS existentes, CSS, activos, pruebas anteriores. No hay rediseño ni datos reales o ficticios.

## Verificaciones

- Sintaxis JavaScript de nuevos archivos.
- Comprobación de que todos los archivos precacheados existen.
- Comparación SHA-256 de los archivos originales salvo la inserción puntual de un script en `index.html`.
- Integridad del ZIP.
- **Navegador automático:** intento en Chromium local bloqueado por `ERR_BLOCKED_BY_ADMINISTRATOR`, por lo que **no se afirma probado el funcionamiento real sin red**.

## Validación manual necesaria

1. **Publica la carpeta de esta candidata** en GitHub Pages bajo el mismo origen/ruta que vayas a usar para esta prueba, o sírvela desde `localhost`. No basta abrir por doble clic (`file://`). Idealmente usa un despliegue de prueba separado para no sustituir tu versión estable.
2. **Con red:** abre `index.html` y después `prueba-offline.html`. Pulsa «Comprobar disponibilidad». Debe indicar Service Worker activo, archivos esenciales en caché e IndexedDB versión 1. Si no está aún activo, recarga una vez con conexión. Comprueba que las pestañas funcionan.
3. **Sin red:** en herramientas del navegador activa modo *Offline* para el mismo origen, recarga `prueba-offline.html` y repite «Comprobar disponibilidad». Debe seguir mostrando resultados correctos. Desde allí abre `index.html`, recárgalo sin red y comprueba que las cinco pestañas siguen funcionando sin datos simulados.
4. **Regresión:** vuelve a conectar, comprueba `prueba-indexeddb.html` y `prueba-repositorios.html` de nuevo online. Las pruebas anteriores son independientes y no están precacheadas.
5. Si hay un fallo, comunica el mensaje íntegro, el navegador, el tipo de publicación y si el Service Worker figura activo. No borres ninguna base del navegador ni fuerces una limpieza general de caché.

**Pendiente:** validación manual explícita de la 3.4. No comenzar 3.5 sin autorización.
