const { execFileSync } = require('child_process');
const gh = (p) => JSON.parse(execFileSync('gh', ['api', p, '--paginate'], {maxBuffer: 1<<28, encoding:'utf8'}));
const ghq = (q, vars={}) => {
  const args = ['api','graphql','-f',`query=${q}`];
  for (const [k,v] of Object.entries(vars)) args.push('-F', `${k}=${v}`);
  return JSON.parse(execFileSync('gh', args, {maxBuffer: 1<<28, encoding:'utf8'}));
};

const repos = [];
for (const p of ['user/repos?per_page=100&affiliation=owner,organization_member,collaborator']) {
  try { repos.push(...gh(p)); } catch(e){ console.error('ERR',e.message); }
}
const uniq = new Map(repos.map(r=>[r.full_name,r]));
console.log('REPO COUNT', uniq.size);

const langTotals = {};
let totalBytes = 0;
const perRepo = [];
for (const r of uniq.values()) {
  let langs = {};
  try { langs = gh(`repos/${r.full_name}/languages`); } catch(e){}
  let sum = 0;
  for (const [l,b] of Object.entries(langs)) { langTotals[l]=(langTotals[l]||0)+b; totalBytes+=b; sum+=b; }
  perRepo.push({name:r.full_name, private:r.private, size:r.size, bytes:sum, created:r.created_at, pushed:r.pushed_at, lang:r.language});
}
const sorted = Object.entries(langTotals).sort((a,b)=>b[1]-a[1]);
console.log('\n=== LANGUAGES (bytes) total', totalBytes.toLocaleString());
for (const [l,b] of sorted.slice(0,20)) console.log(`${l.padEnd(20)} ${String(b).padStart(12)}  ${(b/totalBytes*100).toFixed(2)}%`);

console.log('\n=== PER REPO ===');
perRepo.sort((a,b)=>b.bytes-a.bytes).forEach(r=>console.log(`${r.private?'priv':'PUB '} ${r.name.padEnd(45)} ${String(r.bytes).padStart(10)}b  ${String(r.size).padStart(8)}kb  created ${r.created.slice(0,10)} pushed ${r.pushed.slice(0,10)}`));
require('fs').writeFileSync(process.argv[2]||'out.json', JSON.stringify({langTotals, totalBytes, perRepo, repoCount:uniq.size}, null, 2));
