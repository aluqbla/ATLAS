/* ATLAS v0.0.22 · Fase 3.3: repositorios IndexedDB. Sin integración DEMO. */
(() => {
  'use strict';

  // El esquema y sus índices pertenecen exclusivamente a database.js (Fase 3.2).
  const database = window.ATLASDatabase;
  const STORE_NAMES = Object.freeze([
    'athletes', 'activities', 'activityDetails', 'observations', 'rawRecords',
    'derivedMetrics', 'equipment', 'personalRecords', 'trainingZones',
    'plans', 'sessions', 'planChanges', 'preferences', 'syncState'
  ]);
  const NAMES = new Set(STORE_NAMES);
  const ALLOWED_ACTIONS = new Set(['put', 'add', 'delete']);
  const MAX_PAGE_SIZE = 500;

  function assertStore(name) {
    if (!NAMES.has(name)) throw new TypeError(`Almacén ATLAS desconocido: ${String(name)}`);
    return name;
  }
  function assertRecord(record) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      throw new TypeError('El registro debe ser un objeto.');
    }
  }
  function assertKey(key) {
    if (typeof key !== 'string' || !key.trim()) throw new TypeError('La clave debe ser un texto no vacío.');
  }
  function keyPathFor(store) { return store === 'activityDetails' ? 'activityId' : 'id'; }
  function assertRecordKey(name, record) {
    assertRecord(record);
    assertKey(record[keyPathFor(name)]);
  }
  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Error de lectura o escritura en IndexedDB.'));
    });
  }
  function finished(tx) {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error || new Error('Transacción IndexedDB cancelada.'));
      tx.onerror = () => { /* onabort comunica el error final */ };
    });
  }
  async function transaction(names, mode, submit) {
    if (!database) throw new Error('ATLASDatabase no está disponible.');
    const db = await database.open();
    const tx = db.transaction(names, mode);
    const completed = finished(tx); // registrar callbacks antes de enviar operaciones
    try {
      const result = submit(tx); // sólo peticiones síncronas: no await dentro de la transacción
      await completed;
      return result;
    } catch (error) {
      if (tx.readyState === 'active') {
        try { tx.abort(); } catch (_) { /* la transacción pudo finalizar */ }
      }
      await completed.catch(() => {});
      throw error;
    }
  }
  async function singleRequest(name, mode, makeRequest) {
    assertStore(name);
    if (!database) throw new Error('ATLASDatabase no está disponible.');
    const db = await database.open();
    const tx = db.transaction(name, mode);
    const done = finished(tx);
    let result;
    try {
      result = await requestResult(makeRequest(tx.objectStore(name)));
      await done;
      return result;
    } catch (error) {
      if (tx.readyState === 'active') {
        try { tx.abort(); } catch (_) { /* pudo cerrarse */ }
      }
      await done.catch(() => {});
      throw error;
    }
  }
  function rangeFrom(options) {
    if (options.range !== undefined) {
      if (typeof IDBKeyRange === 'undefined' || !(options.range instanceof IDBKeyRange)) {
        throw new TypeError('range debe ser un IDBKeyRange.');
      }
      return options.range;
    }
    if (options.key !== undefined) return IDBKeyRange.only(options.key);
    if (options.prefix !== undefined) {
      if (!Array.isArray(options.prefix) || !options.prefix.length) throw new TypeError('prefix debe ser un array no vacío.');
      return IDBKeyRange.lowerBound(options.prefix);
    }
    return null;
  }
  function isPrefix(key, prefix) {
    return Array.isArray(key) && key.length >= prefix.length && prefix.every((part, index) => key[index] === part);
  }
  function checkedPaging(options) {
    const limit = options.limit === undefined ? 100 : options.limit;
    const offset = options.offset === undefined ? 0 : options.offset;
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) throw new RangeError(`limit debe estar entre 1 y ${MAX_PAGE_SIZE}.`);
    if (!Number.isSafeInteger(offset) || offset < 0) throw new RangeError('offset debe ser un entero positivo o cero.');
    if (options.direction !== undefined && !['next', 'prev'].includes(options.direction)) throw new TypeError('direction debe ser next o prev.');
    return { limit, offset, direction: options.direction || 'next' };
  }
  async function list(name, options = {}) {
    assertStore(name);
    const { limit, offset, direction } = checkedPaging(options);
    if (options.prefix !== undefined && direction !== 'next') throw new TypeError('prefix sólo admite dirección next.');
    const range = rangeFrom(options);
    if (!database) throw new Error('ATLASDatabase no está disponible.');
    const db = await database.open();
    const tx = db.transaction(name, 'readonly');
    const done = finished(tx);
    try {
      const store = tx.objectStore(name);
      const source = options.index === undefined ? store : store.index(options.index);
      const result = await new Promise((resolve, reject) => {
        const items = [];
        let skipped = 0;
        const request = source.openCursor(range, direction);
        request.onerror = () => reject(request.error || new Error('Error al recorrer IndexedDB.'));
        request.onsuccess = () => {
          const cursor = request.result;
          if (!cursor || items.length >= limit) { resolve(items); return; }
          if (options.prefix && !isPrefix(cursor.key, options.prefix)) { resolve(items); return; }
          if (skipped < offset) { skipped++; cursor.continue(); return; }
          items.push(cursor.value);
          if (items.length === limit) resolve(items);
          else cursor.continue();
        };
      });
      await done;
      return result;
    } catch (error) {
      if (tx.readyState === 'active') {
        try { tx.abort(); } catch (_) { /* cierre concurrente */ }
      }
      await done.catch(() => {});
      throw error;
    }
  }

  const get = (name, key) => { assertStore(name); assertKey(key); return singleRequest(name, 'readonly', store => store.get(key)); };
  const put = (name, record) => { assertStore(name); assertRecordKey(name, record); return singleRequest(name, 'readwrite', store => store.put(record)); };
  const add = (name, record) => { assertStore(name); assertRecordKey(name, record); return singleRequest(name, 'readwrite', store => store.add(record)); };
  const remove = (name, key) => { assertStore(name); assertKey(key); return singleRequest(name, 'readwrite', store => store.delete(key)); };
  const count = (name, options = {}) => {
    assertStore(name);
    if (options.prefix !== undefined) throw new TypeError('count no admite prefix; utilice range o key.');
    const range = rangeFrom(options);
    return singleRequest(name, 'readonly', store => (options.index === undefined ? store : store.index(options.index)).count(range));
  };

  // Inserta/modifica/elimina varios registros de forma indivisible. Permite confirmar
  // datos y cursor de sincronización en la MISMA transacción, sin lógica de sincronización.
  async function batch(operations) {
    if (!Array.isArray(operations) || !operations.length) throw new TypeError('Se requiere una lista de operaciones.');
    const names = [];
    for (const op of operations) {
      if (!op || !ALLOWED_ACTIONS.has(op.action)) throw new TypeError('Acción no permitida; use put, add o delete.');
      assertStore(op.store);
      if (op.action === 'delete') assertKey(op.key);
      else assertRecordKey(op.store, op.value);
      if (!names.includes(op.store)) names.push(op.store);
    }
    return transaction(names, 'readwrite', tx => {
      for (const op of operations) {
        const store = tx.objectStore(op.store);
        if (op.action === 'delete') store.delete(op.key);
        else store[op.action](op.value);
      }
      return operations.length;
    });
  }

  function store(name) {
    assertStore(name);
    return Object.freeze({
      get: key => get(name, key),
      put: value => put(name, value),
      add: value => add(name, value),
      delete: key => remove(name, key),
      list: options => list(name, options),
      count: options => count(name, options)
    });
  }

  window.ATLASRepositories = Object.freeze({ names: STORE_NAMES, store, get, put, add, delete: remove, list, count, batch });
})();
