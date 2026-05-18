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
let current__Series__Tab='main';   // sub-tab key, or 'main' if no sub-tabs

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
  render__Series__();
}

function render__Series__(){
  const content=document.getElementById('main-content');
  // TODO: replace with the real render. See renderNascar / renderN24 for
  // a sub-tab dispatcher pattern, or renderSchedule for a single-view
  // pattern.
  content.innerHTML=`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">__Series__ Coming Soon</div><div class="state-sub">Hardcoded data goes in __SERIES___RESULTS / __SERIES___SCHEDULE; renderer goes here.</div></div>`;
  setStats('—','—','__SERIES__','—');
}
// ── END __SERIES__ ────────────────────────────────────────────────────────────
