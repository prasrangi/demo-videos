import test from 'node:test';
import assert from 'node:assert/strict';
import {actualDashboard} from '../tools/actual-dashboard.mjs';
import {renderActualSection,actualExportRows} from '../actual-view.mjs';
import {stackedBars,donutChart} from '../charts.mjs';

function fixture(){
 const base={file:'fictional-test-source',receivedAt:'2026-01-10T00:00:00Z',period:'Fictional test snapshot',warnings:['Fictional test warning']};
 return {version:1,fictional:false,asOf:'2026-01-10',reports:[
  {...base,kind:'credits',metrics:{prepaidCredits:50.25,payGoCredits:4.5,totalCredits:54.75,entitledCredits:1000,lastUpdated:'2026-01-09T00:00:00Z',copilotCost:null}},
  {...base,kind:'azure',metrics:{azureAiCost:null}},
  {...base,kind:'activity',period:'rolling 30 days',metrics:{runs:8,testRuns:3,otherRuns:5,environments:2},details:{groups:[{environment:'TEST',Runs:3,Traffic:'Test or evaluation',AgentName:'Private fixture agent'},{environment:'OBSERVED',Runs:5,Traffic:'Observed channel'}]}},
  {...base,kind:'inventory',metrics:{agents:3,environments:2},details:{records:[{environmentId:'private-fixture-env-a'},{environmentId:'private-fixture-env-a'},{environmentId:'private-fixture-env-b'}]}}
 ]};
}
const helpers={kpi:(name,value,note)=>`<article>${name}: ${value}<p>${note}</p></article>`,cardHead:(title,subtitle)=>`<h2>${title}</h2><p>${subtitle}</p>`,metric:(name,value)=>`<p>${name}: ${value}</p>`,icon:()=>''};
test('actual dataset keeps fractional credits and missing measurements distinct from zero',()=>{
 const data=actualDashboard(fixture());assert.equal(data.credits.total,54.75);assert.equal(data.credits.remaining,949.75);assert.equal(data.costs.total,null);assert.equal(data.adoption.mau,null);assert.equal(data.value.roi,null);assert.equal(data.forecastAvailable,false);
});
test('actual charts reconcile activity and inventory without exposing raw details',()=>{
 const data=actualDashboard(fixture());assert.equal(data.activity.byEnvironment.reduce((s,r)=>s+r.testRuns+r.observedRuns,0),8);assert.equal(data.inventory.byEnvironment.reduce((s,r)=>s+r.agents,0),3);assert.equal(data.inventory.byEnvironment.length,2);assert.doesNotMatch(JSON.stringify(data),/Private fixture agent|private-fixture-env/);
});
test('invalid summaries and duplicate report coverage fail closed',()=>{
 const bad=fixture();bad.reports[2].metrics.runs=500;assert.throws(()=>actualDashboard(bad),/reconcile/);const badCredits=fixture();badCredits.reports[0].metrics.totalCredits=90;assert.throws(()=>actualDashboard(badCredits),/reconcile/);const duplicate=fixture();duplicate.reports[3].kind='activity';assert.throws(()=>actualDashboard(duplicate),/coverage/);
});
test('a known zero cost is preserved while the unknown component stays unavailable',()=>{
 const source=fixture();source.reports[1].metrics.azureAiCost=0;const data=actualDashboard(source);assert.equal(data.costs.azure,0);assert.equal(data.costs.copilot,null);assert.equal(data.costs.total,null);
});
test('actual views reuse bar and donut charts and avoid sample assumptions',()=>{
 const data=actualDashboard(fixture());const overview=renderActualSection('overview',data,helpers);assert.match(overview,/54\.75/);assert.match(overview,/Actual month-to-date Copilot Credits/);assert.match(overview,/Actual prepaid credit capacity/);for(const section of ['overview','usage','forecast','value','methodology']){const view=renderActualSection(section,data,helpers);assert.doesNotMatch(view,/Northstar|Meridian|\$45|70%|NaN|undefined/);assert.match(view,/Unavailable|unavailable/);}
});
test('actual exports include source scope and explicit missing values',()=>{
 const rows=actualExportRows(actualDashboard(fixture()));assert.equal(rows.find(r=>r.report==='credits'&&r.metric==='total').value,54.75);assert.equal(rows.find(r=>r.metric==='MAU').value,'Unavailable');assert.equal(rows.find(r=>r.metric==='prepaid').sourceUpdatedAt,'2026-01-09T00:00:00Z');assert.ok(rows.some(r=>r.period==='rolling 30 days'));
});
test('shared chart renderer distinguishes all-missing data from measured zero',()=>{
 assert.match(stackedBars([{label:'Test',x:null}],{keys:['x']}),/Unavailable/);assert.doesNotMatch(stackedBars([{label:'Test',x:0}],{keys:['x']}),/Unavailable|NaN/);assert.match(donutChart([{label:'Test',value:null}]),/Unavailable/);assert.doesNotMatch(stackedBars([{label:'<script>',x:1}],{keys:['x']}),/<script>/);
});
