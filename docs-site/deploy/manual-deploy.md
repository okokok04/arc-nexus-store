# Manual Deploy (Stellar Laboratory)

For when you want a contract ID without running any workflow or script at all — useful for
debugging, or if CI/the deploy script is unavailable.

::: warning
The README's example contract ID from an older revision (`CBZCZQL4...`) does **not** include
this repo's `init`/`pay` functions. If your frontend is pointed at a contract you didn't deploy
yourself from `contracts/restaurant`, deploy your own copy and set `VITE_CONTRACT_ID` — see
[Error Handling](/integration/error-handling) for what a contract mismatch looks like at
runtime.
:::

## Steps

1. **Build the WASM locally** (requires Rust):

   ```bash
   cargo build --target wasm32-unknown-unknown --release --package restaurant-contract
   ```

   Or, with the Stellar CLI installed: `stellar contract build`.

2. Open [laboratory.stellar.org — Smart Contracts](https://laboratory.stellar.org/#smart-contracts?network=test)
   (make sure the network switcher says **Test**).

3. Upload `target/wasm32-unknown-unknown/release/restaurant_contract.wasm`.

4. **Deploy** → copy the resulting **Contract ID**.

5. **Invoke `init`** with:
   - `owner` = your Freighter public key
   - `name` = e.g. `"Arc Bistro"`

## After deploying

- **Init may already be done by CI** — if invoking `init` returns "already initialized," skip
  straight to testing `pay`.
- Fund your Freighter wallet on **Testnet** before attempting any transaction.
- Update the live app's `VITE_CONTRACT_ID` (locally in `.env`, or on Vercel for production) and
  hard-refresh the page — Vite inlines env vars at build time, so a production change needs a
  redeploy, not just a refresh.
