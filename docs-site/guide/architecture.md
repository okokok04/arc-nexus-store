# Architecture

Arc Nexus Store has exactly three layers, and no server tier — there's nothing between the
browser and the Stellar network.

```text
┌─────────────────────────┐
│  React frontend (Vite)  │  builds + simulates transactions, renders UI
└────────────┬─────────────┘
             │ sign via Freighter (@stellar/freighter-api)
             ▼
┌─────────────────────────┐
│  Soroban RPC             │  simulateTransaction / sendTransaction / getEvents
│  (soroban-testnet.stellar.org) │
└────────────┬─────────────┘
             │
             ▼
┌─────────────────────────┐
│  RestaurantContract       │  Rust / soroban-sdk 22, deployed to Stellar Testnet
│  (contracts/restaurant)   │  owns ledger state: owner, name, balance, order_count
└─────────────────────────┘
```

## Frontend layer

- **React 18 + Vite**, no router — the whole app is a single page (`src/App.jsx`).
- **`WalletContext`** (`src/context/WalletContext.jsx`) holds the connected Freighter public
  key and exposes it via the `useWallet` hook.
- **`useEventStream`** polls Soroban RPC on an interval and keeps the most recent 50 contract
  events in memory — no websocket, no indexer.
- Plain CSS + Tailwind utility classes (`src/index.css`) — no component library.

## Contract layer

A single Soroban contract, `RestaurantContract` (`contracts/restaurant/src/lib.rs`), holds all
on-chain state in instance storage:

| Key | Type | Meaning |
|---|---|---|
| `Owner` | `Address` | Set once at `init`, receives every payment |
| `Name` | `String` | Store display name |
| `Balance` | `i128` | Running total of everything paid in |
| `OrderCount` | `u64` | Number of successful `pay()` calls |
| `Initialized` | `bool` | Guards against calling `init` twice |

See [Smart Contract](/guide/smart-contract) for the full function reference.

## Data flow — a purchase, end to end

1. Customer picks a menu item in `RestaurantPanel`; the UI opens `PurchaseConfirmModal`.
2. On confirm, `src/lib/soroban.js#invokeContract` builds a `TransactionBuilder` transaction
   calling `pay(customer, token, amount, order_id)`.
3. The transaction is **simulated** first (`server.simulateTransaction`) so footgun errors
   (unfunded account, wrong contract, zero amount) surface before a signature is ever
   requested.
4. Freighter signs the prepared XDR (`signTransaction`).
5. The signed transaction is submitted (`server.sendTransaction`) and polled
   (`pollTransaction`) until Soroban RPC reports `SUCCESS` or `FAILED`.
6. The contract's `pay` handler transfers the token via the Stellar Asset Contract, then
   updates `Balance` and `OrderCount` in the same atomic call, and publishes a `pay` event.
7. `useEventStream`'s next poll picks up that event and it appears in the Live Event Stream
   panel — this is the *ledger* talking, not a server pushing a webhook.

## Security notes

- Every state-changing call requires a real signature: `owner.require_auth()` in `init`,
  `customer.require_auth()` in `pay` — enforced on-chain by the Soroban runtime, not by the
  frontend.
- The network passphrase (`Test SDF Network ; September 2015` for testnet) is checked both by
  Freighter and by the SDK's `TransactionBuilder`, so a signature built for the wrong network
  is rejected before it can be submitted.
- Private keys never touch this codebase — Freighter holds them, and the frontend only ever
  sees a public key and signed XDR.
- `init` originally had no `require_auth()` check, which meant anyone could front-run a
  freshly-deployed, uninitialized contract and claim ownership. This was found during real
  testing and fixed (see [Roadmap & Iteration Log](/product/roadmap)) — it's a good example of
  why "it compiles" isn't the same as "it's safe to deploy."
