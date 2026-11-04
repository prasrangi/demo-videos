import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parseCSV,contiguous,ingest,headers} from '../tools/ingest.mjs';
import {sampleData} from '../sample-data.mjs';

const csv=rows=>[headers.join(','),...rows.map(r=>headers.map(key=>r[key]).join(','))].join('\r\n');
test('CSV handles quoted customer names and rejects empty measures or broken quoting',()=>{
 const valid=csv([sampleData.rows[0]]).replace('Northstar Retail','"Example, Fictional"');assert.equal(parseCSV(valid)[0].customer,'Example, Fictional');assert.throws(()=>parseCSV(valid.replace(',147680,',',,')));assert.throws(()=>parseCSV('"unclosed'),/Unterminated/);
});
test('history gaps and changing customer population fail closed',()=>{
 const a=sampleData.rows[0];assert.throws(()=>contiguous([a,{...a,month:'2026-07'}]),/Missing/);assert.throws(()=>contiguous([a,{...a,month:'2026-06'},{...a,customer:'Example',month:'2026-06'}]),/same customer/);
});
test('approved private ingestion verifies hash, deduplicates and requires replacement authorization',async()=>{
 const temporary=await mkdtemp(path.join(tmpdir(),'ai-dashboard-test-'));
 try{
  const input=path.join(temporary,'fixture.csv'),approval=path.join(temporary,'fixture.approval.json'),storage=path.join(temporary,'store'),text=csv(sampleData.rows),hash=createHash('sha256').update(text).digest('hex');
  const evidence={approved:true,approvedBy:'Fictional test reviewer',approvedAt:'2026-11-04T06:00:00Z',approvalEvidence:'Fictional integration test only',sourceMessageId:'fictional-test-message',receivedAt:'2026-11-03T20:00:00Z',sha256:hash,currency:'USD',pauDefinition:'paid_active_users'};
  await writeFile(input,text);await writeFile(approval,JSON.stringify({...evidence,sha256:'0'.repeat(64)}));
  await assert.rejects(ingest({input,approval,storage}),/SHA-256/);
  await writeFile(approval,JSON.stringify(evidence));
  assert.equal((await ingest({input,approval,storage,receivedDate:'2026-11-04'})).records,24);
  assert.equal((await ingest({input,approval,storage})).status,'already-ingested');
  const saved=JSON.parse(await readFile(path.join(storage,'dashboard.json'),'utf8'));assert.equal(saved.fictional,false);assert.equal(saved.rows.length,24);
  const updated=text+'\r\n';await writeFile(input,updated);await writeFile(approval,JSON.stringify({...evidence,sha256:createHash('sha256').update(updated).digest('hex')}));
  await assert.rejects(ingest({input,approval,storage}),/Snapshot exists/);
 }finally{
  const base=path.resolve(tmpdir());const relative=path.relative(base,path.resolve(temporary));
  if(relative.startsWith('ai-dashboard-test-')&&!relative.includes(path.sep))await rm(temporary,{recursive:true,force:true});
 }
});
