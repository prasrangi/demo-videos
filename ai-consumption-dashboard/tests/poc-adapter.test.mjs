import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {publicPocDashboard} from '../poc-adapter.mjs';
import {renderActualSection,actualExportRows} from '../actual-view.mjs';

const load=async()=>JSON.parse(await readFile(new URL('../data/POC-reports.json',import.meta.url),'utf8'));
const helpers={kpi:(label,value,note)=>`<article>${label}: ${value}<p>${note}</p></article>`,cardHead:(title,subtitle,extra='')=>`<h2>${title}</h2><p>${subtitle}</p>${extra}`,metric:(name,value)=>`<p>${name}: ${value}</p>`,icon:()=>''};

test('public PoC adapter maps the four categories without inventing unsupported measures',async()=>{
 const data=publicPocDashboard(await load());
 assert.equal(data.publicPoc,true);assert.equal(data.sourceAssurance.nativeExportsVerified,false);assert.equal(data.sourceAssurance.approvalManifestComplete,false);assert.equal(data.credits.total,344.79);assert.equal(data.activity.runs,329);assert.equal(data.activity.testRuns,321);assert.equal(data.activity.observedRuns,8);assert.equal(data.inventory.agents,90);assert.equal(data.inventory.environments,9);assert.equal(data.costs.azure,4.824119178);assert.equal(data.costs.copilot,null);assert.equal(data.costs.total,null);assert.equal(data.adoption.mau,null);assert.equal(data.adoption.pau,null);assert.equal(data.forecastAvailable,false);
});

test('public PoC dashboard model removes tenant and detailed source identifiers',async()=>{
 const source=await load(),data=publicPocDashboard(source),rendered=JSON.stringify(data);
 const sensitive=[source.reports.find(r=>r.kind==='azure').details.aiCostRows[0].resourceId,source.reports.find(r=>r.kind==='activity').details.groups[0].AgentId,source.reports.find(r=>r.kind==='activity').details.groups[0].AgentName,source.reports.find(r=>r.kind==='inventory').details.records[0].environmentId,source.reports.find(r=>r.kind==='inventory').details.records[0].name];
 for(const value of sensitive)assert.doesNotMatch(rendered,new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
 assert.ok(data.activity.byEnvironment.every(row=>/^Activity scope \d+$/.test(row.label)));assert.ok(data.inventory.byEnvironment.every(row=>/^Inventory scope \d+$/.test(row.label)));
});

test('public PoC view labels periods, test traffic, available cost and unavailable measures',async()=>{
 const data=publicPocDashboard(await load()),view=renderActualSection('usage',data,helpers),methodology=renderActualSection('methodology',data,helpers);
 assert.match(view,/CEL · validated public aggregate/);assert.match(view,/Preview-only source/);assert.match(view,/rolling 30 days/i);assert.match(view,/Test \/ evaluation/);assert.match(view,/\$4\.82/);assert.match(view,/Daily metrics; cost query period unspecified in file/);assert.match(view,/Monthly active users \(MAU\).*Unavailable/s);assert.match(view,/Token counts.*Unavailable/s);assert.match(view,/Agent-level credit allocation.*Unavailable/s);assert.doesNotMatch(methodology,/subscriptions\//i);assert.doesNotMatch(methodology,/AgentId|environmentId/);
 const rows=actualExportRows(data);assert.equal(rows.find(row=>row.metric==='MAU').value,'Unavailable');assert.equal(rows.find(row=>row.metric==='token counts').value,'Unavailable');assert.equal(rows.find(row=>row.report==='billed cost'&&row.metric==='azure').period,data.costs.azurePeriod);
});

test('data source selector exposes Sample Data and CEL only',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 assert.match(html,/<option value="sample">Sample Data<\/option><option value="poc">CEL<\/option>/);
 assert.doesNotMatch(html,/<option value="actual"/);
});

test('public PoC schema validation fails closed on inconsistent or incomplete input',async()=>{
 const source=await load();source.reports.find(r=>r.kind==='credits').metrics.totalCredits=999;assert.throws(()=>publicPocDashboard(source),/reconcile/);
 const duplicate=await load();duplicate.reports[3].kind='activity';assert.throws(()=>publicPocDashboard(duplicate),/coverage/);
 const leakedUnsupported=await load();leakedUnsupported.reports.find(r=>r.kind==='activity').metrics.mau=1;assert.throws(()=>publicPocDashboard(leakedUnsupported),/must be unavailable/);
});
