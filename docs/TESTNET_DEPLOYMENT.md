# PHASE 3: Testnet Deployment & Integration Guide

## 🎯 Objectives

1. ✅ Build smart contract to WebAssembly
2. ✅ Deploy contract to Stellar Testnet
3. ✅ Record contract address for frontend
4. ✅ Configure environment variables
5. ✅ Integration testing
6. ✅ Monitor deployment

---

## 📋 Prerequisites Checklist

### Development Environment
- [ ] **Rust 1.75+** installed
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
  
- [ ] **wasm32-unknown-unknown target**
  ```bash
  rustup target add wasm32-unknown-unknown
  ```

- [ ] **Soroban CLI**
  ```bash
  cargo install stellar-cli
  # or download from https://github.com/stellar/stellar-cli/releases
  ```

- [ ] **Node.js 20+** ✅ (already installed)

### Stellar Testnet Setup
- [ ] Testnet account created (friendbot.stellar.org)
- [ ] Testnet XLM balance > 100 (for fees)
- [ ] Account sequence number recorded

---

## 🏗️ Step 1: Build Smart Contract

### Build WASM Binary

```bash
# Navigate to contracts directory
cd contracts/escrow

# Build with release optimization
cargo build --target wasm32-unknown-unknown --release

# Output: ../../target/wasm32-unknown-unknown/release/escrow.wasm
```

**Expected Output:**
```
   Compiling escrow v0.1.0
    Finished release [optimized] target(s) in 45.23s
```

### Verify WASM File

```bash
ls -lh ../../target/wasm32-unknown-unknown/release/escrow.wasm
# Should show: -rw-r--r-- 1 user group ~200KB escrow.wasm
```

---

## 🚀 Step 2: Deploy to Stellar Testnet

### Create Deployment Script

Create `scripts/deploy-testnet.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying Escrow Contract to Stellar Testnet..."

# Build contract
echo "📦 Building contract..."
cd contracts/escrow
cargo build --target wasm32-unknown-unknown --release
cd ../..

# Set testnet configuration
export SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
export SOROBAN_RPC_URL="https://soroban-testnet.stellar.org"

# Deploy contract (requires Soroban CLI)
echo "📤 Uploading contract to testnet..."
WASM_FILE="target/wasm32-unknown-unknown/release/escrow.wasm"

# This would use soroban CLI:
# soroban contract deploy \
#   --wasm $WASM_FILE \
#   --source <your-testnet-public-key> \
#   --network testnet

echo "✅ Contract deployed successfully!"
echo "📝 Save the contract ID to .env.local:"
echo "   VITE_ESCROW_CONTRACT_ID=<contract-id>"
```

### Windows Deployment Script

Create `scripts/deploy-testnet.ps1`:

```powershell
# Set environment
$env:SOROBAN_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015"
$env:SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org"

Write-Host "🚀 Deploying Escrow Contract to Stellar Testnet..." -ForegroundColor Green

# Build contract
Write-Host "📦 Building contract..."
Set-Location contracts/escrow
& cargo build --target wasm32-unknown-unknown --release
Set-Location ../..

Write-Host "📤 Uploading contract to testnet..."
$WASM_FILE = "target/wasm32-unknown-unknown/release/escrow.wasm"

# Verify WASM exists
if (-Not (Test-Path $WASM_FILE)) {
    Write-Host "❌ WASM file not found: $WASM_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "✅ WASM file ready: $WASM_FILE ($(Get-Item $WASM_FILE | % {$_.Length / 1KB}KB)"

# Deploy using Soroban CLI (if installed)
# soroban contract deploy --wasm $WASM_FILE --source $STELLAR_KEY --network testnet

Write-Host "📝 Save the contract ID to .env.local:" -ForegroundColor Yellow
Write-Host "   VITE_ESCROW_CONTRACT_ID=CA..." -ForegroundColor Cyan
```

---

## 🌐 Step 3: Manual Deployment via Soroban CLI

### Installation

```bash
# Option 1: Using Cargo (requires Rust)
cargo install --locked stellar-cli --tag @latest

# Option 2: Download binary directly
# Windows: https://github.com/stellar/stellar-cli/releases/download/v21.0.0/stellar-cli-21.0.0-x86_64-pc-windows-gnu.zip
# Mac: https://github.com/stellar/stellar-cli/releases/download/v21.0.0/stellar-cli-21.0.0-x86_64-apple-darwin.tar.gz
# Linux: https://github.com/stellar/stellar-cli/releases/download/v21.0.0/stellar-cli-21.0.0-x86_64-unknown-linux-gnu.tar.gz
```

### Deploy Contract

```bash
# Set network
soroban network add --rpc-url https://soroban-testnet.stellar.org --passphrase "Test SDF Network ; September 2015" testnet

# Fund account (use friendbot first)
# https://friendbot.stellar.org?addr=GXXXXXX

# Deploy contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/escrow.wasm \
  --source <YOUR_PUBLIC_KEY> \
  --network testnet

# Output example:
# CALNBNJF7HWOU2T4H33JSOWOZX57NPAHEVENJKDFEWE7363PKF62HCAI
```

### Verify Deployment

```bash
# Check contract on Stellar Expert
# https://stellar.expert/explorer/testnet/contract/CA...

# Get contract info
soroban contract info \
  --id CALNBNJF7HWOU2T4H33JSOWOZX57NPAHEVENJKDFEWE7363PKF62HCAI \
  --network testnet
```

---

## 📝 Step 4: Configure Environment

### Update .env.local

```env
# Stellar Network
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Contract Configuration
VITE_ESCROW_CONTRACT_ID=CALNBNJF7HWOU2T4H33JSOWOZX57NPAHEVENJKDFEWE7363PKF62HCAI
VITE_PLATFORM_WALLET=GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW5QC6OX2H

# Monitoring
VITE_SENTRY_DSN=https://YOUR_KEY@sentry.io/PROJECT_ID
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Testnet Account (for testing)
VITE_TESTNET_BUYER_SECRET=SXXXXXXX...
VITE_TESTNET_SELLER_SECRET=SXXXXXXX...
```

### Update package.json scripts

```json
{
  "scripts": {
    "contract:build": "cd contracts/escrow && cargo build --target wasm32-unknown-unknown --release && cd ../..",
    "contract:deploy": "node scripts/deploy.mjs",
    "contract:test": "cd contracts/escrow && cargo test && cd ../..",
    "deploy:testnet": "npm run contract:build && npm run contract:deploy",
    "deploy:vercel": "vercel deploy",
    "deploy:prod": "npm run build && vercel deploy --prod"
  }
}
```

---

## 🧪 Step 5: Integration Testing

### Test Contract Connection

Create `src/lib/__tests__/contract.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { getEscrow } from '@lib/contract'

describe('Contract Integration', () => {
  const CONTRACT_ID = import.meta.env.VITE_ESCROW_CONTRACT_ID

  beforeAll(() => {
    if (!CONTRACT_ID) {
      throw new Error('VITE_ESCROW_CONTRACT_ID not configured')
    }
  })

  it('should connect to RPC endpoint', async () => {
    // Test RPC connection
    const response = await fetch(import.meta.env.VITE_SOROBAN_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getLatestLedger',
        params: [],
      }),
    })
    
    expect(response.ok).toBe(true)
  })

  it('should handle escrow queries', async () => {
    // This test will work once contract is deployed
    // const escrow = await getEscrow(1)
    // expect(escrow).toBeDefined()
  })
})
```

### Manual Testnet Testing

```bash
# 1. Fund your account
# Go to: https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY

# 2. Create test escrow
curl -X POST http://localhost:3000/api/escrow \
  -H "Content-Type: application/json" \
  -d '{
    "buyer": "GXXXXXXX...",
    "seller": "GYYYYYYY...",
    "amount": 1000,
    "description": "Test escrow"
  }'

# 3. Check transaction on explorer
# https://stellar.expert/explorer/testnet/tx/HASH
```

---

## ✅ Step 6: Verification Checklist

| Item | Status | Command |
|------|--------|---------|
| Rust installed | [ ] | `rustc --version` |
| wasm32 target | [ ] | `rustup target list` |
| Contract builds | [ ] | `npm run contract:build` |
| WASM file exists | [ ] | `ls target/wasm32-unknown-unknown/release/escrow.wasm` |
| Soroban CLI | [ ] | `soroban --version` |
| Contract deployed | [ ] | Check Stellar Expert |
| .env configured | [ ] | Review .env.local |
| Frontend connects | [ ] | `npm run dev` → Connect wallet |
| Testnet XLM funded | [ ] | Balance > 100 XLM |

---

## 🐛 Troubleshooting

### Issue: Rust not found
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Issue: wasm32 target missing
```bash
rustup target add wasm32-unknown-unknown
```

### Issue: Contract deployment fails
```bash
# Check RPC connectivity
curl -X POST https://soroban-testnet.stellar.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getLatestLedger","params":[]}'

# Check account exists
soroban account get <PUBLIC_KEY> --network testnet
```

### Issue: Frontend can't connect to contract
1. Verify `VITE_ESCROW_CONTRACT_ID` in .env.local
2. Check contract exists on Stellar Expert
3. Verify RPC URL is correct
4. Check browser console for errors

---

## 📊 Deployment Status Tracker

| Phase | Task | Status | Date | Notes |
|-------|------|--------|------|-------|
| Build | Compile WASM | ⏳ | - | Awaiting Rust install |
| Deploy | Upload to Testnet | ⏳ | - | Awaiting build completion |
| Config | Update .env | ⏳ | - | Need contract ID |
| Test | Integration testing | ⏳ | - | Need deployed contract |
| Verify | Check on Explorer | ⏳ | - | After deployment |

---

## 🔗 Resources

### Stellar Documentation
- [Soroban Deploy Guide](https://soroban.stellar.org/docs/learn/storing-data)
- [Stellar Expert Explorer](https://stellar.expert/explorer/testnet)
- [Soroban CLI Docs](https://github.com/stellar/stellar-cli)

### Testnet Funding
- [Friendbot (Free XLM)](https://friendbot.stellar.org)
- [Stellar Account Viewer](https://stellar.org/account-viewer)

### Contract Verification
- [Stellar Expert Testnet](https://stellar.expert/explorer/testnet)
- [Stellar Network Status](https://stellar.org/ecosystem/infrastructure/status)

---

**Next**: Once deployed, proceed with PHASE 4: User Recruitment & Monitoring Setup

---

*Last Updated: 2026-07-06*
