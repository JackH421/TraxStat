# TraxStat

A single-page, mobile-first web app showing live timing, race results, and championship standings for motorsport series — primarily F1 and NASCAR Cup. Built as one self-contained `index.html`: no build step, no framework, no dependencies beyond the Google Fonts CDN.

## Data rule

**NEVER invent race results, points, fastest laps, or standings.** Every value in the hardcoded constants must be verified from an official source: **F1.com**, **NASCAR.com**, **FIA classification PDFs**, or **Wikipedia** race pages. If a value cannot be verified, leave it as `'—'` (em dash) and add a comment explaining what's missing. Fabricated data is worse than a gap — the app's whole credibility rests on these constants being correct.

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

## File layout

The entire project is one file: **`index.html`** (~1600 lines, ~128 KB).

- Lines 1–166: `<head>` + inline CSS
- Lines 167–207: DOM scaffolding (header, series bar, F1/NASCAR submenu bars, `#main-content`, stats bar, toast)
- Lines 209–1602: inline `<script>` containing all logic, hardcoded data, and renderers

There is no `package.json`, no bundler, no tests, no README. Open `index.html` in a browser to run it.

## Architecture at a glance

- **State**: a handful of top-level `let` variables (`currentSeries`, `currentF1Tab`, `selectedRace`, `selectedDriver`, `isLive`, plus NASCAR equivalents `currentNascarTab`, `currentNascarSeries`, `selectedNascarRace`, etc.). No framework, no reactive store. Mutate the var, then call the matching `render*()` function which replaces `#main-content.innerHTML` wholesale.
- **Rendering pattern**: each tab has a `render<Tab>()` function that builds an HTML string and assigns it to `document.getElementById('main-content').innerHTML`. Inline `onclick="..."` attributes on rendered elements call back into top-level functions (`selectRace`, `toggleLaps`, `switchF1Tab`, etc.). This means every function the HTML references must be in module scope.
- **Routing**: `switchSeries(s)` for the top tab bar; `switchF1Tab(tab)` and `switchNascarTab(tab)` for the sub-bars; `switchNascarSeries(s)` for Cup/Xfinity/Trucks. Each toggles the `.active` class and calls the appropriate render fn.
- **Refresh**: the `⟳` button calls `refresh()`, which clears all in-memory caches and re-renders the current view.
- **Live polling**: `setInterval` at line 1601 re-runs `renderLive()` every 30 s, but only when `currentSeries==='f1' && currentF1Tab==='live' && isLive`.

## Series support

| Series  | Status                                                                 |
|---------|------------------------------------------------------------------------|
| F1      | Fully built — live timing, results, drivers, constructors              |
| NASCAR  | Cup fully built (results, drivers, manufacturers). Xfinity/Trucks are placeholder "coming soon" screens (`renderNascar*` functions early-return when `currentNascarSeries !== 'cup'`) |
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

`NEXT_RACES` (line ~353) is a separate hardcoded list of upcoming rounds used for the "Next Race" banner and countdown.

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
- `NASCAR_CUP_SCHEDULE` (~1135): 36-round 2026 schedule with `round`, `race`, `track`, `date`, `laps`, optional `type` (`'R'` road course, `'S'` street), optional `chase: true` for Chase rounds (R27–36).
- `NASCAR_CUP_RESULTS` (~1176): completed rounds keyed by round number. Each entry has `winner`, optional `p2`/`p3`, `polePos`, `stage1`, `stage2`, and a `note` string with race color.
- `NASCAR_CUP_STANDINGS` (~1192): driver points after the latest completed round. The `cutline: true` flag on P16 marks the Chase cutline; the cutline divider also renders unconditionally after P16.
- `NASCAR_CUP_MFRS` (~1232): manufacturer wins (Toyota, Chevrolet, Ford). NASCAR no longer publishes official manufacturer points, so this tracks **wins only**.

To add a completed race: append to `NASCAR_CUP_RESULTS`, then update `NASCAR_CUP_STANDINGS` totals and `NASCAR_CUP_MFRS` wins. The race list, "last race recap", and driver win history are all derived from these constants.

## "Off-air" live view

When no F1 or NASCAR session is in-progress (the common case), the LIVE tab does not render an error. Instead, `renderLiveOffAir(reason, ctx)` (line ~979) renders:
1. The "next race" banner with countdown.
2. A "NO SESSION ON TRACK" status row.
3. A recap of the most recent completed race with podium and a "View full results" link that switches to the results tab.

The function is generic over series via a `ctx` object. F1 uses default ctx; NASCAR builds one in `nascarOffAirContext()` (line ~1262) that adapts `NASCAR_CUP_RESULTS` into the F1-shaped `Results` array the renderer expects.

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

- **Don't `Read` the whole file.** It exceeds the tool's token limit. Read it in chunks with `offset`/`limit`, or grep for the constant/function you need.
- **HTML and JS are coupled by string IDs.** The DOM relies on hardcoded element IDs (`main-content`, `live-pill`, `stat-1`..`stat-4`, `tab-live`, `ntab-live`, `nseries-cup`, etc.) and on inline `onclick` handlers binding to globally-named functions. Renaming a function called from rendered HTML will break it silently.
- **State + render = full DOM replacement.** Mutating state and forgetting to call the render function leaves the UI stale. Conversely, every render rebuilds the whole panel, so transient DOM state (scroll position, focus) is lost — that's why `selectRace` etc. use `setTimeout(..., 100)` + `scrollIntoView` to restore scroll after re-render.
- **Position values can be `'DNF'` or `'DNS'`**, not just numbers. Always check before `parseInt`. The result rows handle this at line ~621.
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
