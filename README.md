# Arc Nexus Store

[![CI/CD Pipeline](https://github.com/okokok04/arc-nexus-store/actions/workflows/ci.yml/badge.svg)](https://github.com/okokok04/arc-nexus-store/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contracts-Soroban-orange)](https://soroban.stellar.org)

**Arc Nexus Store** is a Soroban-powered restaurant/store payment dApp on Stellar. Customers connect a Freighter wallet, the owner initializes the store on-chain, and every purchase calls the deployed smart contract directly — no backend, no custodian.

## Live Demo

- **Frontend**: [arc-restaurant-git.vercel.app](https://arc-restaurant-git.vercel.app/)
- **Contract (Testnet)**: `CCG66EK4ZNG4LPB565VWSUEFDXCZM5RRUONQF4YEUQ5U2V5CL6WE2MU7`
- **Demo video**: _pending_

## Screenshots

| Desktop | Mobile (375px) |
|---|---|
| ![Desktop UI](docs/screenshots/desktop-ui.png) | ![Mobile UI](docs/screenshots/mobile-ui.png) |

| Sentry (real production error) | GA4 Realtime (real purchase event) |
|---|---|
| ![Sentry dashboard](docs/screenshots/sentry-dashboard.png) | ![GA4 dashboard](docs/screenshots/ga4-dashboard.png) |

## Key Features

- **Wallet integration** — Freighter connect/disconnect via `@stellar/freighter-api`, with network/account checks before every signature
- **Real on-chain calls** — `init` and `pay` are built, simulated, signed, and submitted through `@stellar/stellar-sdk` (`Contract`, `TransactionBuilder`, `rpc.Server`), not mocked
- **Testnet auto-funding** — one-click Friendbot funding with a fallback link to Stellar Laboratory
- **Live event stream** — polls Soroban RPC `getEvents` for `init`/`pay` contract events in real time
- **Monitoring** — Sentry error tracking and GA4 analytics, wired in `src/lib/monitoring.js` (enabled once DSN/measurement ID are configured)
- **Feedback link** — footer link to a feedback form/mailto, configurable via `VITE_FEEDBACK_URL`
- **Mobile responsive UI** — single-column layout, stacked forms/actions below 640px

## Smart Contract

`contracts/restaurant` — a Soroban contract (`soroban-sdk` 22) exposing:

| Function | Description |
|---|---|
| `init(owner, name)` | One-time store initialization |
| `pay(customer, token, amount, order_id)` | Transfers `amount` of `token` from customer to owner, updates revenue/order count |
| `get_owner`, `get_name`, `get_balance`, `get_order_count` | Read-only views |

### Test output

```text
running 4 tests
test test::test_init_sets_owner_and_name ... ok
test test::test_init_twice_panics - should panic ... ok
test test::test_pay_zero_amount_panics - should panic ... ok
test test::test_pay_transfers_tokens_and_updates_balance ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; finished in 0.03s
```

## Getting Started

```bash
npm install
cp .env.example .env   # fill in VITE_CONTRACT_ID at minimum
npm run dev
```

Build the contract and run its Rust test suite:

```bash
npm run contract:build
npm run contract:test
```

Deploy to testnet (requires a funded deployer key — see `scripts/deploy-contract.mjs`):

```bash
npm run contract:deploy
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Stellar**: `@stellar/stellar-sdk`, `@stellar/freighter-api`, Soroban RPC
- **Contract**: Rust, `soroban-sdk` 22
- **CI/CD**: GitHub Actions (`ci.yml` lint/test/build, `deploy-contract.yml` testnet deploy)

## Project Structure

```
src/
  components/   RestaurantPanel, WalletConnect, EventStream, PurchaseConfirmModal, FeedbackLink
  context/      WalletContext (Freighter wallet state)
  hooks/        useWallet, useEventStream
  lib/          soroban.js (SDK calls), contract.js (contract config/menu), account.js (Friendbot/error mapping), monitoring.js
contracts/
  restaurant/   Soroban contract source + tests
```

## User Feedback & Onboarding

The footer "Send feedback" link routes to `VITE_FEEDBACK_URL` (a form or mailto).

Full tracking sheet: [docs/USER_RECRUITMENT.md](docs/USER_RECRUITMENT.md).

- **1 real human tester** so far (the developer's own first test) — real tx hash on stellar.expert.
- **9 automated smoke-test wallets** (`scripts/generate_test_transactions.mjs`) — real, distinct testnet wallets each submitting a real signed `pay()` transaction, used to verify the contract/frontend handle concurrent distinct wallets correctly. These are explicitly **not** real human testers and don't count toward the 10-real-user-onboarding target.
- **No real external feedback collected yet.** `docs/USER_RECRUITMENT.md` has ready-to-post recruitment messages and an empty row template — replace the automated rows with real testers as they're recruited.

## License

MIT
