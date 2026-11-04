import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {validateRows} from '../model.mjs';
import {assertPrivateStorage} from './storage.mjs';
import {actualDashboard} from './actual-dashboard.mjs';

const args=process.argv.slice(2),privateMode=args.includes('--private');
const arg=name=>args.includes(name)?args[args.indexOf(name)+1]:undefined;
const port=Number(arg('--port')||4173);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid local port.');
const root=fileURLToPath(new URL('../',import.meta.url));
const storage=privateMode?await assertPrivateStorage(arg('--storage')):null;
if(privateMode&&!storage)throw new Error('Private storage is required.');
const types={'index.html':'text/html; charset=utf-8','reports.html':'text/html; charset=utf-8','reports.js':'text/javascript; charset=utf-8','app.js':'text/javascript; charset=utf-8','actual-view.mjs':'text/javascript; charset=utf-8','customer-roi.mjs':'text/javascript; charset=utf-8','roi-view.mjs':'text/javascript; charset=utf-8','benchmarks.mjs':'text/javascript; charset=utf-8','charts.mjs':'text/javascript; charset=utf-8','model.mjs':'text/javascript; charset=utf-8','sample-data.mjs':'text/javascript; charset=utf-8','styles.css':'text/css; charset=utf-8','favicon.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'none'");
 if(req.headers.host!==`127.0.0.1:${port}`){res.writeHead(403);res.end('Invalid host.');return;}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 try{
  const pathname=new URL(req.url,`http://127.0.0.1:${port}`).pathname;
  if(pathname==='/api/capabilities'){
   res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});res.end(req.method==='HEAD'?'':JSON.stringify({privateMode}));return;
  }
  if(pathname==='/api/actual'&&privateMode){
   const data=JSON.parse(await readFile(path.join(storage,'reports.json'),'utf8'));
   let measurements=null;try{measurements=JSON.parse(await readFile(path.join(storage,'measurements.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
   const clean=actualDashboard(data,measurements);
   res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});res.end(req.method==='HEAD'?'':JSON.stringify(clean));return;
  }
  if(pathname==='/api/reports'&&privateMode){
   const data=JSON.parse(await readFile(path.join(storage,'reports.json'),'utf8'));
   const clean={version:1,fictional:false,asOf:data.asOf,reports:data.reports.map(({kind,file,receivedAt,period,metrics,warnings})=>({kind,file,receivedAt,period,metrics,warnings}))};
   res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});res.end(req.method==='HEAD'?'':JSON.stringify(clean));return;
  }
  if(pathname==='/api/dashboard'&&privateMode){
   const data=JSON.parse(await readFile(path.join(storage,'dashboard.json'),'utf8'));
   const clean={fictional:false,asOf:data.asOf,currency:'USD',rows:validateRows(data.rows)};
   res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});res.end(req.method==='HEAD'?'':JSON.stringify(clean));return;
  }
  const name=pathname==='/'?'index.html':pathname.slice(1);
  if(!Object.hasOwn(types,name)){res.writeHead(404);res.end('Not found.');return;}
  const file=await readFile(path.join(root,name));res.writeHead(200,{'Content-Type':types[name]});res.end(req.method==='HEAD'?'':file);
 }catch{res.writeHead(503,{'Content-Type':'text/plain'});res.end('Private data unavailable or invalid.');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/${args.includes('--reports')?'reports.html':privateMode?'?private=1':''}`));
