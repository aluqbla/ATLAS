# 🧭 ATLAS — Fase 3.5 · Corrección v0.0.28

**Estado:** candidata para validación manual. **Base técnica:** v0.0.27, derivada de la v0.0.24 estable validada; sin modificar código funcional de IndexedDB, repositorios, vistas ni estilos.

## Incidencia reproducida en la captura de v0.0.27

El Service Worker declaró `atlas-reconstruccion-shell-v0.0.27`, mientras que la página de integridad comprobaba `atlas-reconstruccion-shell-v0.0.26`. Esta discrepancia provoca un falso fallo «La caché de esta versión no existe» incluso si la caché activa está correctamente instalada.

## Cambios

- `sw.js`: nombre de caché actualizado a `atlas-reconstruccion-shell-v0.0.28`.
- `js/data/test-integridad.js`: expectativa alineada a `atlas-reconstruccion-shell-v0.0.28`; el resto de las pruebas permanece intacto.
- `prueba-integridad.html`: etiqueta de versión actualizada.
- Este archivo documenta el alcance y las comprobaciones.

La actualización de nombre permite al Service Worker distribuir la prueba actual y retirar las cachés antiguas de ATLAS tras activar la nueva. No se borra IndexedDB ni se cambia la base de datos real.

## Verificación técnica y manual

Sintaxis JavaScript de los archivos modificados; igualdad entre ambas constantes de caché; integridad ZIP; comparación de archivos conservados con v0.0.27. **La prueba funcional en navegador no se declara superada**. Publicar todos los archivos en GitHub Pages, abrir `prueba-integridad.html` con conexión, repetir sin conexión y confirmar las seis pruebas y el mensaje final. Si el resultado falla, adjuntar el texto exacto.
