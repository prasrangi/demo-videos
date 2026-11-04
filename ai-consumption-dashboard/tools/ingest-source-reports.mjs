import path from 'node:path';
import {readFile,mkdir,copyFile,open,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {preparePrivateStorage,assertPrivateStorage,atomicJSON} from './storage.mjs';
import {normalizeSource} from './source-reports.mjs';

const args=process.argv.slice(2),arg=name=>args.includes(name)?args[args.indexOf(name)+1]:undefined;
try{
 const manifestPath=path.resolve(arg('--manifest')||'');await assertPrivateStorage(path.dirname(manifestPath));
 const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
 if(manifest.approved!==true||!manifest.approvedBy||!manifest.approvalEvidence||!Number.isFinite(Date.parse(manifest.approvedAt))||!Array.isArray(manifest.reports)||manifest.reports.length!==4)throw new Error('An explicit approved four-report manifest is required.');
 const kinds=new Set();const reports=[];
 for(const item of manifest.reports){
  if(kinds.has(item.kind))throw new Error('Duplicate report kind.');kinds.add(item.kind);
  if(!item.sourceMessageUrl||!item.receivedAt||!item.subject)throw new Error('Source message provenance is required.');
  const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(item.receivedAt));if(date!==manifest.receivedDate)throw new Error('Source received date does not match the approved date.');
  const file=path.resolve(path.dirname(manifestPath),item.file);await assertPrivateStorage(path.dirname(file));
  const bytes=await readFile(file);if(bytes.length>10*1024*1024)throw new Error('Report exceeds 10 MB.');
  const hash=createHash('sha256').update(bytes).digest('hex');if(hash!==item.sha256)throw new Error('Report hash differs from approval manifest.');
  const normalized=normalizeSource(item.kind,new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  reports.push({...item,file:path.basename(file),sha256:hash,bytes:bytes.length,validation:'passed with source limitations',...normalized});
 }
 if(!['credits','azure','activity','inventory'].every(kind=>kinds.has(kind)))throw new Error('Incomplete report batch.');
 const storage=await preparePrivateStorage(arg('--storage'));const lock=path.join(storage,'.source-import.lock');const handle=await open(lock,'wx',0o600);
 try{
  const archive=path.join(storage,'originals'),audit=path.join(storage,'audit');await mkdir(archive,{recursive:true,mode:0o700});await mkdir(audit,{recursive:true,mode:0o700});
  for(const item of manifest.reports)await copyFile(path.resolve(path.dirname(manifestPath),item.file),path.join(archive,`${item.sha256}${item.kind==='inventory'?'.csv':'.json'}`));
  const now=new Date().toISOString();await atomicJSON(path.join(audit,`approved-source-import-${Date.now()}.json`),{...manifest,ingestedAt:now});
  await atomicJSON(path.join(storage,'reports.json'),{version:1,fictional:false,asOf:manifest.receivedDate,ingestedAt:now,approvedBy:manifest.approvedBy,reports});
  console.log(JSON.stringify({status:'ingested privately',reports:reports.length,kinds:[...kinds],unavailable:['verified MAU','verified PAU','AI-account billed cost'],publicDataChanged:false}));
 }finally{await handle.close();await unlink(lock);}
}catch(error){console.error(error.message);process.exitCode=1;}
