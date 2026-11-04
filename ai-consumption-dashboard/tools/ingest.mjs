import {readFile,copyFile,mkdir,stat,open,unlink} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {validateRows,numericFields,addMonth} from '../model.mjs';
import {preparePrivateStorage,assertPrivateStorage,atomicJSON} from './storage.mjs';

export const headers=['customer','month',...numericFields];
export function parseCSV(text){
 const matrix=[];let row=[],field='',quoted=false,afterQuote=false;
 const push=()=>{row.push(field);field='';afterQuote=false;};
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;afterQuote=true;}}else field+=c;continue;}
  if(c==='"'){if(field||afterQuote)throw new Error('Invalid CSV quoting.');quoted=true;continue;}
  if(c===','){push();continue;}
  if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;push();if(row.some(x=>x.trim()))matrix.push(row);row=[];continue;}
  if(afterQuote)throw new Error('Unexpected characters after CSV quote.');field+=c;
 }
 if(quoted)throw new Error('Unterminated CSV quote.');
 if(field||row.length||afterQuote){push();if(row.some(x=>x.trim()))matrix.push(row);}
 const first=matrix.shift()?.map((h,i)=>(i===0?h.replace(/^\ufeff/,''):h).trim());
 if(!first||first.length!==headers.length||headers.some(h=>!first.includes(h))||new Set(first).size!==first.length)throw new Error(`Expected exactly these CSV columns: ${headers.join(',')}`);
 return validateRows(matrix.map((values,i)=>{
  if(values.length!==first.length)throw new Error(`CSV row ${i+2}: incorrect column count.`);
  return Object.fromEntries(first.map((h,j)=>{
   let value=values[j].trim();if(numericFields.includes(h)){if(!/^\d+(\.\d+)?$/.test(value))throw new Error(`CSV row ${i+2}: invalid ${h}.`);value=Number(value);}
   return [h,value];
  }));
 }));
}
export function contiguous(rows){
 const customers=new Set(rows.map(r=>r.customer));
 for(const customer of customers){const months=rows.filter(r=>r.customer===customer).map(r=>r.month).sort();for(let i=1;i<months.length;i++)if(addMonth(months[i-1],1)!==months[i])throw new Error('Missing monthly snapshots: supply contiguous monthly history per customer.');}
 // Portfolio comparisons need the same population in each snapshot.
 const periods=new Set(rows.map(r=>r.month));
 for(const month of periods)if(rows.filter(r=>r.month===month).length!==customers.size)throw new Error('Every reporting month must contain the same customer population.');
}
export async function ingest({input,approval,storage,replace=false,receivedDate}){
 if(!input||!approval||!storage)throw new Error('Required: --input CSV --approval JSON --storage PRIVATE_DIRECTORY');
 const [bytes,approvalText]=await Promise.all([readFile(input),readFile(approval,'utf8')]);
 if(bytes.length>10*1024*1024)throw new Error('Report exceeds the 10 MB ingestion limit.');
 const evidence=JSON.parse(approvalText);
 for(const key of ['approvedBy','approvalEvidence','sourceMessageId','receivedAt','approvedAt'])if(typeof evidence[key]!=='string'||!evidence[key].trim())throw new Error(`Missing approval field: ${key}`);
 if(evidence.approved!==true||evidence.currency!=='USD'||evidence.pauDefinition!=='paid_active_users')throw new Error('Explicit approval, USD currency, and confirmed paid-active-user mapping are required.');
 if(!/^\d{4}-\d\d-\d\dT.*(Z|[+-]\d\d:\d\d)$/.test(evidence.receivedAt)||!Number.isFinite(Date.parse(evidence.receivedAt))||!Number.isFinite(Date.parse(evidence.approvedAt)))throw new Error('Invalid received or approval timestamp.');
 if(receivedDate){const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(evidence.receivedAt));if(date!==receivedDate)throw new Error('Report was not received on the requested date in Asia/Kolkata.');}
 const hash=createHash('sha256').update(bytes).digest('hex');
 if(!/^[a-f0-9]{64}$/.test(evidence.sha256)||hash!==evidence.sha256)throw new Error('Approved report SHA-256 does not match the downloaded attachment.');
 const imported=parseCSV(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 const store=await preparePrivateStorage(storage);
 // Originals and approval evidence must already be in private storage, never Git or cloud sync.
 await assertPrivateStorage(path.dirname(path.resolve(input)));await assertPrivateStorage(path.dirname(path.resolve(approval)));
 const lock=path.join(store,'.ingest.lock');let handle;
 try{
  handle=await open(lock,'wx',0o600);
  let existing={rows:[],imports:[]};
  try{existing=JSON.parse(await readFile(path.join(store,'dashboard.json'),'utf8'));validateRows(existing.rows);}catch(error){if(error.code!=='ENOENT')throw error;}
  if(existing.imports?.some(i=>i.sha256===hash))return {status:'already-ingested',records:0};
  const keys=new Set(imported.map(r=>JSON.stringify([r.customer,r.month])));
  if(!replace&&existing.rows.some(r=>keys.has(JSON.stringify([r.customer,r.month]))))throw new Error('Snapshot exists. Review revised report and use --replace only when authorized.');
  const merged=validateRows([...existing.rows.filter(r=>!keys.has(JSON.stringify([r.customer,r.month]))),...imported]);contiguous(merged);
  const archive=path.join(store,'originals');await mkdir(archive,{recursive:true,mode:0o700});
  const archived=path.join(archive,`${hash}.csv`);try{await stat(archived);}catch(error){if(error.code!=='ENOENT')throw error;await copyFile(input,archived);}
  await atomicJSON(path.join(archive,`${hash}.approval-${Date.now()}.json`),evidence);
  const now=new Date().toISOString();
  const next={fictional:false,currency:'USD',asOf:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),rows:merged,imports:[...(existing.imports||[]),{sha256:hash,approvedBy:evidence.approvedBy,approvedAt:evidence.approvedAt,sourceMessageId:evidence.sourceMessageId,receivedAt:evidence.receivedAt,ingestedAt:now,records:imported.length,replacement:replace}]};
  await atomicJSON(path.join(store,'dashboard.json'),next);
  return {status:'ingested',records:imported.length,totalRecords:merged.length};
 }finally{if(handle){await handle.close();await unlink(lock);}}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),value=name=>args.includes(name)?args[args.indexOf(name)+1]:undefined;
 try{const result=await ingest({input:value('--input'),approval:value('--approval'),storage:value('--storage'),replace:args.includes('--replace'),receivedDate:value('--received-date')});console.log(JSON.stringify(result));}catch(error){console.error(error.message);process.exitCode=1;}
}
