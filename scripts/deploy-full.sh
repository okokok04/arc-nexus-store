#!/bin/bash
# Stellar Escrow - Automated Deployment Script
# Usage: bash scripts/deploy-full.sh [environment]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Stellar Escrow - Full Deployment"
echo "   Environment: $ENVIRONMENT"
echo "   Timestamp: $TIMESTAMP"
echo ""

# Step 1: Clean installation
echo "📦 Step 1: Installing dependencies..."
rm -rf node_modules package-lock.json
npm install

# Step 2: Build frontend
echo "🔨 Step 2: Building frontend..."
npm run build

# Step 3: Verify build
echo "✅ Step 3: Verifying build..."
if [ -d "dist" ]; then
    echo "   ✓ dist/ directory created"
    SIZE=$(du -sh dist | cut -f1)
    echo "   ✓ Build size: $SIZE"
else
    echo "   ✗ Build failed"
    exit 1
fi

# Step 4: Check if Vercel CLI is installed
echo "🔍 Step 4: Checking deployment tools..."
if ! command -v vercel &> /dev/null; then
    echo "   Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Step 5: Deploy to Vercel
echo "🚀 Step 5: Deploying to Vercel ($ENVIRONMENT)..."
if [ "$ENVIRONMENT" = "production" ]; then
    vercel deploy --prod
else
    vercel deploy
fi

echo ""
echo "✨ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Verify deployment at https://your-project.vercel.app"
echo "2. Add environment variables in Vercel dashboard"
echo "3. Deploy smart contract to testnet"
echo "4. Update VITE_ESCROW_CONTRACT_ID"
echo ""
