# 🚀 VERCEL DEPLOYMENT - QUICK SETUP (5 MINUTES)

## ✅ YOUR CODE IS NOW ON GITHUB!

All your code has been pushed to:  
**https://github.com/okokok04/arc-restaurant**

---

## 📱 DEPLOY TO VERCEL (Choose One Method)

### METHOD 1: Web Interface (EASIEST - 3 minutes)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: "Add New Project" 
3. **Click**: "Import Git Repository"
4. **Search**: `okokok04/arc-restaurant`
5. **Select**: Your repo from the list
6. **Click**: "Import"
7. **Settings page will appear** - Just click **"Deploy"** (keep defaults)
8. **Wait**: ~2-3 minutes for build to complete
9. **✅ DONE!** Your app is live at something like `https://arc-restaurant-okokok04.vercel.app`

### METHOD 2: Vercel CLI (FASTEST IF USING LOCALLY)

```powershell
# Install Vercel CLI (one time)
npm install -g vercel

# Login (opens browser)
vercel login

# Deploy from project root
cd c:\Users\Admin\Level\arc-restaurant
vercel --prod
```

**Expected output:**
```
✓ Production deployment ready
✓ https://arc-restaurant-okokok04.vercel.app
```

---

## ⚙️ AFTER DEPLOYMENT: Add Environment Variables (2 minutes)

Once deployed:

1. **Go to**: Vercel Dashboard → Your Project → Settings
2. **Click**: "Environment Variables"
3. **Add these 3 variables**:

```
VITE_STELLAR_NETWORK = testnet
VITE_SOROBAN_RPC_URL = https://soroban-testnet.stellar.org
VITE_ESCROW_CONTRACT_ID = (leave blank for now - will add after contract deployment)
```

4. **Click**: "Save"
5. **Vercel will auto-redeploy** with new environment variables

---

## ✅ VERIFICATION

**Your deployment is successful when:**

✅ Vercel shows "Ready" status  
✅ You can visit the live URL  
✅ App loads without errors  
✅ Wallet connect button appears  
✅ No red error banners  

---

## 🔄 AUTO-DEPLOY SETUP (Already Done!)

Your `vercel.json` is already configured for auto-deploy.

**This means:**
- Every time you push to GitHub, Vercel automatically builds and deploys
- No manual action needed - just `git push`!

---

## 🎯 NEXT: Deploy Smart Contract

Once Vercel is live, deploy your smart contract to Stellar Testnet:

```bash
# In PowerShell
cd c:\Users\Admin\Level\arc-restaurant\contracts\escrow

# Build
cargo build --target wasm32-unknown-unknown --release

# Deploy
soroban contract deploy `
  --wasm ../../target/wasm32-unknown-unknown/release/escrow.wasm `
  --source $YOUR_PUBLIC_KEY `
  --network testnet
```

**Save the contract ID** (starts with `CA...`)  
**Update in Vercel**: `VITE_ESCROW_CONTRACT_ID = CA...`

---

## 📊 VERCEL DASHBOARD FEATURES

After deployment, you can track:

- **Build Logs**: See what happens during deployment
- **Environment Variables**: Manage secrets
- **Deployments**: History of all deploys
- **Analytics**: Traffic and performance
- **Domains**: Add custom domain

---

## 🆘 TROUBLESHOOTING

**If build fails:**
- Check build logs in Vercel dashboard
- Verify vercel.json exists in root
- Ensure all dependencies are in package.json

**If app doesn't load:**
- Check browser console (F12) for errors
- Verify environment variables are set
- Try hard refresh (Ctrl+Shift+R)

**If contract not working:**
- Verify contract ID is set correctly
- Check testnet RPC endpoint is online
- Ensure account has XLM on testnet

---

## 📞 HELP

- **Vercel Docs**: https://vercel.com/docs
- **Your Deployment Guide**: See `VERCEL_DEPLOYMENT.md` in your project

---

**Status**: Ready for Vercel! Deploy now using Method 1 (easiest). 🚀
