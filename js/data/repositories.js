/* ATLAS v0.0.22 · Fase 3.3: repositorios locales, sin Garmin ni conexión a vistas. */
(() => {
  'use strict';
  const database = window.ATLASDatabase;
  const isoDay = /^\d{4}-\d{2}-\d{2}$/;
  const sources = new Set(['garmin_official', 'garmin_private', 'atlas', 'user']);
  const availabilities = new Set(['available', 'unavailable', 'unsupported', 'error']);
  const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const present = value => typeof value === 'string' && value.trim().length > 0;
  const isoInstant = value => present(value) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
  const validDay = value => isoDay.test(value) && !Number.isNaN(Date.parse(value + 'T12:00:00Z')) && new Date(value + 'T12:00:00Z').toISOString().slice(0,10) === value;
  const fail = (code, message, retryable = false) => ({ok: false, error: {code, message, retryable}});
  const success = data => ({ok: true, data, updatedAt: new Date().toISOString()});
  const invalid = message => { throw Object.assign(new Error(message), {code: 'INVALID_RECORD'}); };
  const requireField = (ok, message) => { if (!ok) invalid(message); };
  function validateBase(item, key, {time = false, date = false, quantitative = false} = {}) {
    requireField(plain(item) && present(item[key]), 'Falta identificador: ' + key);
    requireField(item.schemaVersion === 1, 'schemaVersion debe ser 1');
    requireField(sources.has(item.source), 'source desconocida');
    requireField(availabilities.has(item.availability), 'availability desconocida');
    if (time) requireField(isoInstant(item.observedAt), 'observedAt requiere ISO con zona');
    if (date) requireField((item.observedDate !== undefined && validDay(item.observedDate)) || (item.observedAt !== undefined && isoInstant(item.observedAt)), 'Fecha de observación inválida');
    if (item.fetchedAt !== undefined && item.fetchedAt !== null) requireField(isoInstant(item.fetchedAt), 'fetchedAt inválido');
    if (quantitative) {
      requireField(present(item.metricKey), 'Falta metricKey');
      if (item.availability === 'available') requireField(typeof item.value === 'number' && Number.isFinite(item.value) && present(item.unit), 'Valor o unidad no disponibles');
      if (item.value !== undefined && item.value !== null) requireField(typeof item.value === 'number' && Number.isFinite(item.value), 'Valor numérico inválido');
      requireField(item.precision === null || (typeof item.precision === 'number' && Number.isFinite(item.precision) && item.precision >= 0), 'precision debe ser número no negativo o null');
    }
  }
  function ensurePlan(plan) {
    requireField(plain(plan) && present(plan.planId), 'Falta planId');
    requireField(plan.schemaVersion === 1 && (plan.source === 'user' || plan.source === 'atlas'), 'Plan local inválido');
    requireField(!['sessions', 'weeks', 'effectiveSchedule', 'proposal', 'publication'].some(k => Object.hasOwn(plan,k)), 'No incluir calendario, propuesta o publicación en PlanRequest');
    if (plan.startDate !== undefined) requireField(validDay(plan.startDate), 'startDate inválida');
    if (plan.raceDate !== undefined) requireField(validDay(plan.raceDate), 'raceDate inválida');
  }
  function ensureChange(change, planId, revision) {
    requireField(plain(change) && present(change.changeId) && change.planId === planId, 'Identidad del cambio inválida');
    requireField(change.schemaVersion === 1 && change.source === 'user', 'El cambio debe proceder del usuario');
    requireField(change.baseRevision === revision && isoInstant(change.createdAt) && present(change.operation), 'Revisión, fecha u operación inválida');
  }
  function mapError(error) {
    if (error?.code === 'INVALID_RECORD') return fail('INVALID_RECORD', error.message);
    if (error?.code === 'CONFLICT') return fail('CONFLICT', error.message);
    if (error?.name === 'QuotaExceededError') return fail('STORAGE_FULL', 'Espacio local insuficiente');
    if (error?.name === 'ConstraintError') return fail('DUPLICATE', 'El identificador ya existe');
    if (error?.name === 'NotFoundError') return fail('NOT_FOUND', 'Almacén no disponible');
    return fail('STORAGE_ERROR', error?.message || 'Error de IndexedDB', true);
  }
  async function run(stores, mode, operation) {
    try {
      const db = await database.open();
      return await new Promise(resolve => {
        let tx;
        try { tx = db.transaction(stores, mode); } catch (error) { resolve(mapError(error)); return; }
        let value;
        let error = null;
        tx.oncomplete = () => resolve(error || success(value));
        tx.onabort = () => resolve(error || mapError(tx.error));
        tx.onerror = () => { /* onabort resuelve la transacción */ };
        const context = {
          store: name => tx.objectStore(name),
          set: next => { value = next; },
          stop: issue => { error = issue; tx.abort(); }
        };
        try { operation(context); } catch (cause) { error = mapError(cause); tx.abort(); }
      });
    } catch (error) { return mapError(error); }
  }
  const request = (req, onSuccess) => { req.onsuccess = () => onSuccess(req.result); };
  function read(store, key) {
    if (!present(key)) return Promise.resolve(fail('INVALID_RECORD', 'Identificador obligatorio'));
    return run([store], 'readonly', context => request(context.store(store).get(key), value => context.set(value ?? null)));
  }
  function put(store, record, validate) {
    try { validate(record); } catch (error) { return Promise.resolve(mapError(error)); }
    return run([store], 'readwrite', context => {
      request(context.store(store).put(record), () => context.set(record));
    });
  }
  function list(store, filter = () => true) {
    return run([store], 'readonly', context => {
      const values = [];
      const cursor = context.store(store).openCursor();
      cursor.onsuccess = () => {
        const item = cursor.result;
        if (!item) { context.set(values); return; }
        if (filter(item.value)) values.push(item.value);
        item.continue();
      };
    });
  }
  const checkActivity = item => { validateBase(item,'id',{time:true}); requireField(present(item.sport),'Falta sport'); };
  const checkObservation = item => validateBase(item,'id',{date:true,quantitative:true});
  const checkDetail = item => { requireField(plain(item) && present(item.activityId) && item.schemaVersion === 1, 'Detalle inválido'); };
  function activitiesList({sport, from, to} = {}) {
    return list('activities', item => (!sport || item.sport === sport) && (!from || item.observedAt >= from) && (!to || item.observedAt <= to))
      .then(result => result.ok ? {...result, data: result.data.sort((a,b) => b.observedAt.localeCompare(a.observedAt))} : result);
  }
  function observationsList(metricKey, {from, to} = {}) {
    if (!present(metricKey)) return Promise.resolve(fail('INVALID_RECORD','metricKey obligatorio'));
    return list('observations', item => item.metricKey === metricKey && (!from || (item.observedDate || item.observedAt) >= from) && (!to || (item.observedDate || item.observedAt) <= to))
      .then(result => result.ok ? {...result, data: result.data.sort((a,b) => (a.observedDate || a.observedAt).localeCompare(b.observedDate || b.observedAt))} : result);
  }
  function savePlan(plan, expectedRevision = null) {
    try { ensurePlan(plan); requireField(expectedRevision === null || (Number.isInteger(expectedRevision) && expectedRevision > 0), 'Revisión esperada inválida'); }
    catch(error) { return Promise.resolve(mapError(error)); }
    return run(['plans'], 'readwrite', context => {
      const store = context.store('plans');
      request(store.get(plan.planId), previous => {
        const revision = previous?.revision ?? null;
        if (revision !== expectedRevision) { context.stop(fail('CONFLICT', 'Revisión del plan distinta de la esperada')); return; }
        const updated = {...plan, revision: (revision ?? 0) + 1};
        request(store.put(updated), () => context.set(updated));
      });
    });
  }
  function appendChange(planId, change, expectedRevision) {
    if (!present(planId) || !Number.isInteger(expectedRevision) || expectedRevision < 1) return Promise.resolve(fail('INVALID_RECORD', 'Plan y revisión obligatorios'));
    try { ensureChange(change,planId,expectedRevision); }
    catch(error) { return Promise.resolve(mapError(error)); }
    return run(['plans','planChanges'], 'readwrite', context => {
      const store = context.store('plans');
      request(store.get(planId), plan => {
        if (!plan) { context.stop(fail('NOT_FOUND', 'El plan no existe')); return; }
        if (plan.revision !== expectedRevision) { context.stop(fail('CONFLICT', 'Revisión del plan distinta de la esperada')); return; }
        const changes = context.store('planChanges');
        request(changes.get(change.changeId), existing => {
          if (existing) { context.stop(fail('DUPLICATE','changeId ya utilizado')); return; }
          changes.add(change);
          const revised = {...plan, revision: plan.revision + 1};
          request(store.put(revised), () => context.set({change, revision: revised.revision}));
        });
      });
    });
  }
  function changesForPlan(planId) {
    if (!present(planId)) return Promise.resolve(fail('INVALID_RECORD','planId obligatorio'));
    return run(['planChanges'], 'readonly', context => {
      const found = [];
      const cursor = context.store('planChanges').index('byPlan').openCursor(IDBKeyRange.only(planId));
      cursor.onsuccess = () => {
        const row = cursor.result;
        if (row) { found.push(row.value); row.continue(); }
        else context.set(found.sort((a,b) => a.createdAt.localeCompare(b.createdAt)));
      };
    });
  }
  const localRecord = key => item => { requireField(plain(item) && present(item[key]) && item.schemaVersion === 1, 'Registro local inválido'); };
  window.ATLASRepositories = Object.freeze({
    ActivityRepository: Object.freeze({get: id => read('activities', id), list: activitiesList, save: record => put('activities',record,checkActivity), getDetail: id => read('activityDetails',id), saveDetail: record => put('activityDetails',record,checkDetail)}),
    MetricRepository: Object.freeze({get: id => read('observations',id), list: observationsList, save: record => put('observations',record,checkObservation)}),
    PlanRepository: Object.freeze({get: id => read('plans',id), list: () => list('plans'), save: savePlan, addChange: appendChange, changes: changesForPlan}),
    ProfileRepository: Object.freeze({get: id => read('profile',id), save: value => put('profile',value,localRecord('id'))}),
    EquipmentRepository: Object.freeze({get: id => read('equipment',id), list: () => list('equipment'), save: value => put('equipment',value,localRecord('id'))}),
    PreferenceRepository: Object.freeze({get: key => read('preferences',key), save: value => put('preferences',value,localRecord('key'))}),
    SyncStateRepository: Object.freeze({get: id => read('syncState',id), save: value => put('syncState',value,localRecord('id'))})
  });
})();
