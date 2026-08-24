# Smart Contract

`contracts/restaurant` — a Soroban contract (`soroban-sdk` 22) named `RestaurantContract`.
Source: [`contracts/restaurant/src/lib.rs`](https://github.com/okokok04/arc-nexus-store/blob/master/contracts/restaurant/src/lib.rs).

## Functions

| Function | Signature | Description |
|---|---|---|
| `init` | `(owner: Address, name: String) -> Result<(), Error>` | One-time store initialization. Requires `owner`'s signature. |
| `pay` | `(customer: Address, token: Address, amount: i128, order_id: u64) -> Result<(), Error>` | Transfers `amount` of `token` from `customer` to the owner, updates revenue and order count. Requires `customer`'s signature. |
| `get_owner` | `() -> Address` | Read-only. |
| `get_name` | `() -> String` | Read-only. |
| `get_balance` | `() -> i128` | Read-only, defaults to `0`. |
| `get_order_count` | `() -> u64` | Read-only, defaults to `0`. |

## `init`

```rust
pub fn init(env: Env, owner: Address, name: String) -> Result<(), Error> {
    if env.storage().instance().has(&DataKey::Initialized) {
        return Err(Error::AlreadyInitialized);
    }
    owner.require_auth();
    // ... stores Owner, Name, Balance = 0, OrderCount = 0, Initialized = true
    // publishes a `init` event with (owner, name)
}
```

Can only ever run once per deployed contract instance — a second call returns
`Error::AlreadyInitialized`.

## `pay`

```rust
pub fn pay(
    env: Env,
    customer: Address,
    token: Address,
    amount: i128,
    order_id: u64,
) -> Result<(), Error> {
    if !initialized { return Err(Error::NotInitialized); }
    if amount <= 0 { return Err(Error::AmountMustBePositive); }
    customer.require_auth();

    token::Client::new(&env, &token).transfer(&customer, &owner, &amount);
    // Balance += amount, OrderCount += 1
    // publishes a `pay` event keyed by customer, with (amount, order_id)
}
```

The token transfer goes through the standard Stellar Asset Contract client
(`soroban_sdk::token::Client`), so `pay` works with native XLM or any other Stellar Asset
Contract token — the frontend currently always passes the testnet XLM SAC address
(`VITE_TOKEN_ADDRESS`).

## Errors

```rust
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InsufficientFunds = 3,
    AmountMustBePositive = 4,
}
```

The frontend never has to parse these directly — `src/lib/account.js#formatStellarError`
matches on the error text/code and returns a human-readable message. See
[Error Handling](/integration/error-handling) for the full mapping.

## Test suite

```text
running 4 tests
test test::test_init_sets_owner_and_name ... ok
test test::test_init_twice_panics - should panic ... ok
test test::test_pay_zero_amount_panics - should panic ... ok
test test::test_pay_transfers_tokens_and_updates_balance ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; finished in 0.03s
```

Run it yourself with `npm run contract:test` (`cargo test --package restaurant-contract`).
