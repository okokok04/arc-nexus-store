# Stellar Escrow - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- Node.js 20+ and npm 11+
- Vercel account (free at vercel.com)
- GitHub repository with this project
- Stellar testnet account

---

## Part 1: Build & Test Locally

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Build Project
```bash
npm run build
```

Expected output:
```
✓ 1234 modules transformed
dist/index.html                    15.2 kB
dist/assets/main.abc123.js        523.4 kB
dist/assets/style.xyz789.css       87.6 kB
```

### 1.3 Test Build
```bash
npm run preview
```

Visit `http://localhost:4173` to test the built app.

---

## Part 2: Deploy to Vercel

### 2.1 Connect GitHub Repository

1. Push code to GitHub:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click **Add New Project**
4. Select your GitHub repository
5. Vercel auto-detects settings

### 2.2 Configure Environment Variables

In Vercel Dashboard:

1. Go to **Settings → Environment Variables**
2. Add production variables:

```env
# Stellar Network
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Contract (update after deployment)
VITE_ESCROW_CONTRACT_ID=CA_YOUR_CONTRACT_ID

# Monitoring (optional)
VITE_SENTRY_DSN=https://...
VITE_GOOGLE_ANALYTICS_ID=G-...
```

3. Click **Save**

### 2.3 Deploy

Click **Deploy** button in Vercel Dashboard.

Expected deployment time: 2-3 minutes

Monitor logs:
```
Building...
✓ Build completed
✓ Functions ready
✓ Deployment successful
```

### 2.4 Verify Deployment

1. Visit deployment URL (e.g., `https://your-project.vercel.app`)
2. Check browser console for errors
3. Verify wallet connection works
4. Test loading the app

---

## Part 3: Setup Custom Domain (Optional)

### 3.1 Add Domain

1. In Vercel: **Settings → Domains**
2. Enter domain name
3. Follow DNS setup instructions
4. Wait for SSL certificate (~5 minutes)

### 3.2 Update DNS

Update your domain registrar DNS records to point to Vercel:
- See Vercel dashboard for exact DNS records

---

## Part 4: Configure Auto-Deploy

1. In Vercel: **Settings → Git**
2. Enable **Deploy on every push to main**
3. Choose preview for pull requests

Now every git push triggers a new deployment!

---

## Part 5: Contract Deployment

### 5.1 Build Smart Contract

```bash
npm run contract:build
# or
cd contracts/escrow && cargo build --target wasm32-unknown-unknown --release
cd ../..
```

### 5.2 Deploy to Stellar Testnet

```bash
# Set environment
export SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
export SOROBAN_RPC_URL="https://soroban-testnet.stellar.org"

# Deploy contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/escrow.wasm \
  --source <YOUR_PUBLIC_KEY> \
  --network testnet
```

Expected output:
```
Contract ID: CA7QYNF5E2S4APIWWQQQCV7ZPCXCQGYUKQ5W3HTGXQ2XACRQVFMV2BJZ
```

### 5.3 Update Environment

1. Copy contract ID
2. In Vercel: **Settings → Environment Variables**
3. Update `VITE_ESCROW_CONTRACT_ID=CA...`
4. Redeploy application

---

## Part 6: Monitoring Setup

### 6.1 Sentry Configuration

1. Create Sentry account at [sentry.io](https://sentry.io)
2. Create new project (React)
3. Copy DSN
4. Add to Vercel env: `VITE_SENTRY_DSN=...`
5. Redeploy

### 6.2 Google Analytics Setup

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Create web stream for your domain
3. Copy Measurement ID
4. Add to Vercel env: `VITE_GOOGLE_ANALYTICS_ID=G-...`
5. Redeploy

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules .next dist
npm install
npm run build
```

### Contract Not Found
- Verify `VITE_ESCROW_CONTRACT_ID` is set
- Check contract deployed to testnet
- Visit Stellar Expert to verify

### Wallet Won't Connect
- Ensure Freighter is installed
- Check network matches environment
- Verify RPC URL is accessible

### Analytics Not Tracking
- Check IDs in browser console
- Verify no ad blockers
- Wait 24 hours for GA4 to show data

---

## Live Deployment URLs

- **App**: https://stellar-escrow.vercel.app
- **GitHub**: https://github.com/YOUR_ORG/stellar-escrow
- **Contract Explorer**: https://stellar.expert/explorer/testnet/contract/CA...

---

## Next Steps

1. ✅ Deploy to Vercel (complete)
2. ⏳ Recruit 10+ users
3. ⏳ Record demo video
4. ⏳ Final testing
5. ⏳ Submit for Level 4

---

**Deployment Status**: ✅ Production Ready

For detailed information, see:
- [docs/TESTNET_DEPLOYMENT.md](docs/TESTNET_DEPLOYMENT.md)
- [docs/LEVEL4_SUBMISSION.md](docs/LEVEL4_SUBMISSION.md)

