/* ATLAS v0.0.14 · Fase 2.4 — Evolución (presentación DEMO, sin proveedor). */
(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const create = (tag, className = '', label = '') => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (label) node.textContent = label;
    return node;
  };
  const NS = 'http://www.w3.org/2000/svg';
  const dateAtNoon = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const today = dateAtNoon(new Date());
  const dayMs = 86400000;
  const dates = (n) => Array.from({length:n}, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - n + i + 1); return d;
  });
  const shortDate = d => d.toLocaleDateString('es-ES', {day:'numeric',month:'short'}).replace('.', '').toUpperCase();
  const periodOptions = [['7','7 días'],['30','1 mes'],['365','1 año'],['all','Todo']];
  const metrics = [
    {id:'vo2',icon:'🫁',name:'VO₂ máx.',full:'VO₂ máximo',unit:'ml/kg/min',value:'54,73',type:'line',
      description:'Capacidad máxima del organismo para utilizar oxígeno durante el esfuerzo. Es un indicador aeróbico, no una predicción exacta del resultado en carrera.',
      insight:'La mejora sostenida se apoya en la regularidad, los entrenamientos aeróbicos y la recuperación. Observa la tendencia de varias semanas y no una fluctuación puntual.'},
    {id:'thresholdPace',icon:'🏃🏻‍♂️',name:'Ritmo umbral',full:'Umbral — ritmo',unit:'min/km',value:'4:31',type:'line',
      description:'Ritmo de carrera asociado al umbral de lactato; se presenta como referencia externa y no se estima automáticamente en ATLAS.',
      insight:'Un ritmo de umbral más rápido, manteniendo una sensación de esfuerzo comparable, suele reflejar una mejora útil para distancias largas.'},
    {id:'thresholdHr',icon:'❤️',name:'Umbral FC',full:'Umbral — frecuencia cardíaca',unit:'ppm',value:'174',type:'line',
      description:'Frecuencia cardíaca correspondiente al umbral de lactato, distinta de la frecuencia cardíaca máxima.',
      insight:'Combínala con el ritmo y las sensaciones: una cifra aislada puede cambiar por el método de medición o las condiciones del día.'},
    {id:'volume',icon:'📏',name:'Volumen',full:'Volumen de carrera',unit:'km',value:'48',type:'bar',
      description:'Kilómetros de carrera acumulados en cada día de entrenamiento. El histórico permite revisar su distribución y continuidad.',
      insight:'Repartir los kilómetros de manera sostenible y evitar saltos bruscos suele ser más útil que alcanzar un máximo puntual.'},
    {id:'load',icon:'⚡',name:'Carga',full:'Carga de entrenamiento',unit:'u. carga',value:'436',type:'line',
      description:'Indicador de exigencia reciente del entrenamiento. Aquí se muestra un ejemplo simulado, no una métrica oficial recuperada de Garmin.',
      insight:'La evolución de la carga se interpreta junto a la recuperación, la frecuencia de entrenamiento y el rendimiento, no por sí sola.'},
    {id:'efficiency',icon:'🌬️',name:'Eficiencia',full:'Eficiencia aeróbica',unit:'m/latido',value:'1,12',type:'line',
      description:'Métrica DEMO ilustrativa de distancia recorrida por latido durante carrera aeróbica. Su definición operativa deberá validarse antes de calcular datos reales.',
      insight:'Para comparar sesiones, procura condiciones similares: tipo de recorrido, temperatura, intensidad y estado de fatiga influyen en el resultado.'}
  ];
  const races = [
    {id:'five',name:'5 km',color:'#1d9bf0',base:1236,change:62},
    {id:'ten',name:'10 km',color:'#00ba7c',base:2592,change:132},
    {id:'half',name:'Media maratón',color:'#ff9f0a',base:5745,change:280},
    {id:'full',name:'Maratón',color:'#bf5af2',base:12240,change:600}
  ];
  // Todas las series nacen de una función determinista: datos expresamente ficticios.
  function demoValue(id, d) {
    const t = Math.round((dateAtNoon(d) - today) / dayMs);
    const progression = Math.max(-2, t / 365);
    const swing = Math.sin(t / 13) * .18 + Math.cos(t / 37) * .12;
    switch(id) {
      case 'vo2': return +(54.73 + progression*.92 + swing).toFixed(2);
      case 'thresholdPace': return Math.max(240, Math.round(271 - progression*7 + Math.sin(t/25)*2));
      case 'thresholdHr': return Math.round(174 + progression*1.3 + Math.sin(t/19)*1.5);
      case 'volume': return (Math.abs(t)%7===0 || Math.abs(t)%7===3 || Math.abs(t)%7===5) ? +Math.max(0, 7.3 + Math.sin(t/17)*2.5 + (Math.abs(t)%7===5?5:0)).toFixed(1) : 0;
      case 'load': return Math.round(436 + progression*55 + Math.sin(t/9)*25 + Math.cos(t/31)*17);
      case 'efficiency': return +(1.12 + progression*.045 + Math.sin(t/24)*.018).toFixed(2);
      default: return 0;
    }
  }
  function isObserved(id, d) {
    const n = Math.abs(Math.round((dateAtNoon(d) - today)/dayMs));
    if(id==='volume') return true;
    if(id==='vo2') return n%5===0 || n===0;
    if(id==='thresholdPace' || id==='thresholdHr') return n%14===0 || n===0;
    if(id==='efficiency') return n%3===0 || n===0;
    return n%2===0 || n===0;
  }
  function format(id, value) {
    if (value == null) return '—';
    if(id==='thresholdPace') return `${Math.floor(value / 60)}:${String(Math.round(value % 60)).padStart(2,'0')}`;
    if(id==='vo2' || id==='efficiency') return Number(value).toFixed(2).replace('.',',');
    if(id==='volume') return Number(value).toFixed(1).replace('.',',');
    return String(Math.round(value));
  }
  function timeLabel(value, compact = false) {
    const s = Math.max(0,Math.round(value));
    const h = Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60;
    if (compact && h) return `${h}h ${String(m).padStart(2,'0')}m`;
    return h?`${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${m}:${String(sec).padStart(2,'0')}`;
  }
  function forecast(r, d) {
    const t = Math.max(0, (today - dateAtNoon(d))/dayMs);
    return r.base + r.change * Math.min(1.8, t/600) + 14*Math.sin(t/27 + r.change/250);
  }
  function svgEl(parent, name, attrs = {}, value = null) {
    const node=document.createElementNS(NS,name);
    Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,String(v)));
    if(value!==null) node.textContent=value;
    parent.appendChild(node);
    return node;
  }
  function draw(metric, count, zoom, enabled = new Set(races.map(r=>r.id))) {
    const ds=dates(count),forecastMode=metric==='forecasts';
    const selected = forecastMode?races.filter(r=>enabled.has(r.id)):[metric];
    const containerWidth=Math.max(330, Math.min(410, document.documentElement.clientWidth-28));
    const width=Math.round(containerWidth*zoom), height=260, L=forecastMode?63:52,R=12,T=24,B=32;
    const baseY=height-B, innerW=width-L-R;
    const x=i=>L+i*innerW/Math.max(1,count-1);
    const days=forecastMode?ds.filter((_,i)=>i%7===0||i===ds.length-1):ds;
    let all=[];
    if(forecastMode) all=selected.flatMap(r=>days.map(d=>forecast(r,d)));
    else all=ds.flatMap(d=>isObserved(metric.id,d)?[demoValue(metric.id,d)]:[]);
    if(!all.length)all=[0,1];
    let min=Math.min(...all),max=Math.max(...all);
    if(metric?.id==='volume')min=0;
    const pad=Math.max(.3,(max-min)*.20);
    min=Math.max(0,min-pad*(metric?.id==='volume'?0:1));max+=pad;
    if(max<=min)max=min+1;
    const y=v=>T+(max-v)/(max-min)*(baseY-T);
    const svg=svgEl(document.createDocumentFragment(),'svg',{
      xmlns:NS,viewBox:`0 0 ${width} ${height}`,width,height,role:'img',class:'evolution-chart',
      'aria-label':forecastMode?'Pronósticos DEMO para 5 km, 10 km, media maratón y maratón':`Histórico DEMO de ${metric.full}`
    });
    const defs=svgEl(svg,'defs');
    if(!forecastMode){const grad=svgEl(defs,'linearGradient',{id:'evolution-area',x1:'0',y1:'0',x2:'0',y2:'1'});
      svgEl(grad,'stop',{offset:'0%','stop-color':'#f4212e','stop-opacity':'.32'});
      svgEl(grad,'stop',{offset:'100%','stop-color':'#f4212e','stop-opacity':'0'});}
    for(let j=0;j<4;j++){
      const v=min+(max-min)*j/3, yy=y(v);
      svgEl(svg,'line',{x1:L,y1:yy,x2:width-R,y2:yy,class:'evolution-gridline'});
      const txt=forecastMode?timeLabel(v,true):format(metric.id,v);
      svgEl(svg,'text',{x:L-6,y:yy+3,class:'evolution-axis', 'text-anchor':'end'},txt);
    }
    const dateStep=Math.max(1,Math.ceil(count/(6*zoom)));
    ds.forEach((d,i)=>{if(i%dateStep===0 || i===ds.length-1)svgEl(svg,'text',{x:x(i),y:height-9,'text-anchor':'middle',class:'evolution-axis'},shortDate(d));});
    if(forecastMode){
      for(const race of selected){
        const points=ds.map((d,i)=>({i,d,v:forecast(race,d)})).filter(p=>p.i%7===0||p.i===count-1);
        svgEl(svg,'polyline',{points:points.map(p=>`${x(p.i)},${y(p.v)}`).join(' '),fill:'none',stroke:race.color,'stroke-width':2.2,'stroke-linejoin':'round','stroke-linecap':'round'});
        const step=Math.max(1,Math.ceil(points.length/(4*zoom)));
        points.forEach((p,j)=>{if(j%step!==0&&j!==points.length-1)return;
          svgEl(svg,'circle',{cx:x(p.i),cy:y(p.v),r:2.5,fill:race.color});
        });
      }
    }else if(metric.type==='bar'){
      const bw=Math.max(1.5,Math.min(25,innerW/count*.68));
      ds.forEach((d,i)=>{const v=demoValue(metric.id,d); if(v<=0)return;
        svgEl(svg,'rect',{x:x(i)-bw/2,y:y(v),width:bw,height:Math.max(1,baseY-y(v)),rx:Math.min(3,bw/3),fill:'#1d9bf0'});
      });
    }else{
      let segment=[];
      function flush(){if(!segment.length)return;
        const ps=segment.map(p=>`${x(p.i)},${y(p.v)}`).join(' ');
        if(segment.length>1)svgEl(svg,'polygon',{points:`${x(segment[0].i)},${baseY} ${ps} ${x(segment[segment.length-1].i)},${baseY}`,fill:'url(#evolution-area)'});
        svgEl(svg,'polyline',{points:ps,fill:'none',stroke:'#f4212e','stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round'});
        segment=[];
      }
      // No unir observaciones separadas por huecos como si fueran mediciones diarias.
      // Trazar la serie entre puntos reales simulados, manteniendo los días vacíos en el eje X.
      const available=ds.map((d,i)=>({i,v:demoValue(metric.id,d)})).filter(p=>isObserved(metric.id,ds[p.i]));
      if(available.length){segment=available;flush();}
      const step=Math.max(1,Math.ceil(available.length/(6*zoom)));
      available.forEach((p,i)=>{if(i%step!==0&&i!==available.length-1)return;
        svgEl(svg,'circle',{cx:x(p.i),cy:y(p.v),r:2.8,fill:'#f4212e'});
        svgEl(svg,'text',{x:x(p.i),y:Math.max(10,y(p.v)-9),class:'evolution-value','text-anchor':'middle'},format(metric.id,p.v));
      });
    }
    if(!forecastMode && metric.type==='bar'){
      const active=ds.map((d,i)=>({i,v:demoValue(metric.id,d)})).filter(p=>p.v>0);
      const step=Math.max(1,Math.ceil(active.length/(6*zoom)));
      active.forEach((p,i)=>{if(i%step!==0 && i!==active.length-1)return;
        svgEl(svg,'text',{x:x(p.i),y:Math.max(10,y(p.v)-8),class:'evolution-value','text-anchor':'middle'},format(metric.id,p.v));});
    }
    return svg;
  }
  const view=$('#view-evolucion');
  view.innerHTML=`
    <div class="evolution-heading"><h1 class="atlas-page-title atlas-view-heading">Evolución</h1><span class="today-demo">DEMO · SIMULADO</span></div>
    <p class="evolution-notice">Históricos ficticios para comprobar el diseño. No son datos ni pronósticos de Garmin.</p>
    <div class="evolution-metrics today-metrics" id="evolution-metrics" aria-label="Seis métricas de rendimiento simuladas"></div>
    <div class="evolution-forecast-head"><h2>🏁 Pronósticos de carrera</h2><span>DEMO</span></div>
    <div class="evolution-forecast-main" id="evolution-forecast-main"></div>
    <p class="evolution-footnote">Los valores y las tendencias son ficticios; no se realizan cálculos deportivos ni se estima el umbral real.</p>`;
  const detail=create('section','evolution-detail');
  detail.id='evolution-detail';detail.hidden=true;detail.setAttribute('role','dialog');detail.setAttribute('aria-modal','true');detail.setAttribute('aria-labelledby','evolution-detail-title');
  detail.innerHTML=`<div class="evolution-detail-inner"><div class="evolution-detail-top"><button type="button" class="today-detail-back" id="evolution-detail-back" aria-label="Volver a Evolución">‹</button><h2 id="evolution-detail-title"></h2></div><div id="evolution-detail-body"></div><button type="button" id="evolution-detail-bottom" class="atlas-button atlas-button--quiet evolution-detail-bottom">Volver a Evolución</button></div>`;
  document.body.appendChild(detail);
  let lastFocus=null;
  function close(){detail.hidden=true;document.body.classList.remove('evolution-dialog-open');lastFocus?.focus();}
  $('#evolution-detail-back').addEventListener('click',close);
  $('#evolution-detail-bottom').addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(!detail.hidden && e.key==='Escape'){e.preventDefault();close();}});
  function chartControls(metric, forecasts=false){
    let count=forecasts?365:7,zoom=1,initialDist=0,initialZoom=1;
    const enabled=new Set(races.map(r=>r.id));
    const root=create('div','evolution-chart-section');
    const periods=create('div','today-periods');
    const scroller=create('div','today-chart-container evolution-chart-scroller');
    const zoomButtons=create('div','today-zoom-buttons');
    const status=create('p','evolution-chart-guidance','Arrastra horizontalmente para explorar; amplía con dos dedos o con +/−.');
    function render(){scroller.replaceChildren(draw(forecasts?'forecasts':metric,count,zoom,enabled));}
    periodOptions.forEach(([id,title])=>{
      const b=create('button','today-period-button',title);b.type='button';b.setAttribute('aria-pressed',String(id===(forecasts?'365':'7')));
      b.addEventListener('click',()=>{count=id==='all'?730:Number(id);zoom=1;periods.querySelectorAll('button').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));render();});periods.append(b);
    });
    for (const [step,label] of [[-.5,'−'],[.5,'+']]){
      const b=create('button','today-period-button',label);b.type='button';b.setAttribute('aria-label',step>0?'Ampliar gráfica':'Reducir gráfica');
      b.addEventListener('click',()=>{zoom=Math.max(1,Math.min(6,zoom+step));render();});zoomButtons.append(b);
    }
    scroller.addEventListener('touchstart',e=>{if(e.touches.length===2){initialDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);initialZoom=zoom;}},{passive:true});
    scroller.addEventListener('touchmove',e=>{if(e.touches.length!==2||!initialDist)return;
      e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      const next=Math.max(1,Math.min(6,initialZoom*d/initialDist));if(Math.abs(next-zoom)>.1){zoom=next;render();}
    },{passive:false});
    scroller.addEventListener('touchend',e=>{if(e.touches.length<2)initialDist=0;});
    root.append(periods);
    if(forecasts){
      const legend=create('div','evolution-forecast-legend');
      races.forEach(r=>{const b=create('button','evolution-legend-button');b.type='button';b.setAttribute('aria-pressed','true');
        const dot=create('span','evolution-legend-dot');dot.style.backgroundColor=r.color;
        b.append(dot,document.createTextNode(r.name));b.addEventListener('click',()=>{
          if(enabled.has(r.id)){if(enabled.size===1)return;enabled.delete(r.id);}else enabled.add(r.id);
          b.setAttribute('aria-pressed',String(enabled.has(r.id)));render();
        });legend.append(b);});root.append(legend);
    }
    const inspect=create('div','atlas-chart-inspect');inspect.setAttribute('aria-live','polite');let active=false,guide=null;
    function sample(clientX){const svg=scroller.querySelector('svg');if(!svg)return;const rect=scroller.getBoundingClientRect(),w=Number(svg.getAttribute('width')),x=clientX-rect.left+scroller.scrollLeft,idx=Math.max(0,Math.min(count-1,Math.round((x-(forecasts?63:52))/(w-(forecasts?63:52)-12)*(count-1))));
      const d=dates(count)[idx];if(!d)return;
      if(forecasts){inspect.textContent=`${d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · ${races.filter(r=>enabled.has(r.id)).map(r=>`${r.name}: ${timeLabel(forecast(r,d),true)}`).join(' · ')} · DEMO`;}
      else{inspect.textContent=`${d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}: ${isObserved(metric.id,d)?format(metric.id,demoValue(metric.id,d)):'Sin registro'} · DEMO`;}
      guide?.remove();guide=document.createElementNS(NS,'line');const px=(forecasts?63:52)+idx*(w-(forecasts?63:52)-12)/Math.max(1,count-1);for(const [k,v] of Object.entries({x1:px,x2:px,y1:24,y2:228,stroke:'#fff','stroke-dasharray':'3 4',opacity:'.7'}))guide.setAttribute(k,v);svg.append(guide);
    }
    scroller.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!e.isPrimary)return;active=true;sample(e.clientX);});
    scroller.addEventListener('pointermove',e=>{if(active&&!initialDist)sample(e.clientX);});window.addEventListener('pointerup',()=>active=false);
    root.append(scroller,inspect,zoomButtons,status);render();return root;
  }
  function openMetric(metric){
    lastFocus=document.activeElement;$('#evolution-detail-title').textContent=`${metric.icon} ${metric.full}`;
    const body=$('#evolution-detail-body');body.replaceChildren();
    const unit=create('p','evolution-chart-unit',`Eje vertical: ${metric.unit} · Eje horizontal: fecha`);
    body.append(chartControls(metric),unit,create('p','evolution-explanation',metric.description),create('p','evolution-insight',metric.insight),
      create('p','today-detail-disclaimer','DEMO · Históricos, valores y fechas simulados. No proceden de Garmin ni sustituyen datos oficiales.'));
    detail.hidden=false;document.body.classList.add('evolution-dialog-open');$('#evolution-detail-back').focus();
  }
  const strip=$('#evolution-metrics');
  metrics.forEach(metric=>{
    const button=create('button','today-metric evolution-metric');button.type='button';button.setAttribute('aria-label',`Ver histórico DEMO de ${metric.full}`);
    button.append(create('span','today-metric-icon',metric.icon),create('span','today-metric-label',metric.name));
    const value=create('span','today-metric-value',metric.value);
    button.append(value,create('span','today-metric-meta',metric.unit));button.addEventListener('click',()=>openMetric(metric));strip.append(button);
  });
  // El pronóstico completo se ve sin entrar en otra pantalla y dispone de filtros propios.
  const forecastRoot=$('#evolution-forecast-main');
  forecastRoot.append(chartControls(null,true));
  const note=create('p','evolution-forecast-note','Las cuatro curvas muestran tiempos hipotéticos. Las series pueden mostrarse u ocultarse pulsando su leyenda.');
  forecastRoot.append(note);
})();
