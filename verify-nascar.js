#!/usr/bin/env node
// verify-nascar.js — NASCAR Cup data integrity checks for TraxStat.
// See CLAUDE.md "Automated checks" for spec.
//
// Reads js/series/nascar.js, extracts the four hardcoded Cup constants
// by brace-counting their literal expressions, evals them, and runs three
// categories of consistency checks. Exit 0 on pass, 1 on any failure
// so it composes with shell scripts and skills.

const fs = require('fs');
const path = require('path');

const SOURCE_PATH = path.join(__dirname, 'js', 'series', 'nascar.js');
const XFINITY_PATH = path.join(__dirname, 'js', 'series', 'nascar-xfinity.js');
const source = fs.readFileSync(SOURCE_PATH, 'utf8');
const xfinitySource = fs.existsSync(XFINITY_PATH) ? fs.readFileSync(XFINITY_PATH, 'utf8') : null;

// ── Extraction ────────────────────────────────────────────────────────────────
// (Same brace-counting strategy as verify.js. Duplicated here on purpose —
// only ~30 lines, and we want each verify script to be a self-contained
// single-file Node program with no shared internal modules.)
function extractConst(src, name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*`);
  const m = src.match(re);
  if (!m) throw new Error(`Constant ${name} not found in ${SOURCE_PATH}`);
  let i = m.index + m[0].length;
  const open = src[i];
  if (open !== '{' && open !== '[') {
    throw new Error(`Expected { or [ after const ${name}=, got ${open}`);
  }
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inString = null;
  let escaped = false;
  const start = i;
  for (; i < src.length; i++) {
    const c = src[i];
    if (escaped) { escaped = false; continue; }
    if (inString) {
      if (c === '\\') { escaped = true; continue; }
      if (c === inString) inString = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inString = c; continue; }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error(`Unterminated literal for ${name}`);
}

function loadConst(name) {
  const literal = extractConst(source, name);
  // eslint-disable-next-line no-eval
  return eval(`(${literal})`);
}

function loadXfinityConst(name) {
  if (!xfinitySource) return null;
  const literal = extractConst(xfinitySource, name);
  // eslint-disable-next-line no-eval
  return eval(`(${literal})`);
}

const NASCAR_CUP_DRIVERS   = loadConst('NASCAR_CUP_DRIVERS');
const NASCAR_CUP_RESULTS   = loadConst('NASCAR_CUP_RESULTS');
const NASCAR_CUP_STANDINGS = loadConst('NASCAR_CUP_STANDINGS');
const NASCAR_CUP_MFRS      = loadConst('NASCAR_CUP_MFRS');

const driverRoster = new Set(Object.keys(NASCAR_CUP_DRIVERS));
const errors = [];
const note = (cat, msg) => errors.push({ cat, msg });

// ── Check 1: winners → manufacturer wins tally ────────────────────────────────
// Count each race winner's manufacturer (via NASCAR_CUP_DRIVERS lookup) and
// confirm the totals match NASCAR_CUP_MFRS.wins exactly.
const tallyChecks = { pass: 0, fail: 0, total: NASCAR_CUP_MFRS.length };
const computedWins = {};
for (const round in NASCAR_CUP_RESULTS) {
  const winner = NASCAR_CUP_RESULTS[round].winner;
  if (!winner) continue;
  const drv = NASCAR_CUP_DRIVERS[winner];
  if (!drv) continue; // Check 3 will flag unknown winner names
  computedWins[drv.mfr] = (computedWins[drv.mfr] || 0) + 1;
}
for (const m of NASCAR_CUP_MFRS) {
  const computed = computedWins[m.mfr] || 0;
  if (computed !== m.wins) {
    note('mfr-tally', `${m.mfr}: NASCAR_CUP_MFRS says ${m.wins} wins; computed from race winners = ${computed}`);
    tallyChecks.fail++;
  } else {
    tallyChecks.pass++;
  }
}
// Catch a manufacturer that has computed wins but isn't even listed in NASCAR_CUP_MFRS
for (const mfr in computedWins) {
  if (!NASCAR_CUP_MFRS.some(m => m.mfr === mfr)) {
    note('mfr-tally', `${mfr} has ${computedWins[mfr]} computed wins but isn't in NASCAR_CUP_MFRS at all`);
    tallyChecks.fail++;
    tallyChecks.total++;
  }
}

// ── Check 2: standings gap math ───────────────────────────────────────────────
// gap = row.points - leader.points (so P1 gap is 0; all others are negative).
const gapChecks = { pass: 0, fail: 0, total: NASCAR_CUP_STANDINGS.length };
const leader = NASCAR_CUP_STANDINGS[0];
for (const row of NASCAR_CUP_STANDINGS) {
  const expectedGap = row.points - leader.points;
  if (row.gap !== expectedGap) {
    note('gaps', `${row.driver} (P${row.pos}): gap=${row.gap}; expected ${expectedGap} (leader ${leader.points} − row ${row.points})`);
    gapChecks.fail++;
  } else {
    gapChecks.pass++;
  }
}

// ── Check 3: every driver name referenced exists in the roster ────────────────
const refChecks = { pass: 0, fail: 0, total: 0 };
function checkRef(name, where) {
  refChecks.total++;
  if (!driverRoster.has(name)) {
    note('references', `'${name}' referenced in ${where} but not in NASCAR_CUP_DRIVERS`);
    refChecks.fail++;
  } else {
    refChecks.pass++;
  }
}
// Results: winner / p2 / p3 / polePos / stage1 / stage2 (each may be null)
const RESULT_FIELDS = ['winner', 'p2', 'p3', 'polePos', 'stage1', 'stage2'];
for (const round in NASCAR_CUP_RESULTS) {
  const r = NASCAR_CUP_RESULTS[round];
  for (const f of RESULT_FIELDS) {
    if (r[f]) checkRef(r[f], `NASCAR_CUP_RESULTS[${round}].${f}`);
  }
}
// Standings: every row.driver
for (const row of NASCAR_CUP_STANDINGS) {
  checkRef(row.driver, `NASCAR_CUP_STANDINGS[P${row.pos}]`);
}
// Mfrs.drivers: entries may be 'Reddick (5)' or plain 'Hamlin'. Strip the
// trailing " (N)" win-count suffix before checking.
for (const m of NASCAR_CUP_MFRS) {
  for (const entry of m.drivers || []) {
    const name = entry.replace(/\s*\(\d+\)\s*$/, '').trim();
    checkRef(name, `NASCAR_CUP_MFRS[${m.mfr}].drivers`);
  }
}

// ── Check 4: sibling-series integrity (Xfinity Phase 2 + Trucks) ──────────────
// Mirrors Checks 1-3 against the NASCAR_XFINITY_* and NASCAR_TRUCKS_*
// constants: schedule shape, winner→mfr tally, standings gap math + ordering,
// and roster reference integrity.
const TRUCKS_PATH = path.join(__dirname, 'js', 'series', 'nascar-trucks.js');
const trucksSource = fs.existsSync(TRUCKS_PATH) ? fs.readFileSync(TRUCKS_PATH, 'utf8') : null;
function loadTrucksConst(name) {
  if (!trucksSource) return null;
  // eslint-disable-next-line no-eval
  return eval(`(${extractConst(trucksSource, name)})`);
}

function checkSiblingSeries(label, drivers, schedule, results, standings, mfrs) {
  const chk = { pass: 0, fail: 0, total: 0 };
  const sibRoster = new Set(Object.keys(drivers));
  // Schedule shape
  let prevDate = '0000-00-00';
  schedule.forEach((row, i) => {
    chk.total++;
    const expectedRound = i + 1;
    const problems = [];
    if (row.round !== expectedRound) problems.push(`round=${row.round}, expected ${expectedRound}`);
    if (!row.race) problems.push('missing race');
    if (!row.track) problems.push('missing track');
    if (!row.country) problems.push('missing country');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date || '')) problems.push(`bad date "${row.date}"`);
    else if (row.date < prevDate) problems.push(`date ${row.date} earlier than previous ${prevDate}`);
    if (row.date) prevDate = row.date;
    if (problems.length) { note(`${label}-schedule`, `R${row.round || expectedRound}: ${problems.join('; ')}`); chk.fail++; }
    else chk.pass++;
  });
  // Winner → mfr tally
  const computed = {};
  for (const round in results) {
    const w = results[round].winner;
    const drv = w && drivers[w];
    if (drv && drv.mfr && drv.mfr !== '—') computed[drv.mfr] = (computed[drv.mfr] || 0) + 1;
  }
  for (const m of mfrs) {
    chk.total++;
    const c = computed[m.mfr] || 0;
    if (c !== m.wins) { note(`${label}-mfr-tally`, `${m.mfr}: listed ${m.wins} wins; computed ${c}`); chk.fail++; }
    else chk.pass++;
  }
  for (const mfr in computed) {
    if (!mfrs.some(m => m.mfr === mfr)) {
      chk.total++; chk.fail++;
      note(`${label}-mfr-tally`, `${mfr} has ${computed[mfr]} computed wins but isn't listed`);
    }
  }
  // Standings gap math + ordering + roster refs
  if (standings.length) {
    const lead = standings[0];
    let prevPts = Infinity;
    standings.forEach((row, i) => {
      chk.total++;
      const problems = [];
      if (row.pos !== i + 1) problems.push(`pos=${row.pos}, expected ${i + 1}`);
      if (row.gap !== row.points - lead.points) problems.push(`gap=${row.gap}, expected ${row.points - lead.points}`);
      if (row.points > prevPts) problems.push(`points ${row.points} greater than previous ${prevPts}`);
      prevPts = row.points;
      if (!sibRoster.has(row.driver)) problems.push(`'${row.driver}' not in roster`);
      if (problems.length) { note(`${label}-standings`, `${row.driver} (P${row.pos}): ${problems.join('; ')}`); chk.fail++; }
      else chk.pass++;
    });
  }
  // Results references (winner/p2/p3/polePos)
  for (const round in results) {
    const r = results[round];
    for (const f of ['winner', 'p2', 'p3', 'polePos']) {
      if (r[f]) {
        chk.total++;
        if (!sibRoster.has(r[f])) { note(`${label}-references`, `'${r[f]}' in results[${round}].${f} not in roster`); chk.fail++; }
        else chk.pass++;
      }
    }
  }
  return chk;
}

let xfinityChecks = { pass: 0, fail: 0, total: 0 };
if (xfinitySource) {
  xfinityChecks = checkSiblingSeries('xfinity',
    loadXfinityConst('NASCAR_XFINITY_DRIVERS') || {},
    loadXfinityConst('NASCAR_XFINITY_SCHEDULE') || [],
    loadXfinityConst('NASCAR_XFINITY_RESULTS') || {},
    loadXfinityConst('NASCAR_XFINITY_STANDINGS') || [],
    loadXfinityConst('NASCAR_XFINITY_MFRS') || []);
}
let trucksChecks = { pass: 0, fail: 0, total: 0 };
if (trucksSource) {
  trucksChecks = checkSiblingSeries('trucks',
    loadTrucksConst('NASCAR_TRUCKS_DRIVERS') || {},
    loadTrucksConst('NASCAR_TRUCKS_SCHEDULE') || [],
    loadTrucksConst('NASCAR_TRUCKS_RESULTS') || {},
    loadTrucksConst('NASCAR_TRUCKS_STANDINGS') || [],
    loadTrucksConst('NASCAR_TRUCKS_MFRS') || []);
}

// ── Report ────────────────────────────────────────────────────────────────────
const fmt = (chk, label) => {
  const ok = chk.fail === 0;
  const icon = ok ? '✓' : '✗';
  return `${icon} ${label}: ${chk.pass}/${chk.total} ${ok ? 'pass' : `pass, ${chk.fail} fail`}`;
};

console.log('NASCAR Cup data verification (verify-nascar.js)');
console.log('================================================');
console.log(fmt(tallyChecks, 'Winner → mfr wins tally'));
console.log(fmt(gapChecks,   'Standings gap math      '));
console.log(fmt(refChecks,   'Driver references       '));
if (xfinitySource) {
  console.log(fmt(xfinityChecks, 'Xfinity (full)          '));
}
if (trucksSource) {
  console.log(fmt(trucksChecks, 'Trucks (full)           '));
}
console.log('');

if (errors.length === 0) {
  console.log('All checks passed.');
  process.exit(0);
}

console.log(`${errors.length} error${errors.length === 1 ? '' : 's'}:`);
for (const e of errors) console.log(`  [${e.cat}] ${e.msg}`);
process.exit(1);
