/* ATLAS v0.0.21 · Fase 3.2: estructura IndexedDB, sin repositorios ni datos de muestra. */
(() => {
  'use strict';

  // Nombre aislado para evitar colisiones con bases ATLAS anteriores del mismo origen.
  const NAME = 'atlas-reconstruccion';
  const VERSION = 1;
  let connection = null;
  let opening = null;

  // Sólo crear estructura. Los registros y su validación corresponden a la Fase 3.3.
  function migrateToV1(db) {
    const activities = db.createObjectStore('activities', {keyPath: 'id'});
    activities.createIndex('byObservedAt', 'observedAt');
    activities.createIndex('bySport', 'sport');

    db.createObjectStore('activityDetails', {keyPath: 'activityId'});

    const observations = db.createObjectStore('observations', {keyPath: 'id'});
    observations.createIndex('byMetricDate', ['metricKey', 'observedDate']);
    observations.createIndex('byMetricTime', ['metricKey', 'observedAt']);

    db.createObjectStore('plans', {keyPath: 'planId'});
    const changes = db.createObjectStore('planChanges', {keyPath: 'changeId'});
    changes.createIndex('byPlan', 'planId');

    db.createObjectStore('profile', {keyPath: 'id'});
    db.createObjectStore('equipment', {keyPath: 'id'});
    db.createObjectStore('preferences', {keyPath: 'key'});
    db.createObjectStore('syncState', {keyPath: 'id'});
  }

  const migrations = [migrateToV1];

  function open() {
    if (connection) return Promise.resolve(connection);
    if (opening) return opening;
    if (!('indexedDB' in window)) {
      return Promise.reject(new Error('IndexedDB no está disponible en este navegador.'));
    }

    opening = new Promise((resolve, reject) => {
      let request;
      try {
        request = indexedDB.open(NAME, VERSION);
      } catch (error) {
        reject(error);
        return;
      }

      request.onupgradeneeded = (event) => {
        const db = request.result;
        for (let version = event.oldVersion + 1; version <= VERSION; version++) {
          const migrate = migrations[version - 1];
          if (!migrate) {
            request.transaction.abort();
            return;
          }
          migrate(db);
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        connection = db;
        db.onversionchange = () => {
          db.close();
          if (connection === db) connection = null;
        };
        resolve(db);
      };
      request.onerror = () => reject(request.error || new Error('No se pudo abrir IndexedDB.'));
      request.onblocked = () => {
        console.warn('ATLAS: actualización de IndexedDB bloqueada por otra pestaña.');
      };
    }).finally(() => { opening = null; });

    return opening;
  }

  function close() {
    if (connection) connection.close();
    connection = null;
  }

  // API estructural, no API de consulta/escritura de registros.
  window.ATLASDatabase = Object.freeze({name: NAME, version: VERSION, open, close});
})();
