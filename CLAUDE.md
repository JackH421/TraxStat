# TraxStat

A single-page, mobile-first web app showing live timing, race results, and championship standings for motorsport series — primarily F1 and NASCAR Cup. Built as one self-contained `index.html`: no build step, no framework, no dependencies beyond the Google Fonts CDN.

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
- **Splitting `index.html` into multiple files.** The single-file architecture is deliberate (see Decision log). Only do this if the user explicitly asks.
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

> **Status:** these scripts do not yet exist as of 2026-05-15. Create them before the next round of data updates. The specs above are their requirements.

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
- **SCHEDULE as default landing tab.** Avoids dropping users into F1 specifically; the upcoming-races view is series-neutral and answers the most common question ("what's next?") immediately.
- **Vercel Web Analytics over alternatives** (Plausible, GA4, self-hosted). Native integration (no DNS lookup, same-origin script path survives more ad blockers, edge-served), cookieless by default so no consent banner, zero extra dependencies. Pageviews work on Hobby; custom events require Pro+. See Analytics section for the event taxonomy.

## Current season state (as of 2026-05-15)

- **F1**: Round 4 (Miami GP) complete. Standings: Antonelli 100, Russell 80, Leclerc 59. Next: Canadian GP, 2026-05-24.
- **NASCAR Cup**: Round 12 (Watkins Glen) complete. Standings: Reddick 567, +129 over P2 (Hamlin 438). Next: Coca-Cola 600 at Charlotte, 2026-05-24.

When you update the hardcoded constants past these rounds, also update this section and the "After Rxx" labels in the renderers.

## Deploy workflow

- **Repo**: `github.com/JackH421/TraxStat`
- **Host**: Vercel, auto-deploy on push to `main`
- **Domains**: `traxstat.com`, `traxstat.app`, `traxstat.live` (all point to the same deployment)
- **Build**: none — Vercel serves `index.html` as a static file. Deploy takes ~30 s from push to live.
- To ship a change: edit `index.html`, commit, push. That's the whole pipeline.

## Analytics

We use **Vercel Web Analytics** for pageview + custom event tracking. Cookieless and GDPR-compliant — no consent banner required.

### How it's wired

- **Init stub + deferred loader** at the bottom of `<body>` in `index.html`:
  ```html
  <script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script>
  <script defer src="/_vercel/insights/script.js"></script>
  ```
  Same-origin path (no third-party DNS, no CORS) and Vercel auto-rewrites it from the edge once Analytics is enabled in the dashboard.
- **`track(name, data)` helper** lives near the top of the script section (just after `setStats`). Fail-silent: if `window.va` isn't a function (ad-blocked, network failure, CSP), the call is a no-op. The site never breaks when analytics is unavailable.
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
| `refresh` | — | Refresh button click |

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

## File layout

The entire app is one file: **`index.html`** (~1700 lines, ~135 KB after recent additions).

- Lines 1–166: `<head>` + inline CSS
- Lines 167–210: DOM scaffolding (header, series bar, F1/NASCAR submenu bars, `#main-content`, stats bar, toast)
- Lines 212–end: inline `<script>` containing all logic, hardcoded data, and renderers

There is no `package.json`, no bundler, no tests, no README. `CLAUDE.md` is this file. `verify.js` and `verify-nascar.js` will live at the root when created. Open `index.html` in a browser to run the app.

## Architecture at a glance

- **State**: a handful of top-level `let` variables (`currentSeries`, `currentF1Tab`, `selectedRace`, `selectedDriver`, `isLive`, plus NASCAR equivalents `currentNascarTab`, `currentNascarSeries`, `selectedNascarRace`, etc.). No framework, no reactive store. Mutate the var, then call the matching `render*()` function which replaces `#main-content.innerHTML` wholesale.
- **Rendering pattern**: each tab has a `render<Tab>()` function that builds an HTML string and assigns it to `document.getElementById('main-content').innerHTML`. Inline `onclick="..."` attributes on rendered elements call back into top-level functions (`selectRace`, `toggleLaps`, `switchF1Tab`, etc.). This means every function the HTML references must be in module scope.
- **Routing**: `switchSeries(s)` for the top tab bar; `switchF1Tab(tab)` and `switchNascarTab(tab)` for the sub-bars; `switchNascarSeries(s)` for Cup/Xfinity/Trucks. Each toggles the `.active` class and calls the appropriate render fn.
- **Default landing**: `currentSeries` initialises to `'schedule'`, which renders the cross-series upcoming-race list. Init code calls `switchSeries('schedule')` so the F1 and NASCAR submenu bars start hidden.
- **Refresh**: the `⟳` button calls `refresh()`, which clears all in-memory caches and re-renders the current view (schedule, F1, or NASCAR).
- **Live polling**: `setInterval` re-runs `renderLive()` every 30 s, but only when `currentSeries==='f1' && currentF1Tab==='live' && isLive`.

## Series support

| Series  | Status                                                                 |
|---------|------------------------------------------------------------------------|
| Schedule | Default landing — hero card for next race across all series + next 3 closest races |
| F1      | Fully built — live timing, results, drivers, constructors, schedule    |
| NASCAR  | Cup fully built (results, drivers, manufacturers, schedule). Xfinity/Trucks are placeholder "coming soon" screens (`renderNascar*` functions early-return when `currentNascarSeries !== 'cup'`) |
| MotoGP, WRC, IndyCar, GT3/WEC | Placeholder only — `switchSeries` renders a generic "Coming Soon" state |

## F1 data sources

Two external APIs, with hardcoded fallbacks layered on top:

1. **Jolpica** (`https://api.jolpi.ca/ergast/f1`) — Ergast successor. Used for the 2026 race list, per-race results, lap times, and championship standings.
2. **OpenF1** (`https://api.openf1.org/v1`) — used **only** by `renderLive()` for in-session timing (sessions, drivers, positions, laps, stints, intervals).

### Hardcoded-first pattern

This is the most important thing to understand about the F1 module:

- `HARDCODED_RACES` (line ~384), `HARDCODED_DRIVER_STANDINGS` (~488), `HARDCODED_CONSTRUCTOR_STANDINGS` (~513), `SPRINT_RESULTS` (~714), `DRIVER_RACE_POINTS` (~729), `CONSTRUCTOR_RACE_POINTS` (~851), and `SEEDED_FASTEST_LAPS` (~346) are **verified, hand-curated 2026 results**.
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

`NEXT_RACES` (line ~353) is a separate hardcoded list of upcoming rounds used for the "Next Race" banner, the SCHEDULE landing page, and the F1 SCHEDULE sub-tab.

### Team name normalization

API team names lag the 2026 rebrands. `normalizeTeam(name)` (line ~248) maps legacy names to current ones:

- `Kick Sauber` / `Sauber` → `Audi`
- `RB F1 Team` / `RB` / `AlphaTauri` → `Racing Bulls`

The `TC` color palette and `DT` (driver-number → team) map use the 2026 names. Always pass API-returned team names through `normalizeTeam` before using them as lookup keys.

### 2026 grid encoded in `DT` (line ~221)

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

## NASCAR Cup data

Entirely hardcoded — there is no NASCAR API call anywhere in the file.

- `NASCAR_CUP_DRIVERS` (~1095): last-name → `{first, team, mfr, num}` map for all full-time entries.
- `NASCAR_CUP_SCHEDULE` (~1135): 36-round 2026 schedule with `round`, `race`, `track`, `date`, `laps`, optional `type` (`'R'` road course, `'S'` street), optional `chase: true` for Chase rounds (R27–36). Also drives the NASCAR SCHEDULE sub-tab.
- `NASCAR_CUP_RESULTS` (~1176): completed rounds keyed by round number. Each entry has `winner`, optional `p2`/`p3`, `polePos`, `stage1`, `stage2`, and a `note` string with race color.
- `NASCAR_CUP_STANDINGS` (~1192): driver points after the latest completed round. The `cutline: true` flag on P16 marks the Chase cutline; the cutline divider also renders unconditionally after P16.
- `NASCAR_CUP_MFRS` (~1232): manufacturer wins (Toyota, Chevrolet, Ford). NASCAR no longer publishes official manufacturer points, so this tracks **wins only**.

To add a completed race: append to `NASCAR_CUP_RESULTS`, then update `NASCAR_CUP_STANDINGS` totals and `NASCAR_CUP_MFRS` wins. The race list, "last race recap", and driver win history are all derived from these constants.

## "Off-air" live view

When no F1 or NASCAR session is in-progress (the common case), the LIVE tab does not render an error. Instead, `renderLiveOffAir(reason, ctx)` renders:
1. The "next race" banner with countdown.
2. A "NO SESSION ON TRACK" status row.
3. A recap of the most recent completed race with podium and a "View full results" link that switches to the results tab.

The function is generic over series via a `ctx` object. F1 uses default ctx; NASCAR builds one in `nascarOffAirContext()` that adapts `NASCAR_CUP_RESULTS` into the F1-shaped `Results` array the renderer expects.

## Styling conventions

- CSS variables in `:root` (line ~15): `--bg #0a0a0a`, `--red #e8002d`, `--yellow #ffd600`, `--green #00d84a`, etc. Use these instead of literal hex values.
- Fonts (loaded from Google Fonts):
  - **Barlow Condensed** — display / headings / table labels
  - **Barlow** — body / sub-labels
  - **Share Tech Mono** — times, gaps, points, anything numeric/data-like
- Team-color text: `style="color:${tc(teamName)}"` where `tc` looks up `TC[team]` and falls back to `#888`.
- Tire compound badges: `tireBadge(compound, age)` returns a colored circle (S red, M yellow, H white) plus optional lap count.
- Lots of inline `style="..."` strings in template literals. There's no separate stylesheet — if you're editing a renderer, the styling lives in the same template.

## Common gotchas

- **Don't `Read` the whole file in one go.** It exceeds the tool's token limit. Read it in chunks with `offset`/`limit`, or grep for the constant/function you need.
- **HTML and JS are coupled by string IDs.** The DOM relies on hardcoded element IDs (`main-content`, `live-pill`, `stat-1`..`stat-4`, `tab-live`, `tab-schedule`, `ntab-live`, `ntab-schedule`, `nseries-cup`, etc.) and on inline `onclick` handlers binding to globally-named functions. Renaming a function called from rendered HTML will break it silently.
- **State + render = full DOM replacement.** Mutating state and forgetting to call the render function leaves the UI stale. Conversely, every render rebuilds the whole panel, so transient DOM state (scroll position, focus) is lost — that's why `selectRace` etc. use `setTimeout(..., 100)` + `scrollIntoView` to restore scroll after re-render.
- **Position values can be `'DNF'` or `'DNS'`**, not just numbers. Always check before `parseInt`. The result rows handle this at line ~621.
- **Dates** in the data are bare `YYYY-MM-DD`. `countdown()` and `fmtDate()` assume a race start of 13:00 UTC; NASCAR's banner uses 18:00 UTC.
- **Caching is in-module memory only**: `cachedResults`, `cachedStandings`, `cachedConstructors`, `cachedLaps`, `cachedFastestLaps`. Page reload clears them. `refresh()` clears them manually.
- **No error reporting** beyond `console.error` in `renderLive` and friendly state screens elsewhere. API failures generally fall through to hardcoded data or render a "Couldn't Load" panel.

## What's missing / known limitations

- **`verify.js` and `verify-nascar.js` are specified but not yet implemented.** See Automated checks. Build them before the next data update.
- No persistence (no localStorage, no service worker — despite the `apple-mobile-web-app-*` meta tags suggesting PWA intent).
- No tests, no linting, no type checking.
- MotoGP / WRC / IndyCar / GT3 tabs are inert placeholders.
- NASCAR Xfinity and Trucks tabs are inert placeholders.
- F1 lap-times view depends entirely on Jolpica; if Jolpica has no laps for a round the panel says "Lap times not yet available".
- The hardcoded "after Rxx" labels (e.g. "After R4 Miami", "After R12 Watkins Glen") are baked into renderer strings and must be updated manually alongside the standings.
