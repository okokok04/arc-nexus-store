# Demo Video Script — Arc Nexus Store (Level 5)

Target length: 4-6 minutes. Record with OBS Studio (free) or your OS's built-in screen recorder, 1920x1080, clear mic audio. Do this in one take against the **live** site (`arc-restaurant-git.vercel.app`), not localhost — the whole point is showing a real deployment.

## Before recording

- Have Freighter installed and unlocked, set to **Testnet**
- Have a second wallet account ready in Freighter (or a friend on a call) so you can show a *second*, distinct purchase — one real transaction on camera isn't much of a "walkthrough"
- Open Sentry and GA4 dashboards in background tabs to switch to at the end
- Close unrelated tabs/notifications

## Script

**[0:00–0:20] Hook + problem**
> "Card payments take 2-5 days to settle and cost a merchant 2-3% of every sale. This is Arc Nexus Store — a store's checkout where the smart contract *is* the payment processor. No backend, no bank, settles in about 5 seconds."

Show the live site loading.

**[0:20–0:50] Connect + fund**
> "I connect Freighter — that's the only login this app has."
Click Connect Wallet, approve in the Freighter popup.
> "First-time wallet, so it needs testnet funds — one click, no faucet website to go find."
Click "Fund Testnet Account", show it complete.

**[0:50–1:40] First purchase**
> "Here's the menu. I'll buy the Neural Link Gen-S for 5 XLM."
Click Purchase → show the Confirm Purchase modal → Confirm → Freighter signature popup → approve.
> "That's a real transaction on Stellar testnet — not a mock, not a database row."
Show the tx hash link, click through to stellar.expert briefly to prove it's real.

**[1:40–2:10] Live state update**
> "Store Revenue and Units Sold just updated — that's not an API call to my server, that's the contract's own storage, read straight from the ledger."
Point at the stats cards, then scroll to Live Event Stream.
> "This is polling the Soroban RPC directly for the `pay` event my purchase just emitted."

**[2:10–2:50] Second purchase, different wallet (proves multi-user, not a demo trick)**
Switch Freighter account (or hand off to the second person).
> "Different wallet, different purchase — Quantum Watch this time."
Repeat purchase flow quickly, show revenue/units incrementing again.

**[2:50–3:30] Under the hood — architecture in 30 seconds**
> "There's no backend here. The React frontend builds the transaction, Freighter signs it, and it goes straight to Soroban RPC, which runs this contract."
Screen-share or cut to the pitch deck's architecture slide / show `contracts/restaurant/src/lib.rs`'s `pay` function briefly.
> "The whole payment primitive is about 90 lines of Rust."

**[3:30–4:10] It's actually monitored**
Switch to Sentry tab.
> "This isn't a toy — it's wired to real error tracking and analytics. This Sentry issue is a real mobile visitor who hit a real bug, which we've since fixed."
Switch to GA4 tab, show the purchase event.

**[4:10–4:40] Where this goes next**
> "Right now this is testnet, and we're running an open call for 50 testers — link's in the README and description. Feedback from that cohort becomes the next line on the roadmap: mobile wallet support is already the top ask. After that, the goal is a real mainnet pilot with one actual merchant."

**[4:40–5:00] Close**
> "Code's public, demo's live, and if you try it, the two-minute feedback form is worth more to us right now than a star on the repo. Thanks for watching."
Show the GitHub URL and live demo URL as text on screen.

## After recording

1. Upload to YouTube (unlisted is fine for submission — public if you want the reach for recruitment).
2. Update `README.md`'s "Live Demo" section: replace `_pending_` with the real link.
3. Add the link to the pitch deck's closing slide too if you're re-publishing it.
