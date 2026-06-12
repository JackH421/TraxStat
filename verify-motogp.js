#!/usr/bin/env node
// verify-motogp.js — MotoGP data integrity checks for TraxStat.
// Written BEFORE js/series/motogp.js per the design-first rule
// (docs/series-data-models.md). Modeled on verify.js / verify-nascar.js.
// Exit 0 on pass, 1 on any failure.

const fs = require('fs');
const path = require('path');

const SOURCE_PATH = path.join(__dirname, 'js', 'series', 'motogp.js');
const source = fs.readFileSync(SOURCE_PATH, 'utf8');

// ── Extraction (same brace-counting strategy as verify.js, duplicated on
// purpose — each verify script is self-contained) ─────────────────────────────
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
  let depth = 0, inString = null, escaped = false;
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
  // eslint-disable-next-line no-eval
  return eval(`(${extractConst(source, name)})`);
}

const MOTOGP_RIDERS       = loadConst('MOTOGP_RIDERS');
const MOTOGP_SCHEDULE     = loadConst('MOTOGP_SCHEDULE');
const MOTOGP_RESULTS      = loadConst('MOTOGP_RESULTS');
const MOTOGP_STANDINGS    = loadConst('MOTOGP_STANDINGS');
const MOTOGP_CONSTRUCTORS = loadConst('MOTOGP_CONSTRUCTORS');

const roster = new Set(Object.keys(MOTOGP_RIDERS));
const errors = [];
const note = (cat, msg) => errors.push({ cat, msg });

// ── Check 1: schedule integrity ───────────────────────────────────────────────
const schedChecks = { pass: 0, fail: 0, total: MOTOGP_SCHEDULE.length };
let prevDate = '0000-00-00';
MOTOGP_SCHEDULE.forEach((row, i) => {
  const expectedRound = i + 1;
  const problems = [];
  if (row.round !== expectedRound) problems.push(`round=${row.round}, expected ${expectedRound}`);
  if (!row.gp) problems.push('missing gp');
  if (!row.circuit) problems.push('missing circuit');
  if (!row.country) problems.push('missing country');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date || '')) problems.push(`bad date "${row.date}"`);
  else if (row.date < prevDate) problems.push(`date ${row.date} earlier than previous ${prevDate}`);
  if (row.date) prevDate = row.date;
  if (problems.length) {
    note('schedule', `R${row.round || expectedRound}: ${problems.join('; ')}`);
    schedChecks.fail++;
  } else {
    schedChecks.pass++;
  }
});

// ── Check 2: results integrity + rider references ─────────────────────────────
// Round exists in schedule; GP winner present; every rider name referenced
// (sprintWinner/winner/p2/p3/pole — null allowed except winner) is in the roster.
const resultChecks = { pass: 0, fail: 0, total: 0 };
const scheduleRounds = new Set(MOTOGP_SCHEDULE.map(r => r.round));
function checkRef(name, where) {
  resultChecks.total++;
  if (!roster.has(name)) {
    note('references', `'${name}' referenced in ${where} but not in MOTOGP_RIDERS`);
    resultChecks.fail++;
  } else {
    resultChecks.pass++;
  }
}
for (const round in MOTOGP_RESULTS) {
  const r = MOTOGP_RESULTS[round];
  resultChecks.total++;
  if (!scheduleRounds.has(parseInt(round))) {
    note('results', `Result round ${round} not in MOTOGP_SCHEDULE`);
    resultChecks.fail++;
  } else {
    resultChecks.pass++;
  }
  resultChecks.total++;
  if (!r.winner) {
    note('results', `Round ${round} has no GP winner — completed rounds must name a verified winner`);
    resultChecks.fail++;
  } else {
    resultChecks.pass++;
  }
  for (const f of ['sprintWinner', 'winner', 'p2', 'p3', 'pole']) {
    if (r[f]) checkRef(r[f], `MOTOGP_RESULTS[${round}].${f}`);
  }
}

// ── Check 3: riders' standings math + references ──────────────────────────────
const standChecks = { pass: 0, fail: 0, total: MOTOGP_STANDINGS.length };
const leader = MOTOGP_STANDINGS[0];
let prevPts = Infinity;
MOTOGP_STANDINGS.forEach((row, i) => {
  const problems = [];
  if (row.pos !== i + 1) problems.push(`pos=${row.pos}, expected ${i + 1}`);
  const expectedGap = row.points - leader.points;
  if (row.gap !== expectedGap) problems.push(`gap=${row.gap}, expected ${expectedGap}`);
  if (row.points > prevPts) problems.push(`points ${row.points} greater than previous row ${prevPts}`);
  prevPts = row.points;
  if (!roster.has(row.rider)) problems.push(`'${row.rider}' not in MOTOGP_RIDERS`);
  if (problems.length) {
    note('standings', `${row.rider} (P${row.pos}): ${problems.join('; ')}`);
    standChecks.fail++;
  } else {
    standChecks.pass++;
  }
});

// ── Check 4: constructors' standings math ─────────────────────────────────────
// As published by motogp.com — not derivable from winners alone, so only
// internal consistency is checked (ordering + gap math).
const conChecks = { pass: 0, fail: 0, total: MOTOGP_CONSTRUCTORS.length };
const conLeader = MOTOGP_CONSTRUCTORS[0];
prevPts = Infinity;
MOTOGP_CONSTRUCTORS.forEach((row, i) => {
  const problems = [];
  if (row.pos !== i + 1) problems.push(`pos=${row.pos}, expected ${i + 1}`);
  const expectedGap = row.points - conLeader.points;
  if (row.gap !== expectedGap) problems.push(`gap=${row.gap}, expected ${expectedGap}`);
  if (row.points > prevPts) problems.push(`points ${row.points} greater than previous row ${prevPts}`);
  prevPts = row.points;
  if (problems.length) {
    note('constructors', `${row.constructor} (P${row.pos}): ${problems.join('; ')}`);
    conChecks.fail++;
  } else {
    conChecks.pass++;
  }
});

// ── Report ────────────────────────────────────────────────────────────────────
const fmt = (chk, label) => {
  const ok = chk.fail === 0;
  return `${ok ? '✓' : '✗'} ${label}: ${chk.pass}/${chk.total} ${ok ? 'pass' : `pass, ${chk.fail} fail`}`;
};
console.log('MotoGP data verification (verify-motogp.js)');
console.log('============================================');
console.log(fmt(schedChecks,  'Schedule integrity   '));
console.log(fmt(resultChecks, 'Results + references '));
console.log(fmt(standChecks,  'Riders standings math'));
console.log(fmt(conChecks,    'Constructors math    '));
console.log('');
if (errors.length === 0) {
  console.log('All checks passed.');
  process.exit(0);
}
console.log(`${errors.length} error${errors.length === 1 ? '' : 's'}:`);
for (const e of errors) console.log(`  [${e.cat}] ${e.msg}`);
process.exit(1);
