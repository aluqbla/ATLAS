# 🧭 ATLAS — Fase 3.3 · Repositorios de acceso

**Fecha:** 10-11-2026. **Candidata:** ATLAS v0.0.22, pendiente de validación manual. **Base exclusiva:** v0.0.21 validada. No se modifica ni se sobrescribe el ZIP estable.

## Alcance

Añadido `js/data/repositories.js` utilizando directamente el esquema v1 de `atlas-reconstruccion`, **sin nuevas migraciones**. Contiene repositorios de acceso local: `ActivityRepository`, `MetricRepository`, `PlanRepository`, `ProfileRepository`, `EquipmentRepository`, `PreferenceRepository`, `SyncStateRepository`. No hay integración de las vistas, Garmin, importación, sincronización remota, caché/offline ni Training Engine.

Las operaciones devuelven resultado explícito `{ok:true,data,updatedAt}` o `{ok:false,error:{code,message,retryable}}`; errores de validación, duplicado, conflicto y almacenamiento se distinguen. `get` devuelve `data:null` si no existe; una colección vacía devuelve `[]`, sin crear registros. No se convierten ausencias en cero.

## API disponible

- **Actividades:** `get(id)`, `list({sport,from,to})`, `save(record)`, `getDetail(activityId)`, `saveDetail(record)`. Detalle separado del resumen; filtro cronológico/por deporte.
- **Métricas:** `get(id)`, `list(metricKey,{from,to})`, `save(record)`. Salud y rendimiento comparten el almacén `observations`. Cero numérico válido.
- **Planes:** `get(planId)`, `list()`, `save(plan,expectedRevision)` y `addChange(planId,change,expectedRevision)`, `changes(planId)`. Una creación parte de revisión esperada `null`; cada edición exige la revisión vigente. Un cambio manual se incorpora al historial separado de forma transaccional, elevando la revisión del plan; revisión obsoleta devuelve `CONFLICT` sin escritura.
- **Auxiliares:** `get`/`save` por ID o clave de perfil, equipamiento, preferencias y estado de sincronización. Equipamiento dispone además de `list()`.

Validación mínima: ID, versión de registro 1, procedencia, disponibilidad, fechas ISO con zona en hechos temporales, precisión y unidad para observaciones cuantitativas. No se intenta validar contenido ni formatos de Garmin aún no auditados. No se introduce ningún cálculo deportivo. Los repositorios no tocan el DOM ni hacen llamadas remotas.

**Límite importante:** el repositorio de planes guarda la *configuración* del plan, no calendarios, propuestas, sesiones ni publicación. Rechaza esos campos para evitar sobrescritura del pasado. El control semántico de ediciones futuras y la construcción del calendario efectivo corresponden al Training Engine; la resolución multidispositivo corresponde a fases posteriores. `syncState` guarda datos locales, pero no sincroniza nada.

## Archivos cambiados

- `index.html`: **una sola línea** para cargar `repositories.js`; sin cambios de elementos, estilos ni navegación.
- `js/data/repositories.js`: nuevo módulo nativo, sin bibliotecas.
- `prueba-repositorios.html` y `js/data/test-repositories.js`: prueba técnica aislada que utiliza una base diferente llamada `atlas-prueba-repositorios-temporal`, la elimina al terminar y **no escribe en `atlas-reconstruccion`**.
- Este documento.

Sin cambios en `db.js`, `init.js`, `views.js`, `navigation.js`, CSS, activos, `prueba-componentes.html` ni `prueba-indexeddb.html`.

## Pruebas

**Comprobación estática:** sintaxis de JavaScript, estructura del ZIP, esquema sin cambios y comparación SHA-256 de todos los archivos preservados con v0.0.21. **Prueba automática funcional:** no completada; el entorno bloqueó la navegación de Chromium (`ERR_BLOCKED_BY_ADMINISTRATOR`). No se atribuye éxito al navegador.

**Validación manual:**
1. Descomprime esta candidata en carpeta independiente; abre `prueba-repositorios.html` en el mismo entorno/origen que utilizaste para la fase 3.2.
2. Pulsa **Comprobar repositorios** y comprueba lectura vacía, validación, actividades, métricas, revisiones/conflictos de planes, preferencias y eliminación de la base temporal. Las entradas de prueba son **exclusivamente temporales y técnicas**, no se añaden a la aplicación real.
3. Abre `prueba-indexeddb.html` y comprueba de nuevo la estructura v1 (9 almacenes). Después abre `index.html` y comprueba las cinco pestañas vacías y el diseño sin alteraciones.
4. Si alguna comprobación falla, envía el mensaje completo y el navegador. No borres ninguna base de datos manualmente.

**Estado:** Fases 0, 1, 2, 3.1 y 3.2 validadas. 3.3 entregada pendiente de validación; 3.4 y 3.5 no iniciadas. La última versión estable sigue siendo v0.0.21.
