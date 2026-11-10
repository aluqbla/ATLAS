/* ATLAS · Cierre de la Fase 2. Vistas vacías, sin proveedores ni datos fabricados. */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const make = (tag, cls, txt) => {const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
  const empty = (message='Sin datos disponibles') => make('p','atlas-empty-message',message);
  const metricDefs = {
    sleep: ['💤','Sueño','Sueño'], hrv:['🫀','VFC','VFC'], rhr:['❤️','Reposo','Frecuencia cardíaca en reposo'],
    vo2:['🫁','VO₂ máx.','VO₂ máx.'], load:['⚡','Carga','Carga de entrenamiento'], volume:['🏃🏻‍♂️','Volumen','Volumen'],
    thresholdPace:['🏃🏻‍♂️','Ritmo umb.','Ritmo umbral'], thresholdHr:['❤️','FC umb.','FC umbral'], efficiency:['🌬️','Eficiencia','Eficiencia aeróbica']
  };
  let detailOpener=null;
  const todayDialog=$('#today-detail'), todayTitle=$('#today-detail-title'), todayBody=$('#today-detail-body');
  function showDetail(title, content){detailOpener=document.activeElement;todayTitle.textContent=title;todayBody.replaceChildren(content);todayDialog.hidden=false;document.body.classList.add('today-dialog-open');$('#today-detail-back').focus();}
  function closeDetail(){todayDialog.hidden=true;document.body.classList.remove('today-dialog-open');detailOpener?.focus?.();}
  $('#today-detail-back').addEventListener('click',closeDetail);
  $('#today-detail-close').addEventListener('click',closeDetail);
  function showMetric(id){const def=metricDefs[id];const content=make('div','today-detail-content');const periods=make('div','today-periods');
    for(const [value,label] of [['7','7 días'],['30','1 mes'],['365','1 año'],['all','Todo']]){
      const btn=make('button','today-period-button',label);btn.type='button';btn.disabled=true;btn.setAttribute('aria-pressed',String(value==='7'));periods.append(btn);
    }
    const chart=make('div','atlas-empty-chart');chart.append(empty('Histórico no disponible.'));
    const zoom=make('div','today-zoom-buttons');for(const val of ['−','+']){const b=make('button','today-period-button',val);b.disabled=true;zoom.append(b);}
    content.append(periods,chart,zoom,empty('Los datos aparecerán cuando estén disponibles.'));showDetail(def[2],content);
  }
  // Estado y seis tarjetas de Hoy: sin valores inventados, pero con estructura canónica.
  $('#today-date-caption').textContent='Estado ATLAS';$('#today-state-score').textContent='—';$('#today-state-word').textContent='Sin datos';$('#today-state-note').textContent='A la espera de información deportiva';
  $('#today-state-button').addEventListener('click',()=>{const body=make('div','today-detail-content');body.append(empty('Estado ATLAS no disponible.'),empty('Los factores de recuperación aparecerán cuando existan observaciones.'));showDetail('Estado ATLAS',body);});
  function tile(id){const [icon,label]=metricDefs[id];const b=make('button','today-metric');b.type='button';b.setAttribute('aria-label',`Ver ${metricDefs[id][2]}`);
    b.append(make('span','today-metric-icon',icon),make('span','today-metric-label',label),make('span','today-metric-value','—'),make('span','today-metric-meta','Sin datos'));
    b.addEventListener('click',()=>showMetric(id));return b;}
  for(const id of ['sleep','hrv','rhr','vo2','load','volume'])$('#today-metrics').append(tile(id));
  $('#today-last').append(empty('Todavía no hay actividades registradas.'));
  $('#today-next').append(empty('Todavía no hay entrenamientos planificados.'));
  // Actividades: conserva filtros y contenedor canónicos, sin inventar resultados.
  $('#activities-summary').textContent='Sin actividades disponibles';
  $('#activities-list').append(empty('No hay actividades que mostrar.'));
  $('#activities-sport').addEventListener('change',()=>{});
  $('#activities-year').addEventListener('change',()=>{});
  $('#activities-search').addEventListener('input',()=>{});
  // Pantalla interior canónica preparada, sin registros.
  const actDialog=$('#activity-detail');for(const id of ['activity-detail-back','activity-detail-close'])$('#'+id).addEventListener('click',()=>{actDialog.hidden=true;document.body.classList.remove('activity-dialog-open');});
  // Plan: estructura de entrada, sin sesiones, planes ni edición de datos hasta sus fases correspondientes.
  const plan=$('#view-plan');plan.innerHTML=`<div class="plan-head"><h1 class="atlas-page-title">Plan</h1></div><div id="plan-list"></div><div id="plan-main-calendar"></div>`;
  $('#plan-list').append(empty('Todavía no hay planes de entrenamiento.'));
  const planHead=make('h2','today-section-title','Calendario semanal');$('#plan-main-calendar').append(planHead,empty('No hay sesiones planificadas.'));
  // Evolución: fichas métricas reutilizadas y espacio de pronósticos sin series calculadas.
  const evolution=$('#view-evolucion');evolution.innerHTML=`<div class="evolution-heading"><h1 class="atlas-page-title">Evolución</h1></div><div class="today-metrics evolution-metrics" id="evolution-metrics"></div><div class="evolution-forecast-head"><h2>Pronósticos de carrera</h2></div><div class="evolution-forecast-main" id="evolution-forecast-main"></div>`;
  for(const id of ['vo2','thresholdPace','thresholdHr','volume','load','efficiency'])$('#evolution-metrics').append(tile(id));
  $('#evolution-forecast-main').append(empty('Sin pronósticos disponibles.'));
  // Perfil y Ajustes: acordeones canónicos cerrados inicialmente, sin identidad inventada.
  const profile=$('#view-perfil');profile.innerHTML=`<div class="profile-heading"><h1 class="atlas-page-title">Perfil</h1><button class="profile-settings-launch" id="profile-open-settings" type="button" aria-label="Abrir Ajustes">⚙️</button></div><div class="profile-identity"><div class="profile-avatar" aria-hidden="true">👤</div><div class="profile-identity-content"><strong class="profile-name">Sin perfil conectado</strong><span class="profile-location">Sin información personal</span></div></div><div id="profile-sections"></div>`;
  function accordion(id,icon,name,message){const section=make('section','profile-section atlas-accordion');const btn=make('button','profile-section-toggle atlas-accordion-trigger');btn.type='button';btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls',id);
    btn.append(make('span','profile-section-title',`${icon} ${name}`),make('span','profile-section-arrow atlas-accordion-chevron','›'));
    const panel=make('div','profile-section-content');panel.id=id;panel.hidden=true;panel.append(empty(message));btn.addEventListener('click',()=>{const opened=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!opened));panel.hidden=opened;btn.lastElementChild.textContent=opened?'›':'⌄';});section.append(btn,panel);return section;}
  const sections=$('#profile-sections');for(const [id,icon,name,msg] of [
    ['profile-shoes','👟','Zapatillas','No hay zapatillas registradas.'],
    ['profile-zones','🎯','Zonas de entrenamiento','Zonas no disponibles.'],
    ['profile-load','📊','Foco de carga','No hay datos de carga.'],
    ['profile-records','🏅','Mejores marcas','No hay marcas registradas.']])sections.append(accordion(id,icon,name,msg));
  const profileDialog=$('#profile-detail');const settingsBody=$('#profile-detail-body');let settingsOpener;
  $('#profile-open-settings').addEventListener('click',()=>{settingsOpener=document.activeElement;settingsBody.replaceChildren();
    for(const [id,icon,name,msg] of [
      ['profile-settings-data','🗂️','Datos de ATLAS','No hay datos almacenados.'],
      ['profile-settings-worker','☁️','Worker','No configurado.'],
      ['profile-settings-status','ℹ️','Estado técnico','Sin conexión a Garmin ni almacenamiento configurado.']])settingsBody.append(accordion(id,icon,name,msg));
    profileDialog.hidden=false;document.body.classList.add('profile-dialog-open');$('#profile-detail-back').focus();});
  function closeSettings(){profileDialog.hidden=true;document.body.classList.remove('profile-dialog-open');settingsBody.replaceChildren();settingsOpener?.focus?.();}
  $('#profile-detail-back').addEventListener('click',closeSettings);$('#profile-detail-close').addEventListener('click',closeSettings);
  document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!todayDialog.hidden)closeDetail();else if(!profileDialog.hidden)closeSettings();});
})();
