# Deployment Guide - Stellar Escrow Marketplace

## Quick Start

### Local Development

```bash
# 1. Clone & install
git clone https://github.com/your-username/stellar-escrow-marketplace.git
cd stellar-escrow-marketplace
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your Testnet credentials

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

---

## Testnet Deployment

### Step 1: Setup Account

```bash
# Create/fund testnet account
node scripts/setup-testnet-account.mjs
```

### Step 2: Deploy Contracts

```bash
# Build WASM
npm run contract:build

# Deploy to testnet
npm run contract:deploy
```

Saves contract IDs to `.env`:
```
VITE_ESCROW_CONTRACT_ID=CA7QYNF7...
VITE_DISPUTE_CONTRACT_ID=CB...
VITE_FEE_DISTRIBUTOR_CONTRACT_ID=CC...
```

### Step 3: Build Frontend

```bash
npm run build
```

Output: `dist/` directory ready for deployment

### Step 4: Verify

```bash
npm run dev
# Test in browser at http://localhost:3000
```

---

## Production Deployment (Vercel)

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "feat: Deploy production MVP"
git push origin main
```

2. **Connect Vercel**
   - Go to vercel.com
   - Select GitHub repository
   - Configure:
     - Framework: Vite
     - Build: `npm run build`
     - Output: `dist`

3. **Set Environment**
   - Add `.env` variables to Vercel
   - Deploy automatically on push

4. **Configure Domain**
   - Add custom domain (optional)
   - DNS configuration

### Option 2: Manual Deployment

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Monitoring Setup

### Sentry (Error Tracking)

1. Create Sentry project
2. Get DSN
3. Add to .env:
```
VITE_SENTRY_DSN=https://...
```

### Google Analytics

1. Create GA4 property
2. Get Measurement ID
3. Add to .env:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXX
```

---

## CI/CD Pipeline

Located in `.github/workflows/ci.yml`

Runs on every push:
1. Lint
2. Type check
3. Contract tests
4. Build
5. Lighthouse audit

View results in GitHub → Actions

---

## Troubleshooting

### Soroban CLI not found
```bash
cargo install --locked soroban-cli --version 22.0.0
```

### wasm32 target missing
```bash
rustup target add wasm32-unknown-unknown
```

### Freighter not connecting
- Install: https://www.freighter.app
- Switch to Stellar Testnet
- Refresh page

### Insufficient funds
```bash
node scripts/fund-testnet.mjs
```

---

## Mainnet Deployment (Future)

When ready for production:

1. Update network in config
2. Fund mainnet account
3. Deploy contracts to mainnet
4. Update frontend config
5. Deploy to production

---

**Status**: Production Ready  
**Version**: 1.0.0  
**Last Updated**: July 2026
