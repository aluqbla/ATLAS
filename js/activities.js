/* ATLAS v0.0.10 · Ajustes de presentación · Fase 2 · Historial y ficha canónica. Sólo datos simulados. */
(() => {
  'use strict';
  // Identificadores estables de demostración. No son IDs ni lecturas de Garmin.
  const records = [
    {id:'demo-run-1104',date:'2026-11-04',time:'07:35',sport:'running',name:'Carrera suave',distance:10.2,duration:3194,pace:'5:13',hr:143,hrMax:166,calories:702,ascent:54,descent:52,cadence:172,power:301,stride:1.12,oscillation:8.5,contact:256,vo2:54.7,shoes:'Adizero Boston (ejemplo)',description:'Rodaje cómodo para acumular kilómetros sin fatiga excesiva.',laps:[{km:1,sec:327,hr:137,up:5,down:4},{km:1,sec:317,hr:140,up:4,down:3},{km:1,sec:314,hr:142,up:5,down:4},{km:1,sec:316,hr:143,up:6,down:5},{km:1,sec:312,hr:144,up:5,down:6},{km:1,sec:310,hr:146,up:4,down:3},{km:1,sec:311,hr:146,up:6,down:5},{km:1,sec:313,hr:145,up:7,down:6},{km:1,sec:307,hr:146,up:5,down:4},{km:1,sec:314,hr:145,up:5,down:8},{km:.2,sec:53,hr:146,up:2,down:4}]},
    {id:'demo-strength-1103',date:'2026-11-03',time:'08:10',sport:'strength',name:'Fuerza · cuerpo completo',duration:2820,hr:108,hrMax:149,calories:288,exercises:[['Prensa de piernas','3 × 10','110 kg'],['Press de pecho','3 × 10','45 kg'],['Jalón al pecho','3 × 12','50 kg'],['Peso muerto con mancuernas','3 × 10','20 kg'],['Remo en polea','3 × 12','45 kg'],['Plancha','3 × 45 s','—']]},
    {id:'demo-run-1101',date:'2026-11-01',time:'08:05',sport:'running',name:'Tirada larga',distance:19.4,duration:6380,pace:'5:29',hr:149,hrMax:174,calories:1394,ascent:112,descent:108,cadence:169,power:298,stride:1.08,oscillation:8.8,contact:265,vo2:54.6,shoes:'Adizero Boston (ejemplo)'},
    {id:'demo-ride-1030',date:'2026-10-30',time:'17:40',sport:'cycling',name:'Ciclismo de recuperación',distance:28.6,duration:4120,speed:25.0,hr:125,hrMax:151,calories:588,ascent:180,descent:178,power:148},
    {id:'demo-run-1029',date:'2026-10-29',time:'07:25',sport:'running',name:'Intervalos · 5 × 1000 m',distance:11.0,duration:3420,pace:'5:11',hr:157,hrMax:181,calories:774,ascent:39,descent:38,cadence:178,power:341,stride:1.19,oscillation:8.1,contact:238,vo2:54.5,shoes:'Adizero Adios (ejemplo)',description:'Calentamiento, 5 × 1000 m con recuperación y vuelta a la calma.'},
    {id:'demo-walk-1027',date:'2026-10-27',time:'18:30',sport:'walking',name:'Paseo al atardecer',distance:5.4,duration:3540,pace:'10:56',hr:91,hrMax:115,calories:240,ascent:24,descent:23},
    {id:'demo-run-1025',date:'2026-10-25',time:'08:20',sport:'running',name:'Rodaje aeróbico',distance:14.0,duration:4452,pace:'5:18',hr:147,hrMax:169,calories:960,ascent:72,descent:70,cadence:173,power:309,stride:1.1,oscillation:8.4,contact:251,vo2:54.4,shoes:'Adizero Boston (ejemplo)'},
    {id:'demo-strength-1023',date:'2026-10-23',time:'08:05',sport:'strength',name:'Fuerza · tren superior',duration:2400,hr:104,hrMax:139,calories:235,exercises:[['Press de pecho','3 × 10','45 kg'],['Remo sentado','3 × 12','45 kg'],['Elevaciones laterales','3 × 12','8 kg'],['Plancha','3 × 40 s','—']]},
    {id:'demo-run-1021',date:'2026-10-21',time:'07:30',sport:'running',name:'Rodaje progresivo',distance:10.6,duration:3318,pace:'5:13',hr:152,hrMax:174,calories:745,ascent:41,descent:40,cadence:175,power:320,stride:1.12,oscillation:8.2,contact:247,vo2:54.3,shoes:'Adizero Adios (ejemplo)'},
    {id:'demo-ride-1019',date:'2026-10-19',time:'17:50',sport:'cycling',name:'Ciclismo suave',distance:21.8,duration:3540,speed:22.2,hr:121,hrMax:148,calories:480,ascent:130,descent:129},
    {id:'demo-run-1018',date:'2026-10-18',time:'08:10',sport:'running',name:'Carrera continua',distance:12.0,duration:3912,pace:'5:26',hr:147,hrMax:164,calories:835,ascent:60,descent:59,cadence:171,power:304,stride:1.09,oscillation:8.6,contact:259,vo2:54.2,shoes:'Adizero Boston (ejemplo)'}
  ];
  // Marcas ficticias adicionales: accesibles desde Perfil, no alteran el historial principal.
  const recordExamples=[
    ['demo-pr-1k','2026-09-12','Carrera 1 km · marca DEMO',1,223,3.7167],
    ['demo-pr-5k','2026-10-18','Carrera 5 km · marca DEMO',5,1252,4.1733],
    ['demo-pr-10k','2026-10-04','Carrera 10 km · marca DEMO',10,2615,4.3583],
    ['demo-pr-half','2026-03-15','Media maratón · marca DEMO',21.0975,5864,4.632],
    ['demo-pr-marathon','2026-02-22','Maratón · marca DEMO',42.195,12558,4.96],
    ['demo-pr-longest','2026-05-17','Distancia más larga · DEMO',42.195,13455,5.314]
  ];
  for(const [id,date,name,distance,duration,p] of recordExamples){
    const paceSeconds=Math.round(duration/distance);
    records.push({id,date,time:'08:15',sport:'running',name,distance,duration,pace:`${Math.floor(paceSeconds/60)}:${String(paceSeconds%60).padStart(2,'0')}`,hr:156,hrMax:180,calories:Math.round(distance*70),ascent:Math.round(distance*3),descent:Math.round(distance*3),cadence:178,power:320,vo2:54.6,recordOnly:true,description:'Registro de ejemplo preparado para mostrar el enlace desde Mejores marcas. No representa una carrera registrada.'});
  }
  const SPORTS={running:{label:'Carrera',icon:'🏃🏻‍♂️'},cycling:{label:'Ciclismo',icon:'🚴🏻‍♂️'},strength:{label:'Fuerza',icon:'🏋🏻‍♂️'},walking:{label:'Caminar',icon:'🚶🏻‍♂️'}};
  const $=s=>document.querySelector(s);
  const make=(tag,klass,content)=>{const e=document.createElement(tag);if(klass)e.className=klass;if(content!==undefined)e.textContent=content;return e;};
  const dateOf=s=>new Date(`${s}T12:00:00`);
  const formatDuration=n=>{const h=Math.floor(n/3600),m=Math.floor(n%3600/60),s=n%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${m}:${String(s).padStart(2,'0')}`;};
  const number=(n,d=0)=>n.toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});
  const datestr=s=>dateOf(s).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'});
  const years=[...new Set(records.map(r=>r.date.slice(0,4)))].sort().reverse();for(const year of years){const o=document.createElement('option');o.value=year;o.textContent=year;$('#activities-year').append(o);}
  const details=$('#activity-detail');const main=$('#activity-detail-body');const heading=$('#activity-detail-title');
  const navReturn=$('#activity-detail-back');const backBottom=$('#activity-detail-close');let focusOrigin=null;

  function metric(icon,label,value,unit=''){
    const item=make('div','activity-primary-item');item.append(make('span','activity-primary-icon',icon),make('span','activity-primary-label',label));
    const valueEl=make('span','activity-primary-value',String(value));if(unit)valueEl.append(make('small','activity-primary-unit',` ${unit}`));item.append(valueEl);return item;
  }
  function row(r){const b=make('button','activity-row');b.type='button';b.dataset.activityId=r.id;b.setAttribute('aria-label',`Abrir ficha simulada de ${r.name}, ${datestr(r.date)}`);
    const date=make('span','activity-row-date');date.append(make('span','activity-row-weekday',dateOf(r.date).toLocaleDateString('es-ES',{weekday:'short'}).replace('.','').toUpperCase()),make('span','activity-row-day',String(dateOf(r.date).getDate())),make('span','activity-row-month',dateOf(r.date).toLocaleDateString('es-ES',{month:'short'}).replace('.','').toUpperCase()));
    const copy=make('span','activity-row-copy');copy.append(make('span','activity-row-title',`${SPORTS[r.sport].icon} ${r.name}`));const stats=[r.distance!==undefined?`${number(r.distance,1)} km`:null,formatDuration(r.duration),r.pace?`${r.pace} min/km`:r.speed?`${number(r.speed,1)} km/h`:null].filter(Boolean);copy.append(make('span','activity-row-stats',stats.join('  ·  ')));
    b.append(date,make('span','activity-row-divider'),copy);b.addEventListener('click',()=>open(r.id,b));return b;
  }
  function renderList(){const sport=$('#activities-sport').value;const year=$('#activities-year').value;const query=$('#activities-search').value.trim().toLocaleLowerCase('es');const result=records.filter(r=>!r.recordOnly&&(sport==='all'||r.sport===sport)&&(year==='all'||r.date.startsWith(year))&&`${r.name} ${SPORTS[r.sport].label} ${r.date}`.toLocaleLowerCase('es').includes(query));result.sort((a,b)=>b.date.localeCompare(a.date));
    $('#activities-summary').textContent=`${result.length} actividades de demostración · Sin conexión a Garmin`;
    const list=$('#activities-list');list.replaceChildren();if(!result.length){list.append(make('p','activity-empty','No hay actividades simuladas que coincidan con los filtros.'));return;}
    const groups=new Map();for(const r of result){const key=r.date.slice(0,7);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}for(const group of groups.values()){
      const label=dateOf(group[0].date).toLocaleDateString('es-ES',{month:'long',year:'numeric'}),head=make('div','activity-month-heading');head.append(make('h2','activity-month-title',label.charAt(0).toUpperCase()+label.slice(1)),make('span','activity-month-count',`${group.length} actividades · ${number(group.reduce((n,r)=>n+(r.distance||0),0),1)} km`));list.append(head);for(const r of group)list.append(row(r));}

  }
  // Ficha canónica: la selección de métricas es específica del deporte y no altera los registros fuente.
  function statGrid(r){
    const n=(v,d=0)=>v==null?'—':number(v,d);
    const common=[['⏱️','Tiempo',formatDuration(r.duration)],['❤️','FC media',r.hr??'—','ppm'],['💓','FC máx.',r.hrMax??'—','ppm'],['🔥','Calorías',r.calories??'—','kcal']];
    const distance=['📏','Distancia',n(r.distance,1),'km'];
    const relief=['⛰️','Desnivel',r.ascent==null?'—':r.ascent,'m +'];
    let fields;
    if(r.sport==='running')fields=[distance,common[0],['🏃🏻‍♂️','Ritmo',r.pace||'—','min/km'],common[1],common[2],common[3],['⚡','Potencia',r.power??'—','W'],['👣','Cadencia',r.cadence??'—','ppm'],relief,['🫁','VO₂ máx.',n(r.vo2,1)]];
    else if(r.sport==='cycling')fields=[distance,common[0],['🚴🏻‍♂️','Velocidad',n(r.speed,1),'km/h'],common[1],common[2],common[3],['⚡','Potencia',r.power??'—','W'],['🔄','Cadencia',r.cadence??'—','rpm'],relief,['↘️','Descenso',r.descent??'—','m']];
    else if(r.sport==='strength'){
      const exercises=r.exercises||[];const setCount=exercises.reduce((acc,x)=>acc+(Number(x[1]?.match(/^\d+/)?.[0])||0),0);
      fields=[common[0],['🏋🏻‍♂️','Ejercicios',exercises.length],['🔁','Series',setCount],['🧮','Repet.',exercises.reduce((acc,x)=>acc+(Number(x[1]?.match(/×\s*(\d+)/)?.[1])||0)*(Number(x[1]?.match(/^\d+/)?.[0])||0),0)],common[1],common[2],common[3],['⚖️','Carga','—','kg'],['🎯','RPE',r.rpe??'—','/10'],['🫁','VO₂ máx.','—']];
    } else fields=[distance,common[0],['🚶🏻‍♂️','Ritmo',r.pace||'—','min/km'],common[1],common[2],common[3],['👣','Pasos',r.steps??'—'],['🔄','Cadencia',r.cadence??'—','ppm'],relief,['↘️','Descenso',r.descent??'—','m']];
    const grid=make('div','activity-primary');for(const field of fields)grid.append(metric(...field));main.append(grid);
  }
  function infoAndMap(r){
    const container=make('div','activity-topline');const facts=make('div','activity-quick-facts');
    const date=dateOf(r.date).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'2-digit'}).replace(/\./g,'').toUpperCase();
    const entries=[['📅',date],['🕒',r.time.replace(/^0(?=\d:)/,'')],['🌡️',r.temperature==null?'18 °C':`${r.temperature} °C`],['🎯',`${r.rpe??4}/10`],[({'Excelente':'😄','Muy buenas':'😄','Buenas':'🙂','Normales':'😐','Regulares':'🙁','Malas':'😞','Muy malas':'😣'})[r.feeling||(['Muy buenas','Buenas','Normales','Regulares','Malas'][records.indexOf(r)%5])]||'🙂',r.feeling||(['Muy buenas','Buenas','Normales','Regulares','Malas'][records.indexOf(r)%5])]];
    for(const [icon,value] of entries){const fact=make('div','activity-fact');fact.append(make('span','activity-fact-icon',icon),make('span','activity-fact-value',value));facts.append(fact);}
    container.append(facts);fitActivityFacts(container);
    const map=make('div','activity-map-demo');map.setAttribute('role','img');
    if(['running','cycling','walking'].includes(r.sport)){
      map.setAttribute('aria-label','Ruta ficticia dibujada, no es cartografía GPS');
      map.innerHTML=`<svg viewBox="0 0 360 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="demoGrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#263038" stroke-width="1"/></pattern></defs><rect width="360" height="210" fill="#10171c"/><rect width="360" height="210" fill="url(#demoGrid)"/><path d="M-15 45L85 73 155 27 260 58 380 35M-15 152L85 123 175 165 255 117 380 152" stroke="#33434d" stroke-width="11" fill="none" opacity=".68"/><path d="M68 149C36 105 92 58 133 77S223 38 264 81 288 159 225 165 109 177 68 149Z" stroke="#1d9bf0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="68" cy="149" r="8" fill="#00ba7c" stroke="#fff" stroke-width="2"/><circle cx="75" cy="155" r="8" fill="#f4212e" stroke="#fff" stroke-width="2"/></svg>`;
      map.append(make('span','activity-map-overlay','DEMO · NO GPS'));
    }else{container.classList.add('activity-topline--no-gps');}
    if(!container.classList.contains('activity-topline--no-gps'))container.append(map);main.append(container);
  }
  function equipment(r){
    if(!r.shoes&&r.sport!=='cycling')return;
    const box=make('div','activity-equipment-demo');box.append(make('strong','',r.sport==='cycling'?'🚴🏻‍♂️ Bicicleta de ejemplo':`👟 ${r.shoes}`),make('span','',` · ${r.shoesKm??'428'} km · DEMO`));main.append(box);
  }
  function analysis(r){const messages={running:r.name.toLowerCase().includes('interval')?'Sesión de calidad con alternancia de esfuerzos intensos y pausas de recuperación. El trabajo fraccionado entrena la capacidad de sostener velocidades elevadas con técnica consistente; su utilidad en un plan dependería de la carrera objetivo y de la fase de preparación.':'Sesión de carrera de intensidad controlada y ejecución estable. Acumular tiempo en movimiento favorece la resistencia aeróbica y ayuda a tolerar mejor el volumen semanal. Dentro de un plan de maratón, este tipo de trabajo puede reforzar la base necesaria para las tiradas largas y los esfuerzos específicos.',cycling:'Trabajo cardiovascular de bajo impacto que permite mantener estímulo aeróbico sin sumar los mismos impactos que una carrera.',strength:'Trabajo general de fuerza con estímulo sobre los principales grupos musculares. Su integración dosificada puede contribuir a la estabilidad y economía del movimiento.',walking:'Sesión de movimiento suave, útil para favorecer actividad cotidiana y recuperación sin una gran exigencia.'};main.append(make('p','activity-analysis-demo',messages[r.sport]+' Análisis narrativo ficticio: no deriva de registros ni de un Training Engine.'));}
  
  function paceToSec(p){const [m,s]=(p||'5:20').split(':').map(Number);return m*60+s;}
  function lapsFor(r){if(r.laps)return r.laps;
    if(r.name.toLowerCase().includes('interval')){
      const result=[{km:1,sec:350,hr:130,up:1,down:1,phase:'warmup'},{km:1,sec:345,hr:138,up:1,down:1,phase:'warmup'}];
      for(let k=0;k<5;k++){result.push({km:1,sec:[258,260,256,259,255][k],hr:171+k,up:1,down:1,phase:'main'});if(k<4)result.push({km:.25,sec:105+k,hr:146+k,up:0,down:1,phase:'main'});}
      result.push({km:3,sec:1060,hr:141,up:2,down:1,phase:'cooldown'});return result;
    }const count=Math.min(26,Math.max(1,Math.ceil(r.distance||0)));const p=paceToSec(r.pace);return Array.from({length:count},(_,i)=>{const km=Math.min(1,Math.max(.01,Number((r.distance-i).toFixed(2))));const sec=Math.round(km*(p+Math.round(8*Math.sin(i*1.73))));return{km,sec,hr:Math.round((r.hr||145)+4*Math.sin(i*.8)),up:Math.round((r.ascent||0)/count),down:Math.round((r.descent||0)/count)};});}
  function chartSvg(r,type){const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.classList.add('activity-chart');svg.setAttribute('viewBox','0 0 360 190');svg.setAttribute('role','img');svg.setAttribute('aria-label',`Curva ${type} con datos ficticios`);const values=Array.from({length:40},(_,i)=>{const w=Math.sin(i*.37)+.5*Math.cos(i*.91);if(type==='heart')return (r.hr||140)+w*8+i*.07;if(type==='elevation')return 50+13*Math.sin(i*.26)+7*Math.sin(i*.68);if(type==='cadence')return (r.cadence||171)+w*3;return paceToSec(r.pace)+w*14;});
    const lo=Math.min(...values)-6,hi=Math.max(...values)+6;const pts=values.map((v,i)=>`${16+i*328/(values.length-1)},${159-(v-lo)/(hi-lo)*135}`).join(' ');for(let i=0;i<4;i++){const line=document.createElementNS(ns,'line');line.setAttribute('x1','16');line.setAttribute('x2','344');line.setAttribute('y1',String(24+i*45));line.setAttribute('y2',String(24+i*45));line.setAttribute('stroke','rgba(255,255,255,.12)');svg.append(line);}const defs=document.createElementNS(ns,'defs');const grad=document.createElementNS(ns,'linearGradient');grad.setAttribute('id','activityArea'+type);grad.setAttribute('x1','0');grad.setAttribute('y1','0');grad.setAttribute('x2','0');grad.setAttribute('y2','1');for(const [pos,opacity] of [['0%','.30'],['100%','0']]){const stop=document.createElementNS(ns,'stop');stop.setAttribute('offset',pos);stop.setAttribute('stop-color','#1d9bf0');stop.setAttribute('stop-opacity',opacity);grad.append(stop);}defs.append(grad);svg.append(defs);const area=document.createElementNS(ns,'polygon');area.setAttribute('points',`16,159 ${pts} 344,159`);area.setAttribute('fill',`url(#activityArea${type})`);svg.append(area);const poly=document.createElementNS(ns,'polyline');poly.setAttribute('points',pts);poly.setAttribute('fill','none');poly.setAttribute('stroke','#1d9bf0');poly.setAttribute('stroke-width','2.5');poly.setAttribute('stroke-linecap','round');svg.append(poly);return svg;
  }
  function charts(r){
    if(r.sport==='strength')return;
    const tabs=make('div','activity-chart-tabs');const host=make('div','activity-chart-host');
    const supported=[['pace',r.sport==='cycling'?'Velocidad':'Ritmo'],['heart','FC'],['elevation','Altitud']];if(r.sport==='running')supported.push(['cadence','Cadencia']);
    let selected='pace';for(const [id,label]of supported){const btn=make('button','activity-chart-tab',label);btn.type='button';btn.setAttribute('aria-pressed',String(id===selected));btn.addEventListener('click',()=>{selected=id;tabs.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));host.replaceChildren(chartSvg(r,id));});tabs.append(btn);}
    host.append(chartSvg(r,'pace'));main.append(tabs,host,make('p','activity-demo-note','DEMO · Curvas sintéticas, no datos de sensores.'));
  }
  function fitActivityTypography(container){
    // Un único tamaño máximo común para todas las cifras, conservando las unidades.
    requestAnimationFrame(()=>{
      const cells=[...container.querySelectorAll('.activity-laps-table tbody tr:not(.activity-lap-group) td')];
      if(!cells.length)return;
      let lo=9,hi=17;
      const fits=size=>{for(const cell of cells){cell.style.fontSize=size+'px';if(cell.scrollWidth>cell.clientWidth+1)return false;}return true;};
      for(let i=0;i<9;i++){const mid=(lo+hi)/2;if(fits(mid))lo=mid;else hi=mid;}
      cells.forEach(cell=>cell.style.fontSize=lo.toFixed(2)+'px');
    });
  }
  function fitActivityFacts(container){
    requestAnimationFrame(()=>{
      const nodes=[...container.querySelectorAll('.activity-fact-value')].slice(0,4);
      for(const node of nodes){let lo=9,hi=13;for(let k=0;k<8;k++){const m=(lo+hi)/2;node.style.fontSize=m+'px';if(node.scrollWidth<=node.clientWidth+1)lo=m;else hi=m;}node.style.fontSize=lo.toFixed(2)+'px';}
    });
  }
  function lapsSection(r){
    if(!['running','cycling','walking'].includes(r.sport))return;
    const laps=lapsFor(r),chart=make('div','activity-lap-bars'),scroll=make('div','activity-laps-scroll');
    const table=make('table','activity-laps-table');const head=make('thead');const hr=make('tr');
    for(const label of ['#','Dist.','Tiempo',r.sport==='cycling'?'Ritmo*':'Ritmo','FC','+/−'])hr.append(make('th','',label));
    head.append(hr);table.append(head);const tbody=make('tbody');const rows=[],buttons=[];const isInterval=r.name.toLowerCase().includes('interval');
    // Escala global fija en s/km: azul intenso (rápido) → claro (lento), saturada en <= 3:00 y >= 8:00 min/km.
    const fast=180,slow=480;const pace=l=>l.sec/l.km;
    const min=Math.min(...laps.map(pace)),max=Math.max(...laps.map(pace));
    const ns='http://www.w3.org/2000/svg';const totalDistance=laps.reduce((sum,l)=>sum+Math.max(.01,Number(l.km)||0),0);const usable=Math.max(306,laps.length*28);const width=usable+48,height=186;
    const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('width',width);svg.setAttribute('height',height);svg.setAttribute('role','img');svg.setAttribute('aria-label','Gráfico de barras interactivo de ritmo por vuelta, datos DEMO');
    const svgEl=(tag,attrs,txt)=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));if(txt!==undefined)e.textContent=txt;return e;};
    // Escala Y invertida para el ritmo: arriba más rápido; altura mayor para ritmo más rápido.
    const minY=Math.max(120,Math.floor(min/30)*30-30),maxY=Math.max(minY+60,Math.ceil(max/30)*30+30);const plotTop=17,plotBottom=155;
    const y=v=>plotTop+(v-minY)/(maxY-minY)*(plotBottom-plotTop);
    for(let j=0;j<4;j++){const v=minY+(maxY-minY)*j/3;const yy=y(v);svg.append(svgEl('line',{x1:40,x2:width-4,y1:yy,y2:yy,stroke:'rgba(255,255,255,.13)'}),svgEl('text',{x:35,y:yy+3,fill:'#aeb5bf','font-size':9,'text-anchor':'end'},formatDuration(Math.round(v))));}
    let selectedIndex=-1;function select(index){index=selectedIndex===index?-1:index;selectedIndex=index;rows.forEach((row,i)=>{row.classList.toggle('selected',i===index);row.setAttribute('aria-selected',String(i===index));});buttons.forEach((b,i)=>{b.classList.toggle('selected',i===index);b.setAttribute('aria-pressed',String(i===index));});if(rows[index])rows[index].scrollIntoView({block:'nearest',behavior:'smooth'});}
    laps.forEach((lap,i)=>{
      if(isInterval&&(i===0||laps[i-1]?.phase!==lap.phase)){const group=make('tr','activity-lap-group');const cell=make('td');cell.colSpan=6;cell.textContent=lap.phase==='warmup'?'⚡ Calentamiento':lap.phase==='main'?'◉ Bloque principal':'❄️ Enfriamiento';group.append(cell);tbody.append(group);}
      const seconds=pace(lap);const norm=Math.max(0,Math.min(1,(seconds-fast)/(slow-fast)));
      const light=Math.round(38+norm*32);const color=`hsl(204 92% ${light}%)`;
      const tr=make('tr','activity-lap-selectable');tr.tabIndex=0;tr.setAttribute('role','button');tr.setAttribute('aria-selected','false');
      const values=[String(i+1),lap.km>=1?`${number(lap.km,lap.km%1===0?0:2)} <small>km</small>`:`${Math.round(lap.km*1000)} <small>m</small>`,formatDuration(lap.sec),formatDuration(Math.round(seconds)),`${lap.hr} ppm`,`${lap.up} / −${lap.down} m`];for(let j=0;j<values.length;j++){const td=make('td','');if(j===1)td.innerHTML=values[j];else if(j===4)td.innerHTML=`${lap.hr} <small>ppm</small>`;else if(j===5){const elev=(lap.up||0)-(lap.down||0);td.className=elev>0?'lap-ascent':elev<0?'lap-descent':'';td.innerHTML=`${elev>0?'+':''}${elev} <small>m</small>`;}else td.textContent=values[j];tr.append(td);}
      tr.addEventListener('click',()=>select(i));tr.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(i);}});tbody.append(tr);rows.push(tr);
      const cumulative=laps.slice(0,i).reduce((sum,l)=>sum+Math.max(.01,Number(l.km)||0),0);const slot=usable*Math.max(.01,Number(lap.km)||0)/totalDistance;const x=43+usable*cumulative/totalDistance+Math.min(2,slot*.10),barWidth=Math.max(1,slot-Math.min(4,slot*.20)),top=y(seconds);
      const rect=svgEl('rect',{x,y:top,width:barWidth,height:Math.max(3,plotBottom-top),rx:3,fill:color});
      const button=make('button','activity-lap-bar-hit');button.type='button';button.style.left=`${100*x/width}%`;button.style.width=`${100*barWidth/width}%`;button.style.top=`${100*top/height}%`;button.style.bottom=`${100*(height-plotBottom)/height}%`;button.setAttribute('aria-label',`Seleccionar vuelta ${i+1}, ritmo ${formatDuration(Math.round(seconds))} por km`);button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>select(i));buttons.push(button);
      svg.append(rect,svgEl('text',{x:x+barWidth/2,y:height-10,fill:'#aab3be','font-size':9,'text-anchor':'middle'},i+1));
    });
    chart.append(svg);const plot=make('div','activity-lap-plot');for(const button of buttons)plot.append(button);
    const wrapper=make('div','activity-lap-chart-scroll');const inner=make('div','activity-lap-chart-inner');inner.style.width=`${width}px`;inner.append(chart,plot);wrapper.append(inner);main.append(wrapper);
    table.append(tbody);scroll.append(table);main.append(scroll);
    if(r.sport==='cycling')main.append(make('p','activity-demo-note','* En esta demostración, el gráfico representa el ritmo equivalente por kilómetro, no la velocidad ciclista.'));
    fitActivityTypography(main);main.append(make('p','activity-demo-note','DEMO · Parciales ficticios. Azul fijo según ritmo: ≤ 3:00/km más oscuro; ≥ 8:00/km más claro. Selecciona barra o fila.'));
  }
  
  function open(id,origin){
    const r=records.find(x=>x.id===id);if(!r)return;
    focusOrigin=origin instanceof HTMLElement?origin:document.activeElement;heading.textContent=`${SPORTS[r.sport].icon} ${r.name}`;main.replaceChildren();
    infoAndMap(r);equipment(r);statGrid(r);
    analysis(r);
    if(r.sport==='strength'){
      const list=make('div','activity-exercises');for(const [name,sets,load] of r.exercises||[]){const item=make('div','activity-exercise');item.append(make('strong','',name),make('span','',`${sets} · ${load}`));list.append(item);}main.append(list);
    }else{lapsSection(r);charts(r);}
    main.append(make('p','activity-demo-note','DEMO · Todos los datos de esta ficha son simulados. Ningún valor procede de Garmin.'));
    details.hidden=false;document.body.classList.add('activity-dialog-open');navReturn.focus();
  }
  
  function close(){details.hidden=true;document.body.classList.remove('activity-dialog-open');if(focusOrigin?.isConnected)focusOrigin.focus();}
  navReturn.addEventListener('click',close);backBottom.addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!details.hidden)close();});
  for(const id of ['#activities-sport','#activities-year','#activities-search'])$(id).addEventListener(id.endsWith('search')?'input':'change',renderList);
  renderList();
  // La misma fila y ficha completa se reutilizan desde Hoy, sin duplicar la presentación.
  const last=$('#today-last');last.replaceChildren(row(records[0]));
  window.ATLASActivities=Object.freeze({open:id=>open(id),list:()=>records.filter(r=>!r.recordOnly).map(({id,date,sport,name})=>({id,date,sport,name}))});
})();
