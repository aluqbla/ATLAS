# 🧭 ATLAS — Fase 3.2 · Corrección de incidencia v0.0.21

**Estado:** candidata pendiente de validación manual. **Última versión estable:** v0.0.19, intacta. **Base de esta corrección:** candidata v0.0.20, no validada.

## Incidencia comunicada

Al pulsar «Comprobar estructura» en `prueba-indexeddb.html` de la v0.0.20 se mostró `❌ Almacenes inesperados`.

## Diagnóstico

El comprobador encontró un conjunto de almacenes distinto del esperado. El código v0.0.20 usaba una base con nombre genérico `atlas` y versión física 1. Si ya existía otra base `atlas` v1 bajo el mismo origen, `onupgradeneeded` no volvía a ejecutarse y no se creaban los nueve almacenes nuevos. **Esta colisión es una hipótesis técnica, no una causa confirmada**: el mensaje original no incluía los nombres de los almacenes encontrados.

## Corrección mínima y reversible

- `js/data/db.js`: nombre local exclusivo `atlas-reconstruccion`. El esquema físico permanece en versión 1, sin cambios de stores o índices.
- `js/data/test.js`: comprueba nombre, versión, nombres de stores e índices y reapertura; cuando hay discrepancias enumera almacenes faltantes y sobrantes.
- Se mantiene `index.html`, interfaces y banco de componentes sin cambios; ningún registro de ejemplo, repositorio, Garmin ni Training Engine.
- La base antigua `atlas`, si existe, **no se borra ni se modifica ni se migra**. En esta fase no hay datos de ATLAS importados. El aislamiento evita sobrescribir otros datos del mismo origen.

## Comprobaciones

- Se validó sintaxis JS con `node --check`.
- Se verificó la estructura del ZIP y comparación de archivos con v0.0.20 y v0.0.19.
- **La prueba de IndexedDB en navegador no se ha completado automáticamente**. La captura del usuario confirma un fallo en v0.0.20; la corrección necesita validación manual.

## Prueba manual

1. Descomprimir v0.0.21 en una carpeta nueva o subir la carpeta completa al mismo alojamiento que utilice ATLAS, sin borrar almacenamientos existentes.
2. Abrir `prueba-indexeddb.html` y pulsar **Comprobar estructura**. Debe mostrarse `✅ Base atlas-reconstruccion · estructura v1 correcta`, 9 almacenes y reapertura correcta.
3. Abrir `index.html`: confirmar las cinco vistas vacías y funcionamiento normal. `prueba-componentes.html` sigue sin cambios.
4. Si persiste el error, comunicar el texto nuevo completo y la URL o el tipo de origen usado (`file://`, GitHub Pages o servidor local). No borrar datos.

**Siguiente subfase:** 3.3 sólo tras autorización expresa; 3.2 continúa pendiente de validación.
