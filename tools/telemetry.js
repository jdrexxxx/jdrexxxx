const fs=require('fs');
const c=require('./contrib.json'), L=require('./langs.json');
const days=c.days.filter(x=>x.date>='2025-09-14'&&x.date<='2026-09-12');
const FONT="ui-monospace,'SF Mono','Cascadia Mono','Segoe UI Mono','Roboto Mono',Menlo,Consolas,monospace";
const SANS="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const lvl=n=>n===0?0:n<=3?1:n<=9?2:n<=24?3:4;
const PAL=['#21262d','#0d4a2a','#12844a','#22c96f','#5cf7a4'];
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const W=880,PAD=34,CELL=11,GAP=3,STEP=CELL+GAP;
const GX=PAD+38, GY=118;
const weeks=[]; for(let i=0;i<days.length;i+=7) weeks.push(days.slice(i,i+7));
const gridW=weeks.length*STEP-GAP, gridH=7*STEP-GAP;

let cells='',months='',lastM=-1;
weeks.forEach((wk,wi)=>{
  let inner='';
  wk.forEach((d,di)=>{
    const v=lvl(d.contributionCount);
    inner+=`<rect x="${wi*STEP}" y="${di*STEP}" width="${CELL}" height="${CELL}" rx="2.5" fill="${PAL[v]}"${v>=4?' stroke="#5cf7a4" stroke-opacity="0.5" stroke-width="0.6"':''}><title>${d.date}: ${d.contributionCount}</title></rect>`;
  });
  cells+=`<g><animate attributeName="opacity" values="0;1" dur="0.5s" begin="${(wi*0.013).toFixed(3)}s" fill="freeze"/>${inner}</g>`;
  const f=wk[0]; if(f){const m=+f.date.slice(5,7)-1; if(m!==lastM&&+f.date.slice(8,10)<=7){months+=`<text x="${wi*STEP}" y="-9" class="mi">${MON[m]}</text>`;lastM=m;}}
});
const wd=[[1,'Mon'],[3,'Wed'],[5,'Fri']].map(([i,t])=>`<text x="-10" y="${i*STEP+CELL-1.5}" class="wd">${t}</text>`).join('');
const legend=PAL.map((p,i)=>`<rect x="${gridW-116+i*15}" y="${gridH+9}" width="${CELL}" height="${CELL}" rx="2.5" fill="${p}"/>`).join('');

// language bar
const total=L.totalBytes;
const COLORS={TypeScript:'#3178c6',JavaScript:'#f1e05a',Astro:'#ff5a03',CSS:'#663399',HTML:'#e34c26'};
const top=Object.entries(L.langTotals).sort((a,b)=>b[1]-a[1]);
const segs=[...top.slice(0,5).map(([n,b])=>({n,b,c:COLORS[n]||'#8b949e'})),{n:'9 others',b:top.slice(5).reduce((s,[,b])=>s+b,0),c:'#6e7681'}];
const BARW=W-PAD*2, BARH=15, BARY=GY+gridH+64;
let x=0,bar='',lg='',lx=0;
for(const s of segs){
  const w=Math.max(2,s.b/total*BARW);
  bar+=`<rect x="${x.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="${BARH}" fill="${s.c}"><title>${s.n}: ${(s.b/total*100).toFixed(2)}%</title></rect>`;
  x+=w;
  const pct=s.b/total*100, label=`${s.n} ${pct>=1?pct.toFixed(1):pct.toFixed(2)}%`;
  lg+=`<g transform="translate(${lx},0)"><circle cx="5" cy="-4" r="4.5" fill="${s.c}"/><text x="15" y="0" class="lgt">${label}</text></g>`;
  lx+=label.length*6.7+32;
}
const H=BARY+BARH+74;
const stats=[['1,476','TOTAL SINCE JUNE 2024'],['133','ACTIVE DAYS THIS YEAR'],['96','PEAK DAY &#183; 21-DAY STREAK'],['49.4 MB','SOURCE ACROSS 35 REPOS']];
let rail='';
stats.forEach(([n,l],i)=>{const sx=PAD+i*Math.floor(BARW/4);rail+=`<text x="${sx}" y="${H-32}" class="sn">${n}</text><text x="${sx}" y="${H-15}" class="sl">${l}</text>`;});

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Telemetry. 1,474 contributions in the last year, all to private repositories, 133 active days, longest streak 21 days, peak 96 commits in one day. 49.4 MB of source across 35 repositories: TypeScript 93.2 percent, JavaScript 2.59, Astro 2.55, CSS 0.86, HTML 0.61.">
<style>
  .eb{font:500 10.5px ${FONT};fill:#7d8590;letter-spacing:.19em}
  .h{font:600 17px ${SANS};fill:#e6edf3;letter-spacing:-.01em}
  .mi,.wd,.lgt{font:400 10.5px ${FONT};fill:#7d8590}
  .wd{text-anchor:end}
  .lgt{font-size:11px;fill:#9aa4b0}
  .lb{font:400 10px ${FONT};fill:#6e7681;letter-spacing:.12em}
  .sn{font:600 22px ${FONT};fill:#5cf7a4}
  .sl{font:400 9.5px ${FONT};fill:#6e7681;letter-spacing:.13em}
  .div{stroke:#21262d;stroke-width:1}
</style>
<rect width="${W}" height="${H}" rx="16" fill="#0d1117"/>
<rect x="0.5" y="0.5" width="${W-1}" height="${H-1}" rx="15.5" fill="none" stroke="#30363d"/>
<text x="${PAD}" y="48" class="eb">TELEMETRY &#183; COUNTED FROM THE REPOS, NOT A STATS CARD</text>
<text x="${PAD}" y="78" class="h">1,474 contributions in the last year &#8212; every one of them private</text>
<g transform="translate(${GX},${GY})">
  ${months}${wd}${cells}
  <text x="${gridW-134}" y="${gridH+19}" class="lb" text-anchor="end">LESS</text>
  ${legend}
  <text x="${gridW+4}" y="${gridH+19}" class="lb" text-anchor="end">MORE</text>
</g>
<line x1="${PAD}" y1="${BARY-30}" x2="${W-PAD}" y2="${BARY-30}" class="div"/>
<text x="${PAD}" y="${BARY-12}" class="lb">49,435,195 BYTES OF SOURCE ACROSS 35 REPOSITORIES IN 2 ORGS</text>
<g transform="translate(${PAD},${BARY})"><clipPath id="bclip"><rect x="0" y="0" width="${BARW}" height="${BARH}" rx="7.5"/></clipPath><g clip-path="url(#bclip)">${bar}</g></g>
<g transform="translate(${PAD},${BARY+BARH+24})">${lg}</g>
<line x1="${PAD}" y1="${H-58}" x2="${W-PAD}" y2="${H-58}" class="div"/>
${rail}
</svg>`;
fs.writeFileSync(__dirname+'/telemetry.svg',svg);
console.log('wrote telemetry.svg',svg.length,'bytes',W+'x'+H,'| weeks',weeks.length);
