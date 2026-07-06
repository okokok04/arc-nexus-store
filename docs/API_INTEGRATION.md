# API Integration Guide

## Soroban RPC Integration

### Stellar Testnet RPC
**Endpoint**: `https://soroban-testnet.stellar.org`

### Environment Variables
```env
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_ESCROW_CONTRACT_ID=CAXXXXX...
```

---

## Contract Functions

### 1. Create Escrow
```typescript
createEscrow(
  buyer: string,        // Stellar address
  seller: string,       // Stellar address
  amount: number,       // Amount in stroops (1 XLM = 10^7 stroops)
  expiresIn: number,    // Seconds until expiration
  description: string,  // Transaction description
  tokenType: string,    // 'XLM' or 'USDC'
): Promise<string>      // Returns transaction hash
```

**Transaction Flow**:
1. Build XDR for `create_escrow` contract call
2. Sign with Freighter wallet
3. Submit to Soroban RPC
4. Poll for confirmation
5. Return transaction hash

---

### 2. Deposit Funds
```typescript
depositFunds(escrowId: number): Promise<string>
```

**Requirements**:
- Caller must be escrow buyer
- Escrow must be in Created state
- Token balance must be >= amount

---

### 3. Confirm Delivery
```typescript
confirmDelivery(escrowId: number): Promise<string>
```

**Fee Distribution**:
- 1% to platform wallet (GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW5QC6OX2H)
- 99% to seller

---

### 4. Request Refund
```typescript
requestRefund(escrowId: number): Promise<string>
```

**Conditions**:
- Caller is buyer OR timeout reached
- Escrow must be Funded

---

### 5. File Dispute
```typescript
fileDispute(
  escrowId: number,
  reason: string
): Promise<number>  // Returns dispute ID
```

**Restrictions**:
- Only buyer or seller can file
- Escrow must be Funded
- Reason required

---

### 6. Resolve Dispute
```typescript
resolveDispute(
  disputeId: number,
  resolution: number  // 0 = refund, 1 = release
): Promise<void>
```

**Admin Only**: Requires contract admin authorization

---

## Freighter Integration

### Wallet Connection

```typescript
// Check if Freighter installed
const isAvailable = isFreighterAvailable()

// Get public key
const publicKey = await getPublicKey()

// Sign transaction
const signedTx = await signTransaction(xdr, {
  network: 'TESTNET_NETWORK_PASSPHRASE',
  accountToSign: publicKey
})
```

---

## Event Polling

### Subscribe to Events

```typescript
const { events, isSubscribed } = useEventStream(contractId)

// Events include:
// - EscrowCreated
// - FundsDeposited
// - PaymentReleased
// - RefundIssued
// - DisputeFiled
// - DisputeResolved
```

---

## Error Handling

### Contract Errors
```typescript
Error::InvalidAmount = 1
Error::EscrowNotFound = 2
Error::NotBuyer = 3
Error::NotSeller = 4
Error::InvalidState = 5
Error::BuyerSellerSame = 6
Error::UnauthorizedDispute = 7
Error::EscrowExpired = 8
Error::InsufficientFunds = 9
Error::TransferFailed = 10
Error::DisputeNotFound = 11
Error::InvalidResolution = 12
Error::Unauthorized = 13
```

### Freighter Errors
- Wallet not installed
- User cancelled transaction
- Insufficient funds
- Invalid network

---

## Testing with Testnet

### Deploy Contract
```bash
npm run contract:build
npm run contract:deploy
```

### Record Contract ID
Update `.env.local`:
```env
VITE_ESCROW_CONTRACT_ID=CAXXXXX...
```

### Manual Testing Flow
1. Create account on testnet (friendbot.stellar.org)
2. Get testnet XLM
3. Create escrow (buyer & seller addresses)
4. Fund escrow
5. Verify payment release
6. Check platform fees

---

## Mainnet Deployment

### Prerequisites
- ✅ Contract audited
- ✅ 10+ users tested on testnet
- ✅ All tests passing
- ✅ Documentation complete

### Steps
1. Compile with `--release`
2. Deploy to mainnet RPC
3. Fund platform wallet
4. Update environment variables
5. Deploy frontend to production
6. Monitor transactions

---

*Last Updated: 2024*
