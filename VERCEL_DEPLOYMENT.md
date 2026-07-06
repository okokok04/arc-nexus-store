# 🚀 DEPLOYMENT CHECKLIST - Stellar Escrow

## ✅ Pre-Deployment Tasks

### 1. Code Verification
```
✅ Smart contract compiles (lib.rs, types.rs, error.rs)
✅ Frontend component structure complete
✅ All imports resolved
✅ TypeScript strict mode enabled
✅ Git commits pushed to main branch
```

### 2. Environment Setup
```
⏳ Vercel account created (free)
⏳ GitHub repository connected
⏳ Stellar testnet account funded
⏳ Domain ready (optional)
```

### 3. Documentation
```
✅ README.md - comprehensive overview
✅ ARCHITECTURE.md - system design
✅ DEPLOYMENT.md - deployment guide
✅ TESTNET_DEPLOYMENT.md - contract deployment
✅ LEVEL4_SUBMISSION.md - submission requirements
```

---

## 🔧 DEPLOYMENT STEPS

### STEP 1: Prepare GitHub Repository

```bash
# Navigate to project
cd c:\Users\Admin\Level\arc-restaurant

# Verify git status
git status

# Add all changes
git add -A

# Create meaningful commit
git commit -m "Level 4 Submission: Production MVP ready for deployment"

# Push to main
git push origin main
```

**Verify**: Visit https://github.com/YOUR_ORG/stellar-escrow

---

### STEP 2: Fix Package Dependencies

Edit `package.json` - update problematic versions:

```json
{
  "dependencies": {
    "@stellar/freighter-api": "^9.12.0",
    "@stellar/js-sdk": "^11.3.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "zustand": "^4.5.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "vite": "^5.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0"
  }
}
```

Install dependencies:

```bash
npm install
```

---

### STEP 3: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel (opens browser)
vercel login

# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..."
3. Select "Project"
4. Import from GitHub
5. Select your repository
6. Click "Deploy"

---

### STEP 4: Set Environment Variables in Vercel

In Vercel Dashboard:
1. Go to **Project Settings → Environment Variables**
2. Add the following:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_STELLAR_NETWORK` | `testnet` | Production |
| `VITE_SOROBAN_RPC_URL` | `https://soroban-testnet.stellar.org` | Production |
| `VITE_ESCROW_CONTRACT_ID` | `CA...` | Production (update after contract deployment) |
| `VITE_SENTRY_DSN` | `https://...@sentry.io/...` | Production (optional) |
| `VITE_GOOGLE_ANALYTICS_ID` | `G-...` | Production (optional) |

**Important**: Do NOT set testnet credentials in `.env.local` - use Vercel for production only!

---

### STEP 5: Verify Deployment

```bash
# Check build log
vercel logs

# Test deployed app
curl https://YOUR_PROJECT.vercel.app

# Verify no errors in browser console
# Visit https://YOUR_PROJECT.vercel.app and open DevTools (F12)
```

---

### STEP 6: Deploy Smart Contract

**Prerequisites**:
- Rust installed: `rustc --version`
- Soroban CLI: `soroban --version`
- Testnet account funded

**Deploy Contract**:

```bash
# Navigate to contract
cd contracts/escrow

# Build release binary
cargo build --target wasm32-unknown-unknown --release

# Back to root
cd ../..

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/escrow.wasm \
  --source <YOUR_PUBLIC_KEY> \
  --network testnet
```

**Save Output**: 
```
Contract ID: CA7QYNF5E2S4APIWWQQQCV7ZPCXCQGYUKQ5W3HTGXQ2XACRQVFMV2BJZ
```

---

### STEP 7: Update Contract ID

**In Vercel Dashboard**:
1. Go to Project Settings → Environment Variables
2. Update `VITE_ESCROW_CONTRACT_ID`
3. Set value to contract ID from STEP 6
4. Redeploy:
   ```bash
   vercel --prod
   ```

---

### STEP 8: Verify Contract Works

In browser console:

```javascript
// Test contract connection
const rpcUrl = import.meta.env.VITE_SOROBAN_RPC_URL;
const contractId = import.meta.env.VITE_ESCROW_CONTRACT_ID;

console.log('RPC:', rpcUrl);
console.log('Contract:', contractId);

// Try fetching contract info
fetch(rpcUrl, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getLedgerEntries',
    params: [{key: `AAAAAAAAAABkFBNLpS3rG3yrMEjCPCkA5/u54YCqWqGGQLkV4jGLQw==${contractId}`}]
  })
}).then(r => r.json()).then(console.log);
```

---

## 📋 VERCEL DEPLOYMENT CHECKLIST

- [ ] GitHub repository created & pushed
- [ ] Vercel account created (free)
- [ ] Project connected to GitHub
- [ ] Environment variables set
- [ ] Production deployment successful
- [ ] App loads without errors (F12 console)
- [ ] Wallet connection works
- [ ] Live URL verified

---

## 🔗 DEPLOYMENT LINKS

**After Deployment, You'll Have**:

| Item | Link |
|------|------|
| **Live App** | https://your-project.vercel.app |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **GitHub Repository** | https://github.com/YOUR_ORG/stellar-escrow |
| **Contract Explorer** | https://stellar.expert/explorer/testnet/contract/CA... |

---

## ⏱️ TIMELINE

| Task | Time |
|------|------|
| Fix dependencies | 5 min |
| Deploy to Vercel | 5 min |
| Set env variables | 2 min |
| Build smart contract | 2 min |
| Deploy contract | 3 min |
| Update contract ID | 2 min |
| **TOTAL** | **~20 min** |

---

## 🆘 TROUBLESHOOTING

### Build Fails on Vercel

**Solution**:
```bash
# Clear node_modules locally
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Test build
npm run build

# Push to GitHub
git add -A
git commit -m "Fix: Update dependencies"
git push origin main
```

### Wallet Won't Connect

**Solution**:
1. Install Freighter: https://www.freighter.app
2. Switch to testnet in Freighter
3. Fund account: https://friendbot.stellar.org

### Contract Not Found

**Solution**:
1. Verify contract ID in Vercel env variables
2. Check contract deployed: https://stellar.expert/explorer/testnet/contract/CA...
3. Redeploy if needed

### Analytics Not Tracking

**Solution**:
1. Get Sentry DSN: https://sentry.io
2. Get GA4 ID: https://analytics.google.com
3. Add to Vercel env variables
4. Redeploy

---

## 📞 SUPPORT

- **Vercel Docs**: https://vercel.com/docs
- **Stellar Docs**: https://developers.stellar.org/
- **Soroban Docs**: https://soroban.stellar.org/
- **Discord**: https://discord.gg/stellardev

---

## ✨ SUCCESS INDICATORS

✅ App loads at https://your-app.vercel.app  
✅ Wallet connects successfully  
✅ No errors in browser console  
✅ Contract ID accessible  
✅ Analytics tracking active  
✅ Monitoring (Sentry) active

---

**Status**: 🟡 DEPLOYMENT-READY  
**Next**: Recruit 10+ users for testnet

*Generated: 2026-07-06*
