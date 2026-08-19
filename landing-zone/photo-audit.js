const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = 'c:/jf-devops/maple-ridge-music-program';
const PICS = path.join(ROOT, 'intrument-pics');

const onDisk = fs.readdirSync(PICS).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
const timeKey = f => (f.match(/^PXL_\d{8}_(\d{9})/) || [])[1] || null;

const byTime = new Map();
for (const f of onDisk) {
  const t = timeKey(f);
  if (!t) continue;
  if (!byTime.has(t)) byTime.set(t, []);
  byTime.get(t).push(f);
}

// ---- gather every markdown doc in the repo (working tree) ----
const walk = (dir, acc = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.md$/i.test(e.name)) acc.push(p);
  }
  return acc;
};
const docs = walk(ROOT).map(p => ({
  name: path.relative(ROOT, p).replace(/\\/g, '/'),
  text: fs.readFileSync(p, 'utf8'),
}));

// ---- plus every version of every markdown file ever committed ----
let gitBlobs = '';
try {
  const files = execSync('git log --pretty=format: --name-only --diff-filter=AM -- "*.md"',
    { cwd: ROOT, maxBuffer: 1 << 28 }).toString()
    .split('\n').map(s => s.trim()).filter(Boolean);
  const uniq = [...new Set(files)];
  const revs = execSync('git rev-list --all', { cwd: ROOT, maxBuffer: 1 << 28 })
    .toString().split('\n').filter(Boolean);
  for (const rev of revs) {
    for (const f of uniq) {
      try {
        gitBlobs += execSync(`git show ${rev}:"${f}"`,
          { cwd: ROOT, maxBuffer: 1 << 26, stdio: ['ignore','pipe','ignore'] }).toString() + '\n';
      } catch { /* file absent at that rev */ }
    }
  }
} catch (e) {
  gitBlobs = '';
  console.error('git history scan skipped:', e.message.split('\n')[0]);
}
if (gitBlobs) docs.push({ name: '<git history>', text: gitBlobs });

// ---- extract references ----
const referenced = new Map();
const addRef = (k, d) => {
  if (!referenced.has(k)) referenced.set(k, new Set());
  referenced.get(k).add(d);
};

const FILE_RE = /\b(PXL_\d{8}_\d{9}[\w.\-~()]*\.jpg|1000\d{6}\.jpg|Screenshot_[\d-]+\.png|\d{8}_\d{6}-COLLAGE\.jpg)\b/gi;

for (const { name, text } of docs) {
  for (const m of text.matchAll(FILE_RE)) addRef(m[1], name);
  for (const m of text.matchAll(/\b(\d{9})\b/g)) addRef(m[1], name);
}

const resolved = new Map();   // file -> Set(docs that mention it)
const missing = [];

const markResolved = (f, d) => {
  if (!resolved.has(f)) resolved.set(f, new Set());
  d.forEach(x => resolved.get(f).add(x));
};

for (const [ref, docsFor] of referenced) {
  if (/^\d{9}$/.test(ref)) {
    if (byTime.has(ref)) byTime.get(ref).forEach(f => markResolved(f, docsFor));
    continue;
  }
  if (onDisk.includes(ref)) { markResolved(ref, docsFor); continue; }
  const t = timeKey(ref);
  if (t && byTime.has(t)) { byTime.get(t).forEach(f => markResolved(f, docsFor)); continue; }
  missing.push({ ref, docs: [...docsFor].join(', ') });
}

const orphans = onDisk.filter(f => !resolved.has(f));

// orphan clusters
const clusters = new Map();
for (const f of orphans) {
  const m = f.match(/^PXL_(\d{8})_(\d{2})/);
  const key = m ? `${m[1]} ${m[2]}h` : 'non-PXL';
  clusters.set(key, (clusters.get(key) || 0) + 1);
}

// which docs rescued the most files (i.e. where the real index lives)
const docHits = new Map();
for (const [, ds] of resolved) for (const d of ds) docHits.set(d, (docHits.get(d) || 0) + 1);

const out = [];
out.push(`FILES ON DISK ................. ${onDisk.length}`);
out.push(`REFERENCED SOMEWHERE .......... ${resolved.size}   (${(resolved.size/onDisk.length*100).toFixed(0)}%)`);
out.push(`ORPHANS ....................... ${orphans.length}   (${(orphans.length/onDisk.length*100).toFixed(0)}%)`);
out.push(`REFERENCED BUT MISSING ........ ${missing.length}`);
out.push(`DOCS SCANNED .................. ${docs.length}`);
out.push('');
out.push('=== REFERENCED BUT MISSING FROM DISK ===');
for (const m of missing.sort((a,b)=>a.ref.localeCompare(b.ref))) {
  out.push(`  ${m.ref.padEnd(34)} ${m.docs.slice(0, 110)}`);
}
out.push('');
out.push('=== TOP SOURCES OF PHOTO REFERENCES ===');
for (const [d, n] of [...docHits.entries()].sort((a,b)=>b[1]-a[1]).slice(0, 20)) {
  out.push(`  ${String(n).padStart(4)}  ${d}`);
}
out.push('');
out.push('=== REMAINING ORPHANS BY SHOOT HOUR ===');
for (const [k, n] of [...clusters.entries()].sort()) out.push(`  ${k}  n=${n}`);

fs.writeFileSync(path.join(__dirname, 'orphans.txt'), orphans.join('\n'));
console.log(out.join('\n'));
