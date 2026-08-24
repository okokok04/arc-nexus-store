# Testnet Deployment

There are two working ways to deploy `RestaurantContract` to Stellar Testnet in this repo —
pick whichever fits.

::: tip Which one should I use?
**GitHub Actions** (below) if you just want a contract ID with zero local setup.
**`npm run contract:deploy`** if you're iterating locally and want the `.env` written for you
automatically.
:::

## Option A — GitHub Actions (`deploy-contract.yml`)

Manually-triggered (`workflow_dispatch`) so it never runs on a routine push:

1. Open **Actions → Deploy Contract to Testnet → Run workflow** on the repo.
2. The workflow: installs Rust (`wasm32v1-none` target) and the Stellar CLI, generates a fresh
   funded deployer identity (`stellar keys generate deployer --network testnet --fund`),
   builds the contract, deploys it (retrying up to 3 times if the RPC is flaky), then calls
   `init(owner=deployer, name="Arc Nexus")`.
3. Once green, copy the **Contract ID** from the job summary (also uploaded as the
   `testnet-deployment` artifact, `deployment/testnet.json`).
4. Set it on Vercel → Project → Settings → Environment Variables:
   - `VITE_CONTRACT_ID` = the new contract ID
   - `VITE_NETWORK` = `TESTNET`
5. Redeploy the Vercel project.

## Option B — `npm run contract:deploy` (local script)

```bash
npm run contract:build     # cargo build --target wasm32v1-none --release
npm run contract:deploy    # runs scripts/deploy-contract.mjs
```

`scripts/deploy-contract.mjs` does everything the GitHub Actions workflow does, but from your
machine and using the Stellar SDK directly (no Soroban CLI required):

1. Generates a random `Keypair` and funds it via Friendbot.
2. Waits for the account to become visible on Horizon (retries every 2s).
3. Uploads the contract WASM (`Operation.uploadContractWasm`).
4. Creates the contract instance (`Operation.createCustomContract`) and reads back the new
   contract ID from the simulation result.
5. Calls `init(owner=deployer, name="Arc Bistro")`.
6. Writes `VITE_NETWORK`, `VITE_CONTRACT_ID`, `VITE_RPC_URL`, `VITE_HORIZON_URL`, and
   `VITE_TOKEN_ADDRESS` straight into a `.env` file in the repo root — overwriting whatever
   was there.

Every step polls Soroban RPC and treats a `Bad union switch` parse error while polling as a
success signal (see [Error Handling](/integration/error-handling)) rather than failing a
deployment that actually went through on-chain.

## Verifying a deployment

```bash
# Check the contract on Stellar Expert
open https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>

# Or query it directly via the SDK / frontend once VITE_CONTRACT_ID is set —
# get_owner / get_name / get_balance / get_order_count are all read-only.
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Soroban/Stellar CLI not found | `cargo install --locked stellar-cli` |
| `wasm32v1-none` target missing | `rustup target add wasm32v1-none` |
| Freighter won't connect | Install [freighter.app](https://www.freighter.app), switch to **Testnet**, refresh |
| Account funding fails / rate-limited | Retry Friendbot, or fund via [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test) |
| Frontend can't reach the contract | Confirm `VITE_CONTRACT_ID` is a 56-char `C...` address and matches the network in `VITE_NETWORK` |

::: warning A note on older deployment docs
Earlier drafts of this guide referenced `deploy-testnet.sh` / `.ps1` / `deploy.mjs` scripts and
a contract at `contracts/escrow`. Those were from an earlier iteration of this project and have
since been removed — the only deploy paths that actually exist in this repo today are the two
options above, targeting `contracts/restaurant`.
:::
