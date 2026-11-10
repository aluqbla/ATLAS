# 🧭 ATLAS — Fase 3.5 · Corrección de diagnóstico v0.0.27

**Base:** v0.0.26 (candidata no validada), derivada exclusivamente de la v0.0.24 estable.

## Incidencia observada

La prueba v0.0.26 confirmó la estructura de IndexedDB y después se detuvo con `undefined is not an object (evaluating 'r.ActivityRepository.list()')`. **No demuestra una avería del repositorio:** la prueba no comprobaba la existencia de su API tras cargar el archivo. Las comprobaciones restantes no llegaron a ejecutarse.

## Cambios limitados a la prueba

- `js/data/test-integridad.js`: verifica la inicialización del módulo antes de invocarlo; captura posibles errores de ejecución y describe el problema.
- Con conexión, la prueba solicita `repositories.js` mediante URL versionada para eludir respuestas anteriores; sin conexión usa la URL estática guardada por el Service Worker.
- `sw.js`: versión de caché `v0.0.27` para distribuir los archivos de prueba corregidos.
- `prueba-integridad.html`: título actualizado.

**Sin cambios:** `index.html`, CSS, diseño, datos, `db.js`, `repositories.js`, vistas, funciones Garmin o motor deportivo. La base técnica de pruebas es independiente y se elimina al terminar.

## Validación pendiente

Publicar todos los archivos, abrir `prueba-integridad.html` conectado a Internet y pulsar **Comprobar integridad**. Si hay un fallo, copiar su mensaje completo (ahora con diagnóstico de carga). Repetir la prueba sin conexión cuando sea satisfactoria en línea. No declarar validada esta subfase hasta la confirmación manual.

No se ha confirmado el origen final del error de Safari; este cambio evita atribuirlo equivocadamente a los repositorios y permite identificar su causa.
