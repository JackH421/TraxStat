# Daily news aggregator

The HOME landing page's article list (`HOMEPAGE_ARTICLES`) refreshes daily via PR. A GitHub Action fetches ~12 publisher RSS feeds, scores them, enforces series diversity, extracts og:image previews, and opens an `auto/news-YYYYMMDD` pull request proposing 8 primary articles + 4 alternates in `js/home.js`. No part of the page is auto-updated — every refresh requires merging the PR.

The aggregator never paraphrases. Headlines, URLs, and publish dates come verbatim from the publisher's RSS feed; the `source` field uses the feed's publisher name verbatim. Cardinal rule is preserved by structural means: there is no LLM in the loop and no string concatenation that produces new sentences.

## Wiring

- **Workflow**: `.github/workflows/daily-news-aggregator.yml`
- **Script**: `scripts/news-aggregator.mjs` (Node 22 ES module)
- **Deps**: `fast-xml-parser` + `node-html-parser` (declared in `package.json`; installed in CI with `npm ci`).
- **Cron**: `0 12 * * *` — 12:00 UTC daily, which is 08:00 ET in EDT (summer) and 07:00 ET in EST (winter). Accepted trade-off: GitHub Actions cron is UTC-only and the daily target is "first thing morning ET", not exactly 8am year-round.
- **Branch naming**: `auto/news-YYYYMMDD`. The script upserts — if a PR on that branch is already open from an earlier run today, it force-with-leases the new proposal onto the same branch and the PR updates in place.
- **PR title**: `news: daily article refresh — YYYY-MM-DD`
- **Mobile push**: same setup as the F1 post-race poll — GitHub mobile pushes a notification when the PR opens, no extra secrets needed.

## Feed list (12-feed slate as of 2026-05-18)

| Source | Tier | Default series | URL |
|---|---|---|---|
| Formula1.com | official | f1 | `formula1.com/content/fom-website/en/latest/all.xml` (no pubDate — items skipped) |
| ESPN F1 | major | f1 | `espn.com/espn/rss/f1/news` |
| Sky Sports F1 | major | f1 | `skysports.com/rss/12433` |
| Autosport | specialty | any | `autosport.com/rss/feed/all/` |
| The Race | specialty | any | `the-race.com/feed/` |
| Crash.net | specialty | any | `crash.net/rss` |
| RacingNews365 | specialty | f1 | `racingnews365.com/feed/news.xml` |
| Motorsport.com NASCAR | specialty | nascar | `motorsport.com/rss/nascar-cup/news/` |
| Motorsport.com | specialty | any | `motorsport.com/rss/all/news/` |
| Racer | specialty | any | `racer.com/feed/` |
| DailySportsCar | niche | wec | `dailysportscar.com/feed/` |
| Sportscar365 | niche | wec | `sportscar365.com/feed/` |

GPFans, NASCAR.com, and Jayski were considered but excluded — GPFans returns 404 on its documented RSS endpoint, NASCAR.com blocks the User-Agent, and Jayski is behind Cloudflare. NASCAR coverage is preserved via Motorsport.com NASCAR (Cup-specific) + Racer (US racing generally).

## Filters + scoring

- **Freshness window**: last 48 h only (items with no pubDate are skipped — e.g. Formula1.com's feed).
- **URL blacklist**: `/betting/`, `/odds/`, `/predictions/`, `/fantasy/`, `/tickets/`, `/podcast/`, `/forum/`, plus a few more.
- **Headline blacklist**: case-insensitive substrings — `sponsored:`, `live blog:`, `photos:`, etc.
- **Dedupe**: lowercase + strip punctuation, compare first 80 chars; keeps the highest-scoring duplicate after sorting by score.
- **Series classification**: priority overrides (motogp / Formula E / WorldSBK / NHRA / WRC / N24 / IndyCar) fire first, then the feed's default series, then a keyword classifier for `any`-feed items. Order matters in `SERIES_KEYWORDS` — MotoGP/IndyCar/WEC/WRC/NASCAR are checked before F1 so "grand prix" doesn't false-positive into F1.
- **Scoring**: `recencyWeight(ageHours) + tier × 0.5 + keywordBoost(title)`. Recency: 1.0 (<6 h) → 0.85 (<12 h) → 0.7 (<24 h) → 0.55 (<36 h) → 0.4. Tier: official 1.0, major 0.9, specialty 0.8, niche 0.7. Keyword boost: +0.3 each for "penalty", "disqualif", "breaking", "crash", "fired", "wins", "victory", "pole", etc.; +0.1 each for "contract", "deal", "championship", etc. Capped at +0.6 total.
- **Series diversity quota for primary slate**: target 3 F1 + 3 NASCAR + 2 wildcard. If quota can't be filled (e.g. <3 NASCAR items in window) the remaining slots take the next-best regardless of series. Alternates are the next top 4 with no quota.
- **Floor**: if fewer than 6 articles meet criteria, the script exits clean and opens no PR.

## og:image extraction

For each of the 12 selected items, the script fetches the article URL (5 s timeout) and reads `og:image` / `og:image:secure_url` / `twitter:image` from the HTML head. `og:image:alt` is used for the credit line. 200 ms delay between fetches so we're polite to publisher origins. If extraction fails for any reason, `imageUrl` is empty and the home page row renders without an image slot.

## Mobile review workflow

1. Phone push fires when the PR opens at ~08:00 ET.
2. Open the PR in GitHub mobile. The body lists each proposed article with its image preview, source, publish date, and excerpt.
3. **Approve** → tap **Merge pull request**. Site updates within ~30 s.
4. **Swap** → use GitHub mobile's file editor on `js/home.js` to move an alternate up into `HOMEPAGE_ARTICLES`, then merge.
5. **Skip** → tap **Close pull request** without merging. The current home page articles stay until tomorrow's run.

## Testing the Action

- **GitHub UI** → Actions → "Daily News Aggregator" → Run workflow → check `test_mode: true` → Run. A `[TEST] news: daily aggregator test PR — DO NOT MERGE` PR opens, touching only `scripts/.news-test-pr-marker.md`. Close it without merging.
- **Local dry-run**: `DRY_RUN=true node scripts/news-aggregator.mjs` (or `npm run news:dry`) prints the would-be PR title and body to stdout and exits without calling `gh` or `git push`. Useful for validating feed reachability and seeing what today's slate would look like.
- **`TEST_MODE=true DRY_RUN=true`** combines both — prints what the test-mode PR would say, no GitHub side effects.

## Disabling

Either disable the workflow in the GitHub Actions UI (Actions → "Daily News Aggregator" → … → Disable), or delete `.github/workflows/daily-news-aggregator.yml`. The HOMEPAGE_ARTICLES + HOMEPAGE_ALTERNATES constants then go stale on whatever was last merged.

## Independence from the F1 post-race poll

The news aggregator runs alongside the F1 post-race poll, never alongside (different schedules, different files, different concurrency groups). Both write PRs to the same repo but to disjoint paths — the F1 poll touches `js/series/f1.js`, the aggregator touches `js/home.js`. The verify scripts validate F1/NASCAR data only and are not affected by news PR merges.
