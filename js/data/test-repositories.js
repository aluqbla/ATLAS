/* Fase 3.3: prueba aislada; nunca abre ni escribe atlas-reconstruccion. */
(() => {
  'use strict';
  const button = document.getElementById('run');
  const result = document.getElementById('result');
  const NAME = 'atlas-prueba-repositorios-temporal';
  let database = null;
  function assert(check, text) { if (!check) throw new Error(text); }
  function openTestDatabase() {
    return new Promise((resolve,reject) => {
      const req = indexedDB.open(NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        const activities = db.createObjectStore('activities',{keyPath:'id'});
        activities.createIndex('byObservedAt','observedAt');
        activities.createIndex('bySport','sport');
        db.createObjectStore('activityDetails',{keyPath:'activityId'});
        const observations = db.createObjectStore('observations',{keyPath:'id'});
        observations.createIndex('byMetricDate',['metricKey','observedDate']);
        observations.createIndex('byMetricTime',['metricKey','observedAt']);
        db.createObjectStore('plans',{keyPath:'planId'});
        db.createObjectStore('planChanges',{keyPath:'changeId'}).createIndex('byPlan','planId');
        for (const name of ['profile','equipment','preferences','syncState']) db.createObjectStore(name,{keyPath:name === 'preferences'?'key':'id'});
      };
      req.onsuccess = () => { database = req.result; resolve(database); };
      req.onerror = () => reject(req.error);
    });
  }
  function deleteTestDatabase() {
    if (database) { database.close(); database = null; }
    return new Promise((resolve,reject) => {
      const req = indexedDB.deleteDatabase(NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('Cierra otras pestañas de la prueba temporal'));
    });
  }
  async function run() {
    button.disabled = true;
    const messages = [];
    result.textContent = 'Comprobando…';
    try {
      // No cambiar ATLASDatabase: los repositorios se cargan después con este objeto aislado.
      await deleteTestDatabase();
      const db = await openTestDatabase();
      window.ATLASDatabase = Object.freeze({name:NAME,version:1,open:()=>Promise.resolve(db),close:()=>db.close()});
      await new Promise((resolve,reject) => {
        const script = document.createElement('script');
        script.src = 'js/data/repositories.js';
        script.onload=resolve; script.onerror=()=>reject(new Error('No se cargaron los repositorios'));
        document.head.append(script);
      });
      const r = window.ATLASRepositories;
      assert(r, 'Sin repositorios');
      const empty = await r.ActivityRepository.list();
      assert(empty.ok && empty.data.length===0, 'Lista inicial no vacía');
      messages.push('✅ Lectura de colección vacía');
      const invalid = await r.MetricRepository.save({id:'sin-metadatos'});
      assert(!invalid.ok && invalid.error.code==='INVALID_RECORD', 'Validación incorrecta');
      const activity = {id:'test:run:1',source:'user',schemaVersion:1,availability:'available',sport:'running',observedAt:'2026-11-10T10:00:00+01:00'};
      assert((await r.ActivityRepository.save(activity)).ok, 'No se guarda actividad');
      assert((await r.ActivityRepository.get(activity.id)).data.id===activity.id, 'No se recupera actividad');
      assert((await r.ActivityRepository.list({sport:'running'})).data.length===1, 'Filtro de deporte fallido');
      assert((await r.ActivityRepository.list({sport:'cycling'})).data.length===0, 'Filtro no discrimina');
      messages.push('✅ Actividades: escritura, lectura y filtros');
      const observation = {id:'test:metric:1',source:'user',schemaVersion:1,availability:'available',metricKey:'vo2',observedDate:'2026-11-10',unit:'ml/kg/min',value:0,precision:null};
      assert((await r.MetricRepository.save(observation)).ok, 'No se guarda observación');
      assert((await r.MetricRepository.list('vo2')).data.length===1, 'Consulta de métrica fallida');
      assert((await r.MetricRepository.get(observation.id)).data.value===0, 'Cero legítimo no conservado');
      messages.push('✅ Métricas: histórico y valor cero conservado');
      const plan = {planId:'test:plan:1',source:'user',schemaVersion:1,name:'Prueba técnica'};
      assert((await r.PlanRepository.save(plan)).data.revision===1, 'Revisión inicial incorrecta');
      const conflict = await r.PlanRepository.save(plan,42);
      assert(!conflict.ok && conflict.error.code==='CONFLICT', 'No se detecta conflicto');
      assert((await r.PlanRepository.get(plan.planId)).data.revision===1, 'Conflicto sobrescribió el plan');
      const change = {changeId:'test:change:1',planId:plan.planId,baseRevision:1,source:'user',schemaVersion:1,createdAt:'2026-11-10T11:00:00+01:00',operation:'move'};
      assert((await r.PlanRepository.addChange(plan.planId,change,1)).data.revision===2, 'Cambio no actualizó revisión');
      assert((await r.PlanRepository.changes(plan.planId)).data.length===1, 'Cambio no consultable');
      assert((await r.PlanRepository.addChange(plan.planId,change,1)).error.code==='CONFLICT', 'Cambio obsoleto no rechazado');
      messages.push('✅ Planes: revisiones, cambios y conflicto sin sobrescritura');
      const pref = {key:'test:pref',schemaVersion:1,value:false};
      assert((await r.PreferenceRepository.save(pref)).ok, 'No se guardó preferencia');
      assert((await r.PreferenceRepository.get(pref.key)).data.value===false, 'No se recuperó preferencia');
      messages.push('✅ Acceso auxiliar a preferencias');
    } catch (error) {
      messages.push('❌ '+(error?.message||String(error)));
    } finally {
      try { await deleteTestDatabase(); messages.push('✅ Base temporal eliminada; datos reales intactos'); }
      catch(error) { messages.push('❌ No se pudo eliminar la base temporal: '+error.message); }
      result.textContent=messages.join('\n');
      button.disabled=false;
    }
  }
  button.addEventListener('click', run);
})();
