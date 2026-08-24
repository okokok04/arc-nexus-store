# Introduction

**Arc Nexus Store** is a Soroban-powered restaurant/store payment dApp on Stellar. A customer
connects a Freighter wallet, the store owner initializes the store on-chain once, and every
purchase after that calls the deployed smart contract directly. There is no backend and no
custodian — the contract itself *is* the payment processor.

<div class="chip chip-live">TESTNET</div> <div class="chip chip-ok">CI/CD green</div>

## Why it's built this way

Card payments settle in 2–5 days and cost a merchant 2–3% per sale. Arc Nexus Store's `pay()`
call transfers the customer's token straight to the owner's address in one signed transaction,
settling on Stellar in about 5 seconds, with the store's revenue and order count updated as
part of the same atomic operation — no webhook, no reconciliation job, no chargeback risk.

## Live links

| What | Where |
|---|---|
| Frontend | [arc-restaurant-git.vercel.app](https://arc-restaurant-git.vercel.app/) |
| Contract (Testnet) | `CDRGTQ466OLVQDYDTZKXY4J5AWJOJSIJSN3U2CSWHYXD4L7JYU5VXY6N` |
| Source | [github.com/okokok04/arc-nexus-store](https://github.com/okokok04/arc-nexus-store) |
| Pitch deck | [Arc Nexus Store — Pitch Deck](https://claude.ai/code/artifact/a777089c-395c-4a6d-90f7-0955b99001dc) |

## Key features

- **Wallet integration** — Freighter connect/disconnect via `@stellar/freighter-api`, with
  network and account checks before every signature.
- **Real on-chain calls** — `init` and `pay` are built, simulated, signed, and submitted through
  `@stellar/stellar-sdk` (`Contract`, `TransactionBuilder`, `rpc.Server`). Nothing is mocked.
- **Testnet auto-funding** — one-click Friendbot funding, with a Stellar Laboratory fallback
  link if Friendbot is unavailable.
- **Live event stream** — polls Soroban RPC `getEvents` for `init` / `pay` contract events.
- **Monitoring** — Sentry error tracking and GA4 analytics, wired in `src/lib/monitoring.js`,
  activating automatically once a DSN / measurement ID is configured.
- **Feedback link** — a footer link to a feedback form (or `mailto:`), configurable via
  `VITE_FEEDBACK_URL`.
- **Mobile-responsive UI** — single-column layout below 640px. Wallet *signing* itself is still
  desktop-only, since Freighter is a browser extension — see [Roadmap](/product/roadmap).

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Stellar SDKs | `@stellar/stellar-sdk`, `@stellar/freighter-api`, Soroban RPC |
| Contract | Rust, `soroban-sdk` 22 |
| Monitoring | Sentry (`@sentry/react`), Google Analytics 4 |
| CI/CD | GitHub Actions — `ci.yml` (lint/test/build), `deploy-contract.yml` (testnet deploy) |

## Project structure

```text
src/
  components/   RestaurantPanel, WalletConnect, EventStream, PurchaseConfirmModal, FeedbackLink
  context/      WalletContext (Freighter wallet state)
  hooks/        useWallet, useEventStream
  lib/          soroban.js (SDK calls), contract.js (contract config/menu),
                account.js (Friendbot/error mapping), monitoring.js
contracts/
  restaurant/   Soroban contract source + tests
```

Next: [Getting Started](/guide/getting-started) to run it locally, or
[Smart Contract](/guide/smart-contract) to see the on-chain API.
