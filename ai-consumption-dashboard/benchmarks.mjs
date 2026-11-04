// Public reference prices and planning benchmarks, verified 2026-11-04.
// These are neither customer contract prices nor measured savings.
export const benchmarks={
 currency:'USD',verifiedOn:'2026-11-04',prepaidPackUSD:200,prepaidPackCredits:25000,paygUSDPerCredit:.01,
 copilotUSDPerSeatMonth:30,seatPriceBasis:'Standalone Microsoft 365 Copilot add-on; annual commitment, paid yearly; monthly equivalent',
 minutesPerKnowledgeReference:6,productiveUSDPerHour:72,
 pricingSource:'https://www.microsoft.com/licensing/guidance/Microsoft-Copilot-Studio',
 seatSource:'https://www.microsoft.com/en-us/copilot/solutions/enterprise',
 valueSource:'https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-measure-impact'
};
const valid=(value,name)=>{if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new Error(`Invalid ${name}.`);return value;};
export function estimateCreditValue(prepaid,payg){
 return {prepaid:valid(prepaid,'prepaid credits')*benchmarks.prepaidPackUSD/benchmarks.prepaidPackCredits,payg:valid(payg,'pay-as-you-go credits')*benchmarks.paygUSDPerCredit,
  total:prepaid*benchmarks.prepaidPackUSD/benchmarks.prepaidPackCredits+payg*benchmarks.paygUSDPerCredit,kind:'list-price usage allocation',isInvoice:false};
}
export function estimateValue(references,minutes=benchmarks.minutesPerKnowledgeReference,hourly=benchmarks.productiveUSDPerHour){
 valid(references,'scenario references');valid(minutes,'minutes per reference');valid(hourly,'hourly value');
 if(references>1e8||minutes>240||hourly>10000)throw new Error('Scenario inputs exceed supported planning limits.');
 return {hours:references*minutes/60,grossValue:references*minutes/60*hourly,measured:false};
}
export function enrichActual(base,measurements){
 if(!measurements)return base;
 if(measurements.version!==1||measurements.listPricingApproved!==true||measurements.webBenchmarksApproved!==true)throw new Error('Approved measurement and pricing evidence is required.');
 const a=measurements.adoption;if(!a||!/^\d{4}-\d{2}-\d{2}$/.test(a.asOf)||a.asOf.slice(0,7)!==base.asOf.slice(0,7)||a.definition!=='identified-credit-active-users-month-to-date')throw new Error('Adoption source period or definition does not match.');
 for(const key of ['identifiedActiveUsers','licensedActiveUsers','reportedLicensedSeats'])if(!Number.isInteger(valid(a[key],key)))throw new Error('Adoption counts must be integers.');
 if(a.licensedActiveUsers>a.identifiedActiveUsers||a.licensedActiveUsers>a.reportedLicensedSeats)throw new Error('Adoption counts do not reconcile.');
 const paid=a.paidLicenseBasis==='user-confirmed-paid-reseller-licenses'?a.licensedActiveUsers:null;
 const estimate=estimateCreditValue(base.credits.prepaid,base.credits.payg);
 return {...base,adoption:{mau:a.identifiedActiveUsers,pau:paid,licensedActiveUsers:a.licensedActiveUsers,licensedSeats:a.reportedLicensedSeats,
   definition:a.definition,asOf:a.asOf,scope:'Identified Copilot Studio credit-active users, month to date',source:a.source,paidLicenseBasis:a.paidLicenseBasis,
   caveat:'This is the licensing report\'s signed-in credit-active population. It can include authoring activity and excludes unidentified users; it is not the native Monitor end-user MAU metric.'},
  estimates:{credits:estimate,licensedSeatEquivalent:a.reportedLicensedSeats*benchmarks.copilotUSDPerSeatMonth,seatCount:a.reportedLicensedSeats,
   seatCaveat:'Standalone add-on equivalent only. Existing bundles or included rights can change the payable amount. This benchmark is not added to consumption value.'},
  benchmarks:{...benchmarks},valueScenario:{referenceCount:base.activity.observedRuns,referenceCountVerified:false,
   minutesPerReference:benchmarks.minutesPerKnowledgeReference,productiveUSDPerHour:benchmarks.productiveUSDPerHour,
   assumption:'Illustrative scenario: one qualifying knowledge reference per other observed run. The reports do not measure knowledge references.',
   period:base.activity.period,scope:`${base.activity.environments} telemetry environments; test/evaluation runs excluded`,...estimateValue(base.activity.observedRuns)},
  measurementNotes:['Paid Active Users uses the user-confirmed paid reseller licensing classification; invoice amounts were not provided.',
   'List-price usage allocations are estimates and do not replace invoices, pack commitments or contractual prices.',
   'Azure AI cost remains unavailable because neither matching billed charges nor usable model/token measurements were supplied.',
   'The value scenario is a what-if estimate, not observed savings. Net value and ROI require cost and benefit data for the same scope and period.']};
}
