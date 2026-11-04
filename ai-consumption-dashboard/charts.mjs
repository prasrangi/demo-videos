const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function stackedBars(data,{keys,colors=['#8967dd','#b5c2f0'],format=String,axis=format,description='Consumption by period',grouped=false,width=640}={}){
 const w=width,h=242,left=53,right=15,top=14,bottom=34,plot=h-top-bottom;
 const available=data.some(row=>keys.some(key=>typeof row[key]==='number'));
 if(!available)return emptyChart(description,'No matching source values are available.');
 const max=Math.max(1,...data.map(row=>grouped?Math.max(...keys.map(key=>row[key]??0)):keys.reduce((sum,key)=>sum+(row[key]??0),0)))*1.2;
 let svg=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(description)}"><title>${escape(description)}</title>`;
 for(let i=0;i<=4;i++){const y=top+plot*(1-i/4);svg+=`<line class="chart-grid" x1="${left}" x2="${w-right}" y1="${y}" y2="${y}"/><text x="${left-10}" y="${y+3}" text-anchor="end">${escape(axis(max*i/4))}</text>`;}
 const cell=(w-left-right)/Math.max(1,data.length),bw=Math.min(43,cell*.45);
 data.forEach((row,i)=>{
  let accumulated=0;const x=left+cell*i+(cell-bw)/2;
  svg+=`<g><title>${escape(row.label)}: ${keys.map(key=>`${escape(key)} ${row[key]===null?'Unavailable':escape(format(row[key]))}`).join('; ')}</title>`;
  keys.forEach((key,j)=>{if(row[key]===null||row[key]===undefined)return;const height=row[key]/max*plot;svg+=`<rect x="${grouped?x+j*bw/keys.length:x}" y="${top+plot-height-(grouped?0:accumulated)}" width="${grouped?bw/keys.length-2:bw}" height="${height}" rx="3" fill="${colors[j%colors.length]}"/>`;if(!grouped)accumulated+=height;});
  svg+=`<text x="${x+bw/2}" y="${h-10}" text-anchor="middle">${escape(row.label)}</text></g>`;
 });return svg+'</svg>';
}
export function donutChart(entries,{description='Consumption mix',centerLabel='Total',centerValue='',format=String}={}){
 if(entries.some(entry=>entry.value===null||!Number.isFinite(entry.value)))return emptyChart(description,'Source values are unavailable.');
 const sum=entries.reduce((s,e)=>s+e.value,0);let offset=0;
 return `<div class="donut-layout"><div class="donut-wrap"><svg viewBox="0 0 160 160" role="img" aria-label="${escape(description)}"><title>${entries.map(e=>`${escape(e.label)}: ${escape(format(e.value))}`).join('; ')}</title><circle cx="80" cy="80" r="64" fill="none" stroke="#f3f1f8" stroke-width="17"/>${entries.map((entry,i)=>{const length=sum>0?entry.value/sum*402.124:0,start=offset;offset+=length;return `<circle cx="80" cy="80" r="64" fill="none" stroke="${i?'#b5c2f0':'#8967dd'}" stroke-width="17" stroke-dasharray="${length} 402.124" stroke-dashoffset="${-start}"/>`;}).join('')}</svg><div class="donut-label"><small>${escape(centerLabel)}</small><strong>${escape(centerValue)}</strong></div></div><div class="cost-legend">${entries.map((entry,i)=>`<div><i class="dot ${i?'blue':''}"></i><strong>${escape(entry.label)}</strong><small>${escape(format(entry.value))} · ${sum>0?(entry.value/sum*100).toFixed(1):0}%</small></div>`).join('')}</div></div>`;
}
export function emptyChart(title,reason){return `<div class="empty-chart" role="img" aria-label="${escape(title)}: unavailable"><svg class="chart" viewBox="0 0 640 160" aria-hidden="true"><path class="chart-grid" d="M45 20H620 M45 60H620 M45 100H620 M45 140H620"/></svg><div><strong>Unavailable</strong><p>${escape(reason)}</p></div></div>`;}
