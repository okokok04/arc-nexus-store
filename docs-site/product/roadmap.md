# Roadmap & Iteration Log

## Status

<div class="chip chip-ok">Shipped</div> contract auth fix · mobile-visitor messaging · clearer onboarding · monitoring live with real data · CI/CD green · SDK upgrade fixing simulation reliability

<div class="chip chip-live">Now</div> running the 50-tester recruitment push, collecting structured feedback

<div class="chip chip-todo">Next</div> mobile wallet signing path · feedback-driven UX pass

<div class="chip chip-todo">Later</div> security audit + mainnet deployment · pilot with one real merchant

## Product iteration log

Real engineering feedback (see [Growth & Recruitment](/product/growth)) turned directly into
shipped fixes:

| Feedback | Fix | Commit |
|---|---|---|
| `init()` had no `require_auth()` — anyone could claim ownership of a fresh, uninitialized contract (front-running risk) | Added `owner.require_auth()`, redeployed contract, verified all read functions | [`b2df24d`](https://github.com/okokok04/arc-nexus-store/commit/b2df24d) |
| A real Sentry event showed a mobile Safari visitor hitting a generic "wallet not found" error — Freighter has no mobile app | Mobile browsers now get an honest, actionable message instead | [`b2df24d`](https://github.com/okokok04/arc-nexus-store/commit/b2df24d) |
| Funding flow only became visible after connecting a wallet — first-time visitors didn't know what to expect | Added a 3-step onboarding hint (connect → fund → buy) visible before connecting | [`b2df24d`](https://github.com/okokok04/arc-nexus-store/commit/b2df24d) |
| `simulateContractCall` used an unfunded placeholder account; current testnet RPC can't XDR-decode simulation responses for a source account that doesn't exist on-ledger — reliable "Bad union switch" errors | Root-caused to `@stellar/stellar-sdk` being 3 major versions behind (13.3.0 → 16.2.0); upgraded and verified end-to-end | [`45a80b5`](https://github.com/okokok04/arc-nexus-store/commit/45a80b5) |

**Next iteration**: once the 50-tester form has real responses, the top 2–3 recurring themes
from the free-text feedback column become the next rows in this table, each shipped as its own
commit. The current front-runner is a mobile-compatible signing path (WalletConnect or
similar), since "desktop only" is the most consequential known gap.

## Roadmap

- **Shipped** — contract auth fix, mobile-visitor messaging, clearer onboarding, monitoring
  (Sentry + GA4) live with real captured data, CI/CD fully green, SDK upgrade fixing
  simulation reliability.
- **Now** — run the 50-tester recruitment push, collect structured feedback via the
  [tester form](/product/onboarding-form).
- **Next** — mobile wallet signing path (closes the most-cited gap), feedback-driven UX pass.
- **Later** — security audit + mainnet deployment, pilot with one real merchant taking real
  payments.
