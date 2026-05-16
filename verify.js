#!/usr/bin/env node
// verify.js — F1 data integrity checks for TraxStat's index.html.
// See CLAUDE.md "Automated checks" for spec.
//
// Reads index.html, extracts the hardcoded F1 data constants by
// brace-counting their literal expressions, evals them, and runs
// three categories of consistency checks. Exit 0 on pass, 1 on any
// failure so it composes with shell scripts and skills.

const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, 'index.html');
const source = fs.readFileSync(HTML_PATH, 'utf8');

// ── Extraction ────────────────────────────────────────────────────────────────
// Find `const NAME=` (with optional spaces), then walk forward counting
// brackets, respecting string literals and escape sequences, until the
// value's enclosing bracket closes. Return the literal text for eval.
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
  let inString = null;     // null, "'", '"', or '`'
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

const HARDCODED_RACES                = loadConst('HARDCODED_RACES');
const HARDCODED_DRIVER_STANDINGS     = loadConst('HARDCODED_DRIVER_STANDINGS');
const HARDCODED_CONSTRUCTOR_STANDINGS = loadConst('HARDCODED_CONSTRUCTOR_STANDINGS');
const SPRINT_RESULTS                 = loadConst('SPRINT_RESULTS');
const DRIVER_RACE_POINTS             = loadConst('DRIVER_RACE_POINTS');
const CONSTRUCTOR_RACE_POINTS        = loadConst('CONSTRUCTOR_RACE_POINTS');

// ── Helpers ───────────────────────────────────────────────────────────────────
const errors = [];
const note = (cat, msg) => errors.push({ cat, msg });

const sumDriverGpPoints = (name) =>
  (DRIVER_RACE_POINTS[name] || []).reduce((s, r) => s + (r.pts || 0), 0);

function sumDriverSprintPoints(name) {
  let total = 0;
  for (const round in SPRINT_RESULTS) {
    const sp = SPRINT_RESULTS[round].drivers[name];
    if (sp) total += sp;
  }
  return total;
}

// ── Check 1: driver standings totals ──────────────────────────────────────────
const driverChecks = { pass: 0, fail: 0, total: HARDCODED_DRIVER_STANDINGS.length };
for (const entry of HARDCODED_DRIVER_STANDINGS) {
  const name = entry.Driver.familyName;
  const expected = parseFloat(entry.points);
  const gp = sumDriverGpPoints(name);
  const sprint = sumDriverSprintPoints(name);
  const actual = gp + sprint;

  // Drivers with > 0 points must appear in DRIVER_RACE_POINTS.
  // Drivers with 0 points are allowed to be omitted (currently 5 are).
  if (expected > 0 && !(name in DRIVER_RACE_POINTS)) {
    note('drivers', `${name} (P${entry.position}, ${expected} pts) is missing from DRIVER_RACE_POINTS`);
    driverChecks.fail++;
    continue;
  }
  if (actual !== expected) {
    note('drivers', `${name}: standings say ${expected} pts; per-race math gives ${gp} GP + ${sprint} sprint = ${actual}`);
    driverChecks.fail++;
  } else {
    driverChecks.pass++;
  }
}

// ── Check 2: constructor standings totals ─────────────────────────────────────
const constructorChecks = { pass: 0, fail: 0, total: HARDCODED_CONSTRUCTOR_STANDINGS.length };
for (const entry of HARDCODED_CONSTRUCTOR_STANDINGS) {
  const name = entry.Constructor.name;
  const expected = parseFloat(entry.points);
  const weekends = CONSTRUCTOR_RACE_POINTS[name] || [];
  if (expected > 0 && weekends.length === 0) {
    note('constructors', `${name} (${expected} pts) is missing from CONSTRUCTOR_RACE_POINTS`);
    constructorChecks.fail++;
    continue;
  }
  let total = 0;
  for (const wknd of weekends) {
    for (const d of wknd.drivers) {
      total += d.pts || 0;
      const sp = SPRINT_RESULTS[wknd.round]?.drivers?.[d.name];
      if (sp) total += sp;
    }
  }
  if (total !== expected) {
    note('constructors', `${name}: standings say ${expected} pts; per-weekend math gives ${total}`);
    constructorChecks.fail++;
  } else {
    constructorChecks.pass++;
  }
}

// ── Check 3: driver reference consistency ─────────────────────────────────────
const standingsNames = new Set(HARDCODED_DRIVER_STANDINGS.map(e => e.Driver.familyName));
const refChecks = { pass: 0, fail: 0, total: 0 };

function checkRef(name, where) {
  refChecks.total++;
  if (!standingsNames.has(name)) {
    note('references', `'${name}' referenced in ${where} but not in HARDCODED_DRIVER_STANDINGS`);
    refChecks.fail++;
  } else {
    refChecks.pass++;
  }
}

for (const round in HARDCODED_RACES) {
  for (const r of HARDCODED_RACES[round].Results || []) {
    const fname = r.Driver?.familyName;
    if (fname) checkRef(fname, `HARDCODED_RACES[${round}].Results`);
  }
}
for (const name in DRIVER_RACE_POINTS) {
  checkRef(name, 'DRIVER_RACE_POINTS keys');
}
for (const round in SPRINT_RESULTS) {
  for (const name in SPRINT_RESULTS[round].drivers) {
    checkRef(name, `SPRINT_RESULTS[${round}].drivers`);
  }
}

// ── Report ────────────────────────────────────────────────────────────────────
const fmt = (chk, label) => {
  const ok = chk.fail === 0;
  const icon = ok ? '✓' : '✗';
  return `${icon} ${label}: ${chk.pass}/${chk.total} ${ok ? 'pass' : `pass, ${chk.fail} fail`}`;
};

console.log('F1 data verification (verify.js)');
console.log('================================');
console.log(fmt(driverChecks, 'Driver standings    '));
console.log(fmt(constructorChecks, 'Constructor standings'));
console.log(fmt(refChecks, 'Driver references   '));
console.log('');

if (errors.length === 0) {
  console.log('All checks passed.');
  process.exit(0);
}

console.log(`${errors.length} error${errors.length === 1 ? '' : 's'}:`);
for (const e of errors) console.log(`  [${e.cat}] ${e.msg}`);
process.exit(1);
