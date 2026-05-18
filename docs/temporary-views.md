# Temporary event views

For major one-off events that don't deserve a permanent series tab (Le Mans 24, Indy 500, Bathurst 12h, Spa 24, etc.), we add a **temporary view** that ships with the race week and gets deleted after. The Nürburgring 24 build (May 2026) established the pattern; it has since been converted to a permanent post-race module — see `docs/n24.md`.

## Marker convention

Every temporary view is wrapped with a consistent comment so any future session can find and remove it in under 5 minutes:

```
// ── <NAME> TEMPORARY (DELETE AFTER <date>) ───────────────────────────────────
// ...code...
// ── END <NAME> TEMPORARY ─────────────────────────────────────────────────────
```

`<NAME>` is a short upper-case key (e.g. `N24`, `LM24`, `INDY500`). Use the same `<NAME>` for every site so `grep -rn "<NAME> TEMPORARY" .` finds them all (now that the codebase is split across `index.html`, `styles.css`, and `js/`).

## Five marker sites in a typical view

1. **Series-bar HTML** — the new tab. Wrap with `<!-- ... TEMPORARY -->` HTML comments.
2. **`switchSeries` index array** — add the tab key (e.g. `'n24'`) to the `.series-tab` ordering array used by `classList.toggle`.
3. **`switchSeries` branch** — `if(s==='<key>'){render<Event>();return;}` with a trailing `// <NAME> TEMPORARY` comment so it's grep-able even though it's one line.
4. **Main module block** — constants, `<event>Phase()` helper, `render<Event>()` function, any per-second timers. Wrap with the start/end marker pair.
5. **(Optional) init-time side effects** — e.g. lighting up the series-bar dot before the user opens the tab. One-line, lead with the temporary comment.

After the event: `grep -rn "<NAME> TEMPORARY" .` finds every site; delete each marked block. Run `node verify.js && node verify-nascar.js` before committing the removal to confirm no permanent data was touched.

## Build conventions for the view itself

- Cardinal rule still applies: every fact (driver name, car number, qualifying time, race start) must be verified from an official source. State the source in the commit message.
- **Hardcoded snapshot data only.** Don't try to scrape live timing client-side — CORS will block, and `X-Frame-Options: SAMEORIGIN` blocks iframe embedding for every official timing host checked so far (24h-rennen.de, racehero.io, fg91motorsport.com). If you need a different conclusion, re-verify with a `curl -sI` of the new event's timing host before designing around it.
- **Live timing fallback:** styled "Open Live Timing" button that opens the official page in a new tab. Track the click as a custom event (e.g. `n24:open-timing`) so we can see if anyone uses it.
- **Live stream:** YouTube channel-live embed pattern (`https://www.youtube.com/embed/live_stream?channel=<CHANNEL_ID>`) auto-resolves to whatever's live on the channel — no need to update video IDs day-of.
- **Phase helper.** Single function returning `{ phase: 'pre' | 'live' | 'post', label, sub, color }`. The view template renders the same shape across all three phases; the helper provides countdown / elapsed / "FINISHED" labels.
- **Per-second timer** for countdown/elapsed updates. Self-cancels when `currentSeries !== '<key>'` to avoid background work after the user leaves the tab.
