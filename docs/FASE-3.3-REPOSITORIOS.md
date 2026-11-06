# ATLAS v0.0.22 — Fase 3.3 · Repositorios de acceso

**Base:** v0.0.21 validada. **Alcance exclusivo:** API de acceso a los 14 almacenes de IndexedDB. Sin conexión de pantallas, importación Garmin, caché offline, sincronización, cálculos deportivos ni carga de datos DEMO.

## Archivos

- Nuevo `js/data/repositories.js`: interfaz única de lectura y escritura, validación de claves, operaciones por índices, paginación y lotes atómicos.
- `index.html`: carga del repositorio **después** de `database.js` y antes de `app.js`.
- `js/app.js`: versión `0.0.22`; apertura de IndexedDB idéntica a 3.2.
- Nuevo `tests/repositorios.html`: prueba en navegador real con claves temporales reservadas, reversión de transacciones y limpieza.
- `js/data/model.json`: actualiza únicamente el estado documental; el esquema de base **continúa en versión 1**.

## Contrato API

La interfaz se expone como `window.ATLASRepositories` (JavaScript nativo, sin bibliotecas):

| Método | Resultado |
|---|---|
| `names` | Lista inmutable de 14 almacenes |
| `store(name)` | Repositorio del almacén con métodos `get`, `put`, `add`, `delete`, `list`, `count` |
| `get(name,key)` | Objeto o `undefined` |
| `put(name,record)` | Inserta o reemplaza por clave, devuelve la clave |
| `add(name,record)` | Inserta **sólo si no existe**, devuelve la clave; duplicados fallan |
| `delete(name,key)` | Elimina por clave; operación idempotente |
| `list(name,{index,key,range,prefix,limit,offset,direction})` | Página de registros (por defecto 100, máximo 500); orden de índice o clave primaria |
| `count(name,{index,key,range})` | Número de registros coincidentes |
| `batch([{action,store,value|key},...])` | `put`, `add` y `delete` en **una única transacción**; confirma todo o nada |

`index` debe coincidir con un índice declarado del esquema. Para consultar un índice compuesto se puede usar `IDBKeyRange.only([...])` o `prefix:[...]` en `list`: el prefijo filtra desde el inicio del índice sin forzar un rango de tipos de claves. Para `count`, usar `range` en lugar de `prefix`. El paginado es por desplazamiento: para históricos extensos, valorar paginación por cursor en una fase futura cuando el volumen real lo justifique.

**Ejemplo conceptual** (no se ejecuta al abrir ATLAS):

```js
const repo = ATLASRepositories.store('activities');
const result = await repo.list({index:'byAthleteDate',prefix:['athlete-1'],limit:50});
await ATLASRepositories.batch([
  {action:'put',store:'activities',value:activity},
  {action:'put',store:'syncState',value:syncCheckpoint}
]);
```

**Garantías:** claves textuales no vacías; validación básica del objeto; nombres de almacén explícitos; propagación de errores IndexedDB; operaciones independientes sólo se consideran terminadas cuando la transacción confirma. Los lotes se envían sin `await` dentro de la transacción y preservan atomicidad entre almacenes.

**Límites deliberados:** no valida aún el esquema de atributos deportivos ni relaciones entre entidades, porque esas reglas dependen de los adaptadores de Garmin (fase 4) y de integridad (fase 3.5). Los repositorios no generan IDs, fechas, valores, ni realizan conversiones o fusiones. No almacenan tokens ni credenciales deliberadamente. Las vistas existentes no invocan esta API.

## Verificación

1. Publicar el proyecto en GitHub Pages y abrir `tests/persistencia.html` para la estructura v1.
2. Abrir `tests/repositorios.html` y pulsar «Ejecutar pruebas»; comprobar altas, lectura, actualización, índices, lote atómico, reversión y limpieza.
3. Comprobar las cinco pestañas y que los datos DEMO no se han transferido a IndexedDB.

Las pruebas de navegador deben diferenciarse de las comprobaciones de sintaxis y empaquetado. No se declara validada la versión sin la comprobación manual del usuario.
