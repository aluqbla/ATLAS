/* ATLAS 0.0.35 · Garmin Personal API: consulta inicial, sin importación histórica. */
(() => {
  'use strict';
  const WORKER = 'https://atlas.aj-luque.workers.dev'; // URL pública, nunca una credencial.
  const $ = (s,root=document) => root.querySelector(s);
  const el = (tag,cls,text) => {const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  let session = ''; // Sólo memoria. No usar localStorage ni almacenar credenciales.
  const host=$('#profile-sections');
  if(!host || !window.ATLASRepositories) return;
  const section=el('section','profile-section atlas-accordion');
  const toggle=el('button','profile-section-toggle atlas-accordion-trigger');
  toggle.type='button';toggle.setAttribute('aria-expanded','false');
  toggle.append(el('span','profile-section-title','☁️ Garmin oficial'),el('span','profile-section-arrow atlas-accordion-chevron','›'));
  const panel=el('div','profile-section-content');panel.hidden=true;
  toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));toggle.lastElementChild.textContent=panel.hidden?'›':'⌄';});
  section.append(toggle,panel);host.prepend(section);
  const explanation=el('p','atlas-empty-message','Consulta inicial: últimas 10 actividades, perfil y datos de salud del día. No importa el histórico completo.');
  const form=el('form','');
  const password=el('input','');password.type='password';password.placeholder='Contraseña de ATLAS';password.autocomplete='off';password.required=true;password.setAttribute('aria-label','Contraseña de ATLAS');
  const login=el('button','atlas-official-button','Conectar');login.type='submit';
  const sync=el('button','atlas-official-button','Consultar Garmin');sync.type='button';sync.disabled=true;
  const status=el('p','atlas-empty-message','Sin conectar');status.setAttribute('role','status');
  form.append(password,login);panel.append(explanation,form,sync,status);
  const setStatus = message => {status.textContent=message;};
  async function api(path, options={}) {
    const response=await fetch(WORKER+path,{...options,headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session}:{}),...options.headers},cache:'no-store'});
    const payload=await response.json();
    if(!response.ok || !payload.ok) throw new Error(payload.code||'GARMIN_REQUEST_FAILED');
    return payload;
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();login.disabled=true;
    const candidate=password.value;password.value='';setStatus('Conectando…');
    try {const response=await api('/auth/login',{method:'POST',body:JSON.stringify({password:candidate})});session=response.token;sync.disabled=false;setStatus('Sesión autorizada. Puedes consultar Garmin.');}
    catch(error){session='';sync.disabled=true;setStatus('Conexión no disponible: '+error.message);}
    finally {login.disabled=false;}
  });
  const iso = activity => {
    const raw=activity.startTimeGMT||activity.startTimeUTC;
    if(typeof raw!=='string') return null;
    const clean=raw.replace(' ','T');const converted=/Z$|[+-]\d\d:\d\d$/.test(clean)?clean:clean+'Z';
    const date=new Date(converted);return Number.isFinite(date.getTime())?date.toISOString():null;
  };
  function normalizeActivity(activity,fetchedAt){
    if(!activity || !Number.isSafeInteger(Number(activity.activityId)) || Number(activity.activityId)<=0) return null;
    const observedAt=iso(activity);if(!observedAt)return null;
    return {
      id:'garmin:'+String(activity.activityId),externalId:String(activity.activityId),schemaVersion:1,
      source:'garmin_official',availability:'available',observedAt,fetchedAt,
      sport:typeof activity.activityType?.typeKey==='string'?activity.activityType.typeKey:'unknown',
      title:typeof activity.activityName==='string'?activity.activityName:'Actividad',
      distanceM:Number.isFinite(activity.distance)?activity.distance:null,
      durationSec:Number.isFinite(activity.duration)?activity.duration:null,
      rawPrecision:null,
    };
  }
  function renderRow(record){
    const row=el('div','activity-row');
    const date=new Date(record.observedAt);
    const left=el('div','activity-row-date');left.append(el('span','activity-row-weekday',new Intl.DateTimeFormat('es-ES',{weekday:'short'}).format(date)),el('span','activity-row-day',String(date.getDate())),el('span','activity-row-month',new Intl.DateTimeFormat('es-ES',{month:'short'}).format(date)));
    const copy=el('div','activity-row-copy');copy.append(el('span','activity-row-title',record.title));
    const stats=[];if(Number.isFinite(record.distanceM))stats.push((record.distanceM/1000).toFixed(2)+' km');if(Number.isFinite(record.durationSec))stats.push(Math.round(record.durationSec/60)+' min');
    copy.append(el('span','activity-row-stats',stats.join(' · ')||record.sport));
    row.append(left,el('span','activity-row-divider'),copy);return row;
  }
  async function renderCachedActivities(){
    const result=await window.ATLASRepositories.ActivityRepository.list();
    if(!result.ok)return;
    const data=result.data.filter(item=>item.source==='garmin_official').slice(0,20);
    if(!data.length)return;
    const list=$('#activities-list'),recent=$('#today-last');
    list.replaceChildren(...data.map(renderRow));recent.replaceChildren(renderRow(data[0]));
    $('#activities-summary').textContent=data.length+' actividades disponibles localmente (consulta inicial)';
  }
  sync.addEventListener('click',async()=>{
    sync.disabled=true;setStatus('Consultando datos oficiales…');
    try {
      const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      const get=type=>parts.find(p=>p.type===type)?.value;const today=get('year')+'-'+get('month')+'-'+get('day');
      const [activities,profile,daily]=await Promise.allSettled([
        api('/garmin/activities?limit=10'),api('/garmin/profile'),api('/garmin/daily?date='+today),
      ]);
      let saved=0;let rejected=0;
      if(activities.status==='fulfilled' && !Array.isArray(activities.value.data)) throw new Error('GARMIN_ACTIVITIES_INVALID_FORMAT');
      if(activities.status==='fulfilled' && Array.isArray(activities.value.data)) {
        for(const item of activities.value.data){const normalized=normalizeActivity(item,activities.value.fetchedAt);if(!normalized){rejected++;continue;}
          const result=await window.ATLASRepositories.ActivityRepository.save(normalized);if(result.ok)saved++;else rejected++;
        }
        await renderCachedActivities();
      }
      if(profile.status==='fulfilled' && profile.value.data && typeof profile.value.data==='object'){
        const data=profile.value.data;const name=typeof data.displayName==='string'?data.displayName:null;
        if(name) $('.profile-name').textContent=name;
      }
      const states=daily.status==='fulfilled'?Object.entries(daily.value.resources).map(([key,item])=>key+': '+item.availability).join(', '):'salud: error';
      const fails=[activities,profile,daily].filter(item=>item.status==='rejected').map(item=>item.reason.message);
      setStatus(`Actividades guardadas: ${saved}${rejected?' · omitidas: '+rejected:''}. ${states}.${fails.length?' Errores: '+fails.join(', '):''} Sin importación histórica.`);
    }catch(error){setStatus('Error: '+error.message);}finally{sync.disabled=!session;}
  });
  renderCachedActivities().catch(()=>{});
})();
