// ── __SERIES__ SERIES MODULE ──────────────────────────────────────────────────
// Template — copy this file to js/series/<key>.js, rename identifiers,
// fill in the TODOs. This file is NEVER loaded by index.html; the
// underscore prefix on the filename keeps it out of any alphabetised list.
//
// The placeholders __series__ / __Series__ / __SERIES__ are valid JS
// identifiers so this file parses (`node --check js/series/_template.js`
// passes) — that lets CI / verify scripts grep over `js/**/*.js` without
// special-casing it. But the file isn't wired up: no <script src> tag,
// no switchSeries branch.
//
// Steps to add a new series:
//   1. cp js/series/_template.js js/series/<key>.js     # e.g. motogp.js
//   2. In the new file, replace each placeholder (one find-replace per row):
//        __series__   →  <key>           (lowercase, e.g. motogp)
//        __Series__   →  <Key>           (PascalCase, e.g. MotoGP)
//        __SERIES__   →  <KEY>           (uppercase, e.g. MOTOGP)
//   3. Populate the hardcoded data constants from a verified source
//      (cardinal rule — never invent stats; cite the source in a comment
//      above each constant).
//   4. Add `<script src="/js/series/<key>.js"></script>` to index.html,
//      alphabetically among the existing series scripts (keep the load
//      order: core → series files → schedule → init).
//   5. Add the series tab to the .series-bar in index.html:
//        <div class="series-tab" onclick="switchSeries('<key>')"><div class="series-dot"></div><KEY></div>
//      Also add `'<key>'` to the index array inside switchSeries() in
//      js/core.js so the .active class toggles correctly.
//   6. Add an `if(s==='<key>'){render<Key>();return;}` branch to
//      switchSeries() in js/core.js (just above the placeholder fallback).
//   7. If the series needs a sub-menu like F1's, add a `<div class="f1-submenu">`
//      block to index.html, mirror the show/hide logic in switchSeries,
//      and implement a switch<Key>Tab() function below.
//   8. Run `node verify.js && node verify-nascar.js` — both should still
//      pass (existing data untouched).
//   9. Add a row to the "Series support" table in CLAUDE.md.
//  10. (Optional) Add analytics events `tab:<key>`, etc. — see the
//      Analytics events table in CLAUDE.md for the naming convention.

// ── STATE ─────────────────────────────────────────────────────────────────────
// Universal 5-tab shape (Session 7). Tap on the main series tab lands the user
// on the home menu (handled by switchSeries → goToSeriesHome). Tapping a row
// in the menu sets this to the chosen sub-tab key.
let current__Series__Tab='live';

// ── DATA ──────────────────────────────────────────────────────────────────────
// TODO: populate from a verified source. See cardinal rule in CLAUDE.md.
// Examples for the shape of these constants:
//   F1's HARDCODED_RACES (rich object, race-by-race results)
//   NASCAR_CUP_RESULTS (round → winner/podium summary)
//   N24_2026_RESULTS (frozen flat array)
// Pick whichever shape matches the data this series publishes.
const __SERIES__RESULTS=[];
const __SERIES__SCHEDULE=[];

// ── HELPERS ───────────────────────────────────────────────────────────────────
// Series-specific helpers go here (color lookups, formatters, etc.).

// ── DISPATCHER ────────────────────────────────────────────────────────────────
function switch__Series__Tab(tab){
  track('tab:__series__',{tab});
  current__Series__Tab=tab;
  document.querySelectorAll('#__series__-submenu .f1-sub-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('__series__tab-'+tab)?.classList.add('active');
  render__Series__();
}

function render__Series__(){
  const content=document.getElementById('main-content');
  // Universal 5-tab dispatch: live / standings / races / schedule / highlights.
  // Every branch should prepend `renderSeriesBanner('__series__', currentTab)`
  // and `renderBackToSeriesHome('__series__')` to its rendered HTML.
  const top=renderSeriesBanner('__series__',current__Series__Tab)+renderBackToSeriesHome('__series__');
  content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">__Series__ Coming Soon</div><div class="state-sub">Hardcoded data goes in __SERIES___RESULTS / __SERIES___SCHEDULE; renderer goes here. The home menu and 5-tab strip are wired up via core.js.</div></div>`;
  setStats('—','—','__SERIES__','—');
}

// To wire a new series into the home-menu + banner pattern:
//   1. Add a metadata entry to TX_SERIES_META in js/core.js with name/label/
//      seasonSub. (seasonSub returns a string like "2026 Season · Round X of Y".)
//   2. Add an `if(s==='__series__'){goToSeriesHome(s);return;}` branch to
//      switchSeries() in js/core.js (the goto branch already exists for
//      f1/nascar/n24 — extend the condition or add an alongside branch).
//   3. Add an `if(seriesKey==='__series__'){…submenu show…;switch__Series__Tab(subTab);}`
//      branch inside goToSubTab() in core.js.
//   4. Add a `<div class="f1-submenu" id="__series__-submenu" …>` strip to
//      index.html with the 5 standard sub-tabs (Live / Standings / Race Results
//      / Schedule / Highlights).
// ── END __SERIES__ ────────────────────────────────────────────────────────────
