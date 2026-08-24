# Getting Started

## Prerequisites

- Node.js 20+
- [Freighter wallet](https://www.freighter.app) browser extension, switched to **Testnet**
- Rust + `wasm32v1-none` target, only if you plan to build/deploy the contract yourself

## Run the frontend locally

```bash
git clone https://github.com/okokok04/arc-nexus-store.git
cd arc-nexus-store
npm install
cp .env.example .env   # fill in VITE_CONTRACT_ID at minimum
npm run dev
```

Open `http://localhost:5173` (Vite's default port). See
[Environment Variables](/reference/environment-variables) for what each `.env` key does — at
minimum you need a valid `VITE_CONTRACT_ID` pointing at a deployed copy of the
`restaurant` contract.

::: tip Don't have a contract deployed yet?
Either use the currently-live testnet contract ID from the [Introduction](/guide/introduction),
or deploy your own — see [Testnet Deployment](/deploy/testnet-deployment).
:::

## Build and test the contract

```bash
npm run contract:build   # cargo build --target wasm32v1-none --release
npm run contract:test    # cargo test
```

Expected output:

```text
running 4 tests
test test::test_init_sets_owner_and_name ... ok
test test::test_init_twice_panics - should panic ... ok
test test::test_pay_zero_amount_panics - should panic ... ok
test test::test_pay_transfers_tokens_and_updates_balance ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; finished in 0.03s
```

## Run the frontend test suite

```bash
npm run test       # vitest
npm run test:ui    # vitest --ui
```

## Deploy your own contract copy

```bash
npm run contract:deploy   # runs scripts/deploy-contract.mjs
```

This generates a fresh funded testnet keypair, uploads the WASM, creates the contract,
calls `init`, and writes the resulting `VITE_CONTRACT_ID` straight into `.env`. Requires no
manual key management — see [Testnet Deployment](/deploy/testnet-deployment) for what it does
step by step.

## First time using the app

1. **Connect** — click "Connect Wallet", approve in the Freighter popup.
2. **Fund** — first-time wallets need testnet XLM; click "Fund Testnet Account" (Friendbot).
3. **Init** *(owner only, once per contract)* — set the store name and owner address.
4. **Buy** — pick a menu item, confirm in the modal, approve the Freighter signature.
5. **Watch it settle** — the tx hash links to [stellar.expert](https://stellar.expert), and the
   Live Event Stream panel shows the `pay` event as soon as Soroban RPC reports it.
