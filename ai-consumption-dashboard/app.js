import {sampleData} from './sample-data.mjs';
import {validateRows,total,spend,previousMonth,change,baselineGrowth,forecast,csvEscape} from './model.mjs';
import {stackedBars,donutChart} from './charts.mjs';
import {renderActualSection,actualExportRows,updateActualValueScenario} from './actual-view.mjs';
import {defaultRoiAssumptions,aggregateCustomerRoi,roiExportRows} from './customer-roi.mjs';
import {renderCustomerRoiPage,renderCustomerRoiResults,selectedRoiResults,readRoiControls} from './roi-view.mjs';
import {publicPocDashboard} from './poc-adapter.mjs';

const $ = selector => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const num = value => new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(value);
const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
const shortMoney = value => value >= 1000 ? `$${(value/1000).toFixed(1)}k` : money(value);
const compact = value => value >= 1000000 ? `${(value/1000000).toFixed(2)}M` : value >= 1000 ? `${(value/1000).toFixed(1)}k` : num(value);
const monthName = (month, short = false) => new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-US',{month:short?'short':'long',...(!short && {year:'numeric'}),timeZone:'UTC'});
const paths={overview:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',usage:'M4 20V12 M10 20V4 M16 20V8 M22 20H2',forecast:'M3 17l6-6 4 3 8-10 M15 4h6v6',value:'M12 3l8 5v8l-8 5-8-5V8z M8 12l3 3 5-6',methodology:'M5 3h10l4 4v14H5z M14 3v5h5 M8 12h8 M8 16h6',download:'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',credits:'M12 3l8 5v8l-8 5-8-5V8z M4 8l8 5 8-5 M12 13v8',users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 4a4 4 0 0 1 0 7 M22 21v-2a4 4 0 0 0-3-4',cost:'M12 2v20 M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6',spark:'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',info:'M12 16v-4 M12 8h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0'};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.overview}"/></svg>`;
const sections={overview:['Overview','Consumption overview','Understand adoption, manage spend, and see what AI delivers.'],usage:['Usage & cost','Usage & cost','Follow credit consumption, user adoption, and Azure AI spend.'],forecast:['Forecasting','Plan the next quarter','Explore a transparent spend forecast and test your assumptions.'],value:['Business value','Customer ROI & business value','Connect successful outcomes, saved time and full costs to customer returns.'],methodology:['Data & methodology','Know the numbers','Definitions, assumptions, and the boundary between demo and private data.']};
let dataset=sampleData,rows=[],customer='all',month='2026-10',section='overview',growth=0;
let dataMode='sample',actualData=null,privateAvailable=false;
let roiAssumptions={...defaultRoiAssumptions};
const privateRequested = new URLSearchParams(location.search).get('private') === '1';
const pocRequested = new URLSearchParams(location.search).get('source') === 'poc';
const actualView = () => dataMode==='actual'||dataMode==='poc';
const selectedRows = (m=month) => rows.filter(row=> row.month===m && (customer==='all'||row.customer===customer));
const series = () => [...new Set(rows.map(r=>r.month))].sort().filter(m=>m<=month).slice(-6).map(m=>({...total(selectedRows(m)),month:m}));
const comparison = () => total(selectedRows(previousMonth(month)));
const delta = (current,previous,cost=false) => {const pct=change(current,previous);return pct===null?'<span>No prior-month baseline</span>':`<span class="delta ${cost?'cost':''}">${pct>=0?'↗':'↘'} ${Math.abs(pct).toFixed(1)}%</span><span>vs. previous month</span>`;};
const kpi = (label,value,meta,symbol,unit='') => `<article class="kpi"><div class="kpi-label">${label}${icon(symbol)}</div><div class="kpi-value">${value}${unit?`<small>${unit}</small>`:''}</div><div class="kpi-meta">${meta}</div></article>`;
const cardHead = (title,sub,extra='') => `<div class="panel-head"><div><h2>${title}</h2><p class="panel-sub">${sub}</p></div>${extra}</div>`;
const chartLegend = () => '<div class="legend"><span><i class="dot"></i>Copilot Studio</span><span><i class="dot blue"></i>Azure AI</span></div>';
function bars(data) {
  return stackedBars(data.map(row=>({...row,label:monthName(row.month,true)})),{keys:['copilotCost','azureCost'],format:money,axis:shortMoney,description:'Monthly AI spend, split between Copilot Studio and Azure AI'});
}
function donut(t) {
  return donutChart([{label:'Copilot Studio',value:t.copilotCost},{label:'Azure AI',value:t.azureCost}],{description:'Monthly AI spend mix',centerLabel:'Total AI spend',centerValue:shortMoney(t.spend),format:money});
}
function table() {
 const sorted=selectedRows().sort((a,b)=>spend(b)-spend(a));
 return `<section class="panel">${cardHead('Customer portfolio',`${sorted.length} fictional customer${sorted.length===1?'':'s'} · ${monthName(month)}`,'<span class="chip">Monthly snapshot</span>')}<div class="table-wrap"><table><caption class="visually-hidden">Consumption by customer for ${monthName(month)}</caption><thead><tr><th scope="col">Customer</th>${['Copilot Credits','MAU / PAU','AI spend','Credit capacity','Budget'].map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${sorted.map((r,i)=>{const utilization=r.creditCapacity?r.credits/r.creditCapacity*100:null;return `<tr><td><button class="customer-name customer-button" type="button" data-customer="${escape(r.customer)}"><span class="avatar ${['','blue','green','orange'][i%4]}">${escape(r.customer.split(' ').map(w=>w[0]).join(''))}</span><span>${escape(r.customer)}<small>Fictional sample customer</small></span></button></td><td>${num(r.credits)}</td><td>${num(r.mau)} <span class="muted">/ ${num(r.pau)}</span></td><td>${money(spend(r))}</td><td><span class="utilization">${utilization===null?'Unspecified':`${utilization.toFixed(0)}% used`}<span class="progress"><span data-width="${Math.min(utilization||0,100)}"></span></span></span></td><td><span class="status-pill ${spend(r)>r.budget*.9?'amber':''}">${r.budget<=0?'Unspecified':spend(r)>r.budget?'Over budget':spend(r)>r.budget*.9?'Near budget':'On track'}</span></td></tr>`;}).join('')}</tbody></table></div><div class="table-bottom"><span>Illustrative data · customer names are fictional</span><a class="text-link" href="#usage">Explore usage & cost →</a></div></section>`;
}
function overview() {
 const t=total(selectedRows()),p=comparison(),roi=aggregateCustomerRoi(selectedRoiResults(selectedRows(),roiAssumptions));
 return `<div class="kpi-grid">${kpi('Total AI spend',money(t.spend),delta(t.spend,p.spend,true),'cost')}${kpi('Copilot Studio Credits',compact(t.credits),delta(t.credits,p.credits),'credits')}${kpi('Monthly active users',num(t.mau),delta(t.mau,p.mau),'users')}${kpi('Paid active users',num(t.pau),delta(t.pau,p.pau),'users')}</div><div class="two-col"><section class="panel">${cardHead('AI spend over time','Monthly consumption across your selected portfolio','<span class="chip">Last 6 available months</span>')}<div class="panel-body"><div class="chart-key">${chartLegend()}<span class="chip">USD</span></div>${bars(series())}</div></section><section class="panel">${cardHead('Where the spend goes','Consumption by service')}<div class="panel-body">${donut(t)}</div><div class="panel-foot">${icon('info')}Copilot Credits and Azure AI costs tracked separately.</div></section></div><div class="insight-strip"><div class="insight-symbol">${icon('spark')}</div><div><strong>${money(roi.yearNet)} modeled year-one net economic value</strong><p>${num(roi.hours)} potential hours per month · ${roi.economicRoi===null?'Unavailable':roi.economicRoi.toFixed(1)+'%'} modeled economic ROI · licenses, operations and setup included.</p></div><a href="#value">Explore customer ROI →</a></div>${table()}`;
}
function usage() {
 const t=total(selectedRows()),p=comparison(),capacity=t.creditCapacity?`${(t.credits/t.creditCapacity*100).toFixed(1)}%`:'—';
 return `<div class="kpi-grid">${kpi('Copilot Studio cost',money(t.copilotCost),delta(t.copilotCost,p.copilotCost,true),'credits')}${kpi('Azure AI cost',money(t.azureCost),delta(t.azureCost,p.azureCost,true),'cost')}${kpi('Credit capacity used',capacity,`${num(t.credits)} of ${num(t.creditCapacity)} credits`,'credits')}${kpi('Paid share of MAU',t.mau?`${(t.pau/t.mau*100).toFixed(1)}%`:'—','PAU ÷ MAU · sample definition','users')}</div><div class="two-col"><section class="panel">${cardHead('Adoption over time','Distinct users per customer per month')}<div class="panel-body">${adoptionChart()}<p class="chart-note">MAU is a monthly snapshot; users are never added across months.</p></div></section><section class="panel">${cardHead('Unit economics','Consumption and spend efficiency')}<div class="panel-body metrics-list">${metric('AI spend per MAU',t.mau?money(t.spend/t.mau):'—')}${metric('Copilot Credits per MAU',t.mau?num(t.credits/t.mau):'—')}${metric('AI spend per completed task',t.tasks?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(t.spend/t.tasks):'—')}<hr class="divider">${metric('Monthly budget',money(t.budget))}${metric('Budget remaining',money(t.budget-t.spend))}${metric('Completed tasks',num(t.tasks))}</div><div class="panel-foot">${icon('info')}Costs are fictional billed amounts, not list prices.</div></section></div>${table()}`;
}
const metric=(label,value)=>`<div class="metric-row"><span>${label}</span><strong>${value}</strong></div>`;
function adoptionChart() {
 return '<div class="legend"><span><i class="dot"></i>MAU</span><span><i class="dot blue"></i>PAU</span></div>'+stackedBars(series().map(row=>({...row,label:monthName(row.month,true)})),{keys:['mau','pau'],format:num,axis:compact,description:'Monthly MAU and PAU',grouped:true});
}
function forecastPage() {
 return `<div class="notice">Directional planning estimate. The model compounds the latest monthly spend; the lower and higher scenarios are ±25% of that estimate. They are not confidence intervals.</div><div id="forecast-cards" class="scenario-grid"></div><div class="two-col"><section class="panel">${cardHead('Spend outlook','Historical spend and a three-month projection','<span class="chip">USD</span>')}<div class="panel-body"><div class="legend"><span><i class="dot"></i>Actual</span><span><i class="dot blue"></i>Projected</span></div><div id="forecast-chart"></div></div></section><section class="panel">${cardHead('Planning assumptions','Adjust the scenario to explore the impact')}<div class="panel-body"><div class="control-group"><label for="growth">Monthly spend growth <output id="growth-output" for="growth"></output></label><input id="growth" type="range" min="-20" max="30" step="1" value="${Math.round(growth*100)}"></div><div id="forecast-metrics" class="metrics-list"></div><p class="chart-note">Default growth is the average of the last two available monthly growth rates (capped at ±20%). Your scenario can range from −20% to +30%. Budget is held constant each month.</p></div></section></div>`;
}
function updateForecast() {
 const t=total(selectedRows()),future=forecast({month,spend:t.spend},growth),sum=future.reduce((a,b)=>a+b.spend,0),budget=t.budget*3;
 $('#growth-output').textContent=`${growth>=0?'+':''}${Math.round(growth*100)}%`;
 $('#forecast-cards').innerHTML=[['Lower spend',.75,false],['Base scenario',1,true],['Higher spend',1.25,false]].map(([title,factor,active])=>`<article class="scenario-card ${active?'active':''}"><h3>${title}</h3><strong>${money(sum*factor)}</strong><p>Next 3 months ${factor===1?'· selected growth':`· ${factor<1?'−': '+'}25% vs. base`}</p></article>`).join('');
 $('#forecast-metrics').innerHTML=metric('Three-month budget',money(budget))+metric('Projected spend',money(sum))+metric('Projected headroom',money(budget-sum))+metric('Budget outlook',budget<=0?'No budget provided':sum<=budget?'Within budget':'Above budget');
 const history=series().slice(-3),data=[...history,...future],max=Math.max(1,...data.map(r=>r.spend))*1.2,left=49,plot=185,step=535/Math.max(1,data.length-1),point=(r,i)=>`${left+i*step},${15+plot-r.spend/max*plot}`;
 let svg='<svg class="chart" viewBox="0 0 620 244" role="img" aria-label="Actual and forecast monthly spend"><title>Three-month spend forecast</title>';
 for(let i=0;i<=4;i++){let y=15+plot*(1-i/4);svg+=`<line class="chart-grid" x1="49" x2="596" y1="${y}" y2="${y}"/><text x="39" y="${y+3}" text-anchor="end">${shortMoney(max*i/4)}</text>`;}
 svg+=`<polyline points="${history.map(point).join(' ')}" fill="none" stroke="#8967dd" stroke-width="2.5"/><polyline points="${data.slice(history.length-1).map((r,i)=>point(r,i+history.length-1)).join(' ')}" fill="none" stroke="#9bace4" stroke-width="2.5" stroke-dasharray="6 5"/>`;
 data.forEach((r,i)=>{const [x,y]=point(r,i).split(',');svg+=`<g><title>${monthName(r.month)}: ${money(r.spend)} ${i<history.length?'actual':'projected'}</title><circle cx="${x}" cy="${y}" r="4" fill="${i<history.length?'#8967dd':'#9bace4'}" stroke="white" stroke-width="2"/><text x="${x}" y="229" text-anchor="middle">${monthName(r.month,true)}</text></g>`;});$('#forecast-chart').innerHTML=svg+'</svg>';
}
function valuePage() {
 return renderCustomerRoiPage(selectedRows(),roiAssumptions,{kpi,cardHead,metric,icon});
}
function updateValue() {
 try{roiAssumptions=readRoiControls();$('#roi-validation').textContent='';$('#roi-results').innerHTML=renderCustomerRoiResults(selectedRows(),roiAssumptions,{kpi,cardHead,metric,icon});$('#export-button').disabled=false;}
 catch(error){$('#roi-validation').textContent=error.message;$('#roi-results').innerHTML='<div class="notice error">ROI unavailable until the assumptions are corrected.</div>';$('#export-button').disabled=true;}
}
function methodology() {
 return `<div class="notice">${dataset.fictional?'This public dashboard uses only fictional data. No mailbox, report attachment, customer identity, or real consumption amount is included.':'Private viewing mode. Records are read from approved storage on this device. This view is not published to GitHub.'}</div><div class="definitions"><article class="definition"><h2>Copilot Studio Credits</h2><p>Credits measure agent consumption. This dashboard shows monthly billed credits and the allocated monthly capacity from the source snapshot. The example costs are fictional amounts, not Microsoft pricing or a credit-to-currency conversion.</p><p><a href="https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity" target="_blank" rel="noreferrer">Microsoft capacity documentation ↗</a></p></article><article class="definition"><h2>MAU & PAU</h2><p><strong>MAU:</strong> monthly active users, counted once within each customer and month. <strong>PAU:</strong> paid active users in this demo, a subset of MAU. PAU is a project assumption; confirm the definition against the actual report before mapping it.</p><p>Counts are never summed across months. Portfolio totals assume customers represent disjoint user populations.</p></article><article class="definition"><h2>Azure AI & total cost</h2><p>Azure AI cost is the monthly USD amount from the report. Total AI spend = Azure AI cost + Copilot Studio cost. Exclude any Copilot charges already present in Azure AI cost to avoid double counting. The consumption spend metric excludes other licenses, operations, implementation and taxes. The customer ROI model separately includes allocated licenses, ongoing operations and setup.</p><p>Budget remaining = monthly budget − total spend. Credit capacity and monetary budget are separate measures.</p></article><article class="definition"><h2>Forecast methodology</h2><p>Base growth is the mean of up to two consecutive monthly growth rates from the latest three available snapshots, capped at ±20%. Next month = current spend × (1 + growth). The forecast compounds for three months.</p><p>The lower and higher scenarios are 75% and 125% of the base projection. They are planning scenarios, not statistical confidence intervals. Missing monthly snapshots are rejected by the private ingestion workflow.</p></article><article class="definition"><h2>Business value methodology</h2><p>Monthly saved hours = eligible successful production tasks × (manual minutes − AI handling/review minutes) ÷ 60. Monthly economic benefit = saved hours × productive hourly value × capacity realization. Year-one full cost = 12 × (licenses + Copilot + Azure + operations) + upfront setup. Net economic value = year-one benefit − full cost. ROI = net value ÷ full cost × 100.</p><p>Fictional demo defaults: 7 manual minutes, 2 AI/review minutes, $72/hour, 70% realization, 25% cash-releasing share and $30 per allocated license/month. Cash benefit is a subset of economic benefit, never added again. The selected month is repeated 12 times with setup charged once, without growth, tax or discounting. Payback uses the positive monthly margin after recurring costs. These estimates are not measured cash savings. Missing/mismatched inputs block ROI; zero cost makes ROI undefined.</p></article><article class="definition"><h2>Private report workflow</h2><p>Approved reports are validated and stored outside the Git checkout in a private local directory. Original files, approval evidence, hashes and normalized snapshots remain there. No data is sent to GitHub, analytics services, or third-party scripts.</p><p>The local private viewer reads those records on the loopback address. GitHub Pages always serves the fictional portfolio. This static public website has no mailbox connection or upload endpoint.</p></article><article class="definition wide"><h2>Snapshot & quality checks</h2><p>Demo: May–October 2026, as of 31 October 2026 · USD. Customer and month filters apply to every metric, table, forecast and export. Change badges compare the selected customer scope to the previous calendar month. No prior month is shown as unavailable. A report must have one complete row per customer/month with finite nonnegative numeric fields, whole-number user and task counts, PAU ≤ MAU, a valid month, no duplicates, explicit approval evidence and a matching SHA-256 file hash. An updated snapshot requires explicit replacement. Exports contain the selected monthly rows; Business value exports also include the modeled year-one results and their assumptions.</p></article></div>`;
}
function render() {
 section=location.hash.slice(1) in sections?location.hash.slice(1):'overview';
 const [label,title,subtitle]=sections[section];
 $('#breadcrumb').textContent=label;$('#page-title').textContent=title;$('#page-subtitle').textContent=subtitle;
 document.title=`${label} · ${{sample:'Sample Data',poc:'CEL',actual:'Actual Data'}[dataMode]} · AI Consumption Dashboard`;
 $('#export-label').textContent=dataMode==='sample'&&section==='value'?'Export ROI scenario':'Export data';
 document.querySelectorAll('nav a').forEach(a=>{const active=a.hash===`#${section}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(actualView()){
  $('#content').innerHTML=actualData?renderActualSection(section,actualData,{kpi,cardHead,metric,icon}):'';
  return;
 }
 $('#content').innerHTML=({overview,usage,forecast:forecastPage,value:valuePage,methodology}[section])();
 if(!dataset.fictional) document.querySelectorAll('.customer-name small').forEach(el=>el.textContent='Approved private report');
 $('#export-button').disabled=false;
 if(section==='forecast')updateForecast();
 // Capacity meters avoid inline style so the strict Content Security Policy is respected.
 document.querySelectorAll('.progress span').forEach(el=>{const width=el.dataset.width;el.style.width=`${width||0}%`;});
}
function refreshScope() {if(actualView())return;customer=$('#customer-filter').value;month=$('#month-filter').value;growth=baselineGrowth(series());render();}
$('#navigation').innerHTML=Object.entries(sections).map(([id,[label]])=>`<a href="#${id}">${icon(id)}${label}</a>`).join('');
$('#export-icon').innerHTML=icon('download');
$('#customer-filter').addEventListener('change',refreshScope);$('#month-filter').addEventListener('change',refreshScope);
window.addEventListener('hashchange',render);
$('#content').addEventListener('click',event=>{const button=event.target.closest('[data-customer]');if(button){$('#customer-filter').value=button.dataset.customer;refreshScope();}});
$('#content').addEventListener('input',event=>{
 if(actualView()){if(event.target.id.startsWith('actual-')&&actualData)$('#export-button').disabled=updateActualValueScenario(actualData)===false;return;}
 if(event.target.hasAttribute('data-roi-assumption')){updateValue();return;}
 if(event.target.id==='growth'){growth=Number(event.target.value)/100;updateForecast();}
});
$('#export-button').addEventListener('click',()=>{
 if(actualView()){
  if(!actualData)return;
  const fields=['report','metric','value','unit','period','sourceUpdatedAt','basis'];
  downloadCSV(actualExportRows(actualData),fields,`ai-consumption-${dataMode==='poc'?'poc-actual':'actual'}-${actualData.asOf}.csv`);
  $('#load-status').textContent='Actual source measures exported. Unavailable values remain explicit.';
  return;
 }
 if(section==='value'){
  const data=roiExportRows(selectedRoiResults(selectedRows(),roiAssumptions)),fields=Object.keys(data[0]);
  downloadCSV(data,fields,`customer-roi-sample-${month}.csv`);$('#load-status').textContent='Customer ROI scenario exported with its inputs, assumptions, full costs and calculation basis.';return;
 }
 const fields=['customer','month','credits','mau','pau','azureCost','copilotCost','creditCapacity','budget','tasks','hoursSaved'];
 downloadCSV(selectedRows(),fields,`ai-consumption-sample-${month}.csv`);
 $('#load-status').textContent='Selected monthly data exported.';
});
function downloadCSV(data,fields,filename){
 const csv=[fields.map(csvEscape).join(','),...data.map(row=>fields.map(key=>csvEscape(row[key])).join(','))].join('\r\n');
 const link=document.createElement('a');link.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}
async function selectDataMode(mode){
 $('#data-source').disabled=true;$('#export-button').disabled=true;$('#load-status').className='';$('#load-status').textContent='';$('#content').innerHTML='';
 dataMode=mode;$('#data-source').value=mode;customer='all';roiAssumptions={...defaultRoiAssumptions};
 try{
  if(mode==='actual'){
   if(!privateAvailable)throw new Error('Actual Data is available only through the private dashboard on this computer.');
   $('#load-status').textContent='Loading approved Actual Data…';
   const response=await fetch('./api/actual',{cache:'no-store'});if(!response.ok)throw new Error('Actual Data could not be loaded from private storage. You can switch to Sample Data.');
   actualData=await response.json();if(actualData.fictional!==false||actualData.version!==1||!actualData.credits||!actualData.activity||!actualData.inventory||actualData.reports?.length!==4)throw new Error('Actual Data failed validation. No sample values have been substituted.');
   $('#customer-filter').innerHTML='<option value="all">Connected tenant</option>';
   $('#month-filter').innerHTML=`<option>${escape(actualData.asOf)} snapshot</option>`;
   $('#customer-filter').disabled=true;$('#month-filter').disabled=true;
   $('#scope-label').textContent='Scope';$('#period-label').textContent='Reporting snapshot';$('#customer-filter').setAttribute('aria-label','Scope');$('#month-filter').setAttribute('aria-label','Reporting snapshot');
   $('#asof').textContent='Actual reports · '+actualData.asOf;
   $('#mode-badge').textContent='ACTUAL DATA · PRIVATE';$('#sidebar-mode').textContent='Actual Data active';$('#sidebar-note').textContent='Four approved reports, read from private local storage.';$('#workspace-subtitle').textContent='Approved actual reports';$('#footer-label').textContent='Actual Data · private local view · customer-sensitive';
  }else if(mode==='poc'){
   $('#load-status').textContent='Loading CEL…';
   const response=await fetch('./data/POC-reports.json',{cache:'no-store'});if(!response.ok)throw new Error('CEL data could not be loaded. You can switch to Sample Data.');
   actualData=publicPocDashboard(await response.json());
   $('#customer-filter').innerHTML='<option value="all">CEL aggregate</option>';
   $('#month-filter').innerHTML=`<option>${escape(actualData.asOf)} snapshot</option>`;
   $('#customer-filter').disabled=true;$('#month-filter').disabled=true;
   $('#scope-label').textContent='Scope';$('#period-label').textContent='Reporting snapshot';$('#customer-filter').setAttribute('aria-label','Scope');$('#month-filter').setAttribute('aria-label','Reporting snapshot');
   $('#asof').textContent='CEL reports · '+actualData.asOf;
   $('#mode-badge').textContent='CEL · PUBLIC';$('#sidebar-mode').textContent='CEL active';$('#sidebar-note').textContent='Validated aggregate view; source identifiers are not rendered.';$('#workspace-subtitle').textContent='CEL aggregate';$('#footer-label').textContent='CEL · reporting scopes preserved · identifiers hidden in UI';
  }else{
   dataset=sampleData;rows=validateRows(dataset.rows);month=[...new Set(rows.map(r=>r.month))].sort().at(-1);
   $('#customer-filter').innerHTML='<option value="all">All customers</option>'+[...new Set(rows.map(r=>r.customer))].sort().map(name=>`<option value="${escape(name)}">${escape(name)}</option>`).join('');
   $('#month-filter').innerHTML=[...new Set(rows.map(r=>r.month))].sort().reverse().map(m=>`<option value="${m}">${monthName(m)}</option>`).join('');
   $('#customer-filter').disabled=false;$('#month-filter').disabled=false;
   $('#scope-label').textContent='Customer';$('#period-label').textContent='Reporting period';$('#customer-filter').setAttribute('aria-label','Customer');$('#month-filter').setAttribute('aria-label','Reporting period');
   $('#asof').textContent='Sample snapshot · 31 Oct 2026';
   $('#mode-badge').textContent='FICTIONAL SAMPLE DATA';$('#sidebar-mode').textContent='Sample Data active';$('#sidebar-note').textContent='Explore the portfolio with fictional data.';$('#workspace-subtitle').textContent='Fictional sample portfolio';$('#footer-label').textContent='Fictional portfolio · USD · No customer data';
   growth=baselineGrowth(series());
  }
  const url=new URL(location.href);if(mode==='actual')url.searchParams.set('private','1');else url.searchParams.delete('private');if(mode==='poc')url.searchParams.set('source','poc');else url.searchParams.delete('source');history.replaceState(null,'',url.pathname+url.search+url.hash);
  $('#load-status').textContent='';$('#export-button').disabled=false;render();
 }catch(error){actualData=null;$('#load-status').className='notice error';$('#load-status').textContent=error.message;$('#mode-badge').textContent='ACTUAL DATA UNAVAILABLE';$('#sidebar-mode').textContent=mode==='poc'?'CEL unavailable':'Actual Data unavailable';$('#sidebar-note').textContent='Select Sample Data to explore fictional data.';$('#workspace-subtitle').textContent='Actual source unavailable';$('#footer-label').textContent='Actual source unavailable · no sample values substituted';$('#customer-filter').innerHTML='';$('#month-filter').innerHTML='';$('#customer-filter').disabled=true;$('#month-filter').disabled=true;}
 finally{$('#data-source').disabled=false;}
}
$('#data-source').addEventListener('change',event=>selectDataMode(event.target.value));
async function initialize(){
 if(['127.0.0.1','localhost','[::1]'].includes(location.hostname)){
  try{const response=await fetch('./api/capabilities',{cache:'no-store'});if(response.ok)privateAvailable=(await response.json()).privateMode===true;}catch{}
 }
 const actualOption=$('#data-source option[value="actual"]');if(actualOption)actualOption.disabled=!privateAvailable;
 $('#data-source').title='Choose Sample Data or CEL.';
 await selectDataMode(privateRequested?'actual':pocRequested?'poc':'sample');
}
initialize();
