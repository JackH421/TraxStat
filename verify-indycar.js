#!/usr/bin/env node
// verify-indycar.js — IndyCar data integrity checks for TraxStat.
// Written BEFORE js/series/indycar.js per the design-first rule
// (docs/series-data-models.md). Modeled on verify.js / verify-nascar.js.
//
// Reads js/series/indycar.js, extracts the hardcoded constants by
// brace-counting their literal expressions, evals them, and runs
// consistency checks. Exit 0 on pass, 1 on any failure.

const fs = require('fs');
const path = require('path');

const SOURCE_PATH = path.join(__dirname, 'js', 'series', 'indycar.js');
const source = fs.readFileSync(SOURCE_PATH, 'utf8');

// ── Extraction ────────────────────────────────────────────────────────────────
// (Same brace-counting strategy as verify.js. Duplicated on purpose — each
// verify script is a self-contained single-file Node program.)
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

const INDYCAR_DRIVERS     = loadConst('INDYCAR_DRIVERS');
const INDYCAR_SCHEDULE    = loadConst('INDYCAR_SCHEDULE');
const INDYCAR_RESULTS     = loadConst('INDYCAR_RESULTS');
const INDYCAR_STANDINGS   = loadConst('INDYCAR_STANDINGS');
const INDYCAR_ENGINE_WINS = loadConst('INDYCAR_ENGINE_WINS');

const roster = new Set(Object.keys(INDYCAR_DRIVERS));
const errors = [];
const note = (cat, msg) => errors.push({ cat, msg });

// ── Check 1: schedule integrity ───────────────────────────────────────────────
// Rounds sequential 1..N, required fields present, dates valid + ascending,
// type (when present) one of O/R/S, engine values sane in the roster.
const schedChecks = { pass: 0, fail: 0, total: INDYCAR_SCHEDULE.length };
let prevDate = '0000-00-00';
INDYCAR_SCHEDULE.forEach((row, i) => {
  const expectedRound = i + 1;
  const problems = [];
  if (row.round !== expectedRound) problems.push(`round=${row.round}, expected ${expectedRound}`);
  if (!row.race) problems.push('missing race');
  if (!row.track) problems.push('missing track');
  if (!row.country) problems.push('missing country');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date || '')) problems.push(`bad date "${row.date}"`);
  else if (row.date < prevDate) problems.push(`date ${row.date} earlier than previous ${prevDate}`);
  if (row.date) prevDate = row.date;
  if (row.type && !['O', 'R', 'S'].includes(row.type)) problems.push(`bad type "${row.type}"`);
  if (problems.length) {
    note('schedule', `R${row.round || expectedRound}: ${problems.join('; ')}`);
    schedChecks.fail++;
  } else {
    schedChecks.pass++;
  }
});

// ── Check 2: results integrity ────────────────────────────────────────────────
// Every result round exists in the schedule; winner is present; every driver
// name referenced (winner/p2/p3/pole — null allowed for all but winner)
// exists in INDYCAR_DRIVERS.
const resultChecks = { pass: 0, fail: 0, total: 0 };
const scheduleRounds = new Set(INDYCAR_SCHEDULE.map(r => r.round));
function checkRef(name, where) {
  resultChecks.total++;
  if (!roster.has(name)) {
    note('references', `'${name}' referenced in ${where} but not in INDYCAR_DRIVERS`);
    resultChecks.fail++;
  } else {
    resultChecks.pass++;
  }
}
for (const round in INDYCAR_RESULTS) {
  const r = INDYCAR_RESULTS[round];
  resultChecks.total++;
  if (!scheduleRounds.has(parseInt(round))) {
    note('results', `Result round ${round} not in INDYCAR_SCHEDULE`);
    resultChecks.fail++;
  } else {
    resultChecks.pass++;
  }
  resultChecks.total++;
  if (!r.winner) {
    note('results', `Round ${round} has no winner — completed rounds must name a verified winner`);
    resultChecks.fail++;
  } else {
    resultChecks.pass++;
  }
  for (const f of ['winner', 'p2', 'p3', 'pole']) {
    if (r[f]) checkRef(r[f], `INDYCAR_RESULTS[${round}].${f}`);
  }
}

// ── Check 3: standings gap math + ordering + references ──────────────────────
// gap = row.points - leader.points (P1 gap 0, others negative); points
// non-increasing down the table; every driver exists in the roster.
const standChecks = { pass: 0, fail: 0, total: INDYCAR_STANDINGS.length };
const leader = INDYCAR_STANDINGS[0];
let prevPts = Infinity;
INDYCAR_STANDINGS.forEach((row, i) => {
  const problems = [];
  if (row.pos !== i + 1) problems.push(`pos=${row.pos}, expected ${i + 1}`);
  const expectedGap = row.points - leader.points;
  if (row.gap !== expectedGap) problems.push(`gap=${row.gap}, expected ${expectedGap}`);
  if (row.points > prevPts) problems.push(`points ${row.points} greater than previous row ${prevPts}`);
  prevPts = row.points;
  if (!roster.has(row.driver)) problems.push(`'${row.driver}' not in INDYCAR_DRIVERS`);
  if (problems.length) {
    note('standings', `${row.driver} (P${row.pos}): ${problems.join('; ')}`);
    standChecks.fail++;
  } else {
    standChecks.pass++;
  }
});

// ── Check 4: engine wins tally ────────────────────────────────────────────────
// Count each race winner's engine (via INDYCAR_DRIVERS) and confirm the totals
// match INDYCAR_ENGINE_WINS exactly.
const tallyChecks = { pass: 0, fail: 0, total: INDYCAR_ENGINE_WINS.length };
const computedWins = {};
for (const round in INDYCAR_RESULTS) {
  const w = INDYCAR_RESULTS[round].winner;
  if (!w) continue;
  const drv = INDYCAR_DRIVERS[w];
  if (!drv) continue; // Check 2 flags unknown winners
  computedWins[drv.engine] = (computedWins[drv.engine] || 0) + 1;
}
for (const e of INDYCAR_ENGINE_WINS) {
  const computed = computedWins[e.engine] || 0;
  if (computed !== e.wins) {
    note('engine-tally', `${e.engine}: INDYCAR_ENGINE_WINS says ${e.wins}; computed from winners = ${computed}`);
    tallyChecks.fail++;
  } else {
    tallyChecks.pass++;
  }
}
for (const eng in computedWins) {
  if (!INDYCAR_ENGINE_WINS.some(e => e.engine === eng)) {
    note('engine-tally', `${eng} has ${computedWins[eng]} computed wins but isn't in INDYCAR_ENGINE_WINS`);
    tallyChecks.fail++;
    tallyChecks.total++;
  }
}

// ── Report ────────────────────────────────────────────────────────────────────
const fmt = (chk, label) => {
  const ok = chk.fail === 0;
  return `${ok ? '✓' : '✗'} ${label}: ${chk.pass}/${chk.total} ${ok ? 'pass' : `pass, ${chk.fail} fail`}`;
};

console.log('IndyCar data verification (verify-indycar.js)');
console.log('==============================================');
console.log(fmt(schedChecks,  'Schedule integrity   '));
console.log(fmt(resultChecks, 'Results + references '));
console.log(fmt(standChecks,  'Standings math       '));
console.log(fmt(tallyChecks,  'Engine wins tally    '));
console.log('');

if (errors.length === 0) {
  console.log('All checks passed.');
  process.exit(0);
}
console.log(`${errors.length} error${errors.length === 1 ? '' : 's'}:`);
for (const e of errors) console.log(`  [${e.cat}] ${e.msg}`);
process.exit(1);
