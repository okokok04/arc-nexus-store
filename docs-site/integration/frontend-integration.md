# Frontend ↔ Contract Integration

All contract calls go through `src/lib/soroban.js`. There is no wrapper SDK generated from the
contract — every call is hand-built with `@stellar/stellar-sdk`.

## Config

`src/lib/contract.js` centralizes everything environment-dependent:

```js
export const CONTRACT_ID = (import.meta.env.VITE_CONTRACT_ID || '').trim()
export const NETWORK = import.meta.env.VITE_NETWORK || 'TESTNET'
export const NETWORK_PASSPHRASE = NETWORK === 'MAINNET'
  ? 'Public Global Stellar Network ; September 2015'
  : 'Test SDF Network ; September 2015'
export const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org'

export const CONTRACT_FUNCTIONS = {
  INIT: 'init', PAY: 'pay',
  GET_BALANCE: 'get_balance', GET_OWNER: 'get_owner',
  GET_NAME: 'get_name', GET_ORDER_COUNT: 'get_order_count',
}
```

Argument builders (`buildInitArgs`, `buildPayArgs`) return a small declarative spec —
`{ address }`, `{ string }`, `{ i128 }`, `{ u64 }` — which `scValFromSpec()` in `soroban.js`
turns into actual `ScVal`s via `nativeToScVal` / `Address.fromString`. This keeps the
call-sites readable without hand-rolling XDR at every use.

## Read calls — simulate only

Read-only views (`get_balance`, `get_order_count`) go through `simulateContractCall`, which
**requires a funded `sourceKey`**:

```js
export async function getContractBalance(sourceKey) {
  if (!sourceKey) return null // "unknown", not "zero"
  const sim = await simulateContractCall(CONTRACT_FUNCTIONS.GET_BALANCE, [], sourceKey)
  return Number(scValToNative(sim.result.retval))
}
```

::: warning Why a funded source account is required for reads
The current Soroban RPC's simulation response includes account-state fields that only decode
cleanly when the source account actually exists on the ledger. An unfunded/placeholder source
reliably triggers a `Bad union switch` XDR parse error — this was found the hard way and is
why every read call in this codebase takes a connected wallet's key, not a throwaway one.
:::

## Write calls — simulate, sign, submit, poll

`invokeContract(functionName, args, publicKey, signTransaction, { onPhase })` is the one
function every write goes through (`initRestaurant` and `payOrder` are thin wrappers around it):

```text
loading-account → simulating → preparing → awaiting-signature → submitting → confirming
```

Each phase is reported via the `onPhase` callback so the UI (`PurchaseConfirmModal`) can show
a live status instead of a single spinner. Key steps:

1. **Simulate** (`server.simulateTransaction`) — catches contract errors before a wallet
   popup ever appears.
2. **Prepare** (`rpc.assembleTransaction`) — attaches Soroban resource footprint/fees. If this
   throws an XDR parsing error, there's a manual-assembly fallback that rebuilds the
   transaction with `setSorobanData` directly from the simulation result.
3. **Sign** — `signTransaction(xdr, { networkPassphrase, address })`, implemented via
   Freighter's `@stellar/freighter-api`.
4. **Submit** (`server.sendTransaction`) — throws immediately on `status === 'ERROR'`.
5. **Poll** (`pollTransaction`) — checks `server.getTransaction(hash)` every 2s, up to 30
   attempts, until `SUCCESS` or `FAILED`.

```js
export async function payOrder(customer, tokenAddress, amount, orderId, publicKey, signTransaction, options) {
  return invokeContract(
    CONTRACT_FUNCTIONS.PAY,
    buildPayArgs(customer, tokenAddress, amount, orderId),
    publicKey, signTransaction, options,
  )
}
```

## Live events

`fetchContractEvents(startLedger)` calls `server.getEvents` filtered to this contract's ID,
mapping each raw event's `topic`/`value` back to native JS values with `scValToNative`. The
`useEventStream` hook (`src/hooks/useEventStream.js`) wraps this in a 5-second poll and caps
history at 50 events — no unbounded memory growth in long-running tabs.

## Wallet layer

`src/context/WalletContext.jsx` + `src/hooks/useWallet.js` wrap `@stellar/freighter-api`:

```js
const { account, isConnected, connect, disconnect, sign, error } = useWallet()
```

`connect()` checks that Freighter is installed and on the expected network before returning a
public key — mismatches surface as a friendly error rather than a failed signature later on.
