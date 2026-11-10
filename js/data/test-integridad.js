/* ATLAS v0.0.29 · Fase 3.5: diagnóstico de carga de repositorios; NO usa la BD real. */
(() => {
  'use strict';
  const button = document.getElementById('run');
  const output = document.getElementById('result');
  const DB_NAME = 'atlas-integridad-temporal-v1';
  const CACHE_NAME = 'atlas-reconstruccion-shell-v0.0.29';
  const REQUIRED = [
    'activities','activityDetails','observations','plans','planChanges',
    'profile','equipment','preferences','syncState'
  ];
  let testDB = null;
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const line = message => { output.textContent += message + '\n'; };
  const openRequest = (name, version, upgrade) => new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version);
    req.onupgradeneeded = e => { if (upgrade) upgrade(req.result, e.oldVersion); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || Error('Apertura fallida'));
    req.onblocked = () => reject(Error('Otra pestaña mantiene abierta la base temporal'));
  });
  const drop = () => new Promise((resolve, reject) => {
    if (testDB) { testDB.close(); testDB = null; }
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = resolve;
    req.onerror = () => reject(req.error || Error('No se pudo eliminar la base temporal'));
    req.onblocked = () => reject(Error('Base temporal bloqueada por otra pestaña'));
  });
  const createSchema = (db, oldVersion) => {
    if (oldVersion !== 0) throw Error('Migración inicial inesperada');
    const activities = db.createObjectStore('activities', {keyPath:'id'});
    activities.createIndex('byObservedAt','observedAt');
    activities.createIndex('bySport','sport');
    db.createObjectStore('activityDetails',{keyPath:'activityId'});
    const observations = db.createObjectStore('observations',{keyPath:'id'});
    observations.createIndex('byMetricDate',['metricKey','observedDate']);
    observations.createIndex('byMetricTime',['metricKey','observedAt']);
    db.createObjectStore('plans',{keyPath:'planId'});
    db.createObjectStore('planChanges',{keyPath:'changeId'}).createIndex('byPlan','planId');
    db.createObjectStore('profile',{keyPath:'id'});
    db.createObjectStore('equipment',{keyPath:'id'});
    db.createObjectStore('preferences',{keyPath:'key'});
    db.createObjectStore('syncState',{keyPath:'id'});
  };
  async function checkSchema() {
    testDB = await openRequest(DB_NAME,1,createSchema);
    assert(testDB.version===1, 'Versión inicial incorrecta');
    assert(JSON.stringify(Array.from(testDB.objectStoreNames))===JSON.stringify([...REQUIRED].sort()), 'Los nueve almacenes no coinciden');
    const tx=testDB.transaction(['activities','observations','planChanges'],'readonly');
    assert(Array.from(tx.objectStore('activities').indexNames).join(',')==='byObservedAt,bySport','Índices de actividades incorrectos');
    assert(Array.from(tx.objectStore('observations').indexNames).join(',')==='byMetricDate,byMetricTime','Índices de métricas incorrectos');
    assert(Array.from(tx.objectStore('planChanges').indexNames).join(',')==='byPlan','Índice de cambios incorrecto');
    testDB.close(); testDB=null;
    testDB=await openRequest(DB_NAME,1,() => {throw Error('La migración no debe repetirse');});
    assert(testDB.version===1,'Reapertura incorrecta');
    line('✅ IndexedDB: esquema v1, nueve almacenes, índices y reapertura');
  }
  // Comprobar que el archivo JS se ha ejecutado, no sólo que el navegador lo ha descargado.
  // En línea: URL versionada para no reutilizar una respuesta antigua de la caché.
  // Sin conexión: URL exacta presente en la caché del Service Worker.
  const loadRepositories = async () => {
    const path = './js/data/repositories.js';
    const url = navigator.onLine ? path + '?integrity=0.0.27' : path;
    let scriptError = '';
    const onError = event => {
      if (event.filename && event.filename.includes('repositories.js')) {
        scriptError = `${event.message || 'Error de ejecución'} (${event.lineno || '?'}:${event.colno || '?'})`;
      }
    };
    window.addEventListener('error', onError);
    try {
      await new Promise((resolve,reject) => {
        const el=document.createElement('script'); el.src=url;
        el.onload=resolve;
        el.onerror=()=>reject(Error('No se pudo descargar ' + url));
        document.head.append(el);
      });
    } finally { window.removeEventListener('error', onError); }
    const r = window.ATLASRepositories;
    if (!r || !r.ActivityRepository || typeof r.ActivityRepository.list !== 'function') {
      throw Error('Repositorio de actividades no inicializado. ' +
        (scriptError ? 'Error JavaScript: ' + scriptError :
          'El archivo repositories.js se descargó, pero no expuso ATLASRepositories. ' +
          'Verifica que esté publicada la versión del ZIP y que no se sirva un archivo antiguo.'));
    }
    return r;
  };
  async function checkRepositories() {
    // Los repositorios capturan ATLASDatabase al cargarse; se les da exclusivamente la BD de prueba.
    window.ATLASDatabase=Object.freeze({name:DB_NAME,version:1,open:()=>Promise.resolve(testDB),close:()=>{}});
    const r=await loadRepositories();
    line('✅ Repositorios: módulo cargado e interfaz pública disponible');
    const activity={id:'integrity:activity',schemaVersion:1,source:'user',availability:'available',sport:'running',observedAt:'2026-11-10T08:00:00+01:00'};
    assert((await r.ActivityRepository.list()).data.length===0,'Base de prueba no está vacía');
    assert((await r.ActivityRepository.save(activity)).ok,'Escritura de actividad fallida');
    assert((await r.ActivityRepository.get(activity.id)).data.sport==='running','Actividad no persistida');
    const detail={activityId:activity.id,schemaVersion:1,laps:[]};
    assert((await r.ActivityRepository.saveDetail(detail)).ok,'Detalle no almacenado');
    assert((await r.ActivityRepository.getDetail(activity.id)).data.activityId===activity.id,'Detalle no recuperado');
    const metric={id:'integrity:metric',schemaVersion:1,source:'user',availability:'available',metricKey:'test',observedDate:'2026-11-10',value:0,unit:'count',precision:0};
    assert((await r.MetricRepository.save(metric)).ok,'Métrica no guardada');
    assert((await r.MetricRepository.get(metric.id)).data.value===0,'Cero legítimo perdido');
    const missing={...metric,id:'integrity:missing',availability:'unavailable',value:null,unit:null,precision:null};
    assert((await r.MetricRepository.save(missing)).ok,'Ausencia de dato rechazada');
    assert((await r.MetricRepository.get(missing.id)).data.availability==='unavailable','Ausencia convertida en dato');
    const invalid=await r.MetricRepository.save({...metric,id:'integrity:invalid',observedDate:'2026-02-30'});
    assert(!invalid.ok && invalid.error.code==='INVALID_RECORD','No se rechazó una fecha inválida');
    assert((await r.MetricRepository.get('integrity:invalid')).data===null,'Dato inválido persistido');
    line('✅ Repositorios: escritura/lectura, detalle, cero, ausencia y rechazo de datos inválidos');
    const plan={planId:'integrity:plan',schemaVersion:1,source:'user',name:'Prueba técnica'};
    assert((await r.PlanRepository.save(plan)).data.revision===1,'Revisión inicial incorrecta');
    const change={changeId:'integrity:change',planId:plan.planId,baseRevision:1,source:'user',schemaVersion:1,createdAt:'2026-11-10T09:00:00+01:00',operation:'move'};
    const first=await r.PlanRepository.addChange(plan.planId,change,1);
    assert(first.ok && first.data.revision===2,'Cambio no confirmado');
    const conflict=await r.PlanRepository.addChange(plan.planId,{...change,changeId:'integrity:conflict'},1);
    assert(!conflict.ok && conflict.error.code==='CONFLICT','No se identificó conflicto');
    const duplicate=await r.PlanRepository.addChange(plan.planId,change,2);
    assert(!duplicate.ok && duplicate.error.code==='INVALID_RECORD','No se rechazó revisión base incorrecta');
    assert((await r.PlanRepository.get(plan.planId)).data.revision===2,'Conflicto sobrescribió el plan');
    assert((await r.PlanRepository.changes(plan.planId)).data.length===1,'Conflicto dejó un cambio parcial');
    const saveConflict=await r.PlanRepository.save(plan,1);
    assert(!saveConflict.ok && saveConflict.error.code==='CONFLICT','No se rechazó guardado obsoleto');
    line('✅ Planes: revisión optimista, transacción atómica y conflictos sin sobrescritura');
    for(const [repo,item,key] of [
      [r.ProfileRepository,{id:'integrity:profile',schemaVersion:1},'id'],
      [r.EquipmentRepository,{id:'integrity:equipment',schemaVersion:1},'id'],
      [r.PreferenceRepository,{key:'integrity:pref',schemaVersion:1,value:false},'key'],
      [r.SyncStateRepository,{id:'integrity:sync',schemaVersion:1},'id']
    ]) {
      assert((await repo.save(item)).ok,'Guardado auxiliar fallido');
      assert((await repo.get(item[key])).data[key]===item[key],'Lectura auxiliar fallida');
    }
    assert((await r.PreferenceRepository.get('integrity:pref')).data.value===false,'Preferencia false perdida');
    line('✅ Perfil, equipo, preferencias y estado local de sincronización');
  }
  async function checkCache() {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) {
      throw Error('Caché no verificable: abre ATLAS por HTTPS (GitHub Pages) o localhost');
    }
    // Esta página es independiente de index.html: debe registrar su propio SW.
    // No basta consultar getRegistration(), porque la primera visita puede no tenerlo.
    let registration;
    try {
      registration = await navigator.serviceWorker.register('./sw.js', {scope:'./'});
    } catch (error) {
      throw Error('Registro del Service Worker fallido: ' + (error?.message || String(error)) + '. Comprueba sw.js en GitHub Pages.');
    }
    // Si hay una instalación nueva, esperar hasta activación sin depender de recargas.
    const waitActive = async () => {
      if (registration.active && !registration.installing && !registration.waiting) return true;
      const worker = registration.installing || registration.waiting;
      if (!worker) return Boolean(registration.active);
      if (worker.state === 'activated') return true;
      return new Promise(resolve => {
        let completed = false;
        const finish = ok => {
          if (completed) return;
          completed = true;
          worker.removeEventListener('statechange', changed);
          clearTimeout(timer);
          resolve(ok);
        };
        const changed = () => {
          if (worker.state === 'activated') finish(true);
          if (worker.state === 'redundant') finish(false);
        };
        const timer = setTimeout(() => finish(Boolean(registration.active)), 12000);
        worker.addEventListener('statechange', changed);
        changed();
      });
    };
    let active = await waitActive();
    if (!active && navigator.onLine) {
      await registration.update().catch(() => {});
      active = await waitActive();
    }
    assert(active && registration.active,
      'Service Worker sin activar. Estado: ' +
      (registration.installing?.state || registration.waiting?.state || 'sin instalación') +
      '. Comprueba que todos los archivos de sw.js estén publicados.');
    assert(await caches.has(CACHE_NAME),
      'La caché de esta versión no existe: ' + CACHE_NAME +
      '. Comprueba la instalación de sw.js y que los archivos estén publicados.');
    const cache=await caches.open(CACHE_NAME);
    for(const path of ['./index.html','./prueba-integridad.html','./js/data/test-integridad.js','./js/data/repositories.js','./css/tokens.css']) {
      assert(await cache.match(new URL(path,location.href).href),'Falta en caché: '+path);
    }
    line('✅ Caché: Service Worker activo y archivos esenciales presentes');
    line('ℹ️ Red indicada por navegador: '+(navigator.onLine?'en línea':'sin conexión'));
  }
  async function run() {
    button.disabled=true; output.textContent='';
    let failure=false;
    try {
      assert('indexedDB' in window,'IndexedDB no disponible');
      await drop();
      await checkSchema();
      await checkRepositories();
      await checkCache();
    } catch(error) { failure=true; line('❌ '+(error?.message||String(error))); }
    finally {
      try { await drop(); line('✅ Base temporal eliminada; base real intacta'); }
      catch(error) {failure=true;line('❌ Limpieza fallida: '+(error?.message||String(error)));}
      line(failure?'❌ INTEGRIDAD NO CONFIRMADA':'✅ COMPROBACIONES FINALIZADAS');
      button.disabled=false;
    }
  }
  button.addEventListener('click',run);
})();
