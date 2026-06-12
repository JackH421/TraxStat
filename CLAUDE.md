# TraxStat

A single-page, mobile-first web app showing live timing, race results, and championship standings for motorsport series — primarily F1 and NASCAR Cup. Built as a static `index.html` shell + `styles.css` + a handful of plain `.js` files under `js/`: no build step, no framework, no dependencies beyond the Google Fonts CDN.

This file is the working contract for Claude Code (and any human collaborator) on this project. Read it top to bottom before making changes. The detailed reference material lives in `docs/*.md`; pull those in only when you need them — see the index below.

## When to read which doc

- Touching F1 state machine, polling, post-race automation, hardcoded-data updates, or qualifying videos → `docs/f1.md`
- Touching `js/series/nascar.js` data → `docs/nascar.md`
- Touching the N24 module → `docs/n24.md`
- Touching `js/home.js` news aggregator or `scripts/news-aggregator.mjs` → `docs/news-aggregator.md`
- Adding an analytics event or unsure about PII → `docs/analytics.md`
- Adding a new series → `docs/add-series.md`
- Building a temporary event view (Le Mans, Indy 500, etc.) → `docs/temporary-views.md`
- Race-day operational reference → `docs/race-day.md`
- Questioning a past architectural choice → `docs/decisions.md`

## Cardinal rule: data integrity

**Never invent statistics.** Race results, points totals, fastest laps, podium positions, championship standings, qualifying times, stage winners, manufacturer wins — every hardcoded number in this codebase must trace to an official source.

Acceptable sources, in rough priority:
- **F1.com** official results pages
- **NASCAR.com** winners gallery and race recaps
- **FIA** classification PDFs (most authoritative for F1)
- **Wikipedia** race pages (cross-check against primaries when possible)
- **racingnews.co** for NASCAR points after each race
- **beyondtheflag.com** for full NASCAR points tables (publishes all ~35 drivers; precedent: R13/R15 standings commits a15e349, 0c3c0b7)
- **Jolpica/Ergast API** for archived F1 results (current season may lag)

Per-series approved sources (added 2026-06-12 for the all-series buildout — no other sources):
- **MotoGP** → motogp.com official results/standings
- **IndyCar** → indycar.com
- **WRC** → wrc.com + FIA
- **WEC/GT3** → fiawec.com
- All four may cross-check **Wikipedia** race/rally pages against those primaries.

Rules:
- When asked to add data, **state the source first**. Cite the URL or document. Do not start typing values until the source is named.
- If a source can't be verified, **refuse and ask the user**. Do not guess from training-data knowledge. A placeholder dash (`'—'`) with a comment is always better than a fabricated number.
- If existing data looks unverified or suspect, **flag it** — don't silently keep using it.
- Fabricated stats are the worst possible failure mode for a sports stats app. They erode user trust permanently. Treat them as a P0 bug.

This rule overrides every other consideration in this document. If shipping fast and getting the number right conflict, get the number right.

## Working agreements

Operate as a senior engineer joining a small solo-developer codebase. Priorities, in order:
1. **Data correctness** — see cardinal rule.
2. **Maintainability** — keep the codebase readable and predictable.
3. **Shipping speed** — fast is good, but never at the cost of #1 or #2.

Process:
- For any task larger than a single trivial edit, **propose a plan in plain English first**. Wait for approval before writing code.
- When unsure about intent, **ask before assuming**. A clarifying question costs 10 seconds; a wrong implementation costs minutes plus rework.
- When existing code looks weird, **ask why before "fixing."** Weird often means "deliberate workaround." Read git history or ask the user.
- **Push back** if a request would create tech debt, fight the architecture, or violate the cardinal rule. The user is solo; they need a second opinion, not a yes-man.
- **No drive-by refactors.** Solve the asked problem with the smallest viable change. If something nearby looks bad, mention it — don't silently rewrite.
- **Never use `Math.random()` or placeholder values in real code paths.** Test fixtures only.

## Session approval policy
Run fully autonomously — do not stop to ask permission for edits, builds, installs, or running scripts. Work on a branch, never on main. Do NOT commit or push during the session.
At the end of the session, present ONE final review package:
1. Plain-English summary of everything changed and why
2. Full output of node verify.js and node verify-nascar.js if any data was touched
3. A local preview URL I can open on my phone
4. Any decisions you made that I should know about, and anything you skipped
Only after I reply with approval: commit (one logical commit per concept) and push.
Exception — automated dispatchers: if this session was initiated by an automated dispatcher (e.g. Puter, a scheduled routine) rather than Jack directly, skip the interactive gate — push the branch, open a PR, and stop. Never merge.
Exception — cardinal rule: if a data point cannot be verified against an approved source, park it with '—', flag it in the final package. Never silently continue with an unverified number.

## When to refuse

Refuse — politely, with reasoning — these requests:
- **Adding data without a verified source.** Ask the user to provide one.
- **Deleting a verified hardcoded constant** without explicit confirmation. Verified data is hard-won; don't lose it casually.
- **Silently changing a "verified" data point.** Flag the proposed change and confirm before applying.
- **Reverting the file split.** The modular layout (`index.html` shell + `styles.css` + `js/core.js` + `js/schedule.js` + `js/home.js` + `js/init.js` + `js/series/*.js`) is deliberate — see `docs/decisions.md`. Don't propose collapsing back to a single file.
- **Adding dependencies** (npm packages, CDN scripts, frameworks). Discuss trade-offs first. Zero runtime dependencies is a feature.

## Automated checks

After any change that touches an F1 or NASCAR data constant, run both:

```sh
node verify.js
node verify-nascar.js
```

Report the output before declaring the change done. If a check fails, **fix it before pushing**. Never push broken data.

## Git workflow

- **Commit per logical change.** One concept per commit — adding a race, fixing a typo, adding a feature. Don't batch unrelated edits.
- **Subject line: short imperative.** "add Canadian GP results" — not "added the results" or "various updates". Under ~60 chars.
- **Optional body** for context: why, sources, gotchas. Wrap at ~72 chars.
- **Push at natural stopping points**, not after every commit. A working feature, a verified fix, a completed section.
- **Never amend or force-push** commits already on GitHub. Pushed history is shared history.

## Current season state (as of 2026-06-11)

- **F1**: Round 6 (Monaco GP) complete. Standings: Antonelli 156, Hamilton 90, Russell 88. Antonelli's 5th win in 6 rounds in a chaotic race with seven retirements (Verstappen anti-stall at the start; Leclerc/Stroll/Sainz crashes; Norris, Bearman, Bottas out). Russell penalised twice → P12. Alonso added to `DRIVER_RACE_POINTS` (first point of 2026). Next: Spanish GP, 2026-06-14.
- **NASCAR Cup**: Round 15 (FireKeepers Casino 400, Michigan) complete — Hamlin won R14 Nashville (62nd career) and R15 Michigan (63rd, tying the late Kyle Busch for 9th all-time) back-to-back. Standings: Reddick 669, +51 over P2 (Hamlin 618) after Reddick crashed out at Michigan (P35, first DNF of 2026). Manufacturers: Toyota 9, Chevrolet 5, Ford 1. Kyle Busch remains removed from the standings (official list runs 35 deep, omits him) but is retained in `NASCAR_CUP_DRIVERS` because R1–R12 results still reference him. Next: The Great American Getaway 400 at Pocono, 2026-06-14.

When you update the hardcoded constants past these rounds, also update this section and the "After Rxx" labels in the renderers.

## Deploy workflow

- **Repo**: `github.com/JackH421/TraxStat`. **Host**: Vercel, auto-deploy on push to `main`.
- **Domains**: `traxstat.com`, `traxstat.app`, `traxstat.live` (all point to the same deployment).
- **Build**: none — Vercel serves static assets. Push → live in ~30 s.

## Automation (never merges)

**Automation NEVER merges; all automation ends at an open PR; Jack merges from GitHub mobile/desktop; cloud agents have no GitHub access by deliberate choice.**

- **F1 post-race Action** (`.github/workflows/f1-post-race-poll.yml`, cron */30): opens an `auto/f1-r*` PR proposing Jolpica data after each race. Proposal only.
- **Weekly local routine** (launchd on the Mac mini, Mondays 9:00 AM ET, prompt in `scripts/weekly-data-update-prompt.md`, log in `logs/weekly-update.log`): verifies + completes the auto-PR (or builds the update from official sources), runs the verify scripts, and stops at an open PR assigned to Jack. Details in `docs/f1.md`.
- **Daily news Action** (`.github/workflows/daily-news-aggregator.yml`): refreshes a rolling `auto/news-*` PR in place. Merging it is manual.

## File layout

```
~/TraxStat/
├── index.html              shell only (head, body scaffold, 8 <script src> tags + Vercel analytics stub)
├── styles.css              every CSS rule the app uses
├── js/
│   ├── core.js             utilities, app-wide state, Jolpica API helpers, switchSeries,
│   │                       refresh, updateLiveDots, renderLiveOffAir, track()
│   ├── schedule.js         renderSchedule, renderScheduleRow (secondary view)
│   ├── home.js             HOMEPAGE_FEATURED, HOMEPAGE_ARTICLES; carousel + championship +
│   │                       articles renderers; openHome* action handlers
│   ├── init.js             boot statements: switchSeries('home'), setInterval timers,
│   │                       updateF1Badges, F1 post-race-polling resumption IIFE
│   └── series/
│       ├── f1.js           NEXT_RACES, all HARDCODED_* + per-race-points constants;
│       │                   race/champ/quali renderers; live timing; state machine;
│       │                   post-race polling; switchF1Tab
│       ├── nascar.js       NASCAR_CUP_* constants; every renderNascar*;
│       │                   switchNascarTab/Series; nascarOffAirContext
│       ├── nascar-xfinity.js Xfinity (O'Reilly Auto Parts) sibling module —
│       │                   Phase 1 schedule + renderers; see docs/nascar.md
│       ├── n24.js          N24_VERSTAPPEN, N24_2026_* constants; every renderN24*;
│       │                   switchN24Tab; toggleN24Entry/Recap
│       └── _template.js    copy-and-rename starter for new series; not loaded
├── docs/                   reference material — pulled in by topic when needed
├── .github/workflows/
│   ├── f1-post-race-poll.yml      cron */30 — opens auto/f1-r* PRs post-race
│   └── daily-news-aggregator.yml  daily — refreshes the news PR
├── scripts/
│   ├── post-race-poll.mjs  F1 post-race GitHub Action body
│   └── news-aggregator.mjs daily news aggregator GitHub Action body
├── verify.js               validates F1 data (reads js/series/f1.js)
├── verify-nascar.js        validates NASCAR data (reads js/series/nascar.js)
└── CLAUDE.md               this file — working contract + doc index
```

No `package.json` for the app itself; the script `package.json` declares `fast-xml-parser` + `node-html-parser` (news aggregator only) and an `npm run news:dry` helper. No bundler, no tests beyond the verify scripts, no README beyond a stub. Open `index.html` in a browser to run the app (or `python3 -m http.server` from the repo root — `file://` won't satisfy the absolute `/styles.css` and `/js/...` paths).

### Script load order

Eight `<script src>` tags in `index.html`, in this order:

```
core.js → series/f1.js → series/nascar.js → series/nascar-xfinity.js → series/n24.js → schedule.js → home.js → init.js
```

`core.js` declares shared utilities and the router with no cross-file references. Series files declare their own data + renderers. `schedule.js` and `home.js` read constants from the series files. `init.js` runs the imperative boot last. Traditional `<script>` tags (not `type="module"`) so top-level functions sit on `globalThis` and inline `onclick="…"` handlers find them.

## Architecture at a glance

- **State**: top-level `let` variables in each file (`currentSeries`, `currentF1Tab`, `selectedRace`, etc.). No framework, no reactive store. Mutate the var, then call the matching `render*()` function which replaces `#main-content.innerHTML` wholesale.
- **Rendering**: each tab has a `render<Tab>()` function that builds an HTML string and assigns it to `document.getElementById('main-content').innerHTML`. Inline `onclick="..."` attributes on rendered elements call back into top-level functions. Every function the HTML references must be at the top level of some classic script.
- **Routing**: `switchSeries(s)` for the top tab bar; `switchF1Tab(tab)` / `switchNascarTab(tab)` / `switchN24Tab(tab)` for sub-bars; `switchNascarSeries(s)` for Cup/Xfinity/Trucks.
- **Default landing**: `js/init.js` calls `switchSeries('home')` on boot. F1 and NASCAR submenu bars start hidden.
- **Refresh**: the `⟳` button calls `refresh()`, clears all in-memory caches, re-renders.
- **Live polling**: `setInterval` re-runs `renderLive()` every 30 s, but only when `currentSeries==='f1' && currentF1Tab==='live' && isLive`.

## Series support

| Series  | Status |
|---|---|
| Home | Default landing — news feed. Featured carousel + championship snapshot (F1 + NASCAR) + 8-card article feed. See `js/home.js`. |
| Race Schedule | Hero card for next race across all series + next 3 closest. Routing key `'schedule'`. |
| F1 | Fully built — five sub-tabs (LIVE / QUALIFYING / RACE RESULTS / DRIVERS / CONSTRUCTORS). LIVE is adaptive — see `docs/f1.md`. |
| NASCAR | Cup fully built. Xfinity schedule populated (33 rounds, verified Wikipedia); race results / standings / mfrs are Phase-2 backfill. Trucks placeholder. See `docs/nascar.md`. |
| N24 | Permanent post-race-only module for the 2026 Nürburgring 24. See `docs/n24.md`. |
| IndyCar | Fully built (no LIVE — no free live API). Four sub-tabs: STANDINGS / RACE RESULTS / SCHEDULE / HIGHLIGHTS. 2026 through R9 Gateway, verified indycar.com + Wikipedia. `js/series/indycar.js`, `verify-indycar.js`. |
| GT3/WEC | Fully built (no LIVE). Class-based results — Hypercar + LMGT3 winner per round. 2026 through R2 Spa (Le Mans runs 2026-06-13/14), verified fiawec.com + Wikipedia. `js/series/wec.js` (routing key `'gt3'`), `verify-wec.js`. |
| MotoGP, WRC | Placeholder — `switchSeries` renders generic "Coming Soon" |

## F1 data: hardcoded-first pattern (essentials)

The most important thing to know about the F1 module:

- `HARDCODED_RACES`, `HARDCODED_DRIVER_STANDINGS`, `HARDCODED_CONSTRUCTOR_STANDINGS`, `SPRINT_RESULTS`, `DRIVER_RACE_POINTS`, `CONSTRUCTOR_RACE_POINTS`, `SEEDED_FASTEST_LAPS` live in `js/series/f1.js` — verified, hand-curated 2026 results.
- `fetchRaceResults(round)` checks `HARDCODED_RACES[round]` **before** hitting Jolpica.
- `fetchDriverStandings` / `fetchConstructorStandings` only trust the API if the leader's point total clears a sanity threshold (90 for drivers, 170 for constructors). Otherwise hardcoded wins.
- Post-race polling **proposes** diffs via badge; it **never** writes to hardcoded data.

Full details (state machine, polling cadence + endpoints, server-side GitHub Action, qualifying-video onboarding, team-name normalization, the 2026 driver-number → team map) are in `docs/f1.md`.

## NASCAR Cup data (essentials)

Entirely hardcoded in `js/series/nascar.js` — no NASCAR API call anywhere. Five constants: `NASCAR_CUP_DRIVERS`, `NASCAR_CUP_SCHEDULE`, `NASCAR_CUP_RESULTS`, `NASCAR_CUP_STANDINGS`, `NASCAR_CUP_MFRS`. Xfinity lives in the sibling module `js/series/nascar-xfinity.js`. Full details in `docs/nascar.md`.

**Why no NASCAR API:** official NASCAR data is only available through paid providers (Sportradar, SportsDataIO); unofficial endpoints are undocumented and unstable. Evaluated and rejected June 2026. Web research against the approved source list is the permanent approach. Do not reintroduce an API without discussing with Jack.

## Styling conventions

- CSS variables in `:root` (top of `styles.css`): `--bg #0a0a0a`, `--red #e8002d`, `--yellow #ffd600`, `--green #00d84a`, etc. Use these instead of literal hex values.
- Fonts (Google Fonts): **Barlow Condensed** (display / headings / table labels), **Barlow** (body), **Share Tech Mono** (times, gaps, points — anything numeric).
- Team-color text: `style="color:${tc(teamName)}"` where `tc` looks up `TC[team]` and falls back to `#888`.
- Lots of inline `style="..."` strings in template literals — if you're editing a renderer, the styling lives in the same template.

## Common gotchas

- **HTML and JS are coupled by string IDs.** The DOM relies on hardcoded element IDs (`main-content`, `live-pill`, `stat-1`..`stat-4`, `tab-live`, `tab-schedule`, `ntab-live`, `nseries-cup`, etc.) and on inline `onclick` handlers binding to globally-named functions. Renaming a function called from rendered HTML will break it silently.
- **State + render = full DOM replacement.** Mutating state and forgetting to call the render function leaves the UI stale. Every render rebuilds the whole panel, so transient DOM state (scroll position, focus) is lost — that's why `selectRace` etc. use `setTimeout(..., 100)` + `scrollIntoView` to restore scroll after re-render.
- **Position values can be `'DNF'` or `'DNS'`**, not just numbers. Always check before `parseInt`.
- **Dates** in the data are bare `YYYY-MM-DD`. `countdown()` and `fmtDate()` assume a race start of 13:00 UTC; NASCAR's banner uses 18:00 UTC.
- **Caching is in-module memory only**: `cachedResults`, `cachedStandings`, `cachedConstructors`, `cachedLaps`, `cachedFastestLaps`. Page reload clears them. `refresh()` clears them manually.
- **No error reporting** beyond `console.error` in `renderLive` and friendly state screens elsewhere. API failures generally fall through to hardcoded data or render a "Couldn't Load" panel.

## What's missing / known limitations

- No persistence beyond F1 polling state (no service worker — despite the `apple-mobile-web-app-*` meta tags suggesting PWA intent).
- No linting, no type checking; verify scripts are the only tests.
- MotoGP / WRC / IndyCar / GT3 tabs are inert placeholders.
- NASCAR Xfinity and Trucks tabs are inert placeholders.
- F1 lap-times view depends entirely on Jolpica; if Jolpica has no laps for a round the panel says "Lap times not yet available".
- The hardcoded "after Rxx" labels (e.g. "After R6 Monaco", "After R15 Michigan") are baked into renderer strings and must be updated manually alongside the standings.

