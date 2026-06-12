# NASCAR Cup data

Entirely hardcoded in `js/series/nascar.js` — there is no NASCAR API call anywhere in the codebase.

> **Xfinity (O'Reilly Auto Parts) lives in `js/series/nascar-xfinity.js`** as a sibling module. Phase 2 (landed 2026-06-12): R1–R16 results, 38-driver standings (truncated where the source tail was unverifiable), manufacturer wins (Chevrolet 14 / Toyota 2 / Ford 0), 44-entry roster. The same `switchNascarSeries('xfinity')` route powers it; each renderer in `nascar.js` dispatches to `renderNascarXfinity*` when the active series is Xfinity.

> **Trucks (Craftsman) lives in `js/series/nascar-trucks.js`** as a second sibling module (added 2026-06-12): 25-round schedule, R1–R12 results, standings through P26 (verified portion only; Heim P11 is championship-ineligible part-time), manufacturer wins incl. the new fourth manufacturer Ram (0 wins). Dispatch mirrors Xfinity: `renderNascarTrucks*` when the active sub-series is Trucks. `verify-nascar.js` now runs full schedule/tally/standings/reference checks for both sibling series.

All NASCAR constants live in `js/series/nascar.js`:

- `NASCAR_CUP_DRIVERS`: last-name → `{first, team, mfr, num}` map for all full-time entries.
- `NASCAR_CUP_SCHEDULE`: 36-round 2026 schedule with `round`, `race`, `track`, `date`, `laps`, optional `type` (`'R'` road course, `'S'` street), optional `chase: true` for Chase rounds (R27–36). Also drives the NASCAR SCHEDULE sub-tab.
- `NASCAR_CUP_RESULTS`: completed rounds keyed by round number. Each entry has `winner`, optional `p2`/`p3`, `polePos`, `stage1`, `stage2`, and a `note` string with race color.
- `NASCAR_CUP_STANDINGS`: driver points after the latest completed round. The `cutline: true` flag on P16 marks the Chase cutline; the cutline divider also renders unconditionally after P16.
- `NASCAR_CUP_MFRS`: manufacturer wins (Toyota, Chevrolet, Ford). NASCAR no longer publishes official manufacturer points, so this tracks **wins only**.

To add a completed race: append to `NASCAR_CUP_RESULTS`, then update `NASCAR_CUP_STANDINGS` totals and `NASCAR_CUP_MFRS` wins. The race list, "last race recap", and driver win history are all derived from these constants.

## "Off-air" live view

When no NASCAR session is in-progress (the common case), the LIVE tab does not render an error. `renderLiveOffAir(reason, ctx)` (in `js/core.js`) renders the next-race banner with countdown, a "NO SESSION ON TRACK" status row, and a recap of the most recent completed race with podium plus a "View full results" link that switches to the results tab.

The function is generic over series via a `ctx` object. F1 uses default ctx; NASCAR builds one in `nascarOffAirContext()` (in `js/series/nascar.js`) that adapts `NASCAR_CUP_RESULTS` into the F1-shaped `Results` array the renderer expects.

## Verification

`verify-nascar.js` at the repo root validates this data. After any change to a NASCAR data constant:

```sh
node verify-nascar.js
```

It checks: race-winner manufacturers in `NASCAR_CUP_RESULTS` tally against `NASCAR_CUP_MFRS` win counts; `NASCAR_CUP_STANDINGS` gap math (P1 gap = 0; every other row's `gap = P1.points - row.points`, negative); every driver referenced in results / standings / mfrs exists in `NASCAR_CUP_DRIVERS`.
