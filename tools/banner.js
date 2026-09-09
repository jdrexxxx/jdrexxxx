const fs=require('fs');
const W=880,H=300,PAD=34;
const FONT="ui-monospace,'SF Mono','Cascadia Mono','Segoe UI Mono','Roboto Mono',Menlo,Consolas,monospace";
const SANS="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

const services=[
  ['rexvet.org','501(c)(3) VET TELEHEALTH'],
  ['greenbits.ai','AI VIDEO STUDIO'],
  ['seowires.com','SEO CONTENT ENGINE'],
  ['rexsailing.com','SAILING SCHOOL'],
  ['blackwires.com','THE STUDIO'],
];
const RX=498, RW=W-RX-PAD;
let rows='';
services.forEach(([host,tag],i)=>{
  const y=100+i*32;
  rows+=`<g transform="translate(${RX},${y})">`
    +`<circle cx="0" cy="-4" r="3.2" fill="#3fb950"/>`
    +`<circle cx="0" cy="-4" r="3.2" fill="none" stroke="#3fb950" stroke-width="1" opacity="0"><animate attributeName="r" values="3.2;10" dur="2.6s" begin="${(i*0.42).toFixed(2)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.7;0" dur="2.6s" begin="${(i*0.42).toFixed(2)}s" repeatCount="indefinite"/></circle>`
    +`<text x="14" y="0" class="host">${host}</text>`
    +`<text x="${RW}" y="0" class="tag" text-anchor="end">${tag}</text>`
    +`</g>`;
});

const stats=[['49.4','MB','SOURCE'],['93.2','%','TYPESCRIPT'],['1,476','','CONTRIBUTIONS'],['35','','REPOSITORIES']];
let rail='';
stats.forEach(([n,u,l],i)=>{
  const x=PAD+i*Math.floor((W-PAD*2)/4);
  rail+=`<text x="${x}" y="${H-34}" class="sn">${n}<tspan class="su">${u}</tspan></text>`
      +`<text x="${x}" y="${H-16}" class="sl">${l}</text>`;
});

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="JD, founder and architect at Black Wires, Miami. Five products: rexvet.org, greenbits.ai, seowires.com, rexsailing.com, blackwires.com. 49.4 MB of source, 93.2 percent TypeScript, 1,476 contributions, 35 repositories.">
<defs>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#3fb950"/><stop offset="0.55" stop-color="#2ea043"/><stop offset="1" stop-color="#1f6feb"/>
  </linearGradient>
  <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse">
    <path d="M34 0H0V34" fill="none" stroke="#1b2129" stroke-width="1"/>
  </pattern>
</defs>
<style>
  .eyebrow{font:500 10.5px ${FONT};fill:#7d8590;letter-spacing:.19em}
  .name{font:700 54px ${SANS};fill:#e6edf3;letter-spacing:-.02em}
  .handle{font:400 14px ${FONT};fill:#6e7681}
  .role{font:600 11.5px ${FONT};fill:#3fb950;letter-spacing:.17em}
  .lede{font:400 13.5px ${SANS};fill:#9aa4b0}
  .host{font:500 13px ${FONT};fill:#c9d1d9}
  .tag{font:400 9.5px ${FONT};fill:#6e7681;letter-spacing:.11em}
  .sn{font:600 25px ${FONT};fill:#e6edf3}
  .su{font:600 13px ${FONT};fill:#3fb950}
  .sl{font:400 9.5px ${FONT};fill:#6e7681;letter-spacing:.15em}
  .div{stroke:#21262d;stroke-width:1}
</style>
<rect width="${W}" height="${H}" rx="16" fill="#0d1117"/>
<rect width="${W}" height="${H}" rx="16" fill="url(#grid)" opacity="0.85"/>
<rect x="0" y="0" width="${W}" height="4" rx="2" fill="url(#edge)"/>
<rect x="0.5" y="0.5" width="${W-1}" height="${H-1}" rx="15.5" fill="none" stroke="#30363d"/>

<text x="${PAD}" y="52" class="eyebrow">BLACK WIRES &#183; MIAMI, FLORIDA</text>
<text x="${PAD}" y="112" class="name">JD<tspan class="handle" dx="14">@jdrexxxx</tspan></text>
<text x="${PAD}" y="138" class="role">FOUNDER &#183; ARCHITECT &#183; OPERATOR</text>
<text x="${PAD}" y="178" class="lede">Five companies run on software I own and operate:</text>
<text x="${PAD}" y="198" class="lede">a nonprofit vet-telehealth platform, an AI video</text>
<text x="${PAD}" y="218" class="lede">studio, and an SEO content engine.</text>

<line x1="${RX-30}" y1="76" x2="${RX-30}" y2="238" class="div"/>
<text x="${RX}" y="76" class="eyebrow">IN PRODUCTION</text>
${rows}

<line x1="${PAD}" y1="${H-64}" x2="${W-PAD}" y2="${H-64}" class="div"/>
${rail}
</svg>`;
fs.writeFileSync(__dirname+'/banner.svg',svg);
console.log('wrote banner.svg',svg.length,'bytes',W+'x'+H);
