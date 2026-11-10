# ATLAS v0.0.29 — Corrección de actualización del comprobador

**Base:** v0.0.28 candidata, derivada de v0.0.24 estable. Fase 3.5; pendiente de validación manual.

## Incidencia

El archivo de pruebas v0.0.28 contenía el nombre correcto de caché, pero GitHub Pages continuaba ejecutando JavaScript antiguo (v0.0.26). La causa compatible con la evidencia es que el Service Worker anterior aplica una estrategia cache-first a `prueba-integridad.html` y a `js/data/test-integridad.js`.

## Cambio mínimo

- `prueba-integridad.html`: indica la versión visible e incorpora una solicitud con parámetro de revisión del JavaScript cuando hay red, para saltar la caché anterior; sin conexión usa la ruta canónica guardada en la caché.
- `js/data/test-integridad.js`: nombre de caché actualizado a v0.0.29.
- `sw.js`: nombre de caché actualizado a v0.0.29. No cambia el comportamiento del Service Worker.

## Prueba manual

1. Publicar el ZIP completo en el directorio configurado de GitHub Pages.
2. Con conexión, visitar `prueba-integridad.html?revision=0.0.29`. El texto **Comprobador v0.0.29** debe aparecer. Pulsar **Comprobar integridad** y confirmar las verificaciones positivas.
3. Esperar activación completa del Service Worker. Abrir sin parámetro `prueba-integridad.html` y verificar la versión visible.
4. Activar modo sin conexión y recargar la URL **sin parámetro**; volver a pulsar. La primera visita con parámetro debe hacerse con conexión, porque el Service Worker deliberadamente no intercepta URL con query string.

La prueba usa una base temporal; no borrar cachés ni IndexedDB manualmente. Si la versión visible no coincide, verificar que la rama y carpeta publicadas son las correctas.

**No modificados:** `index.html`, CSS, repositorios, IndexedDB, interfaces, recursos visuales ni datos persistentes. Las pruebas funcionales de navegador quedan pendientes de validación manual.
