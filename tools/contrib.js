const { execFileSync } = require('child_process');
const q = `query($from:DateTime!,$to:DateTime!){viewer{login createdAt contributionsCollection(from:$from,to:$to){totalCommitContributions totalPullRequestContributions totalIssueContributions totalPullRequestReviewContributions totalRepositoriesWithContributedCommits restrictedContributionsCount contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
const run=(from,to)=>JSON.parse(execFileSync('gh',['api','graphql','-f',`query=${q}`,'-F',`from=${from}`,'-F',`to=${to}`],{encoding:'utf8',maxBuffer:1<<26}));
const ranges=[['2024-06-20T00:00:00Z','2025-06-19T23:59:59Z'],['2025-06-20T00:00:00Z','2026-06-19T23:59:59Z'],['2026-06-20T00:00:00Z','2026-09-09T23:59:59Z']];
let tot={commits:0,prs:0,issues:0,reviews:0,cal:0,restricted:0}; const days=[];
for(const [f,t] of ranges){
  const c=run(f,t).data.viewer.contributionsCollection;
  console.log(`${f.slice(0,10)} → ${t.slice(0,10)}  commits=${c.totalCommitContributions} prs=${c.totalPullRequestContributions} issues=${c.totalIssueContributions} reviews=${c.totalPullRequestReviewContributions} repos=${c.totalRepositoriesWithContributedCommits} restricted=${c.restrictedContributionsCount} calendarTotal=${c.contributionCalendar.totalContributions}`);
  tot.commits+=c.totalCommitContributions; tot.prs+=c.totalPullRequestContributions; tot.issues+=c.totalIssueContributions; tot.reviews+=c.totalPullRequestReviewContributions; tot.cal+=c.contributionCalendar.totalContributions; tot.restricted+=c.restrictedContributionsCount;
  c.contributionCalendar.weeks.forEach(w=>w.contributionDays.forEach(d=>days.push(d)));
}
console.log('\nTOTALS', JSON.stringify(tot));
const active=days.filter(d=>d.contributionCount>0);
console.log('active days:',active.length,'of',days.length);
// longest streak
let best=0,cur=0,bestEnd=null; const sd=[...days].sort((a,b)=>a.date<b.date?-1:1);
for(const d of sd){ if(d.contributionCount>0){cur++; if(cur>best){best=cur;bestEnd=d.date;}} else cur=0; }
console.log('longest streak:',best,'ending',bestEnd);
// current streak
let c2=0; for(let i=sd.length-1;i>=0;i--){ if(sd[i].contributionCount>0)c2++; else if(i<sd.length-1) break; }
console.log('current streak:',c2);
const busiest=[...active].sort((a,b)=>b.contributionCount-a.contributionCount).slice(0,5);
console.log('busiest days:',busiest.map(d=>`${d.date}:${d.contributionCount}`).join(' '));
require('fs').writeFileSync('contrib.json',JSON.stringify({tot,days:sd,best,bestEnd,current:c2,activeDays:active.length},null,2));
