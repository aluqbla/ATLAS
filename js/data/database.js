/* ATLAS v0.0.21 · Fase 3.2: esquema local y migraciones (sin repositorios). */
(() => {
  'use strict';

  const DATABASE_NAME = 'atlas';
  const DATABASE_VERSION = 1;
  // Contrato canónico: js/data/model.json (Fase 3.1).
  // Se declara aquí porque fetch(model.json) no funciona siempre en file://.
  const STORES_V1 = Object.freeze([
    ['athletes', 'id', [['sourceIdentity', ['source', 'sourceId'], true]]],
    ['activities', 'id', [
      ['byAthleteDate', ['athleteId', 'startedAt'], false],
      ['byAthleteSportDate', ['athleteId', 'sport', 'startedAt'], false],
      ['bySourceId', ['athleteId', 'source', 'sourceId'], true]
    ]],
    ['activityDetails', 'activityId', []],
    ['observations', 'id', [
      ['byAthleteMetricDate', ['athleteId', 'metric', 'observedAt'], false],
      ['bySourceRecord', ['athleteId', 'source', 'sourceId'], false]
    ]],
    ['rawRecords', 'id', [['byEntity', ['athleteId', 'entityType', 'entityId'], false]]],
    ['derivedMetrics', 'id', [['byAthleteMetricDate', ['athleteId', 'metric', 'observedAt'], false]]],
    ['equipment', 'id', [
      ['byAthlete', ['athleteId'], false],
      ['bySourceId', ['athleteId', 'source', 'sourceId'], true]
    ]],
    ['personalRecords', 'id', [['byAthleteDistance', ['athleteId', 'distanceMeters'], false]]],
    ['trainingZones', 'id', [['byAthleteType', ['athleteId', 'zoneType'], false]]],
    ['plans', 'id', [['byAthlete', ['athleteId'], false]]],
    ['sessions', 'id', [
      ['byPlanDate', ['planId', 'scheduledDate'], false],
      ['byAthleteDate', ['athleteId', 'scheduledDate'], false]
    ]],
    ['planChanges', 'id', [['byPlanRevision', ['planId', 'revision'], true]]],
    ['preferences', 'id', [['byAthlete', ['athleteId'], false]]],
    ['syncState', 'id', [['byAthleteDomain', ['athleteId', 'domain'], false]]]
  ]);

  // Cada versión se agrega una sola vez. Las migraciones existentes no se reescriben.
  const MIGRATIONS = new Map([
    [1, (db, transaction) => {
      for (const [name, keyPath, indexes] of STORES_V1) {
        const store = db.createObjectStore(name, { keyPath });
        for (const [indexName, indexKeyPath, unique] of indexes) {
          store.createIndex(indexName, indexKeyPath, { unique });
        }
      }
    }]
  ]);

  let connection = null;
  let opening = null;
  let state = 'idle';
  let lastError = null;

  function describeError(error) {
    return error?.message || error?.name || String(error || 'Error de IndexedDB');
  }

  function open() {
    if (connection) return Promise.resolve(connection);
    if (opening) return opening;
    if (typeof indexedDB === 'undefined') {
      state = 'unavailable';
      lastError = 'IndexedDB no está disponible en este navegador o contexto.';
      return Promise.reject(new Error(lastError));
    }

    state = 'opening';
    lastError = null;
    const pending = new Promise((resolve, reject) => {
      let request;
      try {
        request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      } catch (error) {
        state = 'error';
        lastError = describeError(error);
        reject(error);
        return;
      }
      request.onupgradeneeded = event => {
        const db = request.result;
        const transaction = request.transaction;
        try {
          for (let version = event.oldVersion + 1; version <= DATABASE_VERSION; version++) {
            const migrate = MIGRATIONS.get(version);
            if (!migrate) throw new Error(`No existe migración para la versión ${version}`);
            migrate(db, transaction);
          }
        } catch (error) {
          lastError = describeError(error);
          transaction.abort();
        }
      };
      request.onblocked = () => {
        state = 'blocked';
        lastError = 'Otra pestaña mantiene una versión incompatible de ATLAS abierta.';
        // La petición puede reanudarse cuando se cierre la conexión bloqueante.
      };
      request.onerror = () => {
        state = 'error';
        lastError = lastError || describeError(request.error);
        reject(request.error || new Error(lastError));
      };
      request.onsuccess = () => {
        const db = request.result;
        connection = db;
        state = 'ready';
        lastError = null;
        db.onversionchange = () => {
          db.close();
          if (connection === db) connection = null;
          state = 'closed';
        };
        db.onclose = () => {
          if (connection === db) connection = null;
          state = 'closed';
        };
        resolve(db);
      };
    });
    opening = pending;
    pending.finally(() => { if (opening === pending) opening = null; }).catch(() => {});
    return pending;
  }

  function close() {
    if (connection) connection.close();
    connection = null;
    state = 'closed';
  }

  function status() {
    return Object.freeze({ name: DATABASE_NAME, version: DATABASE_VERSION, state, error: lastError });
  }

  // Sólo ciclo de vida y esquema; no se ofrecen operaciones CRUD hasta la Fase 3.3.
  window.ATLASDatabase = Object.freeze({ open, close, status });
})();
