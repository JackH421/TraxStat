# TraxStat Handoff

> **Update this doc when anything ships.** Last updated: 2026-06-12 evening — the all-series
> buildout is **MERGED and LIVE**: PR #14 (IndyCar/MotoGP/WEC/WRC modules, Xfinity Phase 2,
> full Trucks module, 86 verified highlight videos, home+schedule integration, squash `c003b98`)
> and PR #16 (weekly routine extended to all seven series + overnight-build policy exception,
> squash `86e6523`; replaces #15, which GitHub auto-closed on base-branch deletion). Merge
> policy split landed directly on main as `aa6294a`. Vercel deploy confirmed serving all new
> modules on traxstat.com.

One-page current-state snapshot for anyone (human or agent) picking up the project. The working
contract is `CLAUDE.md`; topic detail lives in `docs/*.md`. This file answers "where are we?"

## Data state

All seven series are live with verified 2026 data (per-round source URLs in the checkpoint
commit bodies on PR #14):

- **F1: through R6 Monaco** (2026-06-07). `HARDCODED_RACES` 1–6; Antonelli 156 / Hamilton 90 /
  Russell 88. Entered in `072e0a8` from formula1.com, matched by Jolpica. Calendar is
  **22 rounds** (24 originally; Bahrain + Saudi cancelled).
- **NASCAR Cup: through R15 Michigan**. Reddick 669 / Hamlin 618 (−51), 35 drivers;
  Toyota 9 / Chevy 5 / Ford 1 wins. Entered in `a15e349` / `0c3c0b7`.
- **NASCAR Xfinity: through R16 Nashville** — Allgaier 770, +179 over Love; standings verified
  to P38; Chevrolet 14 / Toyota 2 / Ford 0 wins. `js/series/nascar-xfinity.js`.
- **NASCAR Trucks: through R12 Michigan** — Riggs 497, +26 over Honeycutt; standings verified
  to P26; Toyota 5 / Ford 4 / Chevy 3 / Ram 0 (Ram is a new 4th mfr). `js/series/nascar-trucks.js`.
- **IndyCar: through R9 Gateway** — Palou 342, +49 over Kirkwood; 33-driver standings;
  Honda 6 / Chevrolet 3 engine wins. `js/series/indycar.js`.
- **MotoGP: through R8 Hungary** — Bezzecchi 180, +20 over Martin; sprint + GP per round;
  Aprilia leads constructors 238. `js/series/motogp.js`.
- **WEC: through R2 Spa** — Rast/Frijns 35; BMW leads mfrs 59; class-based results (Hypercar +
  LMGT3). `js/series/wec.js` (routing key `'gt3'`). **Le Mans (R3) runs 2026-06-13/14** —
  first new-module data update due right after.
- **WRC: through R7 Japan** — Evans 151, +20 over Katsuta; stage-win tallies + Power Stage per
  rally. `js/series/wrc.js`.
- **N24**: static post-race module; official "24H Magic Moments" recap added to Highlights.
- **All six verify scripts pass** on main: `verify.js`, `verify-nascar.js` (Cup + Xfinity +
  Trucks), `verify-indycar.js`, `verify-motogp.js`, `verify-wec.js`, `verify-wrc.js`.
- **Highlight videos**: every completed event across all series has an official-channel-verified
  video with a hand-picked action thumbnail (86 total); `HARDCODED_QUALI_VIDEOS` filled with
  pole-lap onboards R1–R6.
- Next races: Le Mans 06-13/14; Xfinity Pocono 06-13; Spanish GP + Cup Pocono 06-14;
  Trucks San Diego 06-19.

## Automation (how data stays current)

**Merge policy (split 2026-06-12, `aa6294a`): headless/automated sessions NEVER merge —
propose-only, ending at an open PR assigned to Jack. Interactive sessions may merge a specific
PR when Jack explicitly names it in-session ("merge #14"); never unprompted, never batch
without each PR named. Cloud agents have no GitHub access by deliberate choice.**

1. **GitHub Action** `.github/workflows/f1-post-race-poll.yml` (cron */30): inside a post-race
   window it opens an `auto/f1-r*` PR proposing race + standings data from Jolpica. Proposal
   only — it never merges.
2. **Weekly LOCAL routine** — launchd job `com.traxstat.weekly-data-update` on the Mac mini
   (`~/Library/LaunchAgents/com.traxstat.weekly-data-update.plist`), Mondays 9:00 AM
   America/New_York, headless Claude Code (sonnet) with `scripts/weekly-data-update-prompt.md`;
   logs to `logs/weekly-update.log` (gitignored). Missed-while-asleep runs fire on next wake.
   Propose-only:
   - First closes any auto-PR whose round already exists in `HARDCODED_RACES` (superseded rule).
   - Cross-checks remaining auto-PRs vs formula1.com/FIA; completes per-race points, fastest
     laps, sprint results, labels, `NEXT_RACES` pruning, CLAUDE.md season state; runs
     `verify.js`; stops at an open PR (sources in a comment, verify output in the description,
     assigned to JackH421). Mismatch → PR comment, no merge.
   - NASCAR: researches missing rounds (NASCAR.com / Wikipedia / beyondtheflag), updates the
     five constants, runs `verify-nascar.js`, stops at an open PR.
   - **Extended 2026-06-12 to all seven series** (TASKS C–H in the prompt): Xfinity, Trucks,
     IndyCar, MotoGP, WEC, WRC — each researched from its approved sources (CLAUDE.md), data
     models per `docs/series-data-models.md`, that series' verify script to 100%, propose-only
     PR. First run covering the new tasks: Mon 2026-06-15.
   - The earlier **cloud** routine (`trig_01AP1xwFenUJXbAdJ8UamCF2`) is **disabled** — Jack
     decided against cloud GitHub access; `/web-setup` will not be run.
3. **Daily news Action** `.github/workflows/daily-news-aggregator.yml`: refreshes a rolling
   `auto/news-*` PR in place each day. **Merging it is manual** — the weekly routine does NOT
   cover news PRs. If the home feed looks stale, an unmerged news PR is why.
4. **Client-side post-race polling** (browser): proposes diffs via yellow-dot badges only;
   never writes data. Defense-in-depth fallback.

## Shipped features worth knowing

- **F1 LIVE sub-tabs** (Practice / Qualifying / Race, `c607c27`): five-state machine
  (`between-races` / `practice-available` / `qualifying-available` / `session-live` /
  `post-race`), OpenF1-first sourcing for live AND completed sessions (Jolpica last-resort),
  persistent practice cache wiped at race start, post-race quali cleanup. See `docs/f1.md`.
- **All-series buildout** (PR #14, merged 2026-06-12): four new modules (IndyCar / MotoGP /
  WEC / WRC) each with its own verify script written first; no LIVE tab for new series (no
  free live API — see `docs/series-data-models.md`); Xfinity Phase 2 + full Trucks module;
  schedule landing page and home championship snapshot cover all six racing series; generic
  lite-YouTube helper (`txHighlightSlotHTML`) in core.js.
- **Highlights**: complete — official-channel-verified videos with curated action thumbnails
  for every completed 2026 event across all series, incl. F1 R6 Monaco and per-round pole-lap
  onboards in `HARDCODED_QUALI_VIDEOS`.

## Standing decisions

- **No NASCAR API**: official data is paid-only (Sportradar, SportsDataIO); unofficial
  endpoints are undocumented/unstable. Evaluated and rejected June 2026. Web research against
  the approved source list (CLAUDE.md) is the permanent approach. Don't reintroduce an API
  without discussing with Jack.
- **Cardinal rule** (CLAUDE.md): no number enters the codebase without a verified official
  source. Automation proposes; verification happens before merge (by Jack or by the routine's
  cross-check step).
- **Session approval policy** (CLAUDE.md): autonomous sessions work on a branch, present one
  final package, and only commit/push after approval. Dispatcher-initiated sessions push a
  branch + PR and stop. Exception (2026-06-12): explicitly-requested overnight builds may make
  per-phase checkpoint commits on their branch during the session; pushing still waits.
- **Repo merge convention is squash** — zero merge commits in history; multi-commit PRs keep
  their per-commit detail (e.g. source citations) on the PR's commits tab.
- **gh auth uses insecure storage** (token in `~/.config/gh/hosts.yml`, not the keychain) —
  deliberate: keychain items need a GUI ACL prompt this headless Mac mini can't show, which
  broke pushes on 2026-06-12 and would break the Monday routine.
- **Zero runtime dependencies, no build step, classic scripts** — deliberate; see
  `docs/decisions.md`.

## Open debt (non-blocking, oldest first)

1. **NASCAR R1–R11 source confirmation** — entries predate the per-commit source-citation
   discipline; header comment claims Wikipedia/NASCAR.com but rounds were never individually
   re-verified. (R12–R15 are fully cited.)
2. **NASCAR per-round fastest laps** — never populated (`nascar.js` TODO).
3. **N24 per-car fastest laps** — never populated (`n24.js` TODO).
4. ~~`HARDCODED_QUALI_VIDEOS` is empty~~ — DONE, merged to main 2026-06-12 (#14): pole-lap
   onboards R1–R6 + R6 Monaco race/quali highlights.
5. ~~NASCAR Xfinity Phase 2~~ — DONE, merged to main 2026-06-12 (#14), with a full Trucks
   module alongside.
6. **home.js VIDEO HIGHLIGHTS section** — built, intentionally not rendered (Session 5 hook).
7. **NEXT_RACES R7–R11 round numbering** — never audited against the revised 22-round
   calendar's official numbering.
8. **New-series tails parked as unverifiable** (2026-06-12): Xfinity standings below P38 and
   Trucks below P26 (source tails non-monotonic/uncheckable); WRC powerStage top5 for R3/R4/R7
   (only winners published); WRC2 scorers' entrant/car details; IndyCar lap counts R2/R4/R7;
   WEC R5/R7 race durations. All '—'/null in the modules, never guessed.

## Queued work order (updated 2026-06-12 evening)

1. **Le Mans weekend** (2026-06-13/14): first data update for a new module — WEC R3 per TASK G,
   plus Xfinity Pocono (06-13), Spanish GP + Cup Pocono (06-14).
2. Watch the local routine's first scheduled run (Mon 2026-06-15 9:00 AM ET) — now covering all
   seven series via TASKS A–H; review + merge the PRs it opens; fix prompt gaps it reveals
   (`logs/weekly-update.log`).
3. Merge the rolling news PR (`auto/news-20260612` is open) or decide its merge cadence.
4. Debt items above, roughly in order — each one data-verified per the cardinal rule.
