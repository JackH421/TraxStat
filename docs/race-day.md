# Race-day playbook

What runs automatically on a typical F1 weekend, and the touchpoints where you (the human) take action.

| When | What to expect / do |
|---|---|
| Daily 08:00 ET / 12:00 UTC | News aggregator PR opens proposing the day's HOMEPAGE_ARTICLES refresh. Push notification fires on mobile. Review + merge from phone, or close to skip the day. See `docs/news-aggregator.md`. |
| Fri / Sat (practice + quali) | Site auto-renders FP and quali whenever someone opens the LIVE tab. No action needed. |
| Sun pre-race | Live pill pulses, series-bar green dot lights, LIVE tab shows live timing. No action needed. |
| Sun post-race (first 4 h) | Off-air recap renders with podium from cached results. Server-side polling is dormant (waiting for the +4 h mark). |
| Sun post-race (4–24 h) | Cron firings begin. **Expect a phone push notification when the first auto-PR opens** — typically within 30–60 min of the race ending. Yellow-dot badges may also appear on RACE RESULTS / DRIVERS / CONSTRUCTORS for visitors with the tab open. |
| Sun evening | From phone: review the auto-PR diff against F1.com / FIA. Tap **Merge**. |
| Mon | If the merged PR was missing sprint data, fastest-lap details, or qualifying videos, top them up via the existing manual prompts. |

The full state-machine / polling / automation details (cadence, endpoints, localStorage keys, badge UI, test-mode flag, GitHub Action wiring) live in `docs/f1.md`.
