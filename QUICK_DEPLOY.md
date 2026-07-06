# Stellar Escrow - Deployment Quick Start

## 🎯 Deployment in 5 Steps

### Step 1: Local Setup (5 minutes)

```bash
cd c:\Users\Admin\Level\arc-restaurant

# Install dependencies
npm install

# Build frontend
npm run build

# Verify build
ls -la dist/
```

---

### Step 2: Create Vercel Account (2 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Grant access to your repository

---

### Step 3: Deploy to Vercel (5 minutes)

**Using Vercel Dashboard**:
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Select your GitHub repository
4. Click "Deploy"

**OR Using Vercel CLI**:
```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

**Expected Result**:
- Deployment URL: `https://YOUR_PROJECT.vercel.app`
- Auto-deploys on GitHub push

---

### Step 4: Configure Environment (3 minutes)

In Vercel Dashboard → Project Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `VITE_STELLAR_NETWORK` | `testnet` |
| `VITE_SOROBAN_RPC_URL` | `https://soroban-testnet.stellar.org` |
| `VITE_ESCROW_CONTRACT_ID` | `CA...` (update after contract deployment) |

---

### Step 5: Deploy Smart Contract (10 minutes)

```bash
# Build contract
cd contracts/escrow
cargo build --target wasm32-unknown-unknown --release
cd ../..

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/escrow.wasm \
  --source <YOUR_PUBLIC_KEY> \
  --network testnet
```

**Save contract ID**: `CA...`

**Update Vercel**: Add `VITE_ESCROW_CONTRACT_ID=CA...`

---

## ✅ DEPLOYMENT VERIFICATION

Visit https://YOUR_PROJECT.vercel.app and check:

- [ ] App loads without errors
- [ ] Wallet button visible
- [ ] Can connect to Freighter wallet
- [ ] No console errors (F12)
- [ ] Analytics loading (GA4)
- [ ] Error tracking active (Sentry)

---

## 📊 NEXT: USER RECRUITMENT

Once deployed, recruit 10+ users:

1. **Discord** - Post in Stellar dev server
2. **Reddit** - r/stellar subreddit
3. **Twitter** - Announce launch
4. **Product Hunt** - Submit project
5. **GitHub** - Link in README

See `docs/USER_RECRUITMENT.md` for full strategy.

---

## 🎬 THEN: RECORD DEMO VIDEO

```bash
# Demo should show:
1. Landing page overview
2. Wallet connection
3. Create escrow form
4. Deposit funds
5. Confirm delivery
6. Payment released
# Duration: 3-5 minutes
# Tools: OBS Studio (free)
```

---

## 🏆 FINALLY: SUBMIT FOR LEVEL 4

All requirements in `docs/LEVEL4_SUBMISSION.md`

---

**Timeline**: ~25 minutes to live deployment ✨

*See `VERCEL_DEPLOYMENT.md` for detailed troubleshooting*
