// This adapter runs only on the private local server. It contains no customer data.
const count=(value,name)=>{if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new Error(`Invalid private ${name}.`);return value;};
const optional=(value,name)=>value===null?null:count(value,name);
export function actualDashboard(source){
 if(source.fictional!==false||source.version!==1||!/^\d{4}-\d{2}-\d{2}$/.test(source.asOf)||!Array.isArray(source.reports)||source.reports.length!==4)throw new Error('Invalid approved source dataset.');
 const kinds=new Set(source.reports.map(r=>r.kind));if(kinds.size!==4||!['credits','azure','activity','inventory'].every(k=>kinds.has(k)))throw new Error('Incomplete source coverage.');
 const report=kind=>source.reports.find(r=>r.kind===kind),credit=report('credits').metrics,activity=report('activity'),inventory=report('inventory');
 const groups=activity.details?.groups,records=inventory.details?.records;
 if(!Array.isArray(groups)||!Array.isArray(records))throw new Error('Detailed activity and inventory records are required.');
 const byEnvironment=new Map();
 for(const row of groups){
  if(typeof row.environment!=='string'||!row.environment||typeof row.Traffic!=='string')throw new Error('Invalid activity group.');
  const group=byEnvironment.get(row.environment)||{label:row.environment,testRuns:0,observedRuns:0};
  group[row.Traffic==='Test or evaluation'?'testRuns':'observedRuns']+=count(row.Runs,'agent runs');byEnvironment.set(row.environment,group);
 }
 const environmentCounts=new Map();for(const row of records){if(typeof row.environmentId!=='string'||!row.environmentId)throw new Error('Missing inventory environment.');environmentCounts.set(row.environmentId,(environmentCounts.get(row.environmentId)||0)+1);}
 const prepaid=count(credit.prepaidCredits,'prepaid credits'),payg=count(credit.payGoCredits,'pay-as-you-go credits'),capacity=count(credit.entitledCredits,'credit capacity');
 if(Math.abs(prepaid+payg-count(credit.totalCredits,'total credits'))>1e-8)throw new Error('Credit totals do not reconcile.');
 if(!Number.isFinite(Date.parse(credit.lastUpdated)))throw new Error('Invalid credit source date.');
 const activityRows=[...byEnvironment.values()],runs=activityRows.reduce((s,r)=>s+r.testRuns+r.observedRuns,0),testRuns=activityRows.reduce((s,r)=>s+r.testRuns,0);
 if(runs!==activity.metrics.runs||testRuns!==activity.metrics.testRuns||runs-testRuns!==activity.metrics.otherRuns||byEnvironment.size!==activity.metrics.environments)throw new Error('Activity summaries do not reconcile.');
 if(records.length!==inventory.metrics.agents||environmentCounts.size!==inventory.metrics.environments)throw new Error('Inventory summaries do not reconcile.');
 const azure=optional(report('azure').metrics.azureAiCost,'Azure AI billed cost'),copilot=optional(credit.copilotCost,'Copilot Studio billed cost');
 return {version:1,fictional:false,asOf:source.asOf,scope:'Connected tenant',currency:'USD',
  credits:{prepaid,payg,total:prepaid+payg,capacity,remaining:Math.max(0,capacity-prepaid),sourceUpdatedAt:credit.lastUpdated},
  costs:{azure,copilot,total:azure===null||copilot===null?null:azure+copilot},
  adoption:{mau:null,pau:null},value:{hoursSaved:null,benefit:null,net:null,roi:null},
  activity:{runs,testRuns,observedRuns:runs-testRuns,environments:byEnvironment.size,period:activity.period,byEnvironment:activityRows},
  inventory:{agents:records.length,environments:environmentCounts.size,byEnvironment:[...environmentCounts.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([,agents],i)=>({label:`Env ${i+1}`,agents}))},
  reports:source.reports.map(({kind,file,receivedAt,period,warnings})=>({kind,file,receivedAt,period,warnings})),
  forecastAvailable:false,forecastReason:'The approved reports contain a single month-to-date credit snapshot and no complete monthly billed-cost history.'};
}
