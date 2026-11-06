# ATLAS v0.0.25 — Ajustes de presentación y navegación

**Base:** v0.0.24 validada. **Fase 4:** no iniciada.

## Modificaciones
- Hoy: sueño con espacio (7h 48min), barras de Estado ATLAS según puntuación y retorno desde sesión propuesta a Hoy.
- Actividades: encabezados de mes igualados a los encabezados de sesiones de Hoy.
- Plan: separadores verticales con extremos libres; Objetivo numérico con tamaño normal; ficha prescrita accesible también para sesiones marcadas como realizadas; retorno desde subeditores a la ficha original; cambio de tipo y selección de ritmos disponibles mediante desplegable DEMO; calendario de cambio de fecha con filas canónicas; títulos que describen repeticiones en sesiones fraccionadas.
- Evolución: «Ritmo umbral» y tamaño de «Pronósticos de carrera» igualado.

## Archivos actualizados
`js/today.js`, `js/plan.js`, `js/evolution.js`, `css/refinement.css`, `js/app.js`, `service-worker.js`, `tests/auditoria-estatica.mjs` y este manifiesto de entrega.

## Alcance
Todos los datos y ediciones siguen siendo DEMO en memoria; ninguna escritura Garmin ni persistencia nueva. El esquema IndexedDB v1, repositorios y cacheo de recursos mantienen su funcionamiento. Se ha actualizado la clave de caché de aplicación, sin tocar el esquema de IndexedDB.

## Validación
La auditoría estática y sintáctica se ejecuta con `node tests/auditoria-estatica.mjs`. La comprobación manual de navegación, editores, diseño en iPhone y retorno entre pestañas queda pendiente.
