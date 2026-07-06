# System Architecture - Stellar Escrow Marketplace

## Overview

Stellar Escrow Marketplace uses a layered architecture:

### Frontend Layer
- React 18 + TypeScript for type-safe UI
- Zustand for lightweight state management
- Tailwind CSS for responsive design

### Contract Layer  
- 3 Soroban smart contracts (Rust)
- Escrow management logic
- Dispute resolution
- Fee distribution

### Blockchain Layer
- Stellar Testnet (Protocol 22)
- Soroban Smart Contract Platform
- Stellar Asset Contract (SAC) for token transfers

---

## Smart Contract Architecture

### Escrow Contract  
Main contract handling escrow lifecycle

**Data Structure**:
```rust
pub struct Escrow {
    pub id: u64,
    pub buyer: Address,
    pub seller: Address,
    pub amount: i128,
    pub state: EscrowState,
    pub created_at: u64,
    pub expires_at: u64,
}
```

**State Machine**:
- Created → Funded → Completed
- Created → Funded → Refunded
- Any state → Disputed

---

## Frontend Architecture

### Components
- `WalletConnect` - Freighter integration
- `CreateEscrow` - Form component
- `EscrowDashboard` - Active escrows
- `TransactionHistory` - All transactions
- `DisputeForm` - Dispute filing

### State Management
- Zustand stores for wallet, escrows, UI
- Event-driven updates
- Real-time synchronization

---

## Data Flow

1. User connects wallet (Freighter)
2. Frontend calls contract via Soroban RPC
3. Transaction signed by wallet
4. Contract updates ledger state
5. Events emitted
6. Frontend listens and updates UI

---

## Security

- Private keys managed by Freighter
- Multi-authorization for critical functions
- Immutable on-chain records
- Atomic transactions only
                ↓
           contract.js (ABI mapping)
```

## Security

- All state-changing calls require Freighter signature
- `customer.require_auth()` and `owner.require_auth()` on-chain
- Network passphrase enforced in wallet + SDK
