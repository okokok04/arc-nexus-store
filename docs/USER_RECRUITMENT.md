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

Target: 10+ real people who connect a Freighter wallet and complete at least one on-chain purchase on the live app.

### Where to recruit

- [Stellar Developer Discord](https://discord.gg/stellardev) (`#projects` / `#showcase`)
- [r/stellar](https://reddit.com/r/stellar)
- X/Twitter, tagging the Stellar/Soroban dev community
- Friends/colleagues willing to try a testnet dApp for a few minutes

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

## 3. Tracking Sheet — fill in as real users test

Only add a row once a real person has actually completed a purchase. Do not fill this in with placeholder/simulated data.

| # | Wallet (public key, first 8 chars) | Tx hash (stellar.expert link) | Date | Feedback |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |
| 9 | | | | |
| 10 | | | | |

## 4. Demo Video

Once a handful of real transactions have gone through, record a 3-5 min walkthrough:

1. Connect wallet
2. Fund testnet account
3. Init store (owner)
4. Purchase an item, show tx confirmation + live event stream
5. Show the feedback link

Publish on YouTube (unlisted is fine) and link it from the README "Live Demo" section.
