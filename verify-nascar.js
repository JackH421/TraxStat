#!/usr/bin/env node
// verify-nascar.js — NASCAR Cup data integrity checks for TraxStat's
// index.html. See CLAUDE.md "Automated checks" for spec.
//
// Reads index.html, extracts the four hardcoded Cup constants by
// brace-counting their literal expressions, evals them, and runs three
// categories of consistency checks. Exit 0 on pass, 1 on any failure
// so it composes with shell scripts and skills.

const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, 'index.html');
const source = fs.readFileSync(HTML_PATH, 'utf8');

// ── Extraction ────────────────────────────────────────────────────────────────
// (Same brace-counting strategy as verify.js. Duplicated here on purpose —
// only ~30 lines, and we want each verify script to be a self-contained
// single-file Node program with no shared internal modules.)
function extractConst(src, name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*`);
  const m = src.match(re);
  if (!m) throw new Error(`Constant ${name} not found in index.html`);
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
console.log('');

if (errors.length === 0) {
  console.log('All checks passed.');
  process.exit(0);
}

console.log(`${errors.length} error${errors.length === 1 ? '' : 's'}:`);
for (const e of errors) console.log(`  [${e.cat}] ${e.msg}`);
process.exit(1);
