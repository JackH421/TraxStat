#!/usr/bin/env node
// verify-wec.js — FIA WEC data integrity checks for TraxStat.
// Written BEFORE js/series/wec.js per the design-first rule
// (docs/series-data-models.md). Modeled on verify.js / verify-nascar.js.
// Exit 0 on pass, 1 on any failure.

const fs = require('fs');
const path = require('path');

const SOURCE_PATH = path.join(__dirname, 'js', 'series', 'wec.js');
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

const WEC_SCHEDULE           = loadConst('WEC_SCHEDULE');
const WEC_RESULTS            = loadConst('WEC_RESULTS');
const WEC_HYPERCAR_STANDINGS = loadConst('WEC_HYPERCAR_STANDINGS');
const WEC_MFR_STANDINGS      = loadConst('WEC_MFR_STANDINGS');
const WEC_LMGT3_STANDINGS    = loadConst('WEC_LMGT3_STANDINGS');

const errors = [];
const note = (cat, msg) => errors.push({ cat, msg });

// ── Check 1: schedule integrity ───────────────────────────────────────────────
// hours may be null (cardinal rule — only verified durations included).
const schedChecks = { pass: 0, fail: 0, total: WEC_SCHEDULE.length };
let prevDate = '0000-00-00';
WEC_SCHEDULE.forEach((row, i) => {
  const expectedRound = i + 1;
  const problems = [];
  if (row.round !== expectedRound) problems.push(`round=${row.round}, expected ${expectedRound}`);
  if (!row.race) problems.push('missing race');
  if (!row.circuit) problems.push('missing circuit');
  if (!row.country) problems.push('missing country');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date || '')) problems.push(`bad date "${row.date}"`);
  else if (row.date < prevDate) problems.push(`date ${row.date} earlier than previous ${prevDate}`);
  if (row.date) prevDate = row.date;
  if (row.hours !== null && (typeof row.hours !== 'number' || row.hours <= 0)) problems.push(`bad hours "${row.hours}"`);
  if (problems.length) {
    note('schedule', `R${row.round || expectedRound}: ${problems.join('; ')}`);
    schedChecks.fail++;
  } else {
    schedChecks.pass++;
  }
});

// ── Check 2: results integrity — per-class winner objects ─────────────────────
// Round exists in schedule; hypercar + lmgt3 winner objects each carry
// car / team / mfr / non-empty drivers array.
const resultChecks = { pass: 0, fail: 0, total: 0 };
const scheduleRounds = new Set(WEC_SCHEDULE.map(r => r.round));
for (const round in WEC_RESULTS) {
  const r = WEC_RESULTS[round];
  resultChecks.total++;
  if (!scheduleRounds.has(parseInt(round))) {
    note('results', `Result round ${round} not in WEC_SCHEDULE`);
    resultChecks.fail++;
  } else {
    resultChecks.pass++;
  }
  for (const cls of ['hypercar', 'lmgt3']) {
    resultChecks.total++;
    const w = r[cls];
    const problems = [];
    if (!w) problems.push(`missing ${cls} winner object`);
    else {
      if (!w.car) problems.push('missing car');
      if (!w.team) problems.push('missing team');
      if (!w.mfr) problems.push('missing mfr');
      if (!Array.isArray(w.drivers) || w.drivers.length === 0) problems.push('missing/empty drivers');
    }
    if (problems.length) {
      note('results', `Round ${round} ${cls}: ${problems.join('; ')}`);
      resultChecks.fail++;
    } else {
      resultChecks.pass++;
    }
  }
}

// ── Check 3: Hypercar drivers' standings math ─────────────────────────────────
const standChecks = { pass: 0, fail: 0, total: WEC_HYPERCAR_STANDINGS.length };
const leader = WEC_HYPERCAR_STANDINGS[0];
let prevPts = Infinity;
WEC_HYPERCAR_STANDINGS.forEach((row, i) => {
  const problems = [];
  if (row.pos !== i + 1) problems.push(`pos=${row.pos}, expected ${i + 1}`);
  const expectedGap = row.points - leader.points;
  if (row.gap !== expectedGap) problems.push(`gap=${row.gap}, expected ${expectedGap}`);
  if (row.points > prevPts) problems.push(`points ${row.points} greater than previous row ${prevPts}`);
  prevPts = row.points;
  if (!row.crew) problems.push('missing crew');
  if (!row.team) problems.push('missing team');
  if (problems.length) {
    note('hypercar-standings', `${row.crew || '?'} (P${row.pos}): ${problems.join('; ')}`);
    standChecks.fail++;
  } else {
    standChecks.pass++;
  }
});

// ── Check 4: Manufacturers' standings math ────────────────────────────────────
const mfrChecks = { pass: 0, fail: 0, total: WEC_MFR_STANDINGS.length };
const mfrLeader = WEC_MFR_STANDINGS[0];
prevPts = Infinity;
WEC_MFR_STANDINGS.forEach((row, i) => {
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

// ── Check 5: LMGT3 Teams trophy math ──────────────────────────────────────────
const gtChecks = { pass: 0, fail: 0, total: WEC_LMGT3_STANDINGS.length };
const gtLeader = WEC_LMGT3_STANDINGS[0];
prevPts = Infinity;
WEC_LMGT3_STANDINGS.forEach((row, i) => {
  const problems = [];
  if (row.pos !== i + 1) problems.push(`pos=${row.pos}, expected ${i + 1}`);
  const expectedGap = row.points - gtLeader.points;
  if (row.gap !== expectedGap) problems.push(`gap=${row.gap}, expected ${expectedGap}`);
  if (row.points > prevPts) problems.push(`points ${row.points} greater than previous row ${prevPts}`);
  prevPts = row.points;
  if (!row.car || !row.team) problems.push('missing car/team');
  if (problems.length) {
    note('lmgt3-standings', `${row.team || '?'} (P${row.pos}): ${problems.join('; ')}`);
    gtChecks.fail++;
  } else {
    gtChecks.pass++;
  }
});

// ── Report ────────────────────────────────────────────────────────────────────
const fmt = (chk, label) => {
  const ok = chk.fail === 0;
  return `${ok ? '✓' : '✗'} ${label}: ${chk.pass}/${chk.total} ${ok ? 'pass' : `pass, ${chk.fail} fail`}`;
};
console.log('FIA WEC data verification (verify-wec.js)');
console.log('==========================================');
console.log(fmt(schedChecks,  'Schedule integrity     '));
console.log(fmt(resultChecks, 'Per-class results      '));
console.log(fmt(standChecks,  'Hypercar standings math'));
console.log(fmt(mfrChecks,    'Manufacturers math     '));
console.log(fmt(gtChecks,     'LMGT3 teams math       '));
console.log('');
if (errors.length === 0) {
  console.log('All checks passed.');
  process.exit(0);
}
console.log(`${errors.length} error${errors.length === 1 ? '' : 's'}:`);
for (const e of errors) console.log(`  [${e.cat}] ${e.msg}`);
process.exit(1);
