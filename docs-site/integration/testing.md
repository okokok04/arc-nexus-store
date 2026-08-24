# Testing

Two independent test suites: Rust unit tests for the contract, and Vitest for the frontend.
Both run in CI on every push/PR to `master`.

## Contract tests

```bash
npm run contract:test   # cargo test --package restaurant-contract
```

`contracts/restaurant/src/test.rs` covers the contract's core invariants:

| Test | Verifies |
|---|---|
| `test_init_sets_owner_and_name` | `init` stores the owner and name correctly |
| `test_init_twice_panics` | a second `init` call is rejected (`AlreadyInitialized`) |
| `test_pay_zero_amount_panics` | `pay` rejects a zero/negative amount |
| `test_pay_transfers_tokens_and_updates_balance` | `pay` moves tokens and updates `Balance`/`OrderCount` atomically |

```text
running 4 tests
test test::test_init_sets_owner_and_name ... ok
test test::test_init_twice_panics - should panic ... ok
test test::test_pay_zero_amount_panics - should panic ... ok
test test::test_pay_transfers_tokens_and_updates_balance ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; finished in 0.03s
```

## Frontend tests

```bash
npm run test      # vitest
npm run test:ui   # vitest --ui
```

`src/test/` covers component behavior (e.g. `WalletConnect.test.jsx`) and contract-call
argument building (`contract.test.js`) using `@testing-library/react` and `jsdom`
(`src/test/setup.js`).

## CI pipeline

`.github/workflows/ci.yml` runs four jobs on every push/PR to `master`:

| Job | What it does |
|---|---|
| `lint` | `npm run lint -- --max-warnings=0` (ESLint) |
| `contract-build` | installs the `wasm32v1-none` Rust target, builds and tests the contract |
| `frontend-test` | `npm run test` (Vitest) |
| `build` → `lighthouse` | `npm run build`, uploads the `dist/` artifact, then runs Lighthouse CI against it |

Contract deployment is a **separate, manually-triggered** workflow
(`.github/workflows/deploy-contract.yml`, `workflow_dispatch`) — see
[Testnet Deployment](/deploy/testnet-deployment). Keeping it manual avoids accidentally
redeploying (and resetting ledger state on) the live contract from a routine push.
