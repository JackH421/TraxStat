# TraxStat Handoff

> **Update this doc when anything ships.** Last updated: 2026-06-12 (all-series buildout on
> `feature/all-series-buildout` — IndyCar/MotoGP/WEC/WRC modules, Xfinity Phase 2, full Trucks
> module, verified highlight videos for every completed event across all series, home+schedule
> integration. Awaiting Jack's review; not yet on main).

One-page current-state snapshot for anyone (human or agent) picking up the project. The working
contract is `CLAUDE.md`; topic detail lives in `docs/*.md`. This file answers "where are we?"

## Data state

- **F1: current through R6 Monaco** (2026-06-07). `HARDCODED_RACES` rounds 1–6; standings
  Antonelli 156 / Hamilton 90 / Russell 88; labels "After R6 Monaco". Entered in `072e0a8`
  from formula1.com official pages, independently matched by Jolpica.
- **NASCAR Cup: current through R15 Michigan** (2026-06-07). Results rounds 1–15; standings
  Reddick 669 / Hamlin 618 (−51), 35 drivers; Toyota 9 / Chevy 5 / Ford 1 wins; labels
  "After R15 Michigan". Entered in `a15e349` (R13) and `0c3c0b7` (R14+R15).
- **N24**: static post-race module, untouched since Session 7.
- **Both verify scripts pass** as of this writing (`node verify.js`, `node verify-nascar.js`).
- 2026 F1 calendar is **22 rounds** (24 originally; Bahrain + Saudi cancelled).
- Next races: Spanish GP + NASCAR Pocono, both **2026-06-14**.

## Automation (how data stays current)

**Automation NEVER merges; all automation ends at an open PR; Jack merges from GitHub
mobile/desktop; cloud agents have no GitHub access by deliberate choice.**

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
- **NASCAR Xfinity Phase 1** (`js/series/nascar-xfinity.js`): 33-round schedule verified;
  results/standings/mfrs are Phase-2 backfill.
- **Highlights**: race-recap embeds verified for F1 R1–R5; R6 Monaco not yet added.

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
  branch + PR and stop.
- **Zero runtime dependencies, no build step, classic scripts** — deliberate; see
  `docs/decisions.md`.

## Open debt (non-blocking, oldest first)

1. **NASCAR R1–R11 source confirmation** — entries predate the per-commit source-citation
   discipline; header comment claims Wikipedia/NASCAR.com but rounds were never individually
   re-verified. (R12–R15 are fully cited.)
2. **NASCAR per-round fastest laps** — never populated (`nascar.js` TODO).
3. **N24 per-car fastest laps** — never populated (`n24.js` TODO).
4. ~~`HARDCODED_QUALI_VIDEOS` is empty~~ — filled 2026-06-12 (pole-lap onboards R1–R6) and
   R6 Monaco race/quali highlights added, on `feature/all-series-buildout`.
5. ~~NASCAR Xfinity Phase 2~~ — landed 2026-06-12 on `feature/all-series-buildout`
   (with a full Trucks module alongside).
6. **home.js VIDEO HIGHLIGHTS section** — built, intentionally not rendered (Session 5 hook).
7. **NEXT_RACES R7–R11 round numbering** — never audited against the revised 22-round
   calendar's official numbering.
8. **New-series tails parked as unverifiable** (2026-06-12): Xfinity standings below P38 and
   Trucks below P26 (source tails non-monotonic/uncheckable); WRC powerStage top5 for R3/R4/R7
   (only winners published); WRC2 scorers' entrant/car details; IndyCar lap counts R2/R4/R7;
   WEC R5/R7 race durations. All '—'/null in the modules, never guessed.

## Queued work order (agreed 2026-06-12)

1. Watch the local routine's first scheduled run (Mon 2026-06-15 9:00 AM ET, Spain + Pocono);
   review + merge the PRs it opens; fix prompt gaps it reveals (`logs/weekly-update.log`).
2. Merge the rolling news PR each time it accumulates, or decide its merge cadence.
3. Debt items above, roughly in order — each one data-verified per the cardinal rule.
