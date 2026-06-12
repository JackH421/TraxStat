#!/usr/bin/env node
// verify-wrc.js — WRC data integrity checks for TraxStat.
// Written BEFORE js/series/wrc.js per the design-first rule
// (docs/series-data-models.md). Modeled on verify.js / verify-nascar.js.
// Exit 0 on pass, 1 on any failure.

const fs = require('fs');
const path = require('path');

const SOURCE_PATH = path.join(__dirname, 'js', 'series', 'wrc.js');
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

const WRC_DRIVERS       = loadConst('WRC_DRIVERS');
const WRC_SCHEDULE      = loadConst('WRC_SCHEDULE');
const WRC_RESULTS       = loadConst('WRC_RESULTS');
const WRC_STANDINGS     = loadConst('WRC_STANDINGS');
const WRC_MFR_STANDINGS = loadConst('WRC_MFR_STANDINGS');

const roster = new Set(Object.keys(WRC_DRIVERS));
const errors = [];
const note = (cat, msg) => errors.push({ cat, msg });

// ── Check 1: schedule integrity ───────────────────────────────────────────────
const SURFACES = ['tarmac', 'gravel', 'snow', 'mixed'];
const schedChecks = { pass: 0, fail: 0, total: WRC_SCHEDULE.length };
let prevDate = '0000-00-00';
WRC_SCHEDULE.forEach((row, i) => {
  const expectedRound = i + 1;
  const problems = [];
  if (row.round !== expectedRound) problems.push(`round=${row.round}, expected ${expectedRound}`);
  if (!row.rally) problems.push('missing rally');
  if (!row.country) problems.push('missing country');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date || '')) problems.push(`bad date "${row.date}"`);
  else if (row.date < prevDate) problems.push(`date ${row.date} earlier than previous ${prevDate}`);
  if (row.date) prevDate = row.date;
  if (!SURFACES.includes(row.surface)) problems.push(`bad surface "${row.surface}"`);
  if (problems.length) {
    note('schedule', `R${row.round || expectedRound}: ${problems.join('; ')}`);
    schedChecks.fail++;
  } else {
    schedChecks.pass++;
  }
});

// ── Check 2: results integrity + driver references + power stage shape ────────
const resultChecks = { pass: 0, fail: 0, total: 0 };
const scheduleRounds = new Set(WRC_SCHEDULE.map(r => r.round));
function checkRef(name, where) {
  resultChecks.total++;
  if (!roster.has(name)) {
    note('references', `'${name}' referenced in ${where} but not in WRC_DRIVERS`);
    resultChecks.fail++;
  } else {
    resultChecks.pass++;
  }
}
for (const round in WRC_RESULTS) {
  const r = WRC_RESULTS[round];
  resultChecks.total++;
  if (!scheduleRounds.has(parseInt(round))) {
    note('results', `Result round ${round} not in WRC_SCHEDULE`);
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
  for (const f of ['winner', 'p2', 'p3']) {
    if (r[f]) checkRef(r[f], `WRC_RESULTS[${round}].${f}`);
  }
  if (r.stageWins) {
    for (const name in r.stageWins) checkRef(name, `WRC_RESULTS[${round}].stageWins`);
  }
  if (r.powerStage) {
    if (r.powerStage.winner) checkRef(r.powerStage.winner, `WRC_RESULTS[${round}].powerStage.winner`);
    if (r.powerStage.top5) {
      resultChecks.total++;
      if (!Array.isArray(r.powerStage.top5) || r.powerStage.top5.length > 5) {
        note('results', `Round ${round} powerStage.top5 must be an array of ≤5`);
        resultChecks.fail++;
      } else if (r.powerStage.top5[0] !== r.powerStage.winner) {
        note('results', `Round ${round} powerStage.top5[0] (${r.powerStage.top5[0]}) ≠ powerStage.winner (${r.powerStage.winner})`);
        resultChecks.fail++;
      } else {
        resultChecks.pass++;
      }
      r.powerStage.top5.forEach(n => checkRef(n, `WRC_RESULTS[${round}].powerStage.top5`));
    }
  }
}

// ── Check 3: drivers' standings math + references ─────────────────────────────
const standChecks = { pass: 0, fail: 0, total: WRC_STANDINGS.length };
const leader = WRC_STANDINGS[0];
let prevPts = Infinity;
WRC_STANDINGS.forEach((row, i) => {
  const problems = [];
  if (row.pos !== i + 1) problems.push(`pos=${row.pos}, expected ${i + 1}`);
  const expectedGap = row.points - leader.points;
  if (row.gap !== expectedGap) problems.push(`gap=${row.gap}, expected ${expectedGap}`);
  if (row.points > prevPts) problems.push(`points ${row.points} greater than previous row ${prevPts}`);
  prevPts = row.points;
  if (!roster.has(row.driver)) problems.push(`'${row.driver}' not in WRC_DRIVERS`);
  if (problems.length) {
    note('standings', `${row.driver} (P${row.pos}): ${problems.join('; ')}`);
    standChecks.fail++;
  } else {
    standChecks.pass++;
  }
});

// ── Check 4: manufacturers' standings math ────────────────────────────────────
const mfrChecks = { pass: 0, fail: 0, total: WRC_MFR_STANDINGS.length };
const mfrLeader = WRC_MFR_STANDINGS[0];
prevPts = Infinity;
WRC_MFR_STANDINGS.forEach((row, i) => {
  const problems = [];
  if (row.pos !== i + 1) problems.push(`pos=${row.pos}, expected ${i + 1}`);
  const expectedGap = row.points - mfrLeader.points;
  if (row.gap !== expectedGap) problems.push(`gap=${row.gap}, expected ${expectedGap}`);
  if (row.points > prevPts) problems.push(`points ${row.points} greater than previous row ${prevPts}`);
  prevPts = row.points;
  if (problems.length) {
    note('mfr-standings', `${row.mfr} (P${row.pos}): ${problems.join('; ')}`);
    mfrChecks.fail++;
  } else {
    mfrChecks.pass++;
  }
});

// ── Report ────────────────────────────────────────────────────────────────────
const fmt = (chk, label) => {
  const ok = chk.fail === 0;
  return `${ok ? '✓' : '✗'} ${label}: ${chk.pass}/${chk.total} ${ok ? 'pass' : `pass, ${chk.fail} fail`}`;
};
console.log('WRC data verification (verify-wrc.js)');
console.log('======================================');
console.log(fmt(schedChecks,  'Schedule integrity   '));
console.log(fmt(resultChecks, 'Results + references '));
console.log(fmt(standChecks,  'Standings math       '));
console.log(fmt(mfrChecks,    'Manufacturers math   '));
console.log('');
if (errors.length === 0) {
  console.log('All checks passed.');
  process.exit(0);
}
console.log(`${errors.length} error${errors.length === 1 ? '' : 's'}:`);
for (const e of errors) console.log(`  [${e.cat}] ${e.msg}`);
process.exit(1);
