// Native report adapters. Source values and identifiers belong only in private storage.
const nonnegative=(value,label)=>{if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new Error(`Invalid ${label}.`);return value;};
const integer=(value,label)=>{nonnegative(value,label);if(!Number.isInteger(value))throw new Error(`Invalid ${label} count.`);return value;};
const timestamp=(value,label)=>{if(typeof value!=='string'||!Number.isFinite(Date.parse(value)))throw new Error(`Invalid ${label} timestamp.`);return value;};
export function creditsReport(data){
 if(data.entitlementId!=='MCSMessages')throw new Error('Unrecognized credit entitlement.');
 const {capacity,payGo}=data.entitlement||{};
 if(capacity?.consumed?.consumptionType!=='MonthToDate'||payGo?.consumed?.consumptionType!=='MonthToDate')throw new Error('Expected month-to-date credit snapshots.');
 const prepaid=nonnegative(capacity.consumed.value,'prepaid credits'),payg=nonnegative(payGo.consumed.value,'pay-as-you-go credits');
 return {period:'Month to date',metrics:{prepaidCredits:prepaid,payGoCredits:payg,totalCredits:prepaid+payg,entitledCredits:nonnegative(capacity.entitled?.value,'credit entitlement'),lastUpdated:timestamp(capacity.consumed.lastUpdatedOn,'credit source'),mau:null,pau:null,copilotCost:null},warnings:['Tenant-level snapshot; no agent-level credit allocation.','Credits may be fractional. No currency conversion or actual billed cost is inferred.','MAU and PAU are not provided.'],details:{entitlementId:data.entitlementId}};
}
export function azureReport(data){
 if(!Array.isArray(data)||!data.length)throw new Error('Expected an array of Azure source responses.');
 const metrics=data.filter(item=>Array.isArray(item.value)),queries=data.filter(item=>item.properties?.columns&&item.properties?.rows);
 if(!metrics.length||!queries.length)throw new Error('Azure report needs metric and actual-cost source responses.');
 let metricSamples=0,aiRows=[],excludedRows=0;const warnings=[];
 for(const response of metrics){
  if(typeof response.timespan!=='string'||!response.timespan.includes('/'))throw new Error('Missing Azure metric window.');
  for(const metric of response.value){if(metric.errorCode&&metric.errorCode!=='Success')warnings.push('A metric source returned an error.');if(!Array.isArray(metric.timeseries))throw new Error('Invalid Azure metric series.');for(const series of metric.timeseries)metricSamples+=(series.data||[]).length;}
 }
 for(const response of queries){
  const q=response.properties;if(q.nextLink)throw new Error('Cost source is paginated; import is incomplete.');
  const ci=q.columns.findIndex(c=>c.name==='PreTaxCost'),ri=q.columns.findIndex(c=>c.name==='ResourceId'),ui=q.columns.findIndex(c=>c.name==='Currency');
  if([ci,ri,ui].some(i=>i<0))throw new Error('Cost report is missing required columns.');
  for(const row of q.rows){if(!Array.isArray(row)||row.length!==q.columns.length)throw new Error('Malformed Azure cost row.');nonnegative(row[ci],'actual cost');if(typeof row[ri]!=='string'||typeof row[ui]!=='string')throw new Error('Invalid cost scope or currency.');if(/\/providers\/microsoft\.cognitiveservices\/accounts\/[^/]+$/i.test(row[ri])){if(row[ui]!=='USD')throw new Error('AI costs must be USD.');aiRows.push({resourceId:row[ri],cost:row[ci],currency:row[ui]});}else excludedRows++;}
 }
 if(!metricSamples)warnings.push('Empty metric series means unavailable usage, not zero tokens.');
 if(!aiRows.length)warnings.push('No AI-account billed-cost rows were returned. Azure AI cost remains unavailable.');
 warnings.push('Azure Monitor response cost is a query-processing measure; it is never treated as a currency amount.','Unrelated subscription charges are excluded from Azure AI cost.');
 return {period:'Daily metrics; month-to-date actual costs',metrics:{metricResponses:metrics.length,metricSamples,aiBilledRows:aiRows.length,azureAiCost:aiRows.length?aiRows.reduce((sum,r)=>sum+r.cost,0):null,excludedCostRows:excludedRows,mau:null,pau:null},warnings,details:{metricWindows:metrics.map(r=>r.timespan),aiCostRows:aiRows}};
}
export function activityReport(data){
 if(!data.environments||typeof data.environments!=='object'||typeof data.window!=='string')throw new Error('Invalid agent activity report.');
 const detail=[];
 for(const [environment,response] of Object.entries(data.environments)){
  if(!Array.isArray(response.value))throw new Error('Invalid activity environment response.');
  for(const row of response.value){for(const key of ['Runs','Conversations','ActiveUserIds','MissingUserIds'])integer(row[key],key);if(typeof row.Traffic!=='string'||typeof row.Channel!=='string')throw new Error('Activity row lacks traffic classification.');timestamp(row.LastSeen,'last activity');detail.push({environment,...row});}
 }
 const test=detail.filter(r=>r.Traffic==='Test or evaluation');
 return {period:data.window,metrics:{environments:Object.keys(data.environments).length,groups:detail.length,runs:detail.reduce((s,r)=>s+r.Runs,0),testRuns:test.reduce((s,r)=>s+r.Runs,0),otherRuns:detail.filter(r=>r.Traffic!=='Test or evaluation').reduce((s,r)=>s+r.Runs,0),mau:null,pau:null},warnings:['Observed activity is not native MAU or PAU.','Distinct user counts and conversations are not summed across overlapping agent/channel groups.','Test or evaluation traffic is separated from other observed channels; an observed channel is not proof of production usage.','No billed Copilot Credits are inferred from activity.'],details:{source:data.source,groups:detail}};
}
export function inventoryReport(text){
 const matrix=[];let row=[],field='',quote=false,closed=false;
 const push=()=>{row.push(field);field='';closed=false;};
 for(let i=0;i<text.length;i++){const c=text[i];if(quote){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quote=false;closed=true;}}else field+=c;continue;}if(c==='"'){if(field||closed)throw new Error('Malformed inventory CSV quote.');quote=true;}else if(c===',')push();else if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;push();if(row.some(v=>v.trim()))matrix.push(row);row=[];}else{if(closed)throw new Error('Unexpected inventory CSV text.');field+=c;}}
 if(quote)throw new Error('Unterminated inventory CSV quote.');if(field||row.length||closed){push();if(row.some(v=>v.trim()))matrix.push(row);}
 const headers=matrix.shift()?.map((h,i)=>(i===0?h.replace(/^\ufeff/,''):h).trim());
 if(!headers||!['name','properties_displayName','properties_model','environmentId'].every(k=>headers.includes(k))||new Set(headers).size!==headers.length)throw new Error('Inventory CSV columns do not match the expected source.');
 const records=matrix.map(values=>{if(values.length!==headers.length)throw new Error('Inventory CSV column count mismatch.');return Object.fromEntries(headers.map((h,i)=>[h,values[i]]));});
 const keys=new Set();for(const record of records){if(!record.name||!record.environmentId)throw new Error('Inventory row lacks agent or environment identity.');const key=JSON.stringify([record.environmentId,record.name]);if(keys.has(key))throw new Error('Duplicate inventory agent/environment.');keys.add(key);}
 return {period:'Point-in-time inventory',metrics:{agents:records.length,environments:new Set(records.map(r=>r.environmentId)).size,mau:null,pau:null},warnings:['Inventory describes configured agents; it does not measure consumption or adoption.'],details:{records}};
}
export function normalizeSource(kind,text){if(kind==='inventory')return inventoryReport(text);const data=JSON.parse(text);if(kind==='credits')return creditsReport(data);if(kind==='azure')return azureReport(data);if(kind==='activity')return activityReport(data);throw new Error('Unsupported report kind.');}
