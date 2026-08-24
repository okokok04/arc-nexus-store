# Error Handling

Every error — contract, network, or Freighter — passes through
`src/lib/account.js#formatStellarError` before it reaches the UI, so users see plain language
instead of a raw XDR dump or Rust panic string.

## Mapping

| Pattern matched | Shown to the user | `needsFunding` |
|---|---|---|
| `non-existent contract function`, `MissingValue` | "Contract mismatch: deployed contract does not expose init/pay. Deploy this repo's contract and set `VITE_CONTRACT_ID`." | no |
| `invalid contract id`, `invalid strkey`, `invalid address` | "Invalid contract or token address. Check `VITE_CONTRACT_ID` on Vercel." | no |
| `account not found`, `not funded` | "Your wallet is not funded on Stellar Testnet. Click 'Fund Testnet Account'…" | **yes** |
| `already initialized`, `Error(Contract, #1)` | "Restaurant is already initialized on this contract. You can proceed to Pay." | no |
| `amount must be positive`, `Error(Contract, #4)` | "Payment amount must be greater than 0." | no |
| `not initialized`, `Error(Contract, #2)` | "Restaurant has not been initialized yet. Click 'Init Restaurant' first." | no |
| `insufficient`, `Error(Contract, #3)`, `balance too low`, `underflow` | "Insufficient XLM balance for this purchase…" | no |
| `freighter must be on testnet`, `network passphrase` | passed through verbatim | no |
| `rejected in freighter`, `signing was cancelled` | passed through verbatim | no |
| `account entry is missing` | "Your account is not ready for Soroban payments yet. Wait 5–10 seconds after funding, then retry." | no |
| `bad union switch` | "Client-side response parsing hiccup — the transaction may have already gone through. Check your wallet address on stellar.expert before retrying to avoid a duplicate payment." | no |
| *(anything else)* | raw message, truncated to 200 characters | no |

The `#1`–`#4` codes are the contract's own `Error` enum (`AlreadyInitialized`,
`NotInitialized`, `InsufficientFunds`, `AmountMustBePositive`) — see
[Smart Contract](/guide/smart-contract).

## Why `Bad union switch` gets special treatment

The current testnet Soroban RPC occasionally returns a transaction-status response this SDK
version can't fully XDR-decode, *even when the transaction actually succeeded on-chain*.
Rather than surface a scary parser error for a payment that already went through:

- `pollTransaction` treats `Bad union switch` while polling as a **success** signal.
- `formatStellarError` tells the user to double-check stellar.expert instead of just retrying
  blindly (which could double-pay).

This was root-caused to `@stellar/stellar-sdk` being three major versions behind (`13.3.0` →
`16.2.0`); upgrading fixed most occurrences, but the defensive handling stayed since a
different RPC/SDK version skew could reintroduce it.

## Funded-account checks

`checkAccountExists(publicKey)` hits Horizon with a 5-second abort timeout — a `404` means
"not funded yet" and is treated as a normal, expected state, not an error. This backs the
"Fund Testnet Account" prompt that appears for first-time wallets.
