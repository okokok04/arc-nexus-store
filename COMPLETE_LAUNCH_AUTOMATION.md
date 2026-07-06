# 🚀 COMPLETE LEVEL 4 LAUNCH AUTOMATION

## PHASE 1: CONTRACT DEPLOYMENT GUIDE (10 minutes)

Since Rust/Soroban CLI aren't in PATH, here's the complete manual deployment guide:

### Prerequisites Setup
```bash
# 1. Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# 2. Add wasm32 target
rustup target add wasm32-unknown-unknown

# 3. Install Soroban CLI
cargo install soroban-cli

# 4. Verify installation
rustc --version
soroban --version
```

### Deploy Contract
```bash
cd c:\Users\Admin\Level\arc-restaurant\contracts\escrow

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Get your Stellar testnet public key
# If you don't have one, create with: soroban keys generate --name testnet_key

# Deploy to testnet (replace YOUR_PUBLIC_KEY with your actual key)
soroban contract deploy \
  --wasm ../../target/wasm32-unknown-unknown/release/escrow.wasm \
  --source YOUR_PUBLIC_KEY \
  --network testnet
```

### After Deployment
```
You'll get output like:
Deploying Stellar Contract
Address: CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

SAVE THIS CONTRACT ID: CA...
```

---

## PHASE 2: ADD ENVIRONMENT VARIABLES TO VERCEL (2 minutes)

```
CONTRACT_ID from above: CAxxxxxx...
```

### Via Browser (Easier):
1. Go to: https://vercel.com/le-van-manh-s-projects/arc-restaurant/settings/environment-variables
2. Click "Add New"
3. Add:
   - Name: `VITE_ESCROW_CONTRACT_ID`
   - Value: `CAxxxxxx...` (your contract ID)
   - Environments: Production
4. Click "Save"
5. Vercel auto-redeploys!

### Via Vercel CLI:
```bash
vercel env add VITE_ESCROW_CONTRACT_ID
# Paste: CAxxxxxx...
# Select: Production
```

---

## PHASE 3: USER RECRUITMENT (Ready to Send NOW!)

Below are 5 complete outreach messages - copy, paste, and send immediately!

