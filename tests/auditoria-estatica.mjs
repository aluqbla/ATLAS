// ATLAS v0.0.24 · Fase 3.5. Solo lectura, sin red ni modificaciones de datos.
// Uso: node tests/auditoria-estatica.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let ok=0,fail=0;
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const test=async(name,fn)=>{try{await fn();ok++;console.log('OK  '+name)}catch(e){fail++;console.error('ERR '+name+': '+e.message)}};
const model=JSON.parse(read('js/data/model.json'));
const index=read('index.html');
const sw=read('service-worker.js');
await test('Manifiesto con 14 almacenes únicos',()=>{
 assert(model.stores.length===14,'Número de almacenes distinto de 14');
 assert(new Set(model.stores.map(s=>s.name)).size===14,'Almacenes duplicados');
 assert(model.contractVersion===1,'Versión de contrato incompatible');
 for(const spec of model.stores){assert(spec.keyPath&&Array.isArray(spec.indexes),'Contrato inválido '+spec.name);assert(new Set(spec.indexes.map(i=>i[0])).size===spec.indexes.length,'Índices repetidos '+spec.name)}
});
await test('Todos los recursos locales del HTML existen',()=>{
 const refs=[...index.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["'](\.[^"']+)["']/g)].map(m=>m[1]);
 assert(refs.length>=12,'No se encontraron referencias suficientes');
 for(const ref of refs)assert(fs.existsSync(path.join(root,ref)),'No existe '+ref);
});
await test('Caché: recursos, unicidad, versión y ausencia de API',()=>{
 const files=[...sw.matchAll(/'((?:\.\/)[^']+)'/g)].map(m=>m[1]);
 const start=sw.indexOf('const SHELL_FILES = Object.freeze(['),stop=sw.indexOf(']);',start);
 const shell=sw.slice(start,stop).match(/'\.\/[^']*'/g).map(s=>s.slice(1,-1));
 assert(shell.length===23,'Se esperaban 23 recursos y hay '+shell.length);
 assert(new Set(shell).size===shell.length,'Recursos duplicados');
 for(const ref of shell){if(ref!=='./')assert(fs.existsSync(path.join(root,ref)),'Recurso ausente '+ref)}
 assert(shell.every(s=>!/garmin|\/api\//i.test(s)),'Rutas externas en caché');
 assert(sw.includes("const SHELL_VERSION = '0.0.25'"),'Versión caché incorrecta');
 assert(read('js/app.js').includes("const APP_VERSION = '0.0.25'"),'Versión app incorrecta');
});
await test('Todos los JavaScript superan comprobación sintáctica',()=>{
 const files=[];
 const traverse=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory())traverse(p);else if(/\.js$/.test(p))files.push(p)}};
 traverse(root);
 for(const file of files)new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
 assert(files.length>=10,'Scripts incompletos');
});
await test('Migración inicial crea almacenes e índices según manifiesto',async()=>{
 let saved=null;let opens=0;let upgradeCount=0;
 function newDB(){
  const stores=new Map();
  return {name:'atlas',version:1,stores,close(){},createObjectStore(name,{keyPath}){
   assert(!stores.has(name),'Almacén duplicado '+name);
   const indexes=new Map();const store={keyPath,indexes,createIndex(n,k,{unique}){indexes.set(n,{keyPath:k,unique})}};
   stores.set(name,store);return store;
  }};
 }
 const context={window:{},Object,Map,Set,Promise,console,Error,TypeError};
 context.indexedDB={open(name,version){opens++;assert(name==='atlas'&&version===1,'Parámetros apertura incorrectos');
  const request={result:saved||newDB(),transaction:{abort(){throw Error('Migración cancelada')}},error:null};
  queueMicrotask(()=>{if(!saved){upgradeCount++;request.onupgradeneeded?.({oldVersion:0});saved=request.result}request.onsuccess?.()});return request;
 }};
 vm.runInNewContext(read('js/data/database.js'),context);
 const api=context.window.ATLASDatabase;
 const [a,b]=await Promise.all([api.open(),api.open()]);assert(a===b,'Aperturas concurrentes distintas');
 assert(opens===1,'Aperturas redundantes');assert(a.stores.size===14,'No se crearon los 14 almacenes');
 for(const spec of model.stores){const store=a.stores.get(spec.name);assert(store&&store.keyPath===spec.keyPath,'Clave de almacén distinta '+spec.name);assert(store.indexes.size===spec.indexes.length,'Índices incompletos '+spec.name);
  for(const [name,keyPath,unique] of spec.indexes){const idx=store.indexes.get(name);assert(idx&&JSON.stringify(idx.keyPath)===JSON.stringify(keyPath)&&idx.unique===unique,'Índice incorrecto '+spec.name+'.'+name)}
 }
 api.close();const reopened=await api.open();assert(reopened===saved,'Reapertura del mismo esquema no esperada');
 assert(upgradeCount===1,'Se repitió migración al reabrir');
});
await test('Repositorios cubren todos los almacenes y prohíben acciones ajenas',()=>{
 const source=read('js/data/repositories.js');
 for(const name of model.stores.map(s=>s.name))assert(source.includes("'"+name+"'"),'Falta repositorio '+name);
 for(const action of ['put','add','delete'])assert(source.includes("'"+action+"'"),'Falta acción '+action);
 assert(source.includes('tx.abort()'),'No hay abortos previstos');
});
console.log(`\nRESULTADO: ${ok} correctas, ${fail} fallidas`);
process.exitCode=fail?1:0;
