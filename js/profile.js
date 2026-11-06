/* ATLAS v0.0.16 · Ajustes de Perfil · Perfil DEMO: interfaz y datos ficticios, sin persistencia. */
(() => {
  'use strict';
  const root = document.getElementById('view-perfil');
  const detail = document.getElementById('profile-detail');
  if (!root || !detail) return;
  const $ = (s, scope = document) => scope.querySelector(s);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const demo = {
    user: { name:'Deportista DEMO', location:'Perfil ficticio · España', initials:'👤' },
    shoes: [
      {id:'a',name:'Adidas Adizero Boston 12',km:486,limit:700,active:true},
      {id:'b',name:'ASICS Novablast 4',km:332,limit:750,active:true},
      {id:'c',name:'Adidas Adizero Adios Pro 4',km:162,limit:450,active:true},
      {id:'d',name:'Nike Pegasus 40',km:802,limit:800,active:false}
    ],
    hrZones:[{n:'Z1',range:'< 133 ppm',color:'#8c98a4'}, {n:'Z2',range:'133–148 ppm',color:'#1d9bf0'}, {n:'Z3',range:'149–163 ppm',color:'#00ba7c'}, {n:'Z4',range:'164–177 ppm',color:'#ff9f0a'}, {n:'Z5',range:'≥ 178 ppm',color:'#f4212e'}],
    paceZones:[{n:'Z1',range:'> 6:00 min/km',color:'#8c98a4'}, {n:'Z2',range:'5:15–6:00',color:'#1d9bf0'}, {n:'Z3',range:'4:50–5:14',color:'#00ba7c'}, {n:'Z4',range:'4:20–4:49',color:'#ff9f0a'}, {n:'Z5',range:'< 4:20',color:'#f4212e'}],
    records:[
      {distance:'1 km',time:'3:43',pace:'3:43',date:'12 SEP 26',activityId:'demo-pr-1k'},
      {distance:'5 km',time:'20:52',pace:'4:10',date:'18 OCT 26',activityId:'demo-pr-5k'},
      {distance:'10 km',time:'43:35',pace:'4:22',date:'4 OCT 26',activityId:'demo-pr-10k'},
      {distance:'Media',time:'1:37:44',pace:'4:38',date:'15 MAR 26',activityId:'demo-pr-half'},
      {distance:'Maratón',time:'3:29:18',pace:'4:58',date:'22 FEB 26',activityId:'demo-pr-marathon'},
      {distance:'Distancia más larga',time:'3:44:15',pace:'5:20',date:'17 MAY 26',activityId:'demo-pr-longest'}
    ]
  };
  root.innerHTML = `
    <div class="profile-heading"><h1 class="atlas-page-title atlas-view-heading">Perfil</h1><button class="profile-settings-launch" type="button" id="profile-open-settings" aria-label="Abrir configuración">⚙️</button></div>
    <p class="profile-demo-line"><span class="today-demo">DEMO · SIMULADO</span> Datos ficticios, no vinculados a Garmin.</p>
    <div class="profile-identity">
      <div class="profile-avatar" role="img" aria-label="Avatar genérico de demostración">${demo.user.initials}</div>
      <div class="profile-identity-content"><strong class="profile-name">${escape(demo.user.name)}</strong><span class="profile-location">📍 ${escape(demo.user.location)}</span><button type="button" class="profile-shoes-link" id="profile-open-shoes">👟 Zapatillas <span aria-hidden="true">›</span></button></div>
    </div>
    <h2 class="profile-heading-secondary">🎯 Zonas de entrenamiento</h2>
    <div class="atlas-zones" aria-label="Zonas de ritmo y frecuencia cardíaca"><div class="atlas-zones-header"><span>Zona</span><span>🏃 Ritmo</span><span>❤️ FC</span></div>
      ${demo.hrZones.map((zone,i)=>`<div class="atlas-zones-row"><span class="atlas-zone-name"><i class="profile-zone-dot" style="--zone-color:${zone.color}"></i><strong>${zone.n}</strong></span><strong class="atlas-zone-pace">${escape(demo.paceZones[i].range)}<small>${i>0&&i<5?'min/km':''}</small></strong><strong class="atlas-zone-hr">${escape(zone.range)}<small>ppm</small></strong></div>`).join('')}
    </div>
    <p class="profile-small-print">Zonas ilustrativas, sin cálculo de umbral ni sincronización. Las zonas reales dependerán de la configuración y los datos disponibles en Garmin.</p>
    <h2 class="profile-heading-secondary">🏅 Mejores marcas</h2>
    <div class="profile-records" aria-label="Mejores marcas simuladas">
      <div class="profile-record-header"><span>Distancia</span><span>Tiempo</span><span>Ritmo</span><span>Fecha</span></div>
      ${demo.records.map(record => `<button type="button" class="profile-record-row profile-record-open" data-profile-record-id="${escape(record.activityId)}" aria-label="Abrir ficha DEMO de ${escape(record.distance)}"><strong>${escape(record.distance)}</strong><strong>${escape(record.time)}</strong><span>${escape(record.pace)} <small>min/km</small></span><span>${escape(record.date)}</span></button>`).join('')}
    </div>
    <p class="profile-small-print">Marcas de muestra, incluido 1 km. No corresponden a actividades reales.</p>`;

  const modalTitle = $('#profile-detail-title');
  const modalBody = $('#profile-detail-body');
  let opener = null;
  function openDetail(title,markup,from){
    opener=from || document.activeElement;
    modalTitle.textContent=title;
    modalBody.innerHTML=markup;
    detail.hidden=false;
    document.body.classList.add('profile-dialog-open');
    $('#profile-detail-back').focus();
  }
  function closeDetail(){
    detail.hidden=true;
    document.body.classList.remove('profile-dialog-open');
    modalBody.replaceChildren();
    opener?.focus?.();
  }
  function renderShoes(){
    const content=`<p class="profile-detail-note">Equipamiento ficticio. El kilometraje, los límites y el estado de las zapatillas son ejemplos sin conexión a Garmin.</p>
       <div class="profile-shoe-list">${demo.shoes.map(shoe=>{
         const percent=Math.min(100,Math.round(shoe.km/shoe.limit*100));
         return `<article class="profile-shoe"><div class="profile-shoe-head"><strong>👟 ${escape(shoe.name)}</strong><span class="profile-shoe-status ${shoe.active?'':'retired'}">${shoe.active?'Activas':'Retiradas'}</span></div><div class="profile-shoe-nums"><span>${shoe.km} <small>km usados</small></span><span>${shoe.limit} <small>km límite</small></span></div><div class="profile-shoe-track" role="progressbar" aria-label="Uso de ${escape(shoe.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%;background:${percent>=95?'var(--atlas-red)':percent>=80?'var(--atlas-orange)':'var(--atlas-blue)'}"></span></div></article>`;
       }).join('')}</div>
       <p class="profile-detail-note">El límite de kilometraje es orientativo. El desgaste real depende del modelo, el terreno y el uso.</p>`;
    openDetail('👟 Zapatillas',content,$('#profile-open-shoes'));
  }
  function renderSettings(){
    const rows=[['Versión de ATLAS',`v${document.documentElement.dataset.atlasVersion||'—'}`],['Modo','DEMO · Sin datos reales'],['Origen deportivo','Garmin · Pendiente'],['Conexión Garmin','No conectada'],['Persistencia','No implementada (fase 3)'],['Sincronización','No disponible']];
    openDetail('Ajustes',`<p class="profile-detail-note">Configuración de ATLAS. Durante la fase 2 sólo se utilizan datos de demostración.</p>
      <h3 class="profile-settings-subtitle">🗂️ Datos de ATLAS</h3>
      <div class="profile-settings-actions"><button type="button" class="atlas-button profile-settings-action" id="profile-export-json">Exportar datos DEMO · JSON</button><button type="button" class="atlas-button profile-settings-action danger" id="profile-clear-database" disabled>Vaciar base de datos · Fase 3</button></div>
      <p class="profile-detail-note">La exportación contiene los datos DEMO del Perfil y el catálogo de actividades simuladas. No es una copia de IndexedDB: todavía no existe base de datos. El vaciado se activará cuando exista, con confirmación expresa y sin afectar a datos externos.</p>
      <h3 class="profile-settings-subtitle">☁️ Worker · Preparado para fase 4</h3>
      <div class="profile-settings-rows"><div class="profile-settings-row"><span>URL del Worker</span><strong>Sin configurar</strong></div><div class="profile-settings-row"><span>Autenticación</span><strong>Pendiente</strong></div><div class="profile-settings-row"><span>Permisos Garmin</span><strong>Pendientes</strong></div></div>
      <p class="profile-detail-note">La configuración operativa se habilitará al definir el Worker y su autenticación. Las credenciales y secretos nunca se guardarán en esta web pública.</p>
      <h3 class="profile-settings-subtitle">ℹ️ Estado técnico</h3><div class="profile-settings-rows">${rows.map(([k,v])=>`<div class="profile-settings-row"><span>${escape(k)}</span><strong>${escape(v)}</strong></div>`).join('')}</div>`,$('#profile-open-settings'));
    $('#profile-export-json',modalBody).addEventListener('click',exportDemoJSON);
  }
  function exportDemoJSON(){
    const payload={format:'ATLAS-DEMO',formatVersion:1,appVersion:document.documentElement.dataset.atlasVersion||'desconocida',exportedAt:new Date().toISOString(),notice:'Datos simulados. No es una exportación de una base de datos IndexedDB.',profile:demo,activities:window.ATLASActivities?.list?.()??[]};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download=`ATLAS-DEMO-v${document.documentElement.dataset.atlasVersion||'sin-version'}.json`;document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-profile-record-id]');
    if(!button)return;
    const id=button.dataset.profileRecordId;
    window.ATLASActivities?.open?.(id);
  });
  $('#profile-open-settings').addEventListener('click',renderSettings);
  $('#profile-open-shoes').addEventListener('click',renderShoes);
  $('#profile-detail-back').addEventListener('click',closeDetail);
  $('#profile-detail-close').addEventListener('click',closeDetail);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!detail.hidden){event.preventDefault();closeDetail();}});
})();
