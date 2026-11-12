const requiredKinds=['credits','activity','inventory','azure'];

const object=(value,name)=>{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error(`Invalid PoC ${name}.`);
 return value;
};
const text=(value,name)=>{
 if(typeof value!=='string'||!value.trim())throw new Error(`Invalid PoC ${name}.`);
 return value;
};
const count=(value,name,{integer=false}={})=>{
 if(typeof value!=='number'||!Number.isFinite(value)||value<0||(integer&&!Number.isInteger(value)))throw new Error(`Invalid PoC ${name}.`);
 return value;
};
const unavailable=(value,name)=>{
 if(value!==null)throw new Error(`PoC ${name} must be unavailable.`);
 return null;
};
const close=(left,right)=>Math.abs(left-right)<=1e-8;
const validDate=value=>typeof value==='string'&&!Number.isNaN(Date.parse(value));
const validDay=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&new Date(`${value}T00:00:00Z`).toISOString().slice(0,10)===value;

function commonReport(report,kind){
 object(report,`${kind} report`);
 if(report.kind!==kind)throw new Error(`Invalid PoC ${kind} report kind.`);
 text(report.period,`${kind} reporting period`);
 object(report.metrics,`${kind} metrics`);
 object(report.details,`${kind} details`);
 if(!Array.isArray(report.warnings)||report.warnings.some(warning=>typeof warning!=='string'))throw new Error(`Invalid PoC ${kind} warnings.`);
}

/** Validate the committed four-report PoC snapshot and return only aggregate, public-safe chart data. */
export function publicPocDashboard(source){
 object(source,'dataset');
 if(source.version!==1||source.fictional!==false||!validDay(source.asOf)||typeof source.sourceVerifiedAsNativeExports!=='boolean'||typeof source.approvalManifestComplete!=='boolean')throw new Error('Invalid PoC dataset header.');
 if(!Array.isArray(source.reports)||source.reports.length!==4)throw new Error('PoC dataset must contain exactly four reports.');
 const kinds=new Set(source.reports.map(report=>report?.kind));
 if(kinds.size!==4||requiredKinds.some(kind=>!kinds.has(kind)))throw new Error('Incomplete PoC report coverage.');
 const report=kind=>source.reports.find(item=>item.kind===kind);
 for(const kind of requiredKinds)commonReport(report(kind),kind);

 const creditReport=report('credits'),credit=creditReport.metrics;
 const prepaid=count(credit.prepaidCredits,'prepaid credits'),payg=count(credit.payGoCredits,'pay-as-you-go credits');
 const total=count(credit.totalCredits,'total credits'),capacity=count(credit.entitledCredits,'credit capacity');
 if(!close(prepaid+payg,total))throw new Error('PoC credit totals do not reconcile.');
 if(!validDate(credit.lastUpdated))throw new Error('Invalid PoC credit source date.');
 unavailable(credit.mau,'credit MAU');unavailable(credit.pau,'credit PAU');unavailable(credit.copilotCost,'Copilot billed cost');

 const activityReport=report('activity'),activity=activityReport.metrics,groups=activityReport.details.groups;
 if(!Array.isArray(groups))throw new Error('PoC activity groups are required.');
 const activityByScope=new Map();
 for(const row of groups){
  object(row,'activity group');const environment=text(row.environment,'activity environment'),traffic=text(row.Traffic,'activity traffic');
  if(!['Test or evaluation','Observed channel'].includes(traffic))throw new Error('Invalid PoC activity traffic classification.');
  const current=activityByScope.get(environment)||{testRuns:0,observedRuns:0};
  current[traffic==='Test or evaluation'?'testRuns':'observedRuns']+=count(row.Runs,'agent runs',{integer:true});
  activityByScope.set(environment,current);
 }
 const activityRows=[...activityByScope.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([,values],index)=>({label:`Activity scope ${index+1}`,...values}));
 const runs=activityRows.reduce((sum,row)=>sum+row.testRuns+row.observedRuns,0),testRuns=activityRows.reduce((sum,row)=>sum+row.testRuns,0);
 if(count(activity.groups,'activity groups',{integer:true})!==groups.length||count(activity.runs,'activity runs',{integer:true})!==runs||count(activity.testRuns,'test runs',{integer:true})!==testRuns||count(activity.otherRuns,'other runs',{integer:true})!==runs-testRuns||count(activity.environments,'activity environments',{integer:true})!==activityByScope.size)throw new Error('PoC activity summaries do not reconcile.');
 unavailable(activity.mau,'activity MAU');unavailable(activity.pau,'activity PAU');

 const inventoryReport=report('inventory'),inventory=inventoryReport.metrics,records=inventoryReport.details.records;
 if(!Array.isArray(records))throw new Error('PoC inventory records are required.');
 const inventoryByEnvironment=new Map();
 for(const row of records){object(row,'inventory record');const environment=text(row.environmentId,'inventory environment');inventoryByEnvironment.set(environment,(inventoryByEnvironment.get(environment)||0)+1);}
 if(count(inventory.agents,'inventory agents',{integer:true})!==records.length||count(inventory.environments,'inventory environments',{integer:true})!==inventoryByEnvironment.size)throw new Error('PoC inventory summaries do not reconcile.');
 unavailable(inventory.mau,'inventory MAU');unavailable(inventory.pau,'inventory PAU');

 const azureReport=report('azure'),azure=azureReport.metrics,costRows=azureReport.details.aiCostRows;
 const azureCost=azure.azureAiCost===null?null:count(azure.azureAiCost,'Azure AI cost');
 if(!Array.isArray(costRows))throw new Error('PoC Azure cost rows are required.');
 const costTotal=costRows.reduce((sum,row)=>{object(row,'Azure cost row');if(row.currency!=='USD')throw new Error('PoC Azure AI cost must be USD.');return sum+count(row.cost,'Azure cost row');},0);
 if((azureCost===null&&costRows.length)||(azureCost!==null&&!close(azureCost,costTotal))||count(azure.aiBilledRows,'Azure billed rows',{integer:true})!==costRows.length)throw new Error('PoC Azure cost summaries do not reconcile.');
 count(azure.metricResponses,'Azure metric responses',{integer:true});count(azure.metricSamples,'Azure metric samples',{integer:true});count(azure.excludedCostRows,'excluded Azure cost rows',{integer:true});
 unavailable(azure.mau,'Azure MAU');unavailable(azure.pau,'Azure PAU');

 return {version:1,fictional:false,publicPoc:true,asOf:source.asOf,scope:'Public PoC aggregate',currency:'USD',sourceAssurance:{nativeExportsVerified:source.sourceVerifiedAsNativeExports,approvalManifestComplete:source.approvalManifestComplete},
  credits:{prepaid,payg,total,capacity,remaining:Math.max(0,capacity-prepaid),sourceUpdatedAt:credit.lastUpdated,period:creditReport.period},
  costs:{azure:azureCost,copilot:null,total:null,azurePeriod:azureReport.period},
  adoption:{mau:null,pau:null},value:{hoursSaved:null,benefit:null,net:null,roi:null},
  unsupported:{mau:true,pau:true,tokenCounts:true,agentCreditAllocation:true},
  activity:{runs,testRuns,observedRuns:runs-testRuns,environments:activityByScope.size,period:activityReport.period,byEnvironment:activityRows},
  inventory:{agents:records.length,environments:inventoryByEnvironment.size,period:inventoryReport.period,byEnvironment:[...inventoryByEnvironment.values()].sort((a,b)=>b-a).map((agents,index)=>({label:`Inventory scope ${index+1}`,agents}))},
  reports:source.reports.map(({kind,period,warnings})=>({kind,period,warnings:[...warnings]})),
  forecastAvailable:false,forecastReason:'The public PoC contains one month-to-date credit snapshot and no complete monthly billed-cost history.'};
}
