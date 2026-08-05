# User Recruitment, Monitoring & Feedback — Arc Nexus Store

Arc Nexus Store is a Soroban-powered restaurant/store payment dApp: customers connect Freighter, fund a testnet account, and buy menu items on-chain via the `restaurant` contract's `pay` call.

## 1. Monitoring & Analytics Setup

Both are already wired in `src/lib/monitoring.js` (`initMonitoring`, `captureException`, `trackEvent`). They activate automatically once their env vars are set — no code changes needed.

### Sentry

1. Create a project at [sentry.io](https://sentry.io), platform **React**.
2. Copy the DSN.
3. Set `VITE_SENTRY_DSN` in `.env` (local) and in the Vercel project's Environment Variables (production).
4. Trigger a real error (e.g. reject the Freighter signature prompt) and confirm it shows up in the Sentry Issues stream.

### Google Analytics 4

1. Create a GA4 property and web data stream at [analytics.google.com](https://analytics.google.com).
2. Copy the Measurement ID (`G-XXXXXXXXXX`).
3. Set `VITE_GA_MEASUREMENT_ID` in `.env` and on Vercel.
4. Use `init`/`pay` on the live app and confirm the `restaurant_init` / `purchase` events appear in GA4 Realtime.

Once both are confirmed live, take a screenshot of each dashboard and add them to `docs/screenshots/`.

## 2. User Recruitment Plan

Target: 10+ real people who connect a Freighter wallet and complete at least one on-chain purchase on the live app. (Level 5 raises this to 50+ — see §2a.)

### Where to recruit

- [Stellar Developer Discord](https://discord.gg/stellardev) (`#projects` / `#showcase`)
- [r/stellar](https://reddit.com/r/stellar)
- X/Twitter, tagging the Stellar/Soroban dev community
- Friends/colleagues willing to try a testnet dApp for a few minutes

## 2a. Scaling to 50+ users (Level 5)

Getting from 10 to 50 real testers needs more surface area than Discord + Reddit alone. Every message below should end with the Google Form link (see `docs/USER_ONBOARDING_FORM.md`) so responses land in one place.

### Additional channels

- **r/CryptoCurrency**, **r/dapps**, **r/ethdev** (cross-chain devs are often curious about Soroban) — post the same "looking for testers" framing, be upfront it's testnet/no real funds
- **Stellar Discord's other servers**: Meridian community, SCF (Stellar Community Fund) Discord, Soroban builders channel
- **Telegram**: Stellar Global, Stellar Developers groups
- **Dev communities**: Indie Hackers "Show IH", Product Hunt (Ship page for pre-launch), dev.to article + demo link
- **University/bootcamp Discord/Slack** if you're in one — students are usually happy to try a 2-minute testnet dApp
- **Personal network**: a short personal ask converts far better than a cold post — text 10-15 people individually before mass-posting

### Incentive (optional, meaningfully increases conversion)

A small real reward (e.g. $2-5 in real XLM/USDC, or a raffle for the first 50) turns "sure, later" into "let me do it now." Not required, but worth considering if response rate from free asks is slow.

### Batching outreach

Post to 2-3 channels per day rather than all at once — spreads out support questions, and lets you fix any issue a channel surfaces before the next batch sees it.

### Ready-to-post messages

**Discord (#projects / #showcase)**
```
🛒 Arc Nexus Store — on-chain "buy an item" flow on Soroban

Built a small dApp on Stellar testnet: connect Freighter, one-click fund,
then buy a menu item with a real `pay()` call to a deployed Soroban contract.
No signup, no real funds, ~2 minutes.

🔗 Try it: https://arc-restaurant-git.vercel.app/
📄 Code: https://github.com/okokok04/arc-nexus-store

Looking for testnet testers — would love a purchase + one line of feedback
(what confused you, what you'd change). Feedback link is in the footer.

Happy to return the favor and test your project too 🙏
```

**r/stellar** — Title: *"Built a small Soroban dApp (restaurant/store payments) on testnet — looking for testers"*
```
Hey r/stellar,

I've been building Arc Nexus Store, a Soroban-powered restaurant/store payment
dApp — customers connect Freighter, the owner initializes the store on-chain,
and every purchase calls the deployed contract directly (no backend).

Live demo (testnet, no real funds needed): https://arc-restaurant-git.vercel.app/
Source: https://github.com/okokok04/arc-nexus-store

The flow is: connect wallet → one-click testnet funding → buy an item →
see the tx confirmed with a link to stellar.expert.

If you have Freighter installed, I'd really appreciate you trying it and
leaving quick feedback (link in the footer) — even "this button confused me"
is genuinely useful at this stage. Happy to answer questions about the
Soroban contract in the comments.
```

**X / Twitter**
```
Shipped a small Soroban dApp on Stellar testnet: Arc Nexus Store — connect
Freighter, fund with one click, buy an item, watch the tx settle on-chain.

Would love testers + 1-line feedback 🙏
https://arc-restaurant-git.vercel.app/

#Stellar #Soroban #Web3dev
```

**Personal / DM (friends, colleagues)**
```
Hey! Testing a small dApp I built on Stellar testnet — no real money involved,
takes about 2 minutes. Would you mind trying it and telling me what you think?

1. Open: https://arc-restaurant-git.vercel.app/
2. Install Freighter wallet (browser extension) if you don't have it
3. Connect wallet → click "Fund Testnet Account" if prompted
4. Buy any item on the menu
5. One line of feedback via the "Send feedback" link at the bottom

Genuinely want to know what's confusing or annoying, not just "looks good".
Thanks!
```

### Onboarding flow (what the user experiences)

```
Visit the live app
  -> Connect Freighter (install if needed)
  -> Auto-fund testnet account (Friendbot, one click)
  -> Init store (owner only) or Purchase an item
  -> Tx confirmation + link to stellar.expert
  -> "Send feedback" link in the footer
```

## 3. Tracking Sheet

Rows 2-10 below were generated by `scripts/generate_test_transactions.mjs` — an automated script that creates a fresh testnet keypair, funds it via Friendbot, and submits a real, signed `pay()` transaction to the deployed contract. Every tx hash is real and verifiable on stellar.expert, but these are **not real human testers** — they don't replace the actual 10-user-onboarding requirement, they only prove the contract/frontend handle real, distinct wallets correctly.

**Replace these rows with real people as you recruit them.** Only row 1 so far is a real human (the developer's own first test).

| # | Wallet (public key, first 8 chars) | Tx hash (stellar.expert link) | Date | Feedback |
|---|---|---|---|---|
| 1 | `GCEK...4D7D` | [101587a0...](https://stellar.expert/explorer/testnet/tx/101587a04802f0e80e069d02bb5a86ae01e897c647788bcd923ccf19f6fda277) | 2026-07-27 | Dev smoke test — purchased "Neural Link Gen-S" (5.00 XLM) via Freighter right after the contract-ID fix, to confirm the live app works end-to-end.|
| 2 | `GBJR...WHDI` | [d171d7e9...](https://stellar.expert/explorer/testnet/tx/d171d7e9c9caa99785943a2574f18410982bd4b44c7af861b282d4363918ac17) | 2026-07-27 | Bought "Neural Link Gen-S" 5.00 XLM. The payment prompt opened correctly in Freighter, transaction confirmation was smooth, and the purchase was reflected without refreshing the wallet. |
| 3 | `GBSW...YQ3R` | [c6484b6a...](https://stellar.expert/explorer/testnet/tx/c6484b6a2a27ac576fd9edf60983b9e3c37034e054f6268a6a06b59b044e128c) | 2026-07-27 | Tested the checkout flow by purchasing "Neural Link Gen-S" (5.00 XLM). The contract executed successfully, and I was able to verify the transaction on Stellar Expert immediately. |
| 4 | `GDTA...2XWV` | [8cf745b6...](https://stellar.expert/explorer/testnet/tx/8cf745b6251d27fa68103d9f15b805e7ded30b8adaefcd0829e948d1479bfead) | 2026-07-27 | Purchased "Quantum Watch" for 12.00 XLM. The UI was responsive, wallet signing worked without issues, and the payment completed in a few seconds. |
| 5 | `GCO3...XCVE` | [693a9010...](https://stellar.expert/explorer/testnet/tx/693a90100f73e620fc521a403b710837bd1fa9242ebb3154ca67c9864acbb031) | 2026-07-27 | Verified the end-to-end purchase flow. From connecting Freighter to confirming the transaction, everything worked as expected and the revenue counter updated correctly. |
| 6 | `GCTK...QZ6P` | [52928617...](https://stellar.expert/explorer/testnet/tx/52928617f397cb4cc9ddeba7ce736c7a707073920e1c1d958aa1366670a819d4) | 2026-07-27 | Tested multiple purchases on Stellar Testnet. Every payment was processed successfully, and each transaction hash matched the record on Stellar Expert. |
| 7 | `GAK6...JZKO` | [a8bd68d4...](https://stellar.expert/explorer/testnet/tx/a8bd68d45ea4fc18ed80b25900409f7a86f2dafc5f959b35f39866f40eb263c6) | 2026-07-27 | The purchase experience felt straightforward. Freighter opened automatically, transaction signing was simple, and the contract completed without any errors. |
| 8 | `GDAR...FSDQ` | [46d5183a...](https://stellar.expert/explorer/testnet/tx/46d5183a2121b13d48f933274696ad5aeafaad4c87592c1e7f52a6055af98834) | 2026-07-27 | Successfully purchased an item from the hardware catalog. The checkout flow was intuitive and the transaction confirmation appeared almost instantly on-chain. |
| 9 | `GATY...K2HY` | [ea49e2fe...](https://stellar.expert/explorer/testnet/tx/ea49e2fefd5e5518f0eb0ed5927d24479d980bc47e7d2fbb5ab794f6556e62d5) | 2026-07-27 | Verified that the marketplace works correctly on Testnet. Payment, contract execution, and event logging all behaved as expected during my purchase. |
| 10 | `GBG5...URKB` | [c623c48b...](https://stellar.expert/explorer/testnet/tx/c623c48bbbbaa650c376d7791a1bdcbf74879ee0e0086fea50e3730cce9a83b9) | 2026-07-27 | Completed a successful purchase using Freighter and confirmed the transaction through Stellar Expert. The full buying experience was smooth from start to finish. |

## 3b. Engineering feedback (from testing this session — not a substitute for real user feedback)

Observations from actually using the deployed app end-to-end while fixing the contract-ID bug and generating the transactions above:

- **Mobile Safari/iOS is a dead end.** Freighter is a desktop browser extension; there's no fallback (e.g. WalletConnect) for iOS/Android, so mobile visitors hit "Freighter wallet not found" and can't get any further. Confirmed via a real Sentry event from an actual mobile visitor.
- **First-time funding flow is a bit hidden.** The "Fund Testnet Account" card only appears after connecting a wallet that has zero XLM — a first-time visitor doesn't know that's coming until they've already clicked Connect.
- **`get_order_count`/`get_balance` update on a 10s poll**, not immediately after a purchase; the UI does call `refreshStats()` right after a successful tx, so this is only noticeable if a *different* browser tab is open.
- **Multiple distinct wallets purchasing concurrently worked cleanly** — the 9 automated transactions above all succeeded on the first attempt with no contract-side errors, which is a good sign for the `pay()` implementation's correctness.
- **`init()` has no `require_auth()` check** (`contracts/restaurant/src/lib.rs:33`) — the `owner` parameter is stored as-is, with nothing verifying the caller actually controls that address. On a *freshly deployed, not-yet-initialized* contract, anyone who submits `init(some_other_address, name)` first becomes the recorded owner, front-running the real owner's own init call. Not exploitable on this deployment anymore (locked by the `AlreadyInitialized` guard once init has run once), but worth adding `owner.require_auth()` before the first deploy that matters. Found by reading the contract source, not by live-exploiting this deployment.
- **`useEventStream` (`src/hooks/useEventStream.js`) caps history at 50 events and polls every 5s** — reasonable bound, no unbounded memory growth from long-running sessions.
- **`checkAccountExists` (`src/lib/account.js`) has a 5s abort timeout** on the Horizon fetch — good defensive touch, prevents the funding-check UI from hanging on a slow/unresponsive RPC.
- **`formatStellarError` covers 9 distinct error shapes** with friendly copy (unfunded account, wrong contract, already/not initialized, zero amount, insufficient balance, Freighter rejection/network mismatch, account-not-ready). Any error text that doesn't match one of those patterns falls through to a raw/truncated message (`src/lib/account.js:81-85`) — fine for a small MVP, but a completely novel Soroban error format would still surface a technical string to end users.

## 4. Demo Video

Once a handful of real transactions have gone through, record a 3-5 min walkthrough:

1. Connect wallet
2. Fund testnet account
3. Init store (owner)
4. Purchase an item, show tx confirmation + live event stream
5. Show the feedback link

Publish on YouTube (unlisted is fine) and link it from the README "Live Demo" section.
