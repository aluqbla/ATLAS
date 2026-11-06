# ATLAS v0.0.24 — Fase 3.5 · Pruebas de integridad

**Base:** v0.0.23 validada. **Alcance exclusivo:** auditoría y pruebas de persistencia local, repositorios y caché. No se integran datos DEMO, Garmin, ni sincronización ni Training Engine.

## Qué se añadió

- `tests/auditoria-estatica.mjs`: auditoría local de solo lectura con Node.js. Comprueba contrato JSON, recursos, shell offline, sintaxis JS, migración simulada y cobertura declarativa de repositorios.
- `tests/integridad.html`: batería de integración para ejecutar en GitHub Pages/localhost, usando claves de prueba únicas y eliminándolas al terminar. Comprueba 14 almacenes e índices, operaciones CRUD, índices y paginación, unicidad, transacción multi-almacén, rollback, cierre/reapertura y caché instalada.
- Este informe de resultados.

## Resultados ejecutados en el entorno de desarrollo

| Prueba | Resultado | Naturaleza |
|---|---|---|
| Contrato de 14 entidades y unicidad de almacenes | ✅ Correcta | Estática |
| Referencias locales de HTML existentes | ✅ Correcta | Estática |
| Caché de shell: 23 recursos, versiones y exclusión de API | ✅ Correcta | Estática |
| Sintaxis de los archivos JavaScript | ✅ Correcta | Análisis de sintaxis |
| Creación de esquema v1 e índices | ✅ Correcta | Simulación controlada de IndexedDB, **no navegador real** |
| Correspondencia declarativa de repositorios | ✅ Correcta | Estática |
| IndexedDB real: transacciones, rollback y reapertura | ⏳ Pendiente | Navegador |
| Service Worker: instalación, control, recarga offline | ⏳ Pendiente | Navegador + prueba sin red |
| Integridad visual/funcional de todas las pestañas | ⏳ Pendiente | Validación manual |

**Total ejecutado:** 6 correctas / 0 fallidas. Se comprobó que el navegador Chromium proporcionado en el entorno bloquea la navegación incluso a `data:` con `ERR_BLOCKED_BY_ADMINISTRATOR`; no se sustituyó esa prueba por una afirmación de éxito.

## Cómo ejecutar las pruebas reales

1. Publicar esta carpeta ATLAS en el mismo repositorio/origen de GitHub Pages utilizado para ATLAS, sin trasladar ni borrar la base IndexedDB existente.
2. Abrir `https://<usuario>.github.io/<repositorio>/tests/integridad.html`, esperar la instalación del Service Worker y pulsar **Ejecutar comprobaciones**. Si el Service Worker aparece «no activo», abrir `index.html`, cerrar las pestañas de ATLAS, recargar y repetir.
3. Verificar los resultados visibles: ninguna fila roja, y limpieza final correcta. La prueba usa identificadores `__atlas_integrity_035_...` exclusivos. No debe ejecutarse simultáneamente en otra pestaña con esos mismos identificadores.
4. Abrir `tests/offline.html` para comprobar el shell; después abrir ATLAS conectado, cerrar pestañas antiguas, volver a abrir conectado, cortar red y recargar `index.html`. Las pestañas DEMO deben renderizarse sin conexión. Volver a conectar al terminar.
5. Confirmar manualmente que Hoy, Actividades, Plan, Evolución, Perfil y las fichas siguen funcionando igual que en v0.0.23.

**Limitación importante:** el test de navegador realiza operaciones breves exclusivamente sobre registros de prueba en la base `atlas` real (mismo origen) y los elimina. Si se interrumpe bruscamente, podrían quedar registros temporales cuyo identificador empieza por `__atlas_integrity_035_`; el test no borra nada ajeno. No se prueba recuperación tras fallo físico ni cuotas llenas.

## Conservación y versionado

- `js/data/database.js` y `js/data/repositories.js` **sin cambios**; 14 almacenes, mismo esquema v1.
- HTML de aplicación, estilos y módulos de cinco pestañas **sin cambios**.
- `js/app.js` cambia **únicamente el número visible** a `0.0.24`.
- `service-worker.js` actualiza **únicamente SHELL_VERSION** a `0.0.24`, para que los dispositivos reciban la nueva versión de `app.js` sin mezclar cachés.
- Se conservan intactos los 23 archivos del shell y no se cachea contenido de las páginas de pruebas.

**Estado:** fase 3.5 ejecutada técnicamente, con pruebas reales pendientes de validación manual. No declarar fase 3 completamente validada hasta obtener el resultado del navegador y la confirmación del usuario.
