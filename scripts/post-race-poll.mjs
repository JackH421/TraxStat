#!/usr/bin/env node
// scripts/post-race-poll.mjs
//
// Server-side F1 post-race poller. Runs from .github/workflows/f1-post-race-poll.yml
// on a 30-minute cron + manual workflow_dispatch. When a round is in its
// post-race window (race start + 4h < now < +24h, AND not yet in
// HARDCODED_RACES) the script fetches Jolpica, diffs against canonical, and
// opens (or updates) an auto/f1-r{N}-* PR proposing the data update.
//
// CARDINAL RULE: this script NEVER commits to main. Every change goes through
// a pull request for human review. The merge is the user's decision.
//
// Modes (via env vars):
//   TEST_MODE=true  → skip in-window check, write to scripts/.test-pr-marker.md,
//                     open a [TEST] PR (clearly labeled DO NOT MERGE).
//   DRY_RUN=true    → print what would happen, don't call gh or git push.
//                     Local-only safety hatch.
//   (neither)       → real cron / manual real run.

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const F1_PATH = resolve(REPO_ROOT, 'js/series/f1.js');
const TEST_MARKER_PATH = resolve(REPO_ROOT, 'scripts/.test-pr-marker.md');

const TEST_MODE = process.env.TEST_MODE === 'true';
const DRY_RUN = process.env.DRY_RUN === 'true';

const JOLPICA = 'https://api.jolpi.ca/ergast/f1';

// Driver-standings sanity threshold — must clear this to be considered "post-race
// complete". Matches the threshold in js/core.js fetchDriverStandings. Filters
// out cases where Jolpica returns pre-season or stale partial data.
const DRV_LEADER_MIN = 90;
const CTR_LEADER_MIN = 170;

function log(...args) { console.log('[poll]', ...args); }
function logErr(...args) { console.error('[poll]', ...args); }

// ─── extraction (mirrors verify.js:20-50, kept inline to avoid a shared util) ─
function extractConst(src, name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*`);
  const m = src.match(re);
  if (!m) throw new Error(`Constant ${name} not found in f1.js`);
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
      if (depth === 0) return { text: src.slice(start, i + 1), start, end: i + 1 };
    }
  }
  throw new Error(`Unterminated literal for ${name}`);
}

// Function constructor is safer than eval — runs in isolated scope, no closure
// over caller's locals. Used only on extracted literal text (no function bodies).
function evalLiteral(text) {
  return new Function(`return (${text});`)();
}

// ─── serializer (close-enough match to existing f1.js style) ─────────────────
const SAFE_KEY = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function quoteString(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function serializeValue(v) {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return quoteString(v);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return '[' + v.map(serializeValue).join(',') + ']';
  if (typeof v === 'object') {
    return '{' + Object.entries(v).map(([k, val]) => {
      const key = SAFE_KEY.test(k) ? k : quoteString(k);
      return `${key}:${serializeValue(val)}`;
    }).join(',') + '}';
  }
  throw new Error(`Cannot serialize ${typeof v}`);
}

// One race entry — Results array gets one row per indented line.
function serializeRaceEntry(round, race) {
  const circuit = serializeValue(race.Circuit);
  const rows = race.Results.map(r => '      ' + serializeValue(r)).join(',\n');
  return `  ${round}:{round:${quoteString(String(round))},raceName:${quoteString(race.raceName)},date:${quoteString(race.date)},Circuit:${circuit},
    Results:[
${rows},
    ]}`;
}

function serializeRacesBlock(racesObj) {
  const entries = Object.entries(racesObj)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([round, race]) => serializeRaceEntry(round, race))
    .join(',\n');
  return `{\n${entries}\n}`;
}

function serializeStandingsArray(arr) {
  return '[\n' + arr.map(row => '  ' + serializeValue(row)).join(',\n') + ',\n]';
}

// ─── normalizeTeam (mirror of js/core.js — kept in sync manually) ────────────
const TEAM_MAP = {
  'Kick Sauber': 'Audi',
  'Sauber': 'Audi',
  'RB F1 Team': 'Racing Bulls',
  'RB': 'Racing Bulls',
  'AlphaTauri': 'Racing Bulls',
};
function normalizeTeam(name) {
  if (!name) return name;
  return TEAM_MAP[name] || name;
}

// ─── Jolpica fetch ───────────────────────────────────────────────────────────
async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'traxstat-post-race-poll/1.0' } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

async function fetchAllForRound(round) {
  const [results, drvStd, ctrStd] = await Promise.all([
    fetchJSON(`${JOLPICA}/2026/${round}/results/?limit=30`),
    fetchJSON(`${JOLPICA}/current/driverStandings/`),
    fetchJSON(`${JOLPICA}/current/constructorStandings/`),
  ]);
  return { results, drvStd, ctrStd };
}

// ─── shape converters: Jolpica → HARDCODED_* format ──────────────────────────
function jolpicaToRaceEntry(jolpicaRace, nextRacesEntry) {
  // Country flag emoji comes from NEXT_RACES (Jolpica returns ISO country name).
  const country = nextRacesEntry?.country ?? jolpicaRace.Circuit?.Location?.country ?? '';
  const Results = jolpicaRace.Results.map(r => {
    // Jolpica uses positionText for non-numeric positions ('DNF', 'DNS', 'DSQ').
    const position = r.positionText && /[^0-9]/.test(r.positionText) ? r.positionText : r.position;
    const row = {
      position,
      Driver: {
        driverId: r.Driver.driverId,
        familyName: r.Driver.familyName,
        nationality: r.Driver.nationality,
      },
      Constructor: { name: normalizeTeam(r.Constructor.name) },
      points: String(r.points ?? '0'),
      laps: String(r.laps ?? '0'),
    };
    if (r.Time?.time) {
      row.Time = { time: r.Time.time };
    } else if (Number(r.position) === 1) {
      row.Time = { time: 'Winner' };
    }
    row.status = r.status;
    if (r.FastestLap?.rank && r.FastestLap?.Time?.time) {
      row.FastestLap = {
        rank: String(r.FastestLap.rank),
        lap: String(r.FastestLap.lap),
        Time: { time: r.FastestLap.Time.time },
      };
    }
    // Match the existing convention: DNF/DNS rows with no completed laps use '—' not '0'.
    if ((position === 'DNS' || (position === 'DNF' && row.laps === '0')) && row.laps !== '0') {
      // leave as-is — Jolpica reported a partial lap count for the DNF
    } else if (position === 'DNS' || (position === 'DNF' && row.laps === '0')) {
      row.laps = '—';
    }
    return row;
  });
  return {
    round: String(jolpicaRace.round),
    raceName: jolpicaRace.raceName,
    date: jolpicaRace.date,
    Circuit: {
      circuitName: jolpicaRace.Circuit.circuitName,
      Location: { country },
    },
    Results,
  };
}

function jolpicaToDriverStandings(jolpicaStandings) {
  return jolpicaStandings.map(s => ({
    position: s.position,
    points: s.points,
    Driver: {
      driverId: s.Driver.driverId,
      familyName: s.Driver.familyName,
      givenName: s.Driver.givenName,
      nationality: s.Driver.nationality,
    },
    Constructors: s.Constructors.map(c => ({ name: normalizeTeam(c.name) })),
  }));
}

function jolpicaToConstructorStandings(jolpicaStandings) {
  return jolpicaStandings.map(s => ({
    position: s.position,
    points: s.points,
    Constructor: {
      name: normalizeTeam(s.Constructor.name),
      nationality: s.Constructor.nationality,
    },
  }));
}

// ─── shell helpers ───────────────────────────────────────────────────────────
function sh(cmd, opts = {}) {
  log(`$ ${cmd}`);
  if (DRY_RUN && !opts.allowInDryRun) return '';
  return execSync(cmd, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    ...opts,
  });
}

function ghPRListForRound(round) {
  try {
    const out = execSync(
      `gh pr list --state open --search "head:auto/f1-r${round}-" --json headRefName,number --jq '.[0]'`,
      { cwd: REPO_ROOT, encoding: 'utf8' }
    ).trim();
    if (!out || out === 'null') return null;
    return JSON.parse(out);
  } catch (e) {
    log('gh pr list failed (assuming no existing PR):', e.message);
    return null;
  }
}

function tsForBranch() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
}

// ─── PR body builders ────────────────────────────────────────────────────────
function summarizeStandingsDiff(oldArr, newArr) {
  const keyOf = r => r.Driver?.driverId ?? r.Constructor?.name;
  const labelOf = r => r.Driver?.familyName ?? r.Constructor?.name;
  const oldByKey = new Map(oldArr.map(r => [keyOf(r), r]));
  const changes = [];
  for (const n of newArr) {
    const k = keyOf(n);
    const o = oldByKey.get(k);
    if (!o) {
      changes.push(`new ${labelOf(n)} P${n.position} (${n.points} pts)`);
    } else if (o.points !== n.points || o.position !== n.position) {
      changes.push(`${labelOf(n)}: P${o.position}→P${n.position}, ${o.points}→${n.points} pts`);
    }
  }
  return changes.slice(0, 5);
}

function buildRealPRBody(round, jolpicaRace, drvDiff, ctrDiff) {
  const fetched = new Date().toISOString();
  const drvSummary = drvDiff.length ? `\n  - changes: ${drvDiff.join('; ')}` : '';
  const ctrSummary = ctrDiff.length ? `\n  - changes: ${ctrDiff.join('; ')}` : '';
  return `Auto-detected post-race data for **R${round} — ${jolpicaRace.raceName}** (${jolpicaRace.date}).

## Proposed changes
- **\`HARDCODED_RACES[${round}]\`**: add new entry from Jolpica \`/2026/${round}/results/\`
- **\`HARDCODED_DRIVER_STANDINGS\`**: replace from Jolpica \`/current/driverStandings/\`${drvSummary}
- **\`HARDCODED_CONSTRUCTOR_STANDINGS\`**: replace from Jolpica \`/current/constructorStandings/\`${ctrSummary}

## Sources
- https://api.jolpi.ca/ergast/f1/2026/${round}/results/
- https://api.jolpi.ca/ergast/f1/current/driverStandings/
- https://api.jolpi.ca/ergast/f1/current/constructorStandings/

Fetched: ${fetched}

## Reviewer checklist
- [ ] **Cardinal rule:** verify the diff matches the official F1.com / FIA classification before merging.
- [ ] Cross-check podium + fastest lap + DNFs against the official PDF or F1.com results page.
- [ ] Confirm \`SPRINT_RESULTS\` is unchanged if this wasn't a sprint weekend (sprint data isn't in Jolpica's \`/results/\`; that still updates via the manual prompt).
- [ ] After merge, the qualifying-highlight videos (\`HARDCODED_QUALI_VIDEOS[${round}]\`) can be added separately — that's a different workflow.

_Generated by \`.github/workflows/f1-post-race-poll.yml\` running \`scripts/post-race-poll.mjs\`._
`;
}

function buildTestPRBody(ts) {
  return `**⚠️ TEST PR — DO NOT MERGE.** This PR was created by \`workflow_dispatch\` with \`test_mode=true\` to verify end-to-end PR creation + push notifications. Close this PR without merging; delete the branch.

To close from your phone: GitHub mobile app → this PR → "Close pull request" → optional "Delete branch".

This PR only touches \`scripts/.test-pr-marker.md\` (a no-op marker file). No data, no logic, no styling is affected.

Test timestamp: ${ts}

_Generated by \`.github/workflows/f1-post-race-poll.yml\` running \`scripts/post-race-poll.mjs\` with \`TEST_MODE=true\`._
`;
}

// ─── modes ───────────────────────────────────────────────────────────────────
async function runTestMode() {
  const ts = new Date().toISOString();
  const branch = `auto/f1-test-${tsForBranch()}`;
  const newMarkerContent = `# F1 Post-Race Poll — Test PR Marker

This file is touched by \`scripts/post-race-poll.mjs\` when invoked with \`TEST_MODE=true\`
(via \`workflow_dispatch\` from the GitHub Actions UI, or locally with the env var set).

It exists only to provide a **non-data file** the Action can modify to verify
end-to-end PR creation + mobile push notifications without touching canonical
data in \`js/series/f1.js\`.

**Do not merge any PR that touches only this file.** Close it without merging
and delete the branch.

Last test run: ${ts}
`;
  const body = buildTestPRBody(ts);
  const title = `[TEST] data: F1 test PR (auto-detected) — DO NOT MERGE`;

  if (DRY_RUN) {
    log('--- DRY_RUN test mode ---');
    log('Would create branch:', branch);
    log('Would write to:', TEST_MARKER_PATH);
    log('Would open PR title:', title);
    log('--- PR body ---');
    console.log(body);
    log('--- end DRY_RUN test mode ---');
    return;
  }

  writeFileSync(TEST_MARKER_PATH, newMarkerContent);
  sh(`git checkout -b ${branch}`);
  sh(`git add scripts/.test-pr-marker.md`);
  sh(`git commit -m "test: verify auto-PR pipeline (${ts})"`);
  sh(`git push -u origin ${branch}`);
  const tmpDir = mkdtempSync(join(tmpdir(), 'traxstat-pr-'));
  const bodyFile = join(tmpDir, 'body.md');
  writeFileSync(bodyFile, body);
  sh(`gh pr create --base main --head ${branch} --title ${JSON.stringify(title)} --body-file ${JSON.stringify(bodyFile)}`);
  log('Test PR opened.');
}

async function runRealMode() {
  // 1. Read f1.js
  const src = readFileSync(F1_PATH, 'utf8');

  // 2. Extract canonical constants
  const nextRacesSpan = extractConst(src, 'NEXT_RACES');
  const racesSpan = extractConst(src, 'HARDCODED_RACES');
  const drvSpan = extractConst(src, 'HARDCODED_DRIVER_STANDINGS');
  const ctrSpan = extractConst(src, 'HARDCODED_CONSTRUCTOR_STANDINGS');

  const NEXT_RACES = evalLiteral(nextRacesSpan.text);
  const HARDCODED_RACES = evalLiteral(racesSpan.text);
  const HARDCODED_DRIVER_STANDINGS = evalLiteral(drvSpan.text);
  const HARDCODED_CONSTRUCTOR_STANDINGS = evalLiteral(ctrSpan.text);

  // 3. Find target round (mirrors findPostRaceRound in f1.js)
  const now = Date.now();
  const hardcoded = new Set(Object.keys(HARDCODED_RACES).map(Number));
  const target = NEXT_RACES.find(r => {
    const start = new Date(r.date + 'T13:00:00Z').getTime();
    return now > start + 4 * 3600 * 1000 && now < start + 24 * 3600 * 1000 && !hardcoded.has(r.round);
  });
  if (!target) {
    log('No round in post-race window — exiting clean.');
    return;
  }
  log(`Target: R${target.round} ${target.name} (${target.date})`);

  // 4. Fetch Jolpica
  let fetched;
  try {
    fetched = await fetchAllForRound(target.round);
  } catch (e) {
    log('Jolpica fetch failed — exiting clean.', e.message);
    return;
  }

  // 5. Completeness gate
  const jolpicaRace = fetched.results.MRData?.RaceTable?.Races?.[0];
  if (!jolpicaRace || !Array.isArray(jolpicaRace.Results) || jolpicaRace.Results.length === 0) {
    log('Jolpica results empty — exiting clean.');
    return;
  }
  const drvList = fetched.drvStd.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
  const ctrList = fetched.ctrStd.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
  const drvLeaderPts = Number(drvList[0]?.points ?? 0);
  const ctrLeaderPts = Number(ctrList[0]?.points ?? 0);
  if (drvLeaderPts < DRV_LEADER_MIN) {
    log(`Driver standings leader pts ${drvLeaderPts} < ${DRV_LEADER_MIN} — exiting clean.`);
    return;
  }
  if (ctrLeaderPts < CTR_LEADER_MIN) {
    log(`Constructor standings leader pts ${ctrLeaderPts} < ${CTR_LEADER_MIN} — exiting clean.`);
    return;
  }

  // 6. Build new entries
  const newRaceEntry = jolpicaToRaceEntry(jolpicaRace, target);
  const newDrvStandings = jolpicaToDriverStandings(drvList);
  const newCtrStandings = jolpicaToConstructorStandings(ctrList);

  // 7. Build proposed file via right-to-left string-slice replacement
  const newRacesObj = { ...HARDCODED_RACES, [target.round]: newRaceEntry };
  const newRacesText = serializeRacesBlock(newRacesObj);
  const newDrvText = serializeStandingsArray(newDrvStandings);
  const newCtrText = serializeStandingsArray(newCtrStandings);

  const replacements = [
    { span: racesSpan, newText: newRacesText },
    { span: drvSpan, newText: newDrvText },
    { span: ctrSpan, newText: newCtrText },
  ].sort((a, b) => b.span.start - a.span.start);

  let proposed = src;
  for (const { span, newText } of replacements) {
    proposed = proposed.slice(0, span.start) + newText + proposed.slice(span.end);
  }

  if (proposed === src) {
    log('No diff between Jolpica and canonical — exiting clean (no-op).');
    return;
  }

  // 8. PR upsert
  const drvDiff = summarizeStandingsDiff(HARDCODED_DRIVER_STANDINGS, newDrvStandings);
  const ctrDiff = summarizeStandingsDiff(HARDCODED_CONSTRUCTOR_STANDINGS, newCtrStandings);
  const body = buildRealPRBody(target.round, jolpicaRace, drvDiff, ctrDiff);
  const title = `data: F1 R${target.round} post-race update (auto-detected)`;

  if (DRY_RUN) {
    log('--- DRY_RUN real mode ---');
    log('Round:', target.round);
    log('Driver-standings changes:', drvDiff);
    log('Constructor-standings changes:', ctrDiff);
    log('--- PR title ---');
    console.log(title);
    log('--- PR body ---');
    console.log(body);
    log('--- proposed f1.js size:', proposed.length, '(was', src.length, ') ---');
    return;
  }

  const existing = ghPRListForRound(target.round);
  let branch;
  if (existing) {
    branch = existing.headRefName;
    log(`Updating existing PR #${existing.number} on branch ${branch}`);
    sh(`git fetch origin ${branch}`);
    sh(`git checkout -B ${branch} origin/${branch}`);
    writeFileSync(F1_PATH, proposed);
    // Did anything actually change?
    let changed = true;
    try {
      execSync(`git diff --quiet js/series/f1.js`, { cwd: REPO_ROOT });
      changed = false;
    } catch { /* exit 1 = changes present */ }
    if (!changed) {
      log('Existing PR already matches current Jolpica state — no update needed.');
      return;
    }
    sh(`git add js/series/f1.js`);
    sh(`git commit -m "update from Jolpica ${new Date().toISOString()}"`);
    sh(`git push --force-with-lease origin ${branch}`);
    log(`PR #${existing.number} updated.`);
  } else {
    branch = `auto/f1-r${target.round}-${tsForBranch()}`;
    log(`Creating new PR on branch ${branch}`);
    sh(`git checkout -b ${branch}`);
    writeFileSync(F1_PATH, proposed);
    sh(`git add js/series/f1.js`);
    sh(`git commit -m "data: F1 R${target.round} post-race auto-update"`);
    sh(`git push -u origin ${branch}`);
    const tmpDir = mkdtempSync(join(tmpdir(), 'traxstat-pr-'));
    const bodyFile = join(tmpDir, 'body.md');
    writeFileSync(bodyFile, body);
    sh(`gh pr create --base main --head ${branch} --title ${JSON.stringify(title)} --body-file ${JSON.stringify(bodyFile)}`);
    log('New PR opened.');
  }
}

// ─── main ────────────────────────────────────────────────────────────────────
async function main() {
  log(`TraxStat F1 post-race poll  (TEST_MODE=${TEST_MODE} DRY_RUN=${DRY_RUN})`);
  if (TEST_MODE) await runTestMode();
  else await runRealMode();
}

main().catch(e => {
  logErr('FATAL', e?.stack ?? e);
  process.exit(1);
});
