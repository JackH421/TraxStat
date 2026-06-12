# TraxStat Handoff

> **Update this doc when anything ships.** Last updated: 2026-06-12 (post-audit cleanup session).

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

1. **GitHub Action** `.github/workflows/f1-post-race-poll.yml` (cron */30): inside a post-race
   window it opens an `auto/f1-r*` PR proposing race + standings data from Jolpica. Proposal
   only — it never merges.
2. **Weekly cloud routine** "TraxStat weekly post-race data update (F1 + NASCAR)"
   (`trig_01AP1xwFenUJXbAdJ8UamCF2`, Mondays 13:00 UTC, sonnet-4-6, claude.ai/code/routines):
   - First closes any auto-PR whose round already exists in `HARDCODED_RACES` (superseded rule).
   - Cross-checks remaining auto-PRs vs formula1.com/FIA; completes per-race points, fastest
     laps, sprint results, labels, `NEXT_RACES` pruning, CLAUDE.md season state; merges only
     when `verify.js` passes 100%. Mismatch → PR comment, no merge.
   - NASCAR: researches missing rounds (NASCAR.com / Wikipedia / beyondtheflag), updates the
     five constants, merges via PR only when `verify-nascar.js` passes.
   - **Dependency: cloud GitHub access** (`/web-setup` or Claude GitHub App). Not yet
     confirmed connected — first run 2026-06-15 will fail at clone if not fixed.
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
4. **`HARDCODED_QUALI_VIDEOS` is empty** — feature shipped, zero entries; R6 Monaco race
   highlight also missing.
5. **NASCAR Xfinity Phase 2** — results / standings / manufacturer backfill.
6. **home.js VIDEO HIGHLIGHTS section** — built, intentionally not rendered (Session 5 hook).
7. **NEXT_RACES R7–R11 round numbering** — never audited against the revised 22-round
   calendar's official numbering.

## Queued work order (agreed 2026-06-12)

1. Confirm cloud GitHub access before Monday 2026-06-15 13:00 UTC (routine's first run).
2. Watch the routine's first run (Spain + Pocono); fix prompt gaps it reveals.
3. Merge the rolling news PR or automate its merge path.
4. Debt items above, roughly in order — each one data-verified per the cardinal rule.
