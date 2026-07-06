# Stellar Escrow - Testnet Deployment Script (PowerShell)
# Usage: .\scripts\deploy-testnet.ps1 [-Network testnet|mainnet]

param(
    [string]$Network = "testnet"
)

# Color codes
function Write-Success { Write-Host "✅ $args" -ForegroundColor Green }
function Write-Error { Write-Host "❌ $args" -ForegroundColor Red }
function Write-Warning { Write-Host "⚠️  $args" -ForegroundColor Yellow }
function Write-Info { Write-Host "ℹ️  $args" -ForegroundColor Cyan }
function Write-Section { Write-Host "`n$('=' * 50)`n  $args`n$('=' * 50)`n" -ForegroundColor Cyan }

# Configuration
$TestnetRpc = "https://soroban-testnet.stellar.org"
$TestnetPassphrase = "Test SDF Network ; September 2015"
$MainnetRpc = "https://soroban.stellar.org"
$MainnetPassphrase = "Public Global Stellar Network ; September 2015"

if ($Network -eq "mainnet") {
    $RpcUrl = $MainnetRpc
    $Passphrase = $MainnetPassphrase
} else {
    $RpcUrl = $TestnetRpc
    $Passphrase = $TestnetPassphrase
}

# Check prerequisites
Write-Section "Checking Prerequisites"

$rustFound = $false
try {
    $rustVersion = rustc --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Rust is installed: $rustVersion"
        $rustFound = $true
    }
} catch {
    Write-Error "Rust not found"
}

if (-not $rustFound) {
    Write-Error "Please install Rust from https://rustup.rs/"
    exit 1
}

# Check Cargo
try {
    $cargoVersion = & cargo --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Cargo is installed: $cargoVersion"
    }
} catch {
    Write-Error "Cargo not found"
    exit 1
}

# Check wasm target
$targets = & rustup target list 2>$null
if ($targets -match "wasm32-unknown-unknown \(installed\)") {
    Write-Success "wasm32-unknown-unknown target installed"
} else {
    Write-Warning "Installing wasm32-unknown-unknown target..."
    & rustup target add wasm32-unknown-unknown
    Write-Success "Target installed"
}

# Build contract
Write-Section "Building Smart Contract"

Write-Warning "Compiling Rust contract..."
$currentDir = Get-Location
try {
    Set-Location contracts/escrow
    & cargo build --target wasm32-unknown-unknown --release
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed"
        exit 1
    }
    Set-Location $currentDir
} catch {
    Write-Error "Build failed: $_"
    exit 1
}

$wasmPath = "target/wasm32-unknown-unknown/release/escrow.wasm"
if (-Not (Test-Path $wasmPath)) {
    Write-Error "WASM file not found at $wasmPath"
    exit 1
}

$fileSize = (Get-Item $wasmPath).Length / 1KB
Write-Success "Contract compiled: $wasmPath ($([math]::Round($fileSize, 2)) KB)"

# Display deployment instructions
Write-Section "Deployment Instructions"

Write-Info "Network: $Network"
Write-Info "RPC URL: $RpcUrl"

# Check if Soroban CLI exists
$sorobanFound = $false
try {
    $sorobanVersion = & soroban --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Soroban CLI found: $sorobanVersion"
        $sorobanFound = $true
    }
} catch {
    Write-Warning "Soroban CLI not found"
}
if ($sorobanFound) {
    Write-Info "Soroban CLI is available for automated deploys."
} else {
    Write-Info "Soroban CLI not available; follow manual steps below."
}

Write-Host ""
Write-Info "To deploy your contract, follow these steps:"
Write-Host ""

Write-Host "$(Write-Host '1. Fund your account:' -ForegroundColor Blue)"
Write-Host "   https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY"
Write-Host ""

Write-Host "$(Write-Host '2. Set up network (one time):' -ForegroundColor Blue)"
Write-Host "   soroban network add \`"
Write-Host "     --rpc-url $RpcUrl \`"
Write-Host "     --passphrase `"$Passphrase`" \`"
Write-Host "     $Network"
Write-Host ""

Write-Host "$(Write-Host '3. Deploy contract:' -ForegroundColor Blue)"
Write-Host "   soroban contract deploy \`"
Write-Host "     --wasm $wasmPath \`"
Write-Host "     --source YOUR_PUBLIC_KEY \`"
Write-Host "     --network $Network"
Write-Host ""

Write-Host "$(Write-Host '4. Update .env.local:' -ForegroundColor Blue)"
Write-Host "   VITE_ESCROW_CONTRACT_ID=CA..."
Write-Host ""

Write-Success "Build complete! Ready for deployment."
Write-Info "Save your contract ID and update .env.local before running the frontend."
