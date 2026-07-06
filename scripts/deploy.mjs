#!/usr/bin/env node
/**
 * Stellar Escrow Contract Deployment Script
 * Handles contract deployment to Stellar Testnet
 * 
 * Usage: node scripts/deploy.mjs [network]
 * Networks: testnet (default), mainnet
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

// Configuration
const config = {
  testnet: {
    rpcUrl: 'https://soroban-testnet.stellar.org',
    passphrase: 'Test SDF Network ; September 2015',
    horizon: 'https://horizon-testnet.stellar.org',
    explorerBase: 'https://stellar.expert/explorer/testnet',
  },
  mainnet: {
    rpcUrl: 'https://soroban.stellar.org',
    passphrase: 'Public Global Stellar Network ; September 2015',
    horizon: 'https://horizon.stellar.org',
    explorerBase: 'https://stellar.expert/explorer/public',
  },
}

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  log(`\n${'═'.repeat(60)}`, 'cyan')
  log(`  ${title}`, 'cyan')
  log(`${'═'.repeat(60)}\n`, 'cyan')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

/**
 * Check prerequisites
 */
function checkPrerequisites(network) {
  logSection('Checking Prerequisites')

  // Check Rust
  try {
    execSync('rustc --version', { stdio: 'pipe' })
    logSuccess('Rust is installed')
  } catch (e) {
    logError('Rust not found. Install with:')
    log('  curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh', 'yellow')
    process.exit(1)
  }

  // Check Cargo
  try {
    execSync('cargo --version', { stdio: 'pipe' })
    logSuccess('Cargo is installed')
  } catch (e) {
    logError('Cargo not found')
    process.exit(1)
  }

  // Check wasm32 target
  try {
    const targets = execSync('rustup target list', { encoding: 'utf8' })
    if (targets.includes('wasm32-unknown-unknown (installed)')) {
      logSuccess('wasm32-unknown-unknown target installed')
    } else {
      logWarning('wasm32-unknown-unknown not installed. Installing...')
      execSync('rustup target add wasm32-unknown-unknown', { stdio: 'inherit' })
      logSuccess('Target installed')
    }
  } catch (e) {
    logError('Failed to check wasm32 target')
    process.exit(1)
  }

  // Check Soroban CLI
  try {
    execSync('soroban --version', { stdio: 'pipe' })
    logSuccess('Soroban CLI is installed')
  } catch (e) {
    logWarning('Soroban CLI not found. You may need to install it for deployment.')
    logInfo('Install with: cargo install --locked stellar-cli --tag @latest')
  }

  // Check Node environment
  try {
    if (!process.env.VITE_ESCROW_CONTRACT_ID && process.env.NODE_ENV !== 'production') {
      logWarning('VITE_ESCROW_CONTRACT_ID not set in environment')
    }
  } catch (e) {
    // Ignore
  }

  log(`\nNetwork: ${network}`, 'bright')
  log(`RPC URL: ${config[network].rpcUrl}`, 'blue')
}

/**
 * Build contract
 */
function buildContract() {
  logSection('Building Smart Contract')

  try {
    log('Compiling Rust contract...', 'yellow')
    execSync('cd contracts/escrow && cargo build --target wasm32-unknown-unknown --release', {
      cwd: projectRoot,
      stdio: 'inherit',
    })
    logSuccess('Contract compiled successfully!')
  } catch (e) {
    logError('Failed to build contract')
    process.exit(1)
  }

  const wasmPath = path.join(projectRoot, 'target/wasm32-unknown-unknown/release/escrow.wasm')
  if (!fs.existsSync(wasmPath)) {
    logError(`WASM file not found at ${wasmPath}`)
    process.exit(1)
  }

  const stats = fs.statSync(wasmPath)
  logSuccess(`WASM file created: ${(stats.size / 1024).toFixed(2)} KB`)

  return wasmPath
}

/**
 * Deploy contract using Soroban CLI
 */
function deployContract(wasmPath, network) {
  logSection(`Deploying to ${network.toUpperCase()}`)

  const cfg = config[network]

  try {
    logInfo('Checking Soroban CLI availability...')
    execSync('soroban --version', { stdio: 'pipe' })
  } catch (e) {
    logError('Soroban CLI not installed. Cannot proceed with deployment.')
    logInfo('Install with: cargo install --locked stellar-cli --tag @latest')
    log('\nAlternatively, deploy manually:', 'yellow')
    log(`  soroban contract deploy \\`, 'cyan')
    log(`    --wasm ${wasmPath} \\`, 'cyan')
    log(`    --source <YOUR_PUBLIC_KEY> \\`, 'cyan')
    log(`    --network ${network}`, 'cyan')
    return null
  }

  logWarning('Note: Deployment requires your Stellar private key.')
  logInfo('Set up network config first:')
  log(
    `  soroban network add --rpc-url ${cfg.rpcUrl} --passphrase "${cfg.passphrase}" ${network}`,
    'cyan',
  )

  logInfo('Then deploy with:')
  log(`  soroban contract deploy --wasm ${wasmPath} --source <KEY> --network ${network}`, 'cyan')

  return null // CLI execution would require user input
}

/**
 * Generate deployment report
 */
function generateReport(network, wasmPath, contractId = null) {
  const cfg = config[network]

  logSection('📋 Deployment Report')

  log('Build Status:', 'bright')
  logSuccess('Contract compiled to WASM')
  log(`File: ${wasmPath}`, 'blue')
  log(`Size: ${(fs.statSync(wasmPath).size / 1024).toFixed(2)} KB\n`, 'blue')

  log('Network Configuration:', 'bright')
  log(`Network: ${network}`, 'blue')
  log(`RPC: ${cfg.rpcUrl}`, 'blue')
  log(`Passphrase: ${cfg.passphrase}\n`, 'blue')

  if (contractId) {
    log('Deployment Status:', 'bright')
    logSuccess(`Contract deployed: ${contractId}`)
    log(`Explorer: ${cfg.explorerBase}/contract/${contractId}\n`, 'cyan')

    // Update .env
    updateEnvFile(contractId)
  } else {
    log('Deployment Status:', 'bright')
    logWarning('Contract not yet deployed (manual deployment required)')
    log('\nNext Steps:', 'yellow')
    log('1. Ensure you have Soroban CLI installed', 'blue')
    log('2. Fund your testnet account: https://friendbot.stellar.org', 'blue')
    log('3. Run deployment command', 'blue')
  }

  log('\nTo verify deployment:', 'yellow')
  log(`  Visit: ${cfg.explorerBase}/contract/${contractId || 'CA...'}`, 'cyan')
}

/**
 * Update .env file with contract ID
 */
function updateEnvFile(contractId) {
  const envPath = path.join(projectRoot, '.env.local')
  const exampleEnvPath = path.join(projectRoot, '.env.example')

  let content = ''

  // Read existing .env.local or .env.example
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8')
  } else if (fs.existsSync(exampleEnvPath)) {
    content = fs.readFileSync(exampleEnvPath, 'utf8')
  }

  // Update or add contract ID
  if (content.includes('VITE_ESCROW_CONTRACT_ID=')) {
    content = content.replace(/VITE_ESCROW_CONTRACT_ID=.*/g, `VITE_ESCROW_CONTRACT_ID=${contractId}`)
  } else {
    content += `\n# Contract Configuration\nVITE_ESCROW_CONTRACT_ID=${contractId}\n`
  }

  fs.writeFileSync(envPath, content)
  logSuccess(`.env.local updated with contract ID: ${contractId}`)
}

/**
 * Main execution
 */
async function main() {
  const network = process.argv[2] || 'testnet'

  if (!config[network]) {
    logError(`Unknown network: ${network}`)
    logInfo('Available networks: testnet, mainnet')
    process.exit(1)
  }

  logSection('🚀 Stellar Escrow Contract Deployment')
  log(`Deployment Script v1.0`, 'blue')
  log(`Started: ${new Date().toISOString()}\n`, 'blue')

  // Step 1: Check prerequisites
  checkPrerequisites(network)

  // Step 2: Build contract
  const wasmPath = buildContract()

  // Step 3: Deploy (note: actual deployment requires manual command with private key)
  deployContract(wasmPath, network)

  // Step 4: Generate report
  generateReport(network, wasmPath)

  logSection('📝 Remember to:')
  log('1. Keep your private key secure', 'yellow')
  log('2. Fund testnet account at: https://friendbot.stellar.org', 'yellow')
  log('3. Set VITE_ESCROW_CONTRACT_ID in .env.local', 'yellow')
  log('4. Test contract on Stellar Expert', 'yellow')

  log('\n✨ Deployment process complete!\n', 'green')
}

// Run
main().catch((err) => {
  logError(`Deployment failed: ${err.message}`)
  process.exit(1)
})
