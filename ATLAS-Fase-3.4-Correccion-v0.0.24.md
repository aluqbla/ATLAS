# ATLAS — Corrección de comprobación offline (v0.0.24)

**Base:** v0.0.23 (candidata de Fase 3.4); última versión estable confirmada: v0.0.22.

## Incidencia

El comprobador anterior detenía la ejecución si `getRegistration` todavía no encontraba un Service Worker activo; no diagnosticaba errores de registro ni instalación. El mensaje observado no prueba por sí mismo que la caché haya fallado.

## Cambios

- `prueba-offline.html`: registro explícito de `./sw.js`, espera controlada de activación, diagnóstico de errores y comprobación de caché e IndexedDB.
- `sw.js`: nueva versión de caché `atlas-reconstruccion-shell-v0.0.24` para actualizar la página de pruebas y limpiar versiones anteriores de la caché de ATLAS.
- `js/data/offline.js`: solo actualización del comentario de versión.

Sin cambios visuales, de repositorios o esquema IndexedDB. Sin Garmin, Training Engine ni datos DEMO. Ninguna base de datos del navegador se borra.

## Prueba manual

1. Publicar **todos** los archivos de v0.0.24 en el mismo directorio de GitHub Pages que `index.html`, manteniendo las carpetas. Esperar a que el despliegue haya terminado; abrir `prueba-offline.html` por HTTPS.
2. Con conexión, pulsar «Comprobar disponibilidad». Debe informar del registro, Service Worker activo, archivos en caché e IndexedDB v1. Si hubo versión anterior, recargar de nuevo y repetir.
3. Simular **Offline** en DevTools > Network, recargar `prueba-offline.html`, repetir la comprobación y abrir `index.html`. Confirmar que las cinco pestañas cargan.
4. Repetir en línea y comprobar que `prueba-indexeddb.html` y `prueba-repositorios.html` siguen funcionando, si se desea regresión.

**Limitación:** no se ha realizado prueba real en GitHub Pages ni una prueba de navegador automatizada en este entorno. La aceptación depende de la validación manual.
