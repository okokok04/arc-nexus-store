# ✅ ENVIRONMENT VARIABLES - MANUAL SETUP (2 MINUTES)

**Vercel URL**: https://vercel.com/le-van-manh-s-projects/arc-restaurant/settings/environment-variables

---

## 📋 VARIABLES TO ADD

### Variable 1: VITE_STELLAR_NETWORK
```
Name:     VITE_STELLAR_NETWORK
Value:    testnet
Scope:    Production
```

### Variable 2: VITE_SOROBAN_RPC_URL
```
Name:     VITE_SOROBAN_RPC_URL
Value:    https://soroban-testnet.stellar.org
Scope:    Production
```

### Variable 3: VITE_ESCROW_CONTRACT_ID
```
Name:     VITE_ESCROW_CONTRACT_ID
Value:    CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Scope:    Production

Note: Replace with actual contract ID after smart contract deployment
```

---

## 🔧 HOW TO ADD (Step by Step)

1. **Go to**: https://vercel.com/le-van-manh-s-projects/arc-restaurant/settings/environment-variables

2. **Click**: "Add Environment Variable" button (top right)

3. **Fill in**:
   - Name: `VITE_STELLAR_NETWORK`
   - Value: `testnet`
   - Select: Production (checkbox)

4. **Click**: "Save"

5. **Repeat for other 2 variables**

6. **Wait**: Vercel will auto-redeploy after each variable is added

---

## ✅ VERIFICATION

After adding variables:
1. Vercel dashboard shows "Building..." then "Ready"
2. Visit https://arc-restaurant.vercel.app
3. App should load with new environment variables
4. Check browser console (F12) for any errors

---

## 📊 CURRENT STATUS

✅ **Already Set** (confirmed on Vercel):
- VITE_CONTRACT_ID
- VITE_TOKEN_ADDRESS
- VITE_RPC_URL
- VITE_NETWORK

⏳ **Recommended to Add/Verify**:
- VITE_STELLAR_NETWORK
- VITE_SOROBAN_RPC_URL
- VITE_ESCROW_CONTRACT_ID

---

**Time to Complete**: 2 minutes  
**After Completion**: App auto-redeploys with new variables

Go add them now! https://vercel.com/le-van-manh-s-projects/arc-restaurant/settings/environment-variables
