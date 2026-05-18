# Adding a new series

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
9. Add the series to the **Series support** table in CLAUDE.md and (optionally) to the event table in `docs/analytics.md` if you wired analytics into the new switch/render functions.

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
