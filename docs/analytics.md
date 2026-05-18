# Analytics

We use **Vercel Web Analytics** for pageview + custom event tracking. Cookieless and GDPR-compliant — no consent banner required.

## How it's wired

- **Init stub + deferred loader** at the bottom of `<body>` in `index.html`:
  ```html
  <script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script>
  <script defer src="/_vercel/insights/script.js"></script>
  ```
  Same-origin path (no third-party DNS, no CORS) and Vercel auto-rewrites it from the edge once Analytics is enabled in the dashboard.
- **`track(name, data)` helper** lives in `js/core.js` (just after `setStats`). Fail-silent: if `window.va` isn't a function (ad-blocked, network failure, CSP), the call is a no-op. The site never breaks when analytics is unavailable.
- **Pageviews** fire automatically on every page load. Custom events fire on user actions via `track()` calls embedded in handlers and template-literal `onclick` attributes.

## Events being tracked

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
| `tab:n24` | `{ tab }` | N24 sub-tab click (results / qualifying / recap) |
| `result:expand:n24` | `{ car }` | Expand an N24 top-20 results row |
| `recap:open:n24` | `{ index }` | Tap an N24 recap thumbnail |
| `refresh` | — | Refresh button click |
| `home:featured` | `{ series }` | Tap a featured-carousel card on HOME (per-series) |
| `home:championship` | `{ series }` | Tap a championship-leader card on HOME |
| `home:article` | `{ series, source }` | Tap a news-feed article card on HOME (opens external URL) |
| `home:render` | `{ cardCount, topSeries }` | Fires once per `renderHome()` — origin/funnel marker |

## Privacy / PII rules

**Never track user PII.** This is non-negotiable:
- **Do not track** anything identifying the visitor: IPs (Vercel handles those server-side, anonymized), email addresses, session tokens, free-text user input, URL query strings carrying personal data, anything the user typed.
- **OK to track** which public sports figure / team / manufacturer the user clicked. Names like "Antonelli", "Mercedes", "Reddick", "Toyota" are public references the user selected from our static list — not data they provided about themselves. If a feature ever lets users *type* a name (search box, custom note), that text **must not** go into `data`.
- Vercel's per-event constraints: `data` values must be `string | number | boolean | null` (no nested objects), 255-char limit per name / key / value, plan-dependent cap on distinct event names.
- **Custom events require Pro plan or higher**; pageviews work on Hobby. If we ever downgrade, the `track()` calls become silent no-ops on the dashboard side but the site keeps working.

## Adding a new event

1. Pick a `name` using the existing `category:action[:scope]` convention (e.g. `lap:expand:f1`).
2. Call `track('your-event-name', { ... })` at the action site. Keep `data` to flat key-value pairs of allowed types.
3. Verify no PII can leak into `data`. If the value comes from user input rather than a static list, don't pass it.
4. Add a row to the event table in this doc, deploy, and confirm the event appears in the Vercel Analytics dashboard within a few hours.
