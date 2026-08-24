# Growth & Recruitment

Arc Nexus Store's growth loop is deliberately simple: every recruitment channel routes to the
same [tester feedback form](/product/onboarding-form), and that form/sheet is the single
source of truth for the "real users" count — not a spreadsheet duplicated by hand.

## Monitoring & analytics setup

Both Sentry and GA4 are already wired in `src/lib/monitoring.js`
(`initMonitoring`, `captureException`, `trackEvent`) — they activate automatically once their
env vars are set, no code changes needed. See
[Environment Variables](/reference/environment-variables).

1. **Sentry** — create a React project at [sentry.io](https://sentry.io), copy the DSN into
   `VITE_SENTRY_DSN` (local `.env` and Vercel), trigger a real error (e.g. reject the Freighter
   signature prompt) to confirm it lands in the Issues stream.
2. **GA4** — create a property + web data stream at
   [analytics.google.com](https://analytics.google.com), copy the Measurement ID into
   `VITE_GA_MEASUREMENT_ID`, use `init`/`pay` on the live app and confirm `restaurant_init` /
   `purchase` events appear in GA4 Realtime.

## Recruitment plan

Target: **10+ real people** who connect a wallet and complete at least one on-chain purchase
(Level 5 raises this to **50+**). Every message below ends with the feedback form link so
responses land in one place.

**Channels**

- [Stellar Developer Discord](https://discord.gg/stellardev) (`#projects` / `#showcase`), plus
  the Meridian community and SCF Discord's Soroban builders channel
- [r/stellar](https://reddit.com/r/stellar), r/CryptoCurrency, r/dapps, r/ethdev
- X/Twitter, tagged to the Stellar/Soroban dev community
- Telegram (Stellar Global, Stellar Developers)
- Indie Hackers "Show IH", Product Hunt Ship page, dev.to
- Personal network — a short individual ask converts far better than a cold mass-post; message
  10–15 people before posting publicly

**Batching**: post to 2–3 channels per day rather than all at once, so one wave's support
questions get fixed before the next wave sees them.

**Optional incentive**: a small real reward ($2–5 XLM/USDC, or a raffle for the first 50)
measurably increases conversion over a free ask.

::: details Ready-to-post messages
**Discord (`#projects` / `#showcase`)**
```text
🛒 Arc Nexus Store — on-chain "buy an item" flow on Soroban

Built a small dApp on Stellar testnet: connect Freighter, one-click fund,
then buy a menu item with a real pay() call to a deployed Soroban contract.
No signup, no real funds, ~2 minutes.

🔗 Try it: https://arc-restaurant-git.vercel.app/
📄 Code: https://github.com/okokok04/arc-nexus-store

Looking for testnet testers — would love a purchase + 2 min of feedback:
📝 https://docs.google.com/forms/d/e/1FAIpQLSe-9bQUDVFaiBA04WXpTfBHxT3wMfCDB6-Q2FvwzgE8XMeiFg/viewform
```

**r/stellar** — *"Built a small Soroban dApp (restaurant/store payments) on testnet — looking for testers"*
```text
I've been building Arc Nexus Store, a Soroban-powered restaurant/store payment
dApp — customers connect Freighter, the owner initializes the store on-chain,
and every purchase calls the deployed contract directly (no backend).

Live demo (testnet, no real funds needed): https://arc-restaurant-git.vercel.app/
Source: https://github.com/okokok04/arc-nexus-store

The flow is: connect wallet → one-click testnet funding → buy an item →
see the tx confirmed with a link to stellar.expert.

Feedback form: https://docs.google.com/forms/d/e/1FAIpQLSe-9bQUDVFaiBA04WXpTfBHxT3wMfCDB6-Q2FvwzgE8XMeiFg/viewform
```

**X / Twitter**
```text
Shipped a small Soroban dApp on Stellar testnet: Arc Nexus Store — connect
Freighter, fund with one click, buy an item, watch the tx settle on-chain.

Try it: https://arc-restaurant-git.vercel.app/
Feedback: https://docs.google.com/forms/d/e/1FAIpQLSe-9bQUDVFaiBA04WXpTfBHxT3wMfCDB6-Q2FvwzgE8XMeiFg/viewform

#Stellar #Soroban #Web3dev
```
:::

**Onboarding flow (what the user experiences)**

```text
Visit the live app
  → Connect Freighter (install if needed)
  → Auto-fund testnet account (Friendbot, one click)
  → Init store (owner only) or Purchase an item
  → Tx confirmation + link to stellar.expert
  → Fill out the tester feedback form
```

## Real vs. automated activity — read this before trusting a number

This project deliberately separates two very different kinds of "activity" so the 50-user
target never gets inflated by accident:

- **Automated smoke-test wallets** — `scripts/generate_test_transactions.mjs` creates a fresh
  testnet keypair, funds it via Friendbot, and submits a real, signed `pay()` transaction.
  Every tx hash is real and verifiable on stellar.expert, but these prove the
  contract/frontend handle distinct wallets correctly — **they are not human testers.**
- **The Google Form + response sheet** — the only source that counts toward the human-tester
  target, described in [User Onboarding Form](/product/onboarding-form).

::: details Automated on-chain activity log (not human testers)
The current live contract (`CDRGTQ466OLVQDYDTZKXY4J5AWJOJSIJSN3U2CSWHYXD4L7JYU5VXY6N`)
superseded an earlier deployment after adding `owner.require_auth()` to `init()` (see
[Roadmap & Iteration Log](/product/roadmap)). As of **2026-08-14**, direct RPC simulation
confirms `get_order_count = 78` and `get_balance = 769.5 XLM` on the current contract.

24 of those orders are individually logged (wallet prefix, tx hash, date) in
[`docs/USER_RECRUITMENT.md §3a`](https://github.com/okokok04/arc-nexus-store/blob/master/docs/USER_RECRUITMENT.md#3a-contract-v2-activity-post-level-5-auth-fix)
in the repo — the remaining 54 orders came from a separate automated batch run outside that
row-by-row log. Both are confirmed real via the on-chain delta, and both are explicitly **not**
human-user proof.

The full static export of the form's 54 real tester responses is kept in-repo as a backup:
[`Tester_Feedback_Responses.xlsx`](https://github.com/okokok04/arc-nexus-store/blob/master/docs/Tester_Feedback_Responses.xlsx) /
[`.csv`](https://github.com/okokok04/arc-nexus-store/blob/master/docs/Tester_Feedback_Responses.csv),
alongside the full [on-chain activity export](https://github.com/okokok04/arc-nexus-store/blob/master/docs/ARC_NEXUS_ACTIVITY_LOG.xlsx).
:::

## Engineering feedback from real testing

Observations from actually using the deployed app end-to-end while fixing the contract-ID bug
and generating the transactions above — these fed directly into the
[Roadmap & Iteration Log](/product/roadmap):

- **Mobile Safari/iOS is a dead end.** Freighter is a desktop browser extension with no mobile
  fallback (e.g. WalletConnect); confirmed via a real Sentry event from an actual mobile
  visitor.
- **First-time funding is a bit hidden** — the "Fund Testnet Account" card only appears after
  connecting a zero-XLM wallet, so a first-time visitor doesn't know it's coming.
- **Stats poll every 10s**, not instantly after a purchase — only noticeable with a second
  browser tab open, since the UI calls `refreshStats()` right after a successful tx.
- **Concurrent distinct-wallet purchases work cleanly** — every automated transaction above
  succeeded on the first attempt with no contract-side errors.
- **`formatStellarError` covers 9 distinct error shapes** with friendly copy — anything outside
  those patterns still falls through to a raw/truncated message, fine for an MVP but worth
  revisiting if a genuinely new Soroban error format shows up.
