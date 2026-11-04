// Fetched outcomes + approved business assumptions + complete, aligned costs.
// The sample adapter is separate so these equations can be used with private reports later.
export const defaultRoiAssumptions={manualMinutes:7,reviewMinutes:2,hourlyValue:72,realization:.7,cashShare:.25,seatMonthlyPrice:30};
const nonnegative=(value,name)=>{if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new Error(`Invalid ${name}.`);return value;};
export function validateRoiAssumptions(a){
 for(const key of Object.keys(defaultRoiAssumptions))nonnegative(a[key],key);
 if(a.manualMinutes>240||a.reviewMinutes>240||a.hourlyValue>10000||a.seatMonthlyPrice>10000||a.realization>1||a.cashShare>1)throw new Error('Assumptions exceed supported planning limits.');
 return a;
}
export function customerRoi(record,assumptions=defaultRoiAssumptions){
 const a=validateRoiAssumptions(assumptions),missing=[];
 if(record.currency!=='USD')missing.push('Use the same supported currency (USD) for benefit and cost.');
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(record.outcomeMonth||'')||record.outcomeMonth!==record.costMonth)missing.push('Outcome and cost months must be valid and match.');
 if(!record.outcomeScope||record.outcomeScope!==record.costScope)missing.push('Outcome and cost customer/workload scopes must match.');
 if(record.testsExcluded!==true||record.deduplicated!==true)missing.push('Exclude test/evaluation traffic and deduplicate task outcomes.');
 const measured=key=>{const value=record[key];if(value===null||value===undefined){missing.push(`Missing ${key}.`);return null;}nonnegative(value,key);return value;};
 const production=measured('productionTasks'),eligible=measured('eligibleTasks'),seats=measured('licensedSeats');
 for(const [key,value] of [['productionTasks',production],['eligibleTasks',eligible],['licensedSeats',seats]])if(value!==null&&!Number.isInteger(value))throw new Error(`${key} must be a whole count.`);
 if(production!==null&&eligible!==null&&eligible>production)throw new Error('Eligible successful tasks cannot exceed production tasks.');
 const copilot=measured('copilotCost'),azure=measured('azureCost'),operations=measured('operationsCost'),implementation=measured('implementationCost');
 const hours=eligible===null?null:eligible*(a.manualMinutes-a.reviewMinutes)/60;
 const monthlyBenefit=hours===null?null:hours*a.hourlyValue*a.realization;
 // Cash-releasing savings are a subset of economic value, not an extra benefit.
 const monthlyCash=monthlyBenefit===null?null:Math.max(0,monthlyBenefit)*a.cashShare;
 const recurring=[seats,copilot,azure,operations].some(v=>v===null)?null:seats*a.seatMonthlyPrice+copilot+azure+operations;
 const ready=missing.length===0;
 const yearCost=ready?recurring*12+implementation:null,yearBenefit=monthlyBenefit===null?null:monthlyBenefit*12,yearCash=monthlyCash===null?null:monthlyCash*12;
 const monthlyMargin=ready?monthlyBenefit-recurring:null,cashMargin=ready?monthlyCash-recurring:null;
 return {customer:record.customer,useCase:record.useCase,month:record.outcomeMonth,currency:record.currency,basis:record.basis||'modeled',record,assumptions:{...a},ready,missing,
  hours,monthlyBenefit,monthlyCash,monthlyCapacityValue:monthlyBenefit===null?null:monthlyBenefit-monthlyCash,
  recurringCost:recurring,implementationCost:implementation,yearCost,yearBenefit,yearCash,
  yearNet:ready?yearBenefit-yearCost:null,yearCashNet:ready?yearCash-yearCost:null,
  economicRoi:ready&&yearCost>0?(yearBenefit-yearCost)/yearCost*100:null,
  cashRoi:ready&&yearCost>0?(yearCash-yearCost)/yearCost*100:null,
  economicPayback:ready&&monthlyMargin>0?implementation/monthlyMargin:null,
  cashPayback:ready&&cashMargin>0?implementation/cashMargin:null,
  timeline:ready?Array.from({length:13},(_,month)=>({month,economic:-implementation+month*monthlyMargin,cash:-implementation+month*cashMargin})):[]};
}
export function aggregateCustomerRoi(results){
 if(!results.length)throw new Error('Select at least one customer ROI record.');
 const sameMonth=new Set(results.map(r=>r.month)).size===1,sameCurrency=new Set(results.map(r=>r.currency)).size===1;
 const ready=results.every(r=>r.ready)&&sameMonth&&sameCurrency;
 const sum=key=>results.some(r=>r[key]===null)?null:results.reduce((s,r)=>s+r[key],0);
 const yearBenefit=sum('yearBenefit'),yearCash=sum('yearCash'),yearCost=ready?sum('yearCost'):null,setup=sum('implementationCost'),recurring=sum('recurringCost');
 const monthlyBenefit=sum('monthlyBenefit'),monthlyCash=sum('monthlyCash');
 return {ready,missing:[...new Set(results.flatMap(r=>r.missing)),...(!sameMonth?['Do not combine different reporting months.']:[]),...(!sameCurrency?['Do not combine currencies.']:[])],
  hours:sum('hours'),monthlyBenefit,monthlyCash,yearBenefit,yearCash,yearCost,implementationCost:setup,recurringCost:recurring,
  yearNet:ready?yearBenefit-yearCost:null,yearCashNet:ready?yearCash-yearCost:null,
  economicRoi:ready&&yearCost>0?(yearBenefit-yearCost)/yearCost*100:null,cashRoi:ready&&yearCost>0?(yearCash-yearCost)/yearCost*100:null,
  economicPayback:ready&&monthlyBenefit>recurring?setup/(monthlyBenefit-recurring):null,cashPayback:ready&&monthlyCash>recurring?setup/(monthlyCash-recurring):null,
  timeline:ready?Array.from({length:13},(_,month)=>({month,economic:-setup+month*(monthlyBenefit-recurring),cash:-setup+month*(monthlyCash-recurring)})):[]};
}

const profiles={
 'Northstar Retail':{useCase:'Customer support automation',baseHours:1850,eligibleTasks:22200,licensedSeats:1400,operationsCost:1000,implementationCost:35000},
 'Meridian Financial':{useCase:'Policy and case assistance',baseHours:1320,eligibleTasks:15840,licensedSeats:1100,operationsCost:800,implementationCost:25000},
 'Alpine Manufacturing':{useCase:'Maintenance knowledge assistant',baseHours:780,eligibleTasks:9360,licensedSeats:650,operationsCost:650,implementationCost:20000},
 'Solstice Health':{useCase:'Staff operations assistance',baseHours:640,eligibleTasks:7680,licensedSeats:450,operationsCost:550,implementationCost:15000}
};
export function sampleRoiRecords(rows){
 return rows.map(row=>{
  const p=profiles[row.customer];if(!p)throw new Error('Unknown fictional ROI customer.');
  // Fictional successful-outcome counts are scaled with the existing sample month.
  // Production integrations must fetch outcomes; they must not infer them from hours or credits.
  const eligible=Math.min(row.tasks,Math.round(p.eligibleTasks*row.hoursSaved/p.baseHours));
  return {customer:row.customer,useCase:p.useCase,currency:'USD',outcomeMonth:row.month,costMonth:row.month,
   outcomeScope:row.customer,costScope:row.customer,productionTasks:row.tasks,eligibleTasks:eligible,
   testRunsExcluded:Math.round(row.tasks*.12),testsExcluded:true,deduplicated:true,
   licensedSeats:p.licensedSeats,copilotCost:row.copilotCost,azureCost:row.azureCost,
   operationsCost:p.operationsCost,implementationCost:p.implementationCost,basis:'fictional sample / estimated business case'};
 });
}
export function roiExportRows(results){return results.map(r=>({customer:r.customer,useCase:r.useCase,sourceMonth:r.month,basis:r.basis,
 productionTasks:r.record.productionTasks,eligibleTasks:r.record.eligibleTasks,testRunsExcluded:r.record.testRunsExcluded,
 manualMinutes:r.assumptions.manualMinutes,reviewMinutes:r.assumptions.reviewMinutes,hourlyValueUSD:r.assumptions.hourlyValue,
 realization:r.assumptions.realization,cashReleasingShare:r.assumptions.cashShare,licensedSeats:r.record.licensedSeats,seatMonthlyPriceUSD:r.assumptions.seatMonthlyPrice,
 copilotCostUSD:r.record.copilotCost,azureCostUSD:r.record.azureCost,operationsCostUSD:r.record.operationsCost,implementationCostUSD:r.implementationCost,
 monthlyHours:r.hours,yearBenefitUSD:r.yearBenefit,yearCashBenefitUSD:r.yearCash,yearCostUSD:r.yearCost,yearNetUSD:r.yearNet,
 yearEconomicRoiPct:r.economicRoi??'Unavailable',yearCashRoiPct:r.cashRoi??'Unavailable',economicPaybackMonths:r.economicPayback??(r.ready?'No payback':'Unavailable'),cashPaybackMonths:r.cashPayback??(r.ready?'No payback':'Unavailable'),
 readiness:r.ready?'Complete modeled inputs':r.missing.join(' '),annualization:'12 identical months; setup charged once; undiscounted; not a growth forecast'}));}
