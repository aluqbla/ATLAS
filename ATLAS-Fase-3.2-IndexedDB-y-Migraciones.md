# 🧭 ATLAS — Fase 3.2 · IndexedDB y migraciones

**Fecha:** 10-11-2026  
**Candidata:** ATLAS v0.0.20 · **Pendiente de validación manual**.  
**Base exclusiva:** ATLAS v0.0.19 validada, conservada sin modificaciones.  
**Contrato aprobado:** `ATLAS-Fase-3.1-Diseno-de-Datos.md` + arquitectura Fase 0.3.

## 1. Alcance implementado

- Una base IndexedDB local denominada `atlas`, **versión física 1**.
- Migración inicial `0 → 1`: crea almacenes e índices atómicamente en el evento `onupgradeneeded`. Si ya es v1, la reapertura no modifica el esquema.
- Apertura inicial en la aplicación, sin importar, insertar, modificar ni borrar registros. Si falla, se registra el error en consola, sin mostrar datos falsos.
- Reutilización de conexión; cierre explícito y cierre ante `versionchange` de otra pestaña. Aviso en consola ante actualización bloqueada.
- Página de comprobación independiente: `prueba-indexeddb.html`.

**No se han implementado** repositorios, métodos de CRUD, validación de registros, Garmin, caché/offline, sincronización, publicación, motor deportivo ni datos DEMO.

## 2. Esquema físico inicial

| Almacén | Clave | Índices | Propósito |
|---|---|---|---|
| `activities` | `id` | `observedAt`, `sport` | Resúmenes de actividades |
| `activityDetails` | `activityId` | — | Detalle opcional ligado a actividad |
| `observations` | `id` | `[metricKey, observedDate]`, `[metricKey, observedAt]` | Observaciones de salud y rendimiento |
| `plans` | `planId` | — | Planes del usuario |
| `planChanges` | `changeId` | `planId` | Cambios autorizados separados del plan |
| `profile` | `id` | — | Información de perfil |
| `equipment` | `id` | — | Zapatillas/equipamiento |
| `preferences` | `key` | — | Preferencias explícitas |
| `syncState` | `id` | — | Estado futuro de importación y sincronización |

Las siete **áreas conceptuales** de la Fase 3.1 no equivalen a siete almacenes. `observations` une salud y rendimiento porque comparten la estructura de observación; `activityDetails`, `planChanges` y `equipment` se separan porque tienen ciclos de vida propios. Ningún almacén contiene ejemplos.

Las fechas, unidades, fuente, precisión, disponibilidad y `schemaVersion` siguen el contrato aprobado. En la **Fase 3.3** se validará y aplicará el formato de los registros, sin deducir datos de Garmin.

**Decisiones conservadoras:** no se crea un almacén de datos originales sin necesidad comprobada; no se persistirán gráficos ni textos de presentación; no se implementan valores derivados sin fórmulas aprobadas; no se crean índices basados en endpoints o consultas aún desconocidas. Las futuras modificaciones de estructura requerirán migración de versión explícita y transaccional, sin borrar datos del usuario.

## 3. Archivos y cambios

- `index.html`: dos referencias nuevas a scripts de la capa de datos; sin cambios de estructura visual.
- `js/data/db.js`: definición del esquema, migración inicial y ciclo de vida de la conexión.
- `js/data/init.js`: apertura inicial sin ninguna escritura de registros.
- `prueba-indexeddb.html`: comprobación aislada.
- `js/data/test.js`: verificaciones de estructura, índices, cierre y reapertura, sin insertar datos.
- Este documento: registro de alcance y validación.

Los demás archivos de la v0.0.19 se mantienen byte a byte. `prueba-componentes.html` permanece intacto.

## 4. Pruebas y límites

**Comprobaciones técnicas estáticas:** sintaxis JavaScript mediante `node --check`; verificación de nombres e índices con inspección; comparación SHA-256 de los archivos preservados con el ZIP v0.0.19.

**Prueba de navegador:** intentada con Chromium automatizado, pero el entorno bloqueó las navegaciones locales y de prueba (`ERR_BLOCKED_BY_ADMINISTRATOR`). **No se declara superada** la prueba funcional IndexedDB en navegador ni la regresión visual.

**Validación manual solicitada:**
1. Descomprimir el ZIP candidato en una carpeta nueva, sin sobrescribir la v0.0.19.
2. Abrir `index.html` preferentemente en GitHub Pages o un servidor web local y comprobar las cinco pestañas, los diálogos y la ausencia de datos deportivos.
3. Abrir `prueba-indexeddb.html` en **el mismo origen** que la aplicación; pulsar «Comprobar estructura». Debe mostrar cuatro comprobaciones correctas.
4. En las herramientas del navegador, **Almacenamiento / IndexedDB / atlas**, comprobar versión 1 y los nueve almacenes. Si es una instalación nueva, estarán vacíos. Si el origen contiene datos preexistentes, no borrarlos para realizar esta prueba.
5. Si aparece un error, comunicar texto del error, navegador y si se ejecutó en GitHub Pages, servidor local o `file://`.

**Nota:** `file://` puede tener restricciones de almacenamiento según navegador; si ocurre, utilizar GitHub Pages (origen final previsto). IndexedDB es local **por origen y navegador**, no es sincronización entre dispositivos.

## 5. Estado

✅ **Resultado:** estructura IndexedDB v1 y migración inicial implementadas en v0.0.20 candidata. Base estable v0.0.19 preservada. **Pendiente:** validación manual.

🧠 **Prueba:** abrir ambos HTML; pulsar el botón de prueba y comprobar interfaz y almacenes.

⏭ **Siguiente mensaje exacto:** «Valido la Fase 3.2 y la versión ATLAS v0.0.20. Comienza la Fase 3.3 — Repositorios de acceso».

📍 **Conversación:** continuar en la misma conversación de la Fase 3.

📋 **Estado:** Fases 0 (5/5), 1 (5/5), 2 (6/6), cierre sin DEMO y 3.1 validados; 3.2 candidata pendiente de aprobación; 3.3–3.5 pendientes. Última estable: **v0.0.19**.
