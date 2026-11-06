/* ATLAS v0.0.7 · Fase 2.1. Datos DEMO aislados de cualquier proveedor. */
(() => {
  'use strict';
  const DEMO = Object.freeze({
    state: { score: 82, word: 'Buena', note: 'Recuperación favorable para entrenar', factors: [
      ['Sueño',84,'Descanso satisfactorio'],['VFC',78,'Dentro de la banda habitual'],
      ['Carga',76,'Carga reciente tolerable'],['Recuperación',90,'Sin alertas en la simulación']
    ] },
    metrics: [
      { id:'sleep', icon:'💤', name:'Sueño', value:'7 h 48 m', unit:'', meta:'Bueno', description:'El sueño agrupa la recuperación física y mental. Una noche aislada no define el rendimiento: observa su tendencia y cómo te encuentras al entrenar.', values:[72,79,75,81,85,76,83,78,86,82,86], suffix:'pts' },
      { id:'hrv', icon:'🫀', name:'VFC', value:'64', unit:'ms', meta:'50 - 62', description:'La variabilidad de la frecuencia cardíaca refleja la respuesta del sistema nervioso autónomo. Importa más la relación con tu rango personal que el valor absoluto.', values:[59,61,60,63,66,65,62,63,64,66,64], suffix:'ms' },
      { id:'rhr', icon:'❤️', name:'Reposo', value:'48', unit:'ppm', meta:'Media: 47', description:'La frecuencia cardíaca en reposo puede verse afectada por el estrés, el calor y la recuperación. Una subida persistente merece revisar el descanso.', values:[51,50,49,50,48,49,48,47,49,48,48], suffix:'ppm' },
      { id:'vo2', icon:'🫁', name:'VO₂ máx.', value:'54,7', unit:'', meta:'ml/kg/min', description:'El VO₂ máximo aproxima la capacidad aeróbica. Su evolución a medio plazo aporta contexto, pero el rendimiento también depende del umbral y la economía de carrera.', values:[53.9,54,54.1,54.1,54.3,54.2,54.4,54.5,54.4,54.6,54.7], suffix:'' },
      { id:'load', icon:'⚡', name:'Carga', value:'436', unit:'', meta:'7 días', description:'La carga resume la exigencia reciente del entrenamiento. Para progresar, debe equilibrarse con la recuperación y mantenerse coherente con tu historial.', values:[350,366,382,401,427,450,423,412,441,448,436], suffix:'' },
      { id:'volume', icon:'🏃🏻‍♂️', name:'Volumen', value:'48', unit:'km', meta:'Últ. 7 días', description:'Kilómetros de carrera acumulados durante los últimos siete días; la regularidad ayuda a construir resistencia.', values:[40,44,42,49,46,51,38,45,47,53,48], suffix:'km', bars:true }
    ],
    last: {date:'2026-11-04', icon:'🏃🏻‍♂️', name:'Carrera suave', details:['10,2 km','53:14','5:13 min/km']},
    next: [
      {date:'2026-11-06',icon:'🏋🏻‍♂️',name:'Fuerza · cuerpo completo',details:['45:00','Full Body']},
      {date:'2026-11-07',icon:'🏃🏻‍♂️',name:'Rodaje aeróbico',details:['12 km','1:06:00','5:15–5:35 min/km']},
      {date:'2026-11-08',icon:'🏃🏻‍♂️',name:'Tirada larga',details:['18 km','1:42:00','Ritmo fácil']}
    ]
  });
  const $ = selector => document.querySelector(selector);
  const el = (tag, className, text) => {const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
  const fmtDate = date => new Date(`${date}T12:00:00`).toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'});
  const modal = $('#today-detail');
  const body = $('#today-detail-body');
  const heading = $('#today-detail-title');
  function openDetail(name, content) {
    heading.textContent=name;
    body.replaceChildren(content);
    modal.hidden=false;
    document.body.classList.add('today-dialog-open');
    $('#today-detail-back').focus();
  }
  function closeDetail(){modal.hidden=true;document.body.classList.remove('today-dialog-open');}
  $('#today-detail-back').addEventListener('click',closeDetail);
  $('#today-detail-close').addEventListener('click',closeDetail);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.hidden)closeDetail();});
  function makeCopy(tag,klass,value){return el(tag,klass,value);}
  function stateDetail(){
    const wrap=el('div','today-detail-content');
    const hero=el('div','today-state-detail-hero');const ring=el('span','today-ring');ring.style.setProperty('--today-score',`${DEMO.state.score}%`);ring.append(el('span','today-ring-value',String(DEMO.state.score)));
    const copy=el('div','');copy.append(el('p','today-detail-lead','Buena'),el('p','today-detail-description','Los indicadores simulados describen una jornada favorable para entrenar con normalidad. El descanso y la recuperación sostienen la disposición actual, mientras que la carga reciente invita a respetar la intensidad prevista.'));hero.append(ring,copy);wrap.append(hero);
    wrap.append(el('p','today-detail-description','Interpretación ilustrativa: la constancia en el volumen y la alternancia entre sesiones exigentes y fáciles ayudan a consolidar adaptaciones sin acumular fatiga innecesaria. Si apareciesen cansancio inusual, sueño deficiente o molestias, sería razonable moderar la sesión. Ninguna de estas conclusiones procede de un cálculo validado.'));
    const factors=el('div','today-factor-grid');
    for(const [name,score,desc] of DEMO.state.factors){
      const row=el('div','today-factor'); const top=el('div','today-factor-head');top.append(el('strong','',({'Sueño':'💤','VFC':'🫀','Carga':'⚡','Recuperación':'🌿'})[name]+' '+name),el('strong','',`${score}/100`));
      const track=el('div','today-factor-track');const fill=el('span','today-factor-fill');fill.style.width=`${score}%`;fill.style.background=score>=85?'var(--atlas-green)':score>=70?'var(--atlas-blue)':score>=50?'var(--atlas-yellow)':'var(--atlas-red)';track.append(fill);
      row.append(top,track,el('p','today-factor-caption',desc));factors.append(row);
    }
    wrap.append(factors,el('p','today-detail-disclaimer','DEMO · Valores, interpretación y factores inventados; sin diagnóstico, Garmin ni motor de entrenamiento.'));
    openDetail('Estado ATLAS',wrap);
  }
  const metricsDate = new Date();metricsDate.setHours(12,0,0,0);
  const metricHistory = (metric,days)=>{
    const base=metric.values;const ret=[];
    for(let i=days-1;i>=0;i--){const day=new Date(metricsDate);day.setDate(day.getDate()-i);const seed=base[(base.length-1-(i%base.length)+base.length)%base.length];
      const present=i<11 || i%4!==0;
      const value=metric.id==='volume'?Math.max(0,Math.round(seed/7+(i%3)*.25)):metric.id==='sleep'?Math.round(6.1*60+seed*1.1):seed;
      ret.push({day,value:present?value:null,reference:[50+Math.sin(i/14)*3,62+Math.sin(i/14)*3],quality:value>=480?'Excelente':value>=420?'Bueno':value>=360?'Regular':'Malo'});
    }return ret;
  };
  const fmtTick=metric=>value=>metric.id==='sleep'?`${Math.floor(value/60)}h ${Math.round(value%60)}m`:(metric.id==='vo2'?Number(value).toFixed(1).replace('.',','):String(Math.round(value)));
  function drawChart(metric,period,zoom=1){
    const days=period==='all'?365:period==='year'?365:period==='month'?30:7;
    const series=metricHistory(metric,days), isBars=['sleep','volume'].includes(metric.id);
    const w=Math.max(350,Math.round(350*zoom)),h=235,L=40,R=12,T=24,B=31;
    const vals=series.flatMap(s=>s.value===null?[]:[s.value]);const refs=metric.id==='hrv'?series.flatMap(s=>s.reference):[];
    const lo=Math.min(...vals,...refs),hi=Math.max(...vals,...refs),span=Math.max(1,hi-lo);const min=Math.max(0,lo-span*.22),max=hi+span*.22;
    const x=i=>L+(i+.5)*(w-L-R)/days;const y=v=>T+(max-v)/(max-min)*(h-T-B);const base=h-B;
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.classList.add('today-chart');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('width',w);svg.setAttribute('height',h);svg.setAttribute('role','img');svg.setAttribute('aria-label',`Histórico DEMO de ${metric.name}: ${days} fechas, incluidos días sin registro`);
    const shape=(tag,a,parent=svg)=>{const node=document.createElementNS(ns,tag);Object.entries(a).forEach(([k,v])=>node.setAttribute(k,String(v)));parent.append(node);return node;};
    const defs=shape('defs',{}),grad=shape('linearGradient',{id:'todayGradient',x1:'0',y1:'0',x2:'0',y2:'1'},defs);shape('stop',{offset:'0%','stop-color':'#f4212e','stop-opacity':'.38'},grad);shape('stop',{offset:'100%','stop-color':'#f4212e','stop-opacity':'0'},grad);
    for(let k=0;k<4;k++){const v=min+(max-min)*k/3,Y=y(v);shape('line',{x1:L,y1:Y,x2:w-R,y2:Y,stroke:'#253038','stroke-width':1});shape('text',{x:L-5,y:Y+3,fill:'#9ba5af','font-size':9,'text-anchor':'end'}).textContent=fmtTick(metric)(v);}
    if(metric.id==='hrv'){const pts=series.map((s,i)=>[x(i),y(s.reference[0]),y(s.reference[1])]);shape('polygon',{points:[...pts.map(p=>`${p[0]},${p[1]}`),...pts.slice().reverse().map(p=>`${p[0]},${p[2]}`)].join(' '),fill:'rgba(0,186,124,.16)'});}
    if(isBars){const bw=Math.max(1.6,Math.min(25,(w-L-R)/days*.65));series.forEach((s,i)=>{if(s.value===null)return;const color=metric.id==='volume'?'#1d9bf0':({Excelente:'#1d9bf0',Bueno:'#00ba7c',Regular:'#ffd400',Malo:'#f4212e'})[s.quality];shape('rect',{x:x(i)-bw/2,y:y(s.value),width:bw,height:Math.max(1,base-y(s.value)),rx:Math.min(3,bw/3),fill:color});});}
    else {let segment=[];function flush(){if(!segment.length)return;const pts=segment.map(s=>`${s.x},${s.y}`);if(metric.id!=='hrv')shape('polygon',{points:[`${segment[0].x},${base}`,...pts,`${segment.at(-1).x},${base}`].join(' '),fill:'url(#todayGradient)'});shape('polyline',{points:pts.join(' '),fill:'none',stroke:'#f4212e','stroke-width':2,'stroke-linejoin':'round'});segment=[];}series.forEach((s,i)=>{if(s.value===null){flush();return;}segment.push({x:x(i),y:y(s.value)});});flush();}
    const plotPerPoint=(w-L-R)/days;
    const step=Math.max(1,Math.ceil(42/plotPerPoint));
    const labelStep=Math.max(1,Math.ceil(48/plotPerPoint));
    series.forEach((s,i)=>{if(i%labelStep===0||i===days-1){shape('text',{x:x(i),y:h-10,fill:'#87929d','font-size':9,'text-anchor':'middle'}).textContent=s.day.toLocaleDateString('es-ES',{day:'numeric',month:'short'}).replace('.','').toUpperCase();}
      if(s.value!==null&&(i%step===0||i===days-1)){const yy=y(s.value);if(!isBars)shape('circle',{cx:x(i),cy:yy,r:2.1,fill:'#f4212e'});shape('text',{x:x(i),y:Math.max(10,yy-7),fill:'#e5ebef','font-size':9,'text-anchor':'middle'}).textContent=fmtTick(metric)(s.value);}
    });return svg;
  }
  function metricDetail(metric){
    const wrap=el('div','today-detail-content');/* El valor ya figura en la tarjeta principal: no duplicarlo sobre los filtros. */
    const buttons=el('div','today-periods'),scroller=el('div','today-chart-container');let selected='week',zoom=1;
    function render(){scroller.replaceChildren(drawChart(metric,selected,zoom));}
    for(const [id,label] of [['week','7 días'],['month','1 mes'],['year','1 año'],['all','Todo']]){
      const b=el('button','today-period-button',label);b.type='button';b.setAttribute('aria-pressed',String(id===selected));b.addEventListener('click',()=>{selected=id;zoom=1;buttons.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});buttons.append(b);
    }
    // Pinza continua 1×–8×; el punto bajo los dedos conserva su posición.
    let pinch=null,frame=0,pending=null;
    const clamp=z=>Math.max(1,Math.min(8,z));
    function applyZoom(z,midpoint){
      const oldWidth=scroller.firstElementChild?.getBoundingClientRect().width||350;
      const anchor=(scroller.scrollLeft+midpoint)/oldWidth;
      zoom=clamp(z);render();
      const newWidth=scroller.firstElementChild?.getBoundingClientRect().width||350;
      scroller.scrollLeft=Math.max(0,anchor*newWidth-midpoint);
    }
    function scheduleZoom(z,x){pending=[z,x];if(frame)return;frame=requestAnimationFrame(()=>{frame=0;if(pending){applyZoom(...pending);pending=null;}});}
    const touchDistance=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
    const midpoint=t=>(t[0].clientX+t[1].clientX)/2-scroller.getBoundingClientRect().left;
    scroller.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch={distance:touchDistance(e.touches),zoom,anchor:midpoint(e.touches)};},{passive:true});
    scroller.addEventListener('touchmove',e=>{if(e.touches.length!==2||!pinch)return;e.preventDefault();scheduleZoom(pinch.zoom*touchDistance(e.touches)/Math.max(1,pinch.distance),midpoint(e.touches));},{passive:false});
    scroller.addEventListener('touchend',e=>{if(e.touches.length<2)pinch=null;},{passive:true});
    scroller.addEventListener('touchcancel',()=>{pinch=null;},{passive:true});
    scroller.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();scheduleZoom(zoom*Math.exp(-e.deltaY*.012),scroller.clientWidth/2);},{passive:false});
    const controls=el('div','today-zoom-buttons');for(const [v,t] of [[-.5,'−'],[.5,'+']]){const b=el('button','today-period-button',t);b.type='button';b.setAttribute('aria-label',v>0?'Ampliar gráfica':'Reducir gráfica');b.addEventListener('click',()=>applyZoom(zoom+v,scroller.clientWidth/2));controls.append(b);}
    const info=el('div','atlas-chart-inspect');info.setAttribute('aria-live','polite');
    let guide=null;
    function inspect(clientX){const rect=scroller.getBoundingClientRect(),svg=scroller.querySelector('svg');if(!svg)return;const w=Number(svg.getAttribute('width'))||350,days=selected==='week'?7:selected==='month'?30:365;
      const localX=clientX-rect.left+scroller.scrollLeft,idx=Math.max(0,Math.min(days-1,Math.round((localX-40)/(w-52)*days-.5))),point=metricHistory(metric,days)[idx];
      if(!point)return;info.textContent=`${point.day.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}: ${point.value===null?'Sin registro':fmtTick(metric)(point.value)+(metric.suffix?' '+metric.suffix:'')} · DEMO`;
      guide?.remove();const ns='http://www.w3.org/2000/svg';guide=document.createElementNS(ns,'line');const x=40+(idx+.5)*(w-52)/days;for(const [k,v] of Object.entries({x1:x,x2:x,y1:24,y2:204,stroke:'#fff','stroke-width':'1','stroke-dasharray':'3 4',opacity:'.65'}))guide.setAttribute(k,v);svg.append(guide);
    }
    let inspecting=false;scroller.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!e.isPrimary)return;inspecting=true;inspect(e.clientX);});scroller.addEventListener('pointermove',e=>{if(inspecting&&(!pinch))inspect(e.clientX);});window.addEventListener('pointerup',()=>{inspecting=false;});
    render();wrap.append(buttons,scroller,info,controls,el('p','today-detail-description',metric.description),el('p','today-detail-disclaimer','DEMO · Serie fechada generada artificialmente, con huecos de observación. No procede de Garmin. Zoom continuo 1×–8× con dos dedos o botones +/-; «Todo» presenta el año ficticio disponible.'));
    openDetail(`${metric.icon} ${metric.name}`,wrap);
  }
  $('#today-date-caption').textContent=new Intl.DateTimeFormat('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date()).replace(/^./,c=>c.toUpperCase());
  const score=$('#today-state-score');score.textContent=DEMO.state.score;
  $('#today-state-ring').style.setProperty('--today-score',`${DEMO.state.score}%`);
  $('#today-state-word').textContent=DEMO.state.word;
  $('#today-state-note').textContent=DEMO.state.note;
  $('#today-state-button').addEventListener('click',stateDetail);
  const strip=$('#today-metrics');
  for (const metric of DEMO.metrics){
    const button=el('button','today-metric');button.type='button';button.setAttribute('aria-label',`Ver histórico simulado de ${metric.name}`);
    button.append(el('span','today-metric-icon',metric.icon),el('span','today-metric-label',metric.name));
    const value=el('span','today-metric-value',metric.value);
    if(metric.id==='sleep'){value.textContent='';for(const [n,u] of [['7','h'],['48','min']]){if(n==='48')value.append(document.createTextNode(' '));value.append(el('span','',n),el('small','',u));}}else if(metric.unit)value.append(el('small','',` ${metric.unit}`));
    const meta=el('span','today-metric-meta',metric.meta);if(metric.id==='sleep')meta.classList.add('sleep-good');button.append(value,meta);button.addEventListener('click',()=>metricDetail(metric));strip.append(button);
  }
  function sessionRow(data,kind){
    const b=el('button','today-session');b.type='button';
    const date=el('span','today-session-date');const readable=fmtDate(data.date).replace('.','');date.append(el('span','today-session-weekday',new Date(`${data.date}T12:00:00`).toLocaleDateString('es-ES',{weekday:'short'}).replace('.','').toUpperCase()),el('span','today-session-day',new Date(`${data.date}T12:00:00`).getDate()),el('span','today-session-month',new Date(`${data.date}T12:00:00`).toLocaleDateString('es-ES',{month:'short'}).toUpperCase()));
    const copy=el('span','today-session-copy');copy.append(el('span','today-session-title',`${data.icon} ${data.name}`),el('span','today-session-stats',data.details.join('  ·  ')));
    b.append(date,copy);b.addEventListener('click',()=>{if(kind==='next'&&window.ATLASPlan?.openSessionByDate(data.date))return;const wrap=el('div','today-detail-content');wrap.append(el('p','today-detail-lead',`${data.icon} ${data.name}`),el('p','today-detail-description',`${readable} · ${data.details.join(' · ')}`),el('p','today-detail-disclaimer',kind==='last'?'SIMULACIÓN · La ficha canónica de actividades se incorporará en la Fase 2.2.':'SIMULACIÓN · La ficha de entrenamiento y el Plan se desarrollarán en la Fase 2.3.'));openDetail(data.name,wrap);});
    return b;
  }
  $('#today-last').append(sessionRow(DEMO.last,'last'));
  for(const next of DEMO.next)$('#today-upcoming').append(sessionRow(next,'next'));
})();
