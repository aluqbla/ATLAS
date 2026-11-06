# ATLAS v0.0.18 — Fase 3.1 · Diseño de datos

**Estado:** diseño implementado como documentación + manifiesto declarativo. **Sin IndexedDB, migraciones, repositorios, caché, Garmin ni sincronización operativa.** Base: v0.0.17 validada.

## 1. Contrato y separación de responsabilidades

1. **Origen**: Garmin oficial, Garmin privado (sólo con justificación posterior), ATLAS o importación explícita. Guardar el contenido original cuando proceda, con contexto mínimo para su trazabilidad.
2. **Normalización**: un modelo canónico independiente de endpoints, pantallas y dispositivo. El adaptador (fase 4) seleccionará fuente, resolverá equivalencias y documentará cobertura.
3. **Derivación**: cálculos ATLAS identificados por fórmula, versión y referencias de entrada; ninguna estimación se etiquetará como métrica Garmin.
4. **Presentación**: las cinco pestañas convierten unidades y formatos sólo para mostrarlos, sin guardar textos como `5:30/km`, `54,7` o `10,2 km` como valores numéricos.
5. **Persistencia**: IndexedDB será la fuente local a partir de 3.2. Los repositorios y contratos de lectura se ejecutarán sólo en 3.3.

**Regla DEMO:** los arrays y mutaciones actuales de `today.js`, `activities.js`, `plan.js`, `evolution.js` y `profile.js` permanecen intactos. No se consideran datos de usuario ni se migran silenciosamente a la base real.

## 2. Entidades, relaciones e índices propuestos

El manifiesto `js/data/model.json` enumera los **14 almacenes propuestos** para IndexedDB v1, sus claves primarias e índices. Es una especificación, **no una base de datos creada**.

| Entidad | Contenido y relación | Clave |
|---|---|---|
| `athletes` | Identidad/perfil del deportista, sin credenciales | `id` |
| `activities` | Resumen normalizado, clasificación deportiva, tiempo y métricas comunes | `id` |
| `activityDetails` | Relación 1:1 con actividad; vueltas, GPS, series, ejercicios, sensores | `activityId` |
| `observations` | Salud y rendimiento temporal, incluso datos faltantes o no disponibles | `id` |
| `rawRecords` | Registros originales segregados, asociados a actividad u observación | `id` |
| `derivedMetrics` | Cálculos propios trazables y versionados | `id` |
| `equipment` | Zapatillas/equipamiento, estado, límites y modificaciones | `id` |
| `personalRecords` | Marcas, distancia y actividad acreditativa | `id` |
| `trainingZones` | Zonas de FC y ritmo, con vigencia y origen | `id` |
| `plans` | Objetivo, disponibilidad, carreras secundarias, versión y publicación | `id` |
| `sessions` | Entrenamientos, prescripciones, cambios y vinculación con lo realizado | `id` |
| `planChanges` | Historial de cambios confirmados, referencia a revisión anterior | `id` |
| `preferences` | Preferencias con ámbito de aplicación | `id` |
| `syncState` | Progreso confirmado, bloques pendientes/fallidos y cursores | `id` |

**Relaciones:** `athleteId` identifica al propietario local; `activityId` enlaza detalles y mejores marcas; `planId` enlaza sesiones e historial; `completedActivityId` enlaza sesiones con actividades. Los IDs de proveedor **no sustituyen** IDs internos y deben conservar su ámbito. La vinculación sesión–actividad no se infiere sólo por la coincidencia de fecha.

**Dedupe:** identificar por `(athleteId, source, sourceId)` cuando haya ID fiable; si dos fuentes describen el mismo objeto, mantener referencias de ambas y decidir equivalencia sólo mediante reglas verificadas en fase 4.6. No fusionar por proximidad temporal ni elegir valores incompatibles silenciosamente.

## 3. Formato común y unidades

- Fechas de calendario y sesiones: `YYYY-MM-DD` (fecha local). Instantes: ISO 8601 UTC (`...Z`), con zona/offset de origen cuando exista. Nunca construir un instante UTC a partir de una fecha local sin zona.
- Distancia: **metros**; duración: **segundos**; velocidad y ritmo: preferentemente **m/s** y **s/km** como magnitudes explícitas; FC: **ppm**; potencia: **W**; elevación: **m**; cadencia: **pasos/min**, cuando Garmin indique esa interpretación; VFC: **ms**; VO₂ máx.: **ml/kg/min**, conservando decimales reales; carga: unidad original identificada, sin conversión arbitraria.
- Valor ausente: `value:null` más `availability` (`pending`, `unavailable`, `error` o `available`); **0 es un valor válido** distinto de ausencia. Mantener `precision`, `observedAt`, `retrievedAt`, `source`, `sourceId` y `unit`.
- Datos heterogéneos: `sport` y `metric` con identificadores estables, más `details` específicos sólo cuando existan. No imponer campos de carrera a fuerza o ciclismo.
- `rawRecords` guarda datos originales y metadatos; no valores interpretados por la vista. Se establecerán límites de tamaño/retención al implantar, evitando almacenar duplicados pesados innecesariamente.

### Esquemas ilustrativos (no datos reales)

```json
{
  "id": "activity:athlete-1:garmin-official:123",
  "athleteId": "athlete-1",
  "source": "garmin-official",
  "sourceId": "123",
  "startedAt": "2026-10-01T06:15:00Z",
  "localDate": "2026-10-01",
  "sport": "running",
  "distanceMeters": 10000,
  "durationSeconds": 3000,
  "avgHeartRateBpm": null,
  "availability": "available",
  "precision": {"distanceMeters": 1, "durationSeconds": 1},
  "retrievedAt": "2026-10-02T12:00:00Z",
  "updatedAt": "2026-10-02T12:00:00Z"
}
```

```json
{
  "id": "observation:athlete-1:vo2max:2026-10-01:source-123",
  "athleteId": "athlete-1",
  "metric": "vo2max",
  "value": 54.73,
  "unit": "ml/kg/min",
  "observedAt": "2026-10-01",
  "source": "garmin-official",
  "sourceId": "source-123",
  "precision": 0.01,
  "availability": "available",
  "retrievedAt": "2026-10-02T12:00:00Z",
  "updatedAt": "2026-10-02T12:00:00Z"
}
```

*Los IDs, cifras, fechas y procedencias de estos ejemplos son inventados para describir la estructura; no demuestran capacidades de ninguna API.*

## 4. Especificaciones por dominio

**Actividades:** resumen y detalle separados para consultar listados sin descargar GPS ni series. Detalle como agregado por actividad: `laps[]` (índice, duración, distancia, elevación y FC disponibles), `track[]` (tiempo, latitud/longitud cuando proceda), `samples[]` (instante y métricas con unidad), `exercises[]` (serie, repeticiones, carga, duración). No asumir presencia uniforme de datos. Equipamiento referenciado por `equipmentIds[]`.

**Hoy y Evolución:** `observations` registra sueño, VFC, FC reposo, estrés, predisposición, Body Battery, umbrales (ritmo y FC separados), VO₂, volumen, carga y pronósticos según disponibilidad verificada. La granularidad (instante/día/período) es obligatoria. No crear puntos artificiales para completar una gráfica. Eficiencia aeróbica y Estado ATLAS serán `derivedMetrics` **sólo tras validar su fórmula**; no se formaliza ninguna ahora.

**Plan:** `plans` incluye `name`, `distanceMeters`, `goalDurationSeconds`, `startDate`, `raceDate`, `availableWeekdays[]` (1=lunes…7=domingo), `allowDoubleSessions`, `secondaryRaces[]` (ID, nombre, fecha, distancia, importancia), `revision`, `publication` (estado y referencias remotas opcionales), `updatedAt`. `sessions` contiene `planId`, `scheduledDate`, `kind`, `distanceMeters`, `durationSeconds`, `prescription` (estructura versionable), `completedActivityId` opcional, `manualEdit` y `revision`. **El pasado realizado es inmutable para regeneraciones deportivas automáticas.** No publicar, sincronizar ni recalcular en esta fase.

**Perfil:** `athletes`, `equipment`, `trainingZones`, `personalRecords` y `preferences` mantienen relaciones estables. Mejores marcas incluyen 1 km y otras distancias respaldadas; `activityId` puede ser nulo si Garmin entrega una marca sin actividad trazable, indicándolo expresamente.

**Sincronización futura:** `syncState` separa dominio, ventana histórica, cursor, bloques confirmados, pendientes y fallidos, última actualización y error. El avance se confirma **después** de persistir datos íntegros. Para planes: `revision`, `baseRevision` y cambio local pendiente; ninguna colisión se resolverá por último escritor sin informar. La tecnología remota no se decide aquí.

## 5. Garantías y límites del diseño

1. Operaciones futuras idempotentes, con claves deterministas y sin duplicados; actualizaciones de un lote y su cursor de avance deberán ser atómicas.
2. Un registro fuente no se transforma ni se destruye al normalizar. Una observación y su valor calculado nunca comparten almacén.
3. Los campos comunes son convenciones; no imponer `retrievedAt` de Garmin a información creada localmente. Toda mutación local tendrá `updatedAt`.
4. No guardar contraseñas, tokens, secretos, cabeceras de autenticación, ni introducir datos sensibles en trazas y exportaciones.
5. El diseño **no presupone** acceso histórico, precisión ni permisos concretos de Garmin. Se verificará en fase 4.
6. La estructura mínima real, índices y compatibilidad entre navegadores se probarán en 3.2; CRUD en 3.3; uso sin conexión en 3.4; integridad en 3.5.

## 6. Inventario de integración futura con v0.0.17

| Módulo existente | Situación validada | Contrato futuro (sin implementar ahora) |
|---|---|---|
| `today.js` | DEMO local y seis métricas | Observaciones, métricas calculadas, última actividad y sesiones |
| `activities.js` | Catálogo DEMO, ficha canónica, registros ficticios para marcas | Actividades, detalles y equipamiento |
| `plan.js` | Plan editable sólo en memoria | Planes, sesiones, cambios y preferencias |
| `evolution.js` | Series generadas matemáticamente, DEMO | Observaciones y derivados con fechas reales |
| `profile.js` | Perfil DEMO, exportación JSON DEMO | Identidad, zapatillas, zonas, marcas y preferencias |
| `app.js` | Navegación canónica | Sin responsabilidad de persistencia |

**Fuera de alcance de 3.1:** apertura de base, migraciones, escrituras, lectura de repositorios, importación de DEMO, servicio offline, Worker, Garmin, cambios de UI o ajustes del Training Engine.

## 7. Revisión antes de 3.2

Validar en 3.2 la elección entre un agregado de detalle por actividad y una segmentación para series extremadamente grandes. Confirmar qué índices proporcionan rendimiento suficiente con histórico real, sin añadir complejidad anticipada. Los 14 almacenes del manifiesto son una **propuesta revisable**, no garantía de que todos deban crearse inmediatamente.
