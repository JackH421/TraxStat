# New-series data models (designed 2026-06-12, before build)

Design-first schemas for the four new modules. These are **not F1 clones** —
each series' constants mirror what that series actually publishes. The same
schema is repeated as a comment block at the top of each module file; this doc
is the design of record. Approved sources per series are listed in CLAUDE.md
(cardinal rule section).

Shared rules for all four modules:

- **Sub-tabs: Standings / Race Results / Schedule / Highlights only. NO live
  timing** — no free live API exists for these series, so there is no LIVE tab
  and no off-air live view. The series home menu shows 4 rows, not 5.
- Hardcoded constants + `render*()` functions + `switchSeries` wiring, exactly
  like NASCAR. CSS vars for color, Share Tech Mono for anything numeric.
- Every constant cites its source URL in a comment above it.
- Unverifiable values are `'—'` (or `null`) with a comment — never a guess.
- Each module gets a `verify-<series>.js` at the repo root, written **before**
  the module, modeled on `verify.js` / `verify-nascar.js`: schema checks,
  points/gap math, winner-vs-tally cross-checks, reference integrity.

## IndyCar (`js/series/indycar.js`) — closest to the NASCAR shape

```js
// INDYCAR_DRIVERS: lastName → {first, team, engine ('Chevrolet'|'Honda'), num}
// INDYCAR_SCHEDULE: [{round, race, track, country, date, laps,
//                     type?: 'O' oval | 'R' road | 'S' street}]
// INDYCAR_RESULTS:  {round: {winner, p2, p3, pole, note}}   // lastName refs
// INDYCAR_STANDINGS:[{pos, driver, points, gap}]            // gap = pts − leader pts (≤0)
// INDYCAR_ENGINE_WINS: [{pos, engine, wins, drivers:[...]}] // wins-only tally,
//                      derivable from INDYCAR_RESULTS — cross-checked by verify
```

## MotoGP (`js/series/motogp.js`) — MotoGP class only (no Moto2/Moto3); sprint + GP every round

```js
// MOTOGP_RIDERS:   lastName → {first, team, bike (manufacturer), num, nat}
// MOTOGP_SCHEDULE: [{round, gp, circuit, country, date}]    // date = GP Sunday
// MOTOGP_RESULTS:  {round: {sprintWinner, winner, p2, p3, pole, note}}
//                  // sprint winner ≠ GP winner is normal; both stored per round
// MOTOGP_STANDINGS:[{pos, rider, points, gap}]              // riders' championship
//                  // (combined sprint+GP points as published by motogp.com)
// MOTOGP_CONSTRUCTORS: [{pos, constructor, points, gap}]    // constructors' championship
//                  // as published — NOT derivable from winners alone; no tally check
```

## WEC (`js/series/wec.js`, routing key `'gt3'`) — class-based: winner per class

```js
// WEC_SCHEDULE: [{round, race, circuit, country, date, hours}]
// WEC_RESULTS:  {round: {
//   hypercar: {car, team, mfr, drivers:[...]},   // overall/Hypercar class winner
//   lmgt3:    {car, team, mfr, drivers:[...]},   // LMGT3 class winner
//   note }}
// WEC_HYPERCAR_STANDINGS: [{pos, crew, team, car, points, gap}]
//                  // Hypercar World Drivers' Championship (crews share points)
// WEC_MFR_STANDINGS: [{pos, mfr, points, gap}]   // Hypercar World Manufacturers'
// (LMGT3 standings deferred unless cleanly verifiable from fiawec.com)
```

## WRC (`js/series/wrc.js`) — rallies: stage winners + power stage

```js
// WRC_DRIVERS:  lastName → {first, codriver, team, car, nat}
// WRC_SCHEDULE: [{round, rally, country, date, surface ('tarmac'|'gravel'|'snow'|'mixed')}]
// WRC_RESULTS:  {round: {
//   winner, p2, p3,                  // lastName refs; overall classification
//   time,                            // winner's total time string, '—' if unverified
//   stageWins: {lastName: count},    // stage-winner tally for the rally
//   powerStage: {winner, top5:[...]},// power-stage result (5-4-3-2-1 bonus points)
//   note }}
// WRC_STANDINGS: [{pos, driver, points, gap}]    // drivers' championship as published
//                 // (includes Sunday/Super-Sunday + power-stage bonus structure —
//                 //  totals taken from wrc.com, not recomputed from finishes)
// WRC_MFR_STANDINGS: [{pos, mfr, points, gap}]   // manufacturers' championship
```

## Verify-script checks per series

| Check | IndyCar | MotoGP | WEC | WRC |
|---|---|---|---|---|
| Schedule rounds sequential, dates ascending, fields present | ✓ | ✓ | ✓ | ✓ |
| Standings gap math (`gap = pts − leader`, P1 = 0) | ✓ | ✓ | ✓ (both tables) | ✓ (both tables) |
| Every name in results exists in roster | ✓ | ✓ | n/a (teams) | ✓ |
| Winner tally vs wins table | engine wins | n/a | n/a | n/a |
| Standings strictly non-increasing points | ✓ | ✓ | ✓ | ✓ |
| Results round exists in schedule | ✓ | ✓ | ✓ | ✓ |
| Power-stage top5 length ≤ 5, winner = top5[0] | | | | ✓ |
| Per-class winner objects have car/team/drivers | | | ✓ | |
