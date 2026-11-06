# ATLAS v0.0.21 — Fase 3.2 · IndexedDB y migraciones

**Base:** ATLAS v0.0.20 validada. **Alcance exclusivo:** establecimiento del esquema IndexedDB v1 y del ciclo de vida de la conexión. No se han implementado repositorios, caché, importación ni sustitución de datos DEMO.

## Estructura

- `js/data/database.js`: apertura asíncrona, migraciones ascendentes en transacción de actualización, gestión de conexión, bloqueo, error y cierre por `versionchange`.
- `js/data/model.json`: contrato declarativo originado en la Fase 3.1, actualizado al estado implementado.
- `index.html`: carga del módulo de persistencia antes de `app.js` (scripts nativos, sin dependencias ni compilación).
- `js/app.js`: versión `0.0.21` e inicialización **no bloqueante**; la interfaz funciona aunque IndexedDB falle.
- `tests/persistencia.html`: comprobación manual no destructiva del esquema v1, número de índices y reapertura.

## Esquema inicial

Base de datos `atlas`, versión **1**, con los **14 almacenes** e índices especificados en `model.json`: `athletes`, `activities`, `activityDetails`, `observations`, `rawRecords`, `derivedMetrics`, `equipment`, `personalRecords`, `trainingZones`, `plans`, `sessions`, `planChanges`, `preferences`, `syncState`.

La migración `0 → 1` crea el esquema una sola vez, dentro de `onupgradeneeded`. Si falla, se aborta la transacción de cambio de versión; no se aplica una migración parcial. Las migraciones posteriores deberán añadirse como nuevos pasos en el registro `MIGRATIONS` sin alterar la versión 1. No se eliminan ni recrean almacenes en cada arranque.

Al detectar `versionchange` desde otra pestaña, ATLAS cierra su conexión para no bloquear una actualización. Si otra pestaña bloquea la apertura, se refleja en `status()`. No hay borrado automático ni reinicio forzoso de datos ante un error.

## Contrato interno

`window.ATLASDatabase.open()` devuelve una promesa con la conexión abierta; `close()` cierra la conexión y `status()` devuelve el estado de ciclo de vida. **No es una API de repositorio**. Las operaciones CRUD, validaciones de registros y transacciones de negocio quedan para 3.3.

La apertura inicia al arrancar ATLAS sin bloquear la navegación. **No se escribe ningún dato DEMO en IndexedDB**. Los módulos de Hoy, Actividades, Plan, Evolución y Perfil siguen funcionando exactamente en memoria y con los mismos datos simulados.

## Limitaciones y validación

- IndexedDB sólo persiste en el origen del navegador donde se abrió. No sincroniza dispositivos.
- El almacenamiento puede estar desactivado, bloqueado o ser borrado por el navegador; no se garantiza persistencia permanente.
- Abrir una versión antigua del código sobre una base creada con versión futura genera un error de versión, sin borrar datos.
- Para comprobar en un navegador real: publicar en GitHub Pages, abrir `tests/persistencia.html`, pulsar **Comprobar base local** y verificar los cuatro resultados positivos; después revisar que las cinco pestañas siguen funcionando.
- Pruebas automatizadas del esquema en un navegador real no realizadas en el entorno de entrega debido al bloqueo administrativo de navegación. La sintaxis y la coherencia estática se comprueban por separado; el test manual anterior permanece pendiente de validación.
