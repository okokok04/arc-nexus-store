# Environment Variables

All variables are read via `import.meta.env` (Vite), so they must be prefixed `VITE_` and are
**inlined at build time** — changing one on Vercel requires a redeploy, not just a refresh.
Source of truth: [`.env.example`](https://github.com/okokok04/arc-nexus-store/blob/master/.env.example).

## Stellar network

| Variable | Default | Notes |
|---|---|---|
| `VITE_NETWORK` | `TESTNET` | `TESTNET` or `MAINNET` — picks the network passphrase used when building transactions |
| `VITE_RPC_URL` | `https://soroban-testnet.stellar.org` | Soroban RPC endpoint |
| `VITE_HORIZON_URL` | `https://horizon-testnet.stellar.org` | Used for Friendbot funding and account-existence checks |

## Contract

| Variable | Default | Notes |
|---|---|---|
| `VITE_CONTRACT_ID` | *(none — required)* | 56-char `C...` address of a deployed `RestaurantContract`. See [`isValidContractId`](/integration/frontend-integration) |
| `VITE_TOKEN_ADDRESS` | testnet native XLM SAC | Token contract used by `pay()`; override to test with a different Stellar Asset Contract |

## Monitoring

| Variable | Default | Notes |
|---|---|---|
| `VITE_SENTRY_DSN` | *(unset — disabled)* | Enables Sentry error tracking once set. See [`initMonitoring`](https://github.com/okokok04/arc-nexus-store/blob/master/src/lib/monitoring.js) |
| `VITE_GA_MEASUREMENT_ID` | *(unset — disabled)* | Enables GA4 (`G-XXXXXXXXXX`) once set |

## Product

| Variable | Default | Notes |
|---|---|---|
| `VITE_FEEDBACK_URL` | *(unset)* | Footer "Send feedback" link target; falls back to a `mailto:` link if unset |
| `VITE_APP_NAME` | `Arc Nexus Store` | |
| `VITE_APP_DESCRIPTION` | `Soroban-powered restaurant payments on Stellar` | |
| `VITE_APP_URL` | `http://localhost:3000` | |
| `VITE_API_TIMEOUT` | `10000` | |
| `VITE_EXAMPLE_TX_HASH` | *(unset)* | Optional example tx hash for demos/screenshots |

## Setting these on Vercel

Project → Settings → Environment Variables → add each key for the **Production** (and
**Preview**, if you want PR previews to work against a real contract) environment, then
trigger a redeploy.
