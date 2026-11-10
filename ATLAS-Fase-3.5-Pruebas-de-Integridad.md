# 🧭 ATLAS — Fase 3.5 · Pruebas de integridad

**Candidata:** ATLAS v0.0.25. **Base única:** v0.0.24 validada. **Estado:** pendiente de validación manual.

## Alcance

Pruebas independientes de la estructura local IndexedDB v1, repositorios de la Fase 3.3 y caché de la Fase 3.4. No hay Garmin, Worker remoto, Training Engine, datos DEMO ni cambios en las cinco vistas.

## Cambios respecto a v0.0.24

- `prueba-integridad.html`: página independiente con botón y resultado detallado.
- `js/data/test-integridad.js`: batería de pruebas aisladas de una base **exclusiva de pruebas** `atlas-integridad-temporal-v1`. Crea registros técnicos temporales y elimina la base al terminar. No abre `atlas-reconstruccion`.
- `sw.js`: actualiza el identificador de caché a `atlas-reconstruccion-shell-v0.0.25` e incorpora **solo** los dos archivos de la nueva prueba al precache. La estrategia de caché y las rutas previas no cambian.
- Ningún otro archivo de la v0.0.24 ha sido modificado.

## Pruebas cubiertas

1. **IndexedDB:** migración v0→v1 en base temporal, nueve almacenes, índices, cierre y reapertura sin nueva migración.
2. **Repositorios:** lecturas/escrituras de actividad y detalle; observación con cero legítimo; estado `unavailable` sin transformarlo en cero; rechazo de fecha imposible sin persistencia.
3. **Planes:** revisiones, cambios, rechazos de revisión obsoleta y comprobación de que ni el plan ni los cambios quedan parcialmente sobrescritos.
4. **Acceso auxiliar:** perfil, equipo, preferencia booleana `false` y estado local de sincronización (sin sincronizar).
5. **Caché:** Service Worker activo y recursos esenciales de la nueva versión presentes en Cache Storage.
6. **Limpieza:** eliminación al final de la base temporal, incluso ante fallo. No se borran bases reales ni cachés de otras aplicaciones.

## Prueba manual obligatoria

1. Publicar el contenido completo del ZIP en GitHub Pages (HTTPS) o servir por localhost. Abrir `index.html` con conexión para activar el Service Worker; recargar si es necesario.
2. Abrir `prueba-integridad.html` y pulsar **Comprobar integridad**. Confirmar los seis grupos de resultados correctos y ausencia de ❌.
3. Con la página ya instalada y cacheada, activar modo sin conexión en herramientas de desarrollo, recargar **la misma página**, pulsar de nuevo y comprobar el mismo resultado.
4. Abrir `index.html` sin conexión y comprobar que Hoy, Actividades, Plan, Evolución y Perfil funcionan y mantienen estados vacíos. Volver a conectar al terminar.
5. Si alguna prueba falla, adjuntar el texto del comprobador; no validar la fase hasta corregir.

## Comprobaciones técnicas realizadas

- Sintaxis JavaScript (`node --check`) de archivos de prueba y Service Worker.
- Comparación binaria de la interfaz y del resto de archivos frente a la v0.0.24.
- Comprobación de integridad del ZIP.
- **No se ha podido ejecutar la prueba funcional en Chromium:** el entorno bloquea las conexiones del navegador a `localhost` (`ERR_BLOCKED_BY_ADMINISTRATOR`). No se declara superada la ejecución navegador/real/offline.

## Límites

Esta prueba revisa contratos y operaciones representativas, no pretende demostrar que toda implementación futura esté libre de errores ni verifica conectividad Garmin o sincronización entre dispositivos (fases posteriores).

**Última versión estable hasta validación expresa:** v0.0.24. **Fase 3.5:** pendiente de aprobación del usuario.
