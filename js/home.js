// ── HOME (LANDING PAGE) ──────────────────────────────────────────────────────
// Default landing view for TraxStat. The site boots into HOME (see init.js);
// SCHEDULE is still accessible as a secondary tab in the .series-bar.
//
// SCAFFOLD ONLY — content for this page is intentionally a placeholder.
// A future session will design what HOME actually shows. When it does:
//   - State variables go below this block.
//   - Read-only helpers (formatters, cross-series aggregators) can live here.
//   - Data should come from existing series modules (NEXT_RACES,
//     NASCAR_CUP_SCHEDULE, HARDCODED_RACES, NASCAR_CUP_RESULTS, etc.) —
//     don't duplicate hardcoded race/driver data in this file.
//   - The cardinal rule still applies: every fact must trace to a verified
//     source. No invented stats.
//
// TODO (next session):
//   1. Decide what the landing page shows (hero card? series-level summary?
//      live-now banner? marquee? combination?).
//   2. Replace renderHome()'s placeholder with the real markup.
//   3. If HOME needs analytics events, add tab:home and any sub-events
//      to the Analytics table in CLAUDE.md.
//   4. If HOME needs new CSS, add it to styles.css; otherwise reuse
//      existing classes (.state-screen, .race-item, .section-title,
//      .countdown-num, etc.).

function renderHome(){
  const content=document.getElementById('main-content');
  content.innerHTML=`<div class="state-screen">
    <div class="state-icon">🏁</div>
    <div class="state-title">HOME · Coming Soon</div>
    <div class="state-sub">Landing page design in progress. SCHEDULE remains accessible from the series bar.</div>
  </div>`;
  setStats('—','—','HOME','—');
}
// ── END HOME ─────────────────────────────────────────────────────────────────
