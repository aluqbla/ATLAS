# 🧭 ATLAS — Fase 3.5 · Corrección v0.0.26

**Base autorizada:** ATLAS v0.0.24 validada. La v0.0.25 era una candidata de pruebas no validada. Esta corrección conserva todo el código de producción de la v0.0.24 y la batería de pruebas de la v0.0.25.

## Incidencia

Cinco verificaciones superadas, pero `prueba-integridad.html` informaba de «Service Worker no activo». A diferencia de `prueba-offline.html`, el comprobador de integridad solo consultaba `navigator.serviceWorker.getRegistration()` y no solicitaba el registro ni esperaba la activación. Una visita directa a la página de pruebas podía fallar antes de instalar el Worker, sin que existiese un problema real en la caché.

## Cambios mínimos

- `js/data/test-integridad.js`: registra `./sw.js`, espera su activación y ofrece información de diagnóstico. Verifica la existencia de la caché antes de abrirla.
- `sw.js`: actualiza la versión de la caché estática a `v0.0.26` para almacenar el comprobador corregido.
- `prueba-integridad.html`: identifica la revisión en el título de la página.
- Esta nota de cambios.

**Sin cambios:** `index.html`, CSS, componentes, esquema IndexedDB, repositorios, datos y demás archivos de aplicación. No incorpora datos ficticios ni integra Garmin.

## Validación manual

1. Publicar todos los archivos del ZIP en GitHub Pages, conservando rutas.
2. Con conexión, abrir `prueba-integridad.html`, pulsar «Comprobar integridad» y confirmar los seis resultados satisfactorios y «COMPROBACIONES FINALIZADAS».
3. Activar modo «Sin conexión» en las herramientas del navegador, recargar la misma página y repetir la comprobación. Abrir también `index.html` y verificar las cinco pestañas.
4. Ante un fallo, copiar el texto completo del comprobador. No borrar datos del navegador.

**Estado:** corrección candidata, pendiente de validación manual. Hasta que el usuario la valide, la última versión estable sigue siendo ATLAS v0.0.24.
