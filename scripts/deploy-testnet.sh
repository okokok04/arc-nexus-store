# Stellar Escrow - Testnet Deployment Script
# Usage: ./scripts/deploy-testnet.sh [network]
# Networks: testnet (default), mainnet

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TESTNET_RPC="https://soroban-testnet.stellar.org"
TESTNET_PASSPHRASE="Test SDF Network ; September 2015"
MAINNET_RPC="https://soroban.stellar.org"
MAINNET_PASSPHRASE="Public Global Stellar Network ; September 2015"

NETWORK="${1:-testnet}"

if [ "$NETWORK" = "mainnet" ]; then
  RPC_URL="$MAINNET_RPC"
  PASSPHRASE="$MAINNET_PASSPHRASE"
else
  RPC_URL="$TESTNET_RPC"
  PASSPHRASE="$TESTNET_PASSPHRASE"
fi

function log_section() {
  echo -e "\n${CYAN}════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  $1${NC}"
  echo -e "${CYAN}════════════════════════════════════════════════${NC}\n"
}

function log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

function log_error() {
  echo -e "${RED}❌ $1${NC}"
}

function log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

function log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
log_section "Checking Prerequisites"

if ! command -v rustc &> /dev/null; then
  log_error "Rust not found. Install with:"
  echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
  exit 1
fi
log_success "Rust is installed"

if ! command -v cargo &> /dev/null; then
  log_error "Cargo not found"
  exit 1
fi
log_success "Cargo is installed"

# Build contract
log_section "Building Smart Contract"

log_warning "Compiling Rust contract..."
cd contracts/escrow
cargo build --target wasm32-unknown-unknown --release
cd ../..

WASM_PATH="target/wasm32-unknown-unknown/release/escrow.wasm"
if [ ! -f "$WASM_PATH" ]; then
  log_error "WASM file not found at $WASM_PATH"
  exit 1
fi

SIZE=$(du -h "$WASM_PATH" | cut -f1)
log_success "Contract compiled: $WASM_PATH ($SIZE)"

# Deployment info
log_section "Deployment Instructions"

log_info "Network: $NETWORK"
log_info "RPC URL: $RPC_URL"
log_info "Passphrase: $PASSPHRASE"

if ! command -v soroban &> /dev/null; then
  log_warning "Soroban CLI not found"
  echo ""
  log_info "Install with:"
  echo "  cargo install --locked stellar-cli --tag @latest"
  echo ""
fi

echo ""
log_info "To deploy your contract, follow these steps:"
echo ""
echo "${BLUE}1. Fund your account:${NC}"
echo "   https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY"
echo ""
echo "${BLUE}2. Set up network (one time):${NC}"
echo "   soroban network add \\"
echo "     --rpc-url $RPC_URL \\"
echo "     --passphrase \"$PASSPHRASE\" \\"
echo "     $NETWORK"
echo ""
echo "${BLUE}3. Deploy contract:${NC}"
echo "   soroban contract deploy \\"
echo "     --wasm $WASM_PATH \\"
echo "     --source YOUR_PUBLIC_KEY \\"
echo "     --network $NETWORK"
echo ""
echo "${BLUE}4. Update .env.local with the contract ID:${NC}"
echo "   VITE_ESCROW_CONTRACT_ID=CA..."
echo ""

log_success "Build complete! Ready for deployment."
