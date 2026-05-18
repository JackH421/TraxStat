# TraxStat

A single-page, mobile-first web app showing live timing, race results, and championship standings for motorsport series — primarily F1 and NASCAR Cup. Built as a static `index.html` shell + `styles.css` + a handful of plain `.js` files under `js/`: no build step, no framework, no dependencies beyond the Google Fonts CDN. See **File layout** below for the full structure.

This file is the working contract for Claude Code (and any human collaborator) on this project. Read it top to bottom before making changes. The contract sections (Cardinal rule through Decision log) govern *how* to work; the reference sections (File layout onward) describe *what's there*.

## Cardinal rule: data integrity

**Never invent statistics.** Race results, points totals, fastest laps, podium positions, championship standings, qualifying times, stage winners, manufacturer wins — every hardcoded number in this codebase must trace to an official source.

Acceptable sources, in rough priority:
- **F1.com** official results pages
- **NASCAR.com** winners gallery and race recaps
- **FIA** classification PDFs (most authoritative for F1)
- **Wikipedia** race pages (cross-check against primaries when possible)
- **racingnews.co** for NASCAR points after each race
- **Jolpica/Ergast API** for archived F1 results (current season may lag)

Rules:
- When asked to add data, **state the source first**. Cite the URL or document. Do not start typing values until the source is named.
- If a source can't be verified, **refuse and ask the user**. Do not guess from training-data knowledge. A placeholder dash (`'—'`) with a comment is always better than a fabricated number.
- If existing data looks unverified or suspect, **flag it** — don't silently keep using it.
- Fabricated stats are the worst possible failure mode for a sports stats app. They erode user trust permanently. Treat them as a P0 bug.

This rule overrides every other consideration in this document. If shipping fast and getting the number right conflict, get the number right.

## Working agreements

Operate as a senior engineer joining a small solo-developer codebase. Priorities, in order:
1. **Data correctness** — see cardinal rule.
2. **Maintainability** — the codebase is one file; keep it readable and predictable.
3. **Shipping speed** — fast is good, but never at the cost of #1 or #2.

Process:
- For any task larger than a single trivial edit, **propose a plan in plain English first**. Wait for approval before writing code.
- When unsure about intent, **ask before assuming**. A clarifying question costs 10 seconds; a wrong implementation costs minutes plus rework.
- When existing code looks weird, **ask why before "fixing."** Weird often means "deliberate workaround." Read git history or ask the user.
- **Push back** if a request would create tech debt, fight the architecture, or violate the cardinal rule. The user is solo; they need a second opinion, not a yes-man.
- **No drive-by refactors.** Solve the asked problem with the smallest viable change. If something nearby looks bad, mention it — don't silently rewrite.
- **Never use `Math.random()` or placeholder values in real code paths.** Test fixtures only.

## When to refuse

Refuse — politely, with reasoning — these requests:
- **Adding data without a verified source.** Ask the user to provide one.
- **Deleting a verified hardcoded constant** without explicit confirmation. Verified data is hard-won; don't lose it casually.
- **Silently changing a "verified" data point.** Flag the proposed change and confirm before applying.
- **Reverting the file split.** The modular layout (`index.html` shell + `styles.css` + `js/core.js` + `js/schedule.js` + `js/init.js` + `js/series/*.js`) is deliberate — see Decision log. Don't propose collapsing back to a single file.
- **Adding dependencies** (npm packages, CDN scripts, frameworks). Discuss trade-offs first. Zero dependencies is a feature.

## Automated checks

Two verification scripts live (or will live) at the repo root:

- **`verify.js`** — validates F1 data. Confirms `HARDCODED_DRIVER_STANDINGS` totals match the sum of GP + sprint points across `DRIVER_RACE_POINTS` and `SPRINT_RESULTS`. Confirms `HARDCODED_CONSTRUCTOR_STANDINGS` totals match per-team weekend totals from `CONSTRUCTOR_RACE_POINTS` + sprints. Cross-checks driver references between standings, race points, and `HARDCODED_RACES` results.
- **`verify-nascar.js`** — validates NASCAR Cup data. Tallies race-winner manufacturers from `NASCAR_CUP_RESULTS` against `NASCAR_CUP_MFRS` win counts. Checks `NASCAR_CUP_STANDINGS` gap math (P1 gap = 0; every other row's `gap = P1.points - row.points`, negative). Confirms every driver referenced in results / standings / mfrs exists in `NASCAR_CUP_DRIVERS`.

**After any change that touches an F1 or NASCAR data constant, run both:**

```sh
node verify.js
node verify-nascar.js
```

Report the output before declaring the change done. If a check fails, **fix it before pushing**. Never push broken data.

> **Status:** both scripts exist at the repo root as of 2026-05-16 and pass against current data. Run them before declaring any F1 or NASCAR data change done.

## Git workflow

- **Commit per logical change.** One concept per commit — adding a race, fixing a typo, adding a feature. Don't batch unrelated edits.
- **Subject line: short imperative.** "add Canadian GP results" — not "added the results" or "various updates". Under ~60 chars.
- **Optional body** for context: why, sources, gotchas. Wrap at ~72 chars.
- **Push at natural stopping points**, not after every commit. A working feature, a verified fix, a completed section.
- **Never amend or force-push** commits already on GitHub. Pushed history is shared history.

## Decision log

Architectural decisions made and the reasoning behind them. Do not propose reversing these without a strong new reason.

- **Single-file HTML over React/framework.** PWA install simplicity, no build step, no framework overhead, trivial Vercel hosting (push → live in ~30 s). The whole app fits in one file a person can read in an hour. Do not propose a framework migration unless the user asks.
- **Hardcoded-first pattern over pure API.** Jolpica/Ergast and OpenF1 lag real-world results by days to weeks; race-day accuracy is non-negotiable. Hardcoded constants are canonical; API calls are supplementary (race lists, lap times, live timing). Sanity thresholds gate API standings (`leader.points >= 90` for drivers, `>= 170` for constructors).
- **"Off-air" live view over error states.** When no session is on track (the common case), the LIVE tab shows the next-race banner plus the most recent race recap — not an error screen. Friendlier and more useful.
- **Real data only, ever.** No mock data, no `Math.random()` filler, no Lorem ipsum stand-ins. See cardinal rule. Worth restating because it's load-bearing.
- **~~SCHEDULE as default landing tab~~ → superseded by HOME (2026-05-17).** Originally chose SCHEDULE as the default so users wouldn't drop into F1 specifically. As of 2026-05-17 the news-feed HOME view is the default landing — `js/init.js` calls `switchSeries('home')` on boot. The upcoming-races view is still accessible as the **RACE SCHEDULE** tab in the series bar; routing key remains `'schedule'`.
- **Vercel Web Analytics over alternatives** (Plausible, GA4, self-hosted). Native integration (no DNS lookup, same-origin script path survives more ad blockers, edge-served), cookieless by default so no consent banner, zero extra dependencies. Pageviews work on Hobby; custom events require Pro+. See Analytics section for the event taxonomy.
- **F1 race-weekend state machine over a static LIVE tab.** Users want to see whatever's currently relevant — qualifying when it's published, live timing during sessions, post-race recap with diff badges after. Four states with strict precedence (`session-live > post-race > qualifying-available > between-races`) drive the LIVE tab's render path. State is cached 60 s; `?devstate=` URL param forces a state for testing. See the [F1 race weekend state machine](#f1-race-weekend-state-machine) section. Polling **proposes** diffs via badge, never modifies hardcoded data — manual approval until Session 3 automates via GitHub Action PRs.
- **Open backlog (deferred sessions).** Session 2 = mirror the same state-machine / polling shape onto NASCAR. Session 3 = GitHub Action that watches the badge state, opens a PR with the proposed hardcoded-data update, and lets a human merge. Do not start either without explicit user direction.
- **Modular file split (2026-05-17).** Single-file `index.html` became HTML shell + `styles.css` + `js/{core,schedule,init}.js` + `js/series/{f1,nascar,n24,_template}.js`. Traditional `<script src>` tags (not ES modules) so inline `onclick="…"` handlers keep working without a `window.foo = foo` shim. No build step. Reason: enable parallel work and templated series-addition without bloating one file past comfortable read-in-one-pass. See **File layout**, **How to add a new series**, and **Parallel development boundaries** below.
- **Home is a news feed (2026-05-17).** `js/home.js` owns the landing view. `HOMEPAGE_ARTICLES` (10 entries) and `HOMEPAGE_FEATURED` are the write target for the deferred Session 5 daily aggregator. Article entries can be a mix of real verified articles and clearly-marked `[STUB — REPLACE]` placeholders (current state: a1–a8 real, a9–a10 stubs) — never substitute invented real-looking articles for stubs. When replacing a stub, source the URL the same way as the seeded entries (publication + verifiable link). The news feed renders newest-first by `publishedAt`.
- **Featured slot is a multi-series carousel (2026-05-18).** Horizontal scroll-snap, one card per series with completed results, sorted most-recent first via `getRecentWinnersAcrossAllSeries()` (currently F1 + NASCAR + N24). Cards are 280px wide so ~1.3 fit at 375px viewport — the peek of the next card is the swipe affordance. `HOMEPAGE_FEATURED` (in `js/home.js`) pins the leftmost card and de-dupes against the auto-derived series. `openHomeFeaturedCard(series)` routes each card to that series's RACE RESULTS sub-tab (or N24's default `results` tab).

## Current season state (as of 2026-05-15)

- **F1**: Round 4 (Miami GP) complete. Standings: Antonelli 100, Russell 80, Leclerc 59. Next: Canadian GP, 2026-05-24.
- **NASCAR Cup**: Round 12 (Watkins Glen) complete. Standings: Reddick 567, +129 over P2 (Hamlin 438). Next: Coca-Cola 600 at Charlotte, 2026-05-24.

When you update the hardcoded constants past these rounds, also update this section and the "After Rxx" labels in the renderers.

## Deploy workflow

- **Repo**: `github.com/JackH421/TraxStat`
- **Host**: Vercel, auto-deploy on push to `main`
- **Domains**: `traxstat.com`, `traxstat.app`, `traxstat.live` (all point to the same deployment)
- **Build**: none — Vercel serves `index.html`, `styles.css`, and every `js/**/*.js` file as static assets. Deploy takes ~30 s from push to live.
- To ship a change: edit the relevant file (one of `index.html`, `styles.css`, or a module under `js/`), commit, push. That's the whole pipeline.

## Analytics

We use **Vercel Web Analytics** for pageview + custom event tracking. Cookieless and GDPR-compliant — no consent banner required.

### How it's wired

- **Init stub + deferred loader** at the bottom of `<body>` in `index.html`:
  ```html
  <script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script>
  <script defer src="/_vercel/insights/script.js"></script>
  ```
  Same-origin path (no third-party DNS, no CORS) and Vercel auto-rewrites it from the edge once Analytics is enabled in the dashboard.
- **`track(name, data)` helper** lives in `js/core.js` (just after `setStats`). Fail-silent: if `window.va` isn't a function (ad-blocked, network failure, CSP), the call is a no-op. The site never breaks when analytics is unavailable.
- **Pageviews** fire automatically on every page load. Custom events fire on user actions via `track()` calls embedded in handlers and template-literal `onclick` attributes.

### Events being tracked

| Event | Data | Fired on |
|---|---|---|
| `tab:series` | `{ series }` | Top-level series tab click |
| `tab:f1` | `{ tab }` | F1 sub-tab |
| `tab:nascar` | `{ tab }` | NASCAR sub-tab |
| `tab:nascar-series` | `{ series }` | Cup / Xfinity / Trucks toggle |
| `race:open:f1` | `{ round }` | Tap a completed F1 race |
| `race:open:nascar` | `{ round }` | Tap a completed NASCAR race |
| `driver:expand:f1` | `{ name }` | Expand F1 driver championship breakdown |
| `driver:expand:nascar` | `{ name }` | Expand NASCAR driver championship breakdown |
| `constructor:expand:f1` | `{ name }` | Expand F1 constructor breakdown |
| `mfr:expand:nascar` | `{ name }` | Expand NASCAR manufacturer breakdown |
| `tab:n24` | `{ tab }` | N24 sub-tab click (results / qualifying / recap) |
| `result:expand:n24` | `{ car }` | Expand an N24 top-20 results row |
| `recap:open:n24` | `{ index }` | Tap an N24 recap thumbnail |
| `refresh` | — | Refresh button click |
| `home:featured` | `{ series }` | Tap a featured-carousel card on HOME (per-series) |
| `home:championship` | `{ series }` | Tap a championship-leader card on HOME |
| `home:article` | `{ series, source }` | Tap a news-feed article card on HOME (opens external URL) |
| `home:render` | `{ cardCount, topSeries }` | Fires once per `renderHome()` — origin/funnel marker |

### Privacy / PII rules

**Never track user PII.** This is non-negotiable:
- **Do not track** anything identifying the visitor: IPs (Vercel handles those server-side, anonymized), email addresses, session tokens, free-text user input, URL query strings carrying personal data, anything the user typed.
- **OK to track** which public sports figure / team / manufacturer the user clicked. Names like "Antonelli", "Mercedes", "Reddick", "Toyota" are public references the user selected from our static list — not data they provided about themselves. If a feature ever lets users *type* a name (search box, custom note), that text **must not** go into `data`.
- Vercel's per-event constraints: `data` values must be `string | number | boolean | null` (no nested objects), 255-char limit per name / key / value, plan-dependent cap on distinct event names.
- **Custom events require Pro plan or higher**; pageviews work on Hobby. If we ever downgrade, the `track()` calls become silent no-ops on the dashboard side but the site keeps working.

### Adding a new event

1. Pick a `name` using the existing `category:action[:scope]` convention (e.g. `lap:expand:f1`).
2. Call `track('your-event-name', { ... })` at the action site. Keep `data` to flat key-value pairs of allowed types.
3. Verify no PII can leak into `data`. If the value comes from user input rather than a static list, don't pass it.
4. Add a row to the event table in this section, deploy, and confirm the event appears in the Vercel Analytics dashboard within a few hours.

## Temporary event views

For major one-off events that don't deserve a permanent series tab (Le Mans 24, Indy 500, Bathurst 12h, Spa 24, etc.), we add a **temporary view** that ships with the race week and gets deleted after. The Nürburgring 24 build (May 2026) established the pattern; it has since been converted to a permanent post-race module — see the [N24 module](#n24-module) section below.

### Marker convention

Every temporary view is wrapped with a consistent comment so any future session can find and remove it in under 5 minutes:

```
// ── <NAME> TEMPORARY (DELETE AFTER <date>) ───────────────────────────────────
// ...code...
// ── END <NAME> TEMPORARY ─────────────────────────────────────────────────────
```

`<NAME>` is a short upper-case key (e.g. `N24`, `LM24`, `INDY500`). Use the same `<NAME>` for every site so `grep -rn "<NAME> TEMPORARY" .` finds them all (now that the codebase is split across `index.html`, `styles.css`, and `js/`).

### Five marker sites in a typical view

1. **Series-bar HTML** — the new tab. Wrap with `<!-- ... TEMPORARY -->` HTML comments.
2. **`switchSeries` index array** — add the tab key (e.g. `'n24'`) to the `.series-tab` ordering array used by `classList.toggle`.
3. **`switchSeries` branch** — `if(s==='<key>'){render<Event>();return;}` with a trailing `// <NAME> TEMPORARY` comment so it's grep-able even though it's one line.
4. **Main module block** — constants, `<event>Phase()` helper, `render<Event>()` function, any per-second timers. Wrap with the start/end marker pair.
5. **(Optional) init-time side effects** — e.g. lighting up the series-bar dot before the user opens the tab. One-line, lead with the temporary comment.

After the event: `grep -rn "<NAME> TEMPORARY" .` finds every site; delete each marked block. Run `node verify.js && node verify-nascar.js` before committing the removal to confirm no permanent data was touched.

### Build conventions for the view itself

- Cardinal rule still applies: every fact (driver name, car number, qualifying time, race start) must be verified from an official source. State the source in the commit message.
- **Hardcoded snapshot data only.** Don't try to scrape live timing client-side — CORS will block, and `X-Frame-Options: SAMEORIGIN` blocks iframe embedding for every official timing host checked so far (24h-rennen.de, racehero.io, fg91motorsport.com). If you need a different conclusion, re-verify with a `curl -sI` of the new event's timing host before designing around it.
- **Live timing fallback:** styled "Open Live Timing" button that opens the official page in a new tab. Track the click as a custom event (e.g. `n24:open-timing`) so we can see if anyone uses it.
- **Live stream:** YouTube channel-live embed pattern (`https://www.youtube.com/embed/live_stream?channel=<CHANNEL_ID>`) auto-resolves to whatever's live on the channel — no need to update video IDs day-of.
- **Phase helper.** Single function returning `{ phase: 'pre' | 'live' | 'post', label, sub, color }`. The view template renders the same shape across all three phases; the helper provides countdown / elapsed / "FINISHED" labels.
- **Per-second timer** for countdown/elapsed updates. Self-cancels when `currentSeries !== '<key>'` to avoid background work after the user leaves the tab.

## File layout

```
~/TraxStat/
├── index.html              ~77 lines — shell only (head, body scaffold, 7 <script src> tags + Vercel analytics stub)
├── styles.css              ~180 lines — every CSS rule the app uses
├── js/
│   ├── core.js             ~240 lines — utilities, app-wide state, JOLPICA API helpers,
│   │                                    switchSeries, refresh, updateLiveDots, renderLiveOffAir
│   ├── schedule.js         ~78 lines — renderSchedule, renderScheduleRow (secondary view)
│   ├── home.js             ~389 lines — HOMEPAGE_FEATURED, HOMEPAGE_ARTICLES (10 entries),
│   │                                    N24_META; getRecentWinnersAcrossAllSeries,
│   │                                    formatRelativeTime, getSeriesAccentColor/Label;
│   │                                    open* action handlers; renderHomeFeaturedCarousel,
│   │                                    renderHomeChampionships, renderHomeArticles,
│   │                                    renderHomeFooter, renderHome
│   ├── init.js             ~24 lines — boot statements: switchSeries('home'),
│   │                                   the two setInterval timers, updateF1Badges, and
│   │                                   the F1 post-race-polling resumption IIFE
│   └── series/
│       ├── f1.js           ~1,051 lines — NEXT_RACES, all HARDCODED_* + per-race-points
│       │                                  constants, race/champ/quali renderers, live timing,
│       │                                  state machine, post-race polling, switchF1Tab
│       ├── nascar.js       ~576 lines — NASCAR_CUP_* constants, every renderNascar*,
│       │                                switchNascarTab, switchNascarSeries,
│       │                                nascarOffAirContext
│       ├── n24.js          ~281 lines — N24_VERSTAPPEN, N24_2026_* constants,
│       │                                every renderN24*, switchN24Tab, toggleN24Entry,
│       │                                toggleN24Recap
│       └── _template.js    ~65 lines — copy-and-rename starter for new series; not loaded
├── verify.js               reads js/series/f1.js
├── verify-nascar.js        reads js/series/nascar.js
└── CLAUDE.md               this file
```

No `package.json`, no bundler, no tests, no README. `CLAUDE.md` is the working contract. Open `index.html` in a browser to run the app (or `python3 -m http.server` from the repo root and hit `127.0.0.1:8000` — `file://` won't satisfy the absolute `/styles.css` and `/js/...` paths).

### Script load order

Seven `<script src>` tags in `index.html`, in this order:

```
core.js → series/f1.js → series/nascar.js → series/n24.js → schedule.js → home.js → init.js
```

Reasoning: `core.js` declares shared utilities, state, and the router with **zero** cross-file references. Series files declare their own data + renderers; `core`'s `fetchRaceResults` / `fetchDriverStandings` / etc. read F1's `HARDCODED_*` constants at call time (when the user interacts), by which point f1.js has loaded. Same for `updateLiveDots` reading `NEXT_RACES` (f1) and `NASCAR_CUP_SCHEDULE` (nascar). `schedule.js` reads both F1's `NEXT_RACES` and NASCAR's `NASCAR_CUP_SCHEDULE`, so it loads after both. `home.js` reads `HARDCODED_RACES` (f1), `NASCAR_CUP_RESULTS` + `NASCAR_CUP_SCHEDULE` + `NASCAR_CUP_DRIVERS` (nascar), `N24_2026_RESULTS` (n24), and the two championship-standings constants — so it loads after the series files. `init.js` runs the imperative boot code last — by which point every global is declared.

Traditional `<script>` tags (not `type="module"`) so top-level `function` declarations sit on `globalThis` and inline `onclick="switchSeries('f1')"` handlers find them without a `window.foo = foo` shuffle. Top-level `const`/`let` declarations share a single Script Global Lexical Environment across all classic scripts, so cross-file constant references resolve at call time the same way.

## Architecture at a glance

- **State**: a handful of top-level `let` variables (`currentSeries`, `currentF1Tab`, `selectedRace`, `selectedDriver`, `isLive`, plus NASCAR equivalents `currentNascarTab`, `currentNascarSeries`, `selectedNascarRace`, etc.). No framework, no reactive store. Mutate the var, then call the matching `render*()` function which replaces `#main-content.innerHTML` wholesale.
- **Rendering pattern**: each tab has a `render<Tab>()` function that builds an HTML string and assigns it to `document.getElementById('main-content').innerHTML`. Inline `onclick="..."` attributes on rendered elements call back into top-level functions (`selectRace`, `toggleLaps`, `switchF1Tab`, etc.). This means every function the HTML references must be at the top level of some classic script — which is why we use traditional `<script src>` tags, not ES modules.
- **Routing**: `switchSeries(s)` for the top tab bar; `switchF1Tab(tab)` and `switchNascarTab(tab)` for the sub-bars; `switchNascarSeries(s)` for Cup/Xfinity/Trucks. Each toggles the `.active` class and calls the appropriate render fn.
- **Default landing**: `currentSeries` is initialised to `'schedule'` in `core.js` but immediately overridden — `js/init.js` calls `switchSeries('home')` on boot, which renders the news-feed HOME view. The F1 and NASCAR submenu bars start hidden.
- **Refresh**: the `⟳` button calls `refresh()`, which clears all in-memory caches and re-renders the current view (schedule, F1, or NASCAR).
- **Live polling**: `setInterval` re-runs `renderLive()` every 30 s, but only when `currentSeries==='f1' && currentF1Tab==='live' && isLive`.

## Series support

| Series  | Status                                                                 |
|---------|------------------------------------------------------------------------|
| Home    | Default landing view — news feed (2026-05-17). Featured carousel of recent winners across all series with completed results, championship snapshot for F1 + NASCAR, 10-card article feed. Video Highlights is a TODO hook for Session 5. See `js/home.js`. |
| Race Schedule | Secondary view — hero card for next race across all series + next 3 closest races. Routable via the **RACE SCHEDULE** tab (label renamed 2026-05-17; routing key remains `'schedule'`). |
| F1      | Fully built — five sub-tabs (LIVE / QUALIFYING / RACE RESULTS / DRIVERS / CONSTRUCTORS). LIVE is adaptive per [race-weekend state machine](#f1-race-weekend-state-machine). |
| NASCAR  | Cup fully built (results, drivers, manufacturers, schedule). Xfinity/Trucks are placeholder "coming soon" screens (`renderNascar*` functions early-return when `currentNascarSeries !== 'cup'`) |
| N24     | Permanent post-race-only module for the 2026 Nürburgring 24 — three sub-tabs (RACE RESULTS / QUALIFYING / RECAP). See [N24 module](#n24-module). |
| MotoGP, WRC, IndyCar, GT3/WEC | Placeholder only — `switchSeries` renders a generic "Coming Soon" state |

## How to add a new series

The whole template lives in `js/series/_template.js`. End-to-end, adding (say) MotoGP looks like this:

1. `cp js/series/_template.js js/series/motogp.js`
2. In the new file, do three find-replaces (single-character delimiters keep them unambiguous):
   - `__series__` → `motogp` (lowercase key — analytics, switchSeries arg, the filename)
   - `__Series__` → `MotoGP` (PascalCase — `renderMotoGP`, `switchMotoGPTab`)
   - `__SERIES__` → `MOTOGP` (uppercase prefix — `MOTOGP_RESULTS`, `MOTOGP_SCHEDULE`)
3. Populate the hardcoded data constants from a verified official source. **Cardinal rule applies** — state the source first, then add values; if you can't verify, use `'—'` placeholders and a comment, never a guess.
4. Add a `<script src="/js/series/motogp.js"></script>` line to `index.html`, alphabetically among the existing series scripts (the load-order constraint is `core → series files → schedule → init`; alphabetical within the "series files" group is fine since they don't depend on each other).
5. Add the tab to the `.series-bar` in `index.html`:
   ```html
   <div class="series-tab" onclick="switchSeries('motogp')"><div class="series-dot"></div>MOTOGP</div>
   ```
   And add `'motogp'` to the index array inside `switchSeries()` in `js/core.js` so the `.active` class toggles correctly.
6. Add an `if(s==='motogp'){renderMotoGP();return;}` branch to `switchSeries()` in `js/core.js`, just above the generic "Coming Soon" fallback.
7. If the series needs a sub-menu like F1's, add a `<div class="f1-submenu" id="motogp-submenu" …>` block to `index.html`, show/hide it in `switchSeries` the same way f1-submenu and nascar-submenu are toggled, and implement `switchMotoGPTab()` mirroring `switchF1Tab` / `switchNascarTab`.
8. Run `node verify.js && node verify-nascar.js`. Both should still pass — they read F1 and NASCAR data, untouched.
9. Add the series to the **Series support** table above and (optionally) to the **Analytics events** table if you wired analytics into the new switch/render functions.

The template is a working "Coming Soon" stub the moment you finish the renames — it loads, the tab is clickable, the placeholder screen renders. From there you grow it incrementally.

## Parallel development boundaries

The split was designed so multiple Claude Code sessions (or human contributors) can work in parallel without merge conflicts. Independent territories:

| Territory | File(s) |
|---|---|
| Page shell | `index.html` |
| Stylesheet | `styles.css` |
| Shared utilities + router | `js/core.js` |
| Cross-series schedule view | `js/schedule.js` |
| HOME news-feed view | `js/home.js` |
| Boot code | `js/init.js` |
| Per-series logic + data | `js/series/<key>.js` |

Two sessions touching different territories will merge cleanly. The conflict surface only opens when two sessions touch the **same** file at the same time. Add-a-series work touches three files (`index.html` for the tab + script tag, `js/core.js` for the router branch, and the new `js/series/<key>.js`), so it's localized — one short edit in two shared files plus a new file that nobody else is editing.

If two efforts genuinely need to share state or a utility, that goes in `js/core.js` and becomes a coordination point — but most series-level work shouldn't need to touch core. Per-series files import nothing and export nothing in the literal sense (classic scripts share a global lexical env), but the discipline is: a series file's renderers and data are private to that file; if you find yourself reaching into another series file's globals, that's a smell — move the shared thing to `core` or duplicate the small bit you need.

## F1 data sources

Two external APIs, with hardcoded fallbacks layered on top:

1. **Jolpica** (`https://api.jolpi.ca/ergast/f1`) — Ergast successor. Used for the 2026 race list, per-race results, lap times, and championship standings.
2. **OpenF1** (`https://api.openf1.org/v1`) — used **only** by `renderLive()` for in-session timing (sessions, drivers, positions, laps, stints, intervals).

### Hardcoded-first pattern

This is the most important thing to understand about the F1 module:

- `HARDCODED_RACES`, `HARDCODED_DRIVER_STANDINGS`, `HARDCODED_CONSTRUCTOR_STANDINGS`, `SPRINT_RESULTS`, `DRIVER_RACE_POINTS`, `CONSTRUCTOR_RACE_POINTS`, and `SEEDED_FASTEST_LAPS` all live in `js/series/f1.js`. **Verified, hand-curated 2026 results.**
- `fetchRaceResults(round)` checks `HARDCODED_RACES[round]` **before** hitting Jolpica.
- `fetchDriverStandings` / `fetchConstructorStandings` only trust the API if the leader's point total clears a sanity threshold (90 for drivers, 170 for constructors). Otherwise they return the hardcoded list. This is because Jolpica lags real results by days to weeks.
- `renderRaceSelector` builds its race list directly from `Object.values(HARDCODED_RACES)` — it does **not** call `fetchRaceList`. The API call exists but is unused for the main list.

When a new race finishes, you update three or four constants:
1. Add an entry to `HARDCODED_RACES[round]` with the full classification.
2. Update every driver's array in `DRIVER_RACE_POINTS` with their finishing position + points for that round.
3. Update every team's array in `CONSTRUCTOR_RACE_POINTS` likewise.
4. Update `HARDCODED_DRIVER_STANDINGS` and `HARDCODED_CONSTRUCTOR_STANDINGS` totals.
5. If it's a sprint weekend, add to `SPRINT_RESULTS[round]` (top 8 only, points 8-7-6-5-4-3-2-1).
6. If you know the race fastest lap, add to `SEEDED_FASTEST_LAPS[round]`.

`NEXT_RACES` (in `js/series/f1.js`) is a separate hardcoded list of upcoming rounds used for the "Next Race" banner, the SCHEDULE landing page (read by `renderSchedule` in `js/schedule.js`), and the live-dot gating in `updateLiveDots` (in `js/core.js`).

### Team name normalization

API team names lag the 2026 rebrands. `normalizeTeam(name)` (in `js/core.js`) maps legacy names to current ones:

- `Kick Sauber` / `Sauber` → `Audi`
- `RB F1 Team` / `RB` / `AlphaTauri` → `Racing Bulls`

The `TC` color palette and `DT` (driver-number → team) map use the 2026 names. Always pass API-returned team names through `normalizeTeam` before using them as lookup keys.

### 2026 grid encoded in `DT` (in `js/core.js`)

Driver-number → team for the OpenF1 live view. Notable 2026 seats baked in:
- Mercedes: Russell (63), Antonelli (12)
- Ferrari: Hamilton (44), Leclerc (16)
- McLaren: Norris (4), Piastri (81)
- Red Bull: Verstappen (1), Hadjar (6)
- Racing Bulls: Lawson (30), Lindblad (TBD — not in `DT`)
- Aston Martin: Alonso (14), Stroll (18)
- Alpine: Gasly (10), Colapinto (43)
- Williams: Sainz (55), Albon (23)
- Haas: Bearman (87), Ocon (31)
- Audi: Hulkenberg (27), Bortoleto (5)
- Cadillac: Perez (11), Bottas (77)

## F1 race weekend state machine

The LIVE tab is adaptive — it renders one of three views depending on the current weekend state. Other F1 sub-tabs gain a yellow-dot diff badge when post-race polling detects Jolpica disagrees with our hardcoded constants.

### Four states (precedence: highest wins)

1. **`session-live`** — OpenF1 reports a session currently in progress (practice / qualifying / race). LIVE tab → live timing.
2. **`post-race`** — A race in `NEXT_RACES` is past `start + 4h`, within 24h of start, and not yet in `HARDCODED_RACES`. LIVE tab → off-air recap; polling runs in background.
3. **`qualifying-available`** — Jolpica returned non-empty qualifying for the upcoming round, and that round isn't yet hardcoded. LIVE tab → banner + compact top-10 quali + "Full Qualifying →" CTA.
4. **`between-races`** — Default. LIVE tab → next-race banner + last-race recap.

### Caching and idle-window gating

- State is cached in `_f1StateCache` for 60 s. Repeated calls within a minute return the cached value.
- OpenF1 sessions endpoint is only fetched when today is within ±3 days of a `NEXT_RACES` entry — keeps idle-week traffic to zero.
- Jolpica qualifying endpoint is only fetched when there's an upcoming round not yet hardcoded.

### `?devstate=` URL param for testing

Bypasses cache and computation. Accepts `between-races` / `qualifying-available` / `session-live` / `post-race`. Any other value (or no param) falls through to the real state machine.

```
https://traxstat.com/?devstate=qualifying-available
```

### What each F1 sub-tab renders per state

| Sub-tab | `between-races` | `qualifying-available` | `session-live` | `post-race` |
|---|---|---|---|---|
| **LIVE** | banner + last-race recap | banner + top-10 quali + CTA | OpenF1 live timing | banner + recap (polling in bg) |
| **QUALIFYING** | most-recent quali Jolpica has data for (any round) | same | same | same |
| **RACE RESULTS** | hardcoded races only | same | same | same + yellow `•` if diff detected |
| **DRIVERS** | hardcoded standings | same | same | same + yellow `•` if diff |
| **CONSTRUCTORS** | hardcoded standings | same | same | same + yellow `•` if diff |

### `HARDCODED_QUALI_VIDEOS`

Per-round, per-driver qualifying highlight video IDs for the QUALIFYING tab's expandable rows. Empty initially. Same verification workflow as N24 onboards.

Shape:
```js
const HARDCODED_QUALI_VIDEOS = {
  <roundNumber>: {
    '<jolpicaDriverId>': 'youtubeVideoId',
    ...
  },
};
```

To add per weekend:
1. Find a YouTube video for the driver's qualifying run from the official F1, FIA, or Formula1 channels (or a reputable third-party with an embeddable upload).
2. Verify both existence and embeddability:
   ```sh
   curl -sS "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json"
   curl -sS "https://www.youtube.com/embed/ID" | grep -E "ytcfg.set|playerResponse|Video unavailable|EMBED_NOT_ALLOWED"
   ```
   oEmbed must return HTTP 200; the embed page must contain `ytcfg.set` or `playerResponse` and must **not** contain `EMBED_NOT_ALLOWED` or `Video unavailable`.
3. Add the entry to `HARDCODED_QUALI_VIDEOS[round]` keyed by Jolpica `driverId` (e.g. `'verstappen'`, `'leclerc'`).

Rows without a verified entry render as plain rows — no green LIVE FEED label, no tap-to-expand. Per the cardinal rule, never add an unverified video ID.

### Post-race polling

When state transitions to `'post-race'` and no poll timer is active, `startF1PostRacePolling(round)` fires. Polling proposes via badge; it **never** modifies hardcoded data.

**Cadence — 35 polls over 24h:**
- 0–60 min after race end → every 5 min (12 polls)
- 1–24 hr after race end → every 1 hr (23 polls)
- 24 hr+ → stop

**Race-end anchor:** `determineRaceEndAnchor(round)` tries OpenF1 `session_end_time` for the race session first; falls back to `race.date + 'T13:00:00Z' + 4h` if OpenF1 doesn't have it. Once set, the anchor is locked in `localStorage` so the 35-poll sequence survives reloads.

**Endpoints polled in parallel each tick:**
- `${JOLPICA}/2026/{round}/results/?limit=30`
- `${JOLPICA}/current/driverStandings/`
- `${JOLPICA}/current/constructorStandings/`

**`localStorage` keys:**
- `traxstat:f1:pollStart:{round}` — race-end anchor timestamp
- `traxstat:f1:lastPoll:{round}` — last successful poll timestamp
- `traxstat:f1:lastResults:{round}` — JSON snapshot of last race results
- `traxstat:f1:lastDriverStandings` — JSON snapshot
- `traxstat:f1:lastConstructorStandings` — JSON snapshot
- `traxstat:f1:badge:{tab}` — `'1'` when diff detected for that tab; absent when dismissed

**Yellow-dot badge UI.** When `diffAndBadge` sees a JSON snapshot mismatch, it appends a small `•×` to the affected sub-tab label (RACE RESULTS / DRIVERS / CONSTRUCTORS). Two dismiss paths converge on `dismissF1Badge(tab)`:
- **Tab visit** — tapping the affected sub-tab auto-clears the badge ("I've seen it").
- **`×` click** — explicit dismiss without visiting. `event.stopPropagation()` prevents accidental tab switch.

**`startF1PostRacePolling` trigger points** (only two — no other code path can start polling):
1. **Init IIFE** — walks `NEXT_RACES` for any saved poll anchor still within 24h, then checks `findPostRaceRound()` for first-time post-race detection on page load.
2. **`getF1RaceWeekendState` mid-session hook** — when state resolves to `'post-race'` and `f1PollTimer` is null. Closes the gap where a user keeps the page open across a `session-live → post-race` transition without reloading.

Both paths are gated on per-round post-race conditions (within 24h of start, not yet hardcoded). `startF1PostRacePolling` is idempotent — first statement is `if(f1PollTimer)return;` — so re-entries don't stack timers.

### Cardinal rule reinforcement

Polling **proposes** diffs via badge. It **never** writes to `HARDCODED_RACES`, `HARDCODED_DRIVER_STANDINGS`, or `HARDCODED_CONSTRUCTOR_STANDINGS`. The user reviews the diff (console-logged on each detection) and updates the canonical constants manually. Session 3 — deferred — will automate this loop via a GitHub Action that opens a pull request when a badge fires.

## NASCAR Cup data

Entirely hardcoded in `js/series/nascar.js` — there is no NASCAR API call anywhere in the codebase.

All NASCAR constants live in `js/series/nascar.js`:

- `NASCAR_CUP_DRIVERS`: last-name → `{first, team, mfr, num}` map for all full-time entries.
- `NASCAR_CUP_SCHEDULE`: 36-round 2026 schedule with `round`, `race`, `track`, `date`, `laps`, optional `type` (`'R'` road course, `'S'` street), optional `chase: true` for Chase rounds (R27–36). Also drives the NASCAR SCHEDULE sub-tab.
- `NASCAR_CUP_RESULTS`: completed rounds keyed by round number. Each entry has `winner`, optional `p2`/`p3`, `polePos`, `stage1`, `stage2`, and a `note` string with race color.
- `NASCAR_CUP_STANDINGS`: driver points after the latest completed round. The `cutline: true` flag on P16 marks the Chase cutline; the cutline divider also renders unconditionally after P16.
- `NASCAR_CUP_MFRS`: manufacturer wins (Toyota, Chevrolet, Ford). NASCAR no longer publishes official manufacturer points, so this tracks **wins only**.

To add a completed race: append to `NASCAR_CUP_RESULTS`, then update `NASCAR_CUP_STANDINGS` totals and `NASCAR_CUP_MFRS` wins. The race list, "last race recap", and driver win history are all derived from these constants.

## N24 module

Permanent **post-race-only** module for the 2026 Nürburgring 24 Hours (16–17 May 2026). No countdown, no timers, no live polling, no schedule-page integration — the data is frozen at the moment the race finished. Three sub-tabs:

- **RACE RESULTS** (default) — Verstappen card on top (Q4 → P38 DNF, driveshaft reason), then top-20 compact rows with tap-to-expand for full driver list + car model + class-win badge + any per-entry note.
- **QUALIFYING** — Top Qualifying 3 pole shootout (12 cars). P1 yellow text, Verstappen Racing row (#3, P4) red border-left highlight.
- **RECAP** — 2×2 grid of recap-video thumbnails using static `img.youtube.com/vi/{ID}/mqdefault.jpg` URLs; tap to expand into a full-width iframe + caption, one at a time.

### Data constants

- `N24_VERSTAPPEN` — the highlighted Verstappen Racing entry. Includes `qualifying` and `finalResult` ({position, classifiedPos, reason}).
- `N24_2026_RESULTS` — top-20 final classification. Top-20 only — **full classification (P21+, lap counts, gaps, fastest laps, grid positions, sector splits) is pending the official ADAC PDF.** Planned future task: extend to top-30 + per-car stats once the PDF publishes.
- `N24_2026_QUALIFYING` — TQ3 pole-shootout, 12 entries. Positions P13+ are set from prior qualifying sessions and aren't in scope for this view.
- `N24_2026_RECAP` — 4 verified videos from the official ADAC RAVENOL 24h Nürburgring channel and GT World (official SRO channel).

### State variables

- `currentN24Tab` — `'results'` (default) | `'qualifying'` | `'recap'`
- `selectedN24Entry` — car # of the expanded results row, or `null`
- `selectedN24RecapIndex` — index of the expanded recap video, or `null` (one iframe at a time)

### Verification

No dedicated `verify-n24.js` script. Rationale: the three constants are a frozen snapshot, no per-race ongoing updates, no cross-constant invariants worth machine-checking. **When adding or changing recap video IDs**, run the YouTube oEmbed + embed-page check that `HARDCODED_QUALI_VIDEOS` uses (see the F1 module's QUALIFYING section). Per the cardinal rule, every other field (driver name, car number, qualifying time, class, team name) must be verified manually against the named sources before being added.

Revisit a dedicated script only when the top-30 + per-car-stats expansion lands — at that point cross-checks become useful (e.g. qualifying position referenced from a results entry must exist in `N24_2026_QUALIFYING`; positions strictly ascending; laps strictly descending).

## "Off-air" live view

When no F1 or NASCAR session is in-progress (the common case), the LIVE tab does not render an error. Instead, `renderLiveOffAir(reason, ctx)` renders:
1. The "next race" banner with countdown.
2. A "NO SESSION ON TRACK" status row.
3. A recap of the most recent completed race with podium and a "View full results" link that switches to the results tab.

The function is generic over series via a `ctx` object. F1 uses default ctx; NASCAR builds one in `nascarOffAirContext()` that adapts `NASCAR_CUP_RESULTS` into the F1-shaped `Results` array the renderer expects.

## Styling conventions

- CSS variables in `:root` (top of `styles.css`): `--bg #0a0a0a`, `--red #e8002d`, `--yellow #ffd600`, `--green #00d84a`, etc. Use these instead of literal hex values.
- Fonts (loaded from Google Fonts):
  - **Barlow Condensed** — display / headings / table labels
  - **Barlow** — body / sub-labels
  - **Share Tech Mono** — times, gaps, points, anything numeric/data-like
- Team-color text: `style="color:${tc(teamName)}"` where `tc` looks up `TC[team]` and falls back to `#888`.
- Tire compound badges: `tireBadge(compound, age)` returns a colored circle (S red, M yellow, H white) plus optional lap count.
- Lots of inline `style="..."` strings in template literals. There's no separate stylesheet — if you're editing a renderer, the styling lives in the same template.

## F1 race weekend automation

A typical F1 race weekend runs end-to-end with zero manual intervention except (a) tapping "Merge" on the auto-PR after each race and (b) adding qualifying highlight videos via the existing separate workflow.

### What runs automatically

- **State machine** (browser, `js/series/f1.js`) — `getF1RaceWeekendState()` cached 60 s. Detects `between-races` / `qualifying-available` / `session-live` / `post-race` and switches the LIVE tab's render path. Precedence: `session-live > post-race > qualifying-available > between-races`.
- **Live timing** — when an OpenF1 session is reported active, the LIVE tab fetches `https://api.openf1.org/v1/sessions?...` every 30 s and renders the live grid.
- **Live pill + green dot** — the header live-pill pulses during sessions; the series-bar green dot on F1 lights from `updateLiveDots()` in `js/core.js`, gated to ±2 days of a `NEXT_RACES` entry.
- **Client-side post-race polling** — `startF1PostRacePolling(round)` in `js/series/f1.js`. 35-poll sequence across 24 h: every 5 min for the first hour, then hourly. Each poll hits Jolpica `/results/`, `/driverStandings/`, `/constructorStandings/`. JSON diffs surface as yellow-dot badges on the affected sub-tab; tooltip explains the server-side poll also runs. Defense-in-depth fallback only.
- **Server-side post-race polling** — `.github/workflows/f1-post-race-poll.yml` + `scripts/post-race-poll.mjs`. Cron `*/30 * * * *` year-round. Inside a post-race window (race start + 4h < now < +24h, round not yet in `HARDCODED_RACES`), fetches Jolpica, applies completeness gates (results non-empty, driver leader ≥ 90 pts, constructor leader ≥ 170 pts), and opens (or updates) an `auto/f1-r{N}-*` pull request proposing the canonical-data update. Direct commits to `main` are forbidden — every change is a PR.

### What I do manually

- **Merge the auto-PR** after cross-checking the diff against F1.com / FIA classification.
- **Add qualifying highlight videos** to `HARDCODED_QUALI_VIDEOS` — separate workflow, not Jolpica-driven.
- **Update `SPRINT_RESULTS`** if a sprint weekend (Jolpica's `/results/` endpoint doesn't carry sprint data) and **`SEEDED_FASTEST_LAPS`** if Jolpica lagged on fastest-lap reporting — both via the existing manual post-race-fix prompt.

### Testing the Action

- **GitHub UI** → Actions → "F1 Post-Race Poll" → Run workflow → check `test_mode: true` → Run. A `[TEST] data: F1 test PR (auto-detected) — DO NOT MERGE` PR opens, touching only `scripts/.test-pr-marker.md` (no canonical data). Close it without merging.
- **Local dry-run**: `DRY_RUN=true node scripts/post-race-poll.mjs` prints the would-be PR title/body and exits. `TEST_MODE=true DRY_RUN=true` exercises the test-fixture path with no GitHub side effects.
- **`?devstate=<state>` URL param** still forces any LIVE-tab state for visual debugging — `between-races`, `qualifying-available`, `session-live`, `post-race`. Bypasses the cache.

### Mobile push notifications (one-time setup)

GitHub mobile app pushes a notification when an auto-PR opens. Confirm: app installed, signed in, the `JackH421/TraxStat` repo's watch level is at least "Pull requests" (defaults to "All Activity" for repo owners), and push notifications for PRs are enabled in app settings. No Telegram bot, no email service, no third-party. Zero secrets to configure.

### If the Action ever fails silently

- The **client-side yellow-dot badge** on RACE RESULTS / DRIVERS / CONSTRUCTORS is the visible fallback. Tap the tab or the `×` to dismiss.
- The **manual post-race-fix prompt** becomes the recovery path: read the badge's console diff log (open DevTools, `F1 polling: ...` lines), hand-update `js/series/f1.js`, `node verify.js`, commit.

## Race-day checklist

| When | What to expect / do |
|---|---|
| Fri / Sat (practice + quali) | Site auto-renders FP and quali whenever someone opens the LIVE tab. No action needed. |
| Sun pre-race | Live pill pulses, series-bar green dot lights, LIVE tab shows live timing. No action needed. |
| Sun post-race (first 4 h) | Off-air recap renders with podium from cached results. Server-side polling is dormant (waiting for the +4 h mark). |
| Sun post-race (4–24 h) | Cron firings begin. **Expect a phone push notification when the first auto-PR opens** — typically within 30–60 min of the race ending. Yellow-dot badges may also appear on RACE RESULTS / DRIVERS / CONSTRUCTORS for visitors with the tab open. |
| Sun evening | From phone: review the auto-PR diff against F1.com / FIA. Tap **Merge**. |
| Mon | If the merged PR was missing sprint data, fastest-lap details, or qualifying videos, top them up via the existing manual prompts. |

## Common gotchas

- **Per-file size is small now.** Every file in the modular layout is comfortably under 1,100 lines (the biggest, `js/series/f1.js`, is ~1,051). A single `Read` per file fits in one tool call. The previous "read in chunks" advice is obsolete — but be aware of cross-file impact: a change to `js/core.js` can affect every series; a change to `index.html` script tags affects load order. Targeted reads stay cheap; whole-app changes need the load-order constraint in mind.
- **HTML and JS are coupled by string IDs.** The DOM relies on hardcoded element IDs (`main-content`, `live-pill`, `stat-1`..`stat-4`, `tab-live`, `tab-schedule`, `ntab-live`, `ntab-schedule`, `nseries-cup`, etc.) and on inline `onclick` handlers binding to globally-named functions. Renaming a function called from rendered HTML will break it silently.
- **State + render = full DOM replacement.** Mutating state and forgetting to call the render function leaves the UI stale. Conversely, every render rebuilds the whole panel, so transient DOM state (scroll position, focus) is lost — that's why `selectRace` etc. use `setTimeout(..., 100)` + `scrollIntoView` to restore scroll after re-render.
- **Position values can be `'DNF'` or `'DNS'`**, not just numbers. Always check before `parseInt`. The result rows in `buildRaceResultsHTML` (in `js/series/f1.js`) handle this.
- **Dates** in the data are bare `YYYY-MM-DD`. `countdown()` and `fmtDate()` assume a race start of 13:00 UTC; NASCAR's banner uses 18:00 UTC.
- **Caching is in-module memory only**: `cachedResults`, `cachedStandings`, `cachedConstructors`, `cachedLaps`, `cachedFastestLaps`. Page reload clears them. `refresh()` clears them manually.
- **No error reporting** beyond `console.error` in `renderLive` and friendly state screens elsewhere. API failures generally fall through to hardcoded data or render a "Couldn't Load" panel.

## What's missing / known limitations

- No persistence (no localStorage, no service worker — despite the `apple-mobile-web-app-*` meta tags suggesting PWA intent).
- No tests, no linting, no type checking.
- MotoGP / WRC / IndyCar / GT3 tabs are inert placeholders.
- NASCAR Xfinity and Trucks tabs are inert placeholders.
- F1 lap-times view depends entirely on Jolpica; if Jolpica has no laps for a round the panel says "Lap times not yet available".
- The hardcoded "after Rxx" labels (e.g. "After R4 Miami", "After R12 Watkins Glen") are baked into renderer strings and must be updated manually alongside the standings.
