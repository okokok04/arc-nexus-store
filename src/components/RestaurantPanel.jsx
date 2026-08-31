import { useState, useEffect, useCallback, useRef } from 'react';
import { useWalletContext } from '../context/WalletContext.jsx';
import {
  initRestaurant,
  payOrder,
  getContractBalance,
  getOrderCount,
} from '../lib/soroban.js';
import {
  checkAccountExists,
  fundTestnetAccount,
  formatStellarError,
  friendbotUrl,
  laboratoryFundUrl,
} from '../lib/account.js';
import {
  CONTRACT_ID,
  isValidContractId,
  DEFAULT_TOKEN,
  MENU_ITEMS,
} from '../lib/contract.js';
import { trackEvent, captureException } from '../lib/monitoring.js';
import PurchaseConfirmModal from './PurchaseConfirmModal.jsx';

const CATEGORIES = ['All', 'NeuroTech', 'Quantum', 'Optics', 'Robotics'];

export default function RestaurantPanel() {
  const { publicKey, connected, connecting, connect, signTransaction } = useWalletContext();
  const [restaurantName, setRestaurantName] = useState('Arc Nexus Bistro');
  const [balance, setBalance] = useState(null);
  const [orderCount, setOrderCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [funding, setFunding] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [action, setAction] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [needsFunding, setNeedsFunding] = useState(false);
  const [lastTxHash, setLastTxHash] = useState(null);
  const [pendingItem, setPendingItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [payPhase, setPayPhase] = useState('confirm');
  const [modalError, setModalError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedContract, setCopiedContract] = useState(false);
  const purchaseStatusRef = useRef(null);

  const copyContractId = () => {
    navigator.clipboard.writeText(CONTRACT_ID);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToPurchaseStatus = useCallback(() => {
    purchaseStatusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  const refreshStats = useCallback(async () => {
    if (!publicKey) return;
    try {
      const bal = await getContractBalance(publicKey);
      const count = await getOrderCount(publicKey);
      if (typeof bal === 'number') setBalance(bal);
      if (typeof count === 'number') setOrderCount(count);
    } catch (err) {
      console.warn('Refresh stats failed:', err.message);
    }
  }, [publicKey]);

  const checkFunding = useCallback(async () => {
    if (!publicKey) {
      setNeedsFunding(false);
      return false;
    }
    setCheckingAccount(true);
    try {
      const exists = await checkAccountExists(publicKey);
      setNeedsFunding(!exists);
      return exists;
    } finally {
      setCheckingAccount(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (!confirmOpen) {
      document.body.style.overflow = '';
      return undefined;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [confirmOpen]);

  useEffect(() => {
    refreshStats();
    const id = setInterval(refreshStats, 10000);
    return () => clearInterval(id);
  }, [refreshStats]);

  useEffect(() => {
    if (connected && publicKey) {
      setError(null);
      checkFunding();
    } else {
      setNeedsFunding(false);
    }
  }, [connected, publicKey, checkFunding]);

  const handleFund = async () => {
    if (!publicKey) return;
    setFunding(true);
    setError(null);
    setMessage(null);
    try {
      const hash = await fundTestnetAccount(publicKey);
      await new Promise((r) => setTimeout(r, 4000));
      const exists = await checkAccountExists(publicKey);
      if (!exists) {
        throw new Error('Funding submitted but account not indexed yet. Wait ~5 seconds and retry.');
      }
      setNeedsFunding(false);
      setMessage(
        hash
          ? `Account funded with 10,000 test XLM! Tx: ${hash.slice(0, 16)}… — ready to buy!`
          : 'Account funded with test XLM. You can now purchase hardware items!'
      );
    } catch (err) {
      const { message: msg } = formatStellarError(err);
      setError(msg || 'Auto-fund failed. Click "Open Friendbot" or use Stellar Laboratory.');
      setNeedsFunding(true);
    } finally {
      setFunding(false);
    }
  };

  const handleInit = async () => {
    if (!connected || !publicKey) {
      setError('Connect your Freighter wallet first (button top-right)');
      return;
    }
    const funded = await checkFunding();
    if (!funded) {
      setNeedsFunding(true);
      setError('Fund your testnet account first using the button below.');
      return;
    }
    setLoading(true);
    setAction('init');
    setError(null);
    setMessage(null);
    try {
      const result = await initRestaurant(publicKey, restaurantName, publicKey, signTransaction);
      setLastTxHash(result.hash);
      setMessage(`Store initialized on-chain! Tx: ${result.hash.slice(0, 16)}…`);
      trackEvent('restaurant_init', { tx_hash: result.hash });
      await refreshStats();
      scrollToPurchaseStatus();
    } catch (err) {
      const { message: msg, needsFunding: nf } = formatStellarError(err);
      setError(msg);
      setNeedsFunding(nf);
      captureException(err, { action: 'init' });
      scrollToPurchaseStatus();
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handlePay = (item) => {
    setError(null);
    setMessage(null);
    setPendingItem(item);
    setModalError(null);
    setPayPhase('confirm');
    setConfirmOpen(true);
  };

  const handleModalConnect = async () => {
    try {
      await connect();
    } catch (err) {
      setModalError(err?.message || 'Failed to connect Freighter wallet.');
    }
  };

  const executePay = async () => {
    const item = pendingItem;
    if (!item || !publicKey) return;

    setLoading(true);
    setAction(`pay-${item.id}`);
    setError(null);
    setMessage(null);
    setModalError(null);
    setPayPhase('simulating');
    scrollToPurchaseStatus();

    try {
      if (!connected || !publicKey) {
        throw new Error('Connect your Freighter wallet first (button top-right).');
      }

      const funded = await checkFunding();
      if (!funded) {
        setNeedsFunding(true);
        throw new Error('Fund your testnet account first, wait ~5 seconds, then retry.');
      }

      const result = await payOrder(
        publicKey,
        DEFAULT_TOKEN,
        item.price,
        item.id,
        publicKey,
        signTransaction,
        {
          onPhase: (phase) => setPayPhase(phase),
        }
      );

      setConfirmOpen(false);
      setPendingItem(null);
      setModalError(null);
      setPayPhase('confirm');
      setLastTxHash(result.hash);
      setMessage(`Successfully purchased ${item.name}! Tx: ${result.hash.slice(0, 16)}…`);
      trackEvent('purchase', {
        item_id: item.id,
        item_name: item.name,
        value: item.price / 1_000_000,
        tx_hash: result.hash,
      });
      await refreshStats();
    } catch (err) {
      console.error('Payment error:', err);
      const { message: msg, needsFunding: nf } = formatStellarError(err);
      const display = msg || 'Payment failed. Check Freighter is on Testnet and try again.';
      setModalError(display);
      setError(display);
      setNeedsFunding(nf);
      setPayPhase('confirm');
      captureException(err, { action: 'pay', itemId: item.id });
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const cancelPay = () => {
    if (loading) return;
    setConfirmOpen(false);
    setPendingItem(null);
    setModalError(null);
    setPayPhase('confirm');
  };

  const purchaseBlockReason = !isValidContractId(CONTRACT_ID)
    ? null
    : !connected
      ? 'Connect Freighter wallet (top-right) to purchase hardware.'
      : checkingAccount
        ? 'Verifying testnet account balance…'
        : needsFunding
          ? 'Your wallet needs testnet funding before purchasing.'
          : loading && action?.startsWith('pay-')
            ? 'Processing transaction — please approve in Freighter popup.'
            : null;

  if (!isValidContractId(CONTRACT_ID)) {
    return (
      <section className="panel restaurant-panel">
        <h2>Restaurant Contract</h2>
        <div className="alert alert-error" role="alert">
          {CONTRACT_ID
            ? `Invalid VITE_CONTRACT_ID (${CONTRACT_ID.length} chars). Must be 56 characters (C + 55).`
            : 'VITE_CONTRACT_ID is not configured. Deploy the contract and set the env var on Vercel.'}
        </div>
      </section>
    );
  }

  return (
    <section className="panel restaurant-panel">
      {/* Contract metadata banner */}
      <div className="contract-hero-banner">
        <div className="contract-hero-info">
          <div className="contract-header-row">
            <span className="hero-badge-live">● Soroban Active</span>
            <span className="hero-badge-net">Stellar Testnet</span>
          </div>
          <h2 className="hero-title">Nexus Hardware Marketplace</h2>
          <p className="hero-desc">
            Direct peer-to-contract settlement via Rust Soroban smart contract. No middleman, instant finality.
          </p>
        </div>

        <div className="contract-meta-box">
          <span className="contract-meta-label">Contract Logic ID</span>
          <div className="contract-id-row">
            <code className="contract-id-text" title={CONTRACT_ID}>{CONTRACT_ID}</code>
            <button
              type="button"
              className="btn btn-secondary btn-xs copy-btn"
              onClick={copyContractId}
              title="Copy Contract ID"
            >
              {copiedContract ? 'Copied! ✓' : 'Copy'}
            </button>
            <a
              href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-xs"
              title="View on Stellar Expert"
            >
              ↗
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Onboarding Flow Steps */}
      {!connected && (
        <div className="onboarding-flow-card" role="status">
          <div className="onboarding-flow-header">
            <span className="onboarding-flow-title">🚀 Quick Start in 3 Steps</span>
            <span className="onboarding-flow-badge">No real funds needed</span>
          </div>
          <div className="onboarding-steps-grid">
            <div className="onboarding-step-box step-active">
              <span className="step-num">01</span>
              <div className="step-content">
                <strong>Connect Wallet</strong>
                <span>Install Freighter & switch to Testnet</span>
              </div>
            </div>
            <div className="onboarding-step-box">
              <span className="step-num">02</span>
              <div className="step-content">
                <strong>1-Click Fund</strong>
                <span>Get 10,000 free test XLM instantly</span>
              </div>
            </div>
            <div className="onboarding-step-box">
              <span className="step-num">03</span>
              <div className="step-content">
                <strong>Instant Purchase</strong>
                <span>Sign on-chain payment with Soroban</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Checking Alert */}
      {checkingAccount && connected && (
        <div className="alert alert-info">
          <span className="spinner" /> Checking testnet account status…
        </div>
      )}

      {/* Funding Card */}
      {needsFunding && connected && !checkingAccount && (
        <div className="funding-card" role="status">
          <div className="funding-card-icon">⛽</div>
          <div className="funding-card-body">
            <h3>Testnet Account Funding Required</h3>
            <p>
              Your address <code>{publicKey?.slice(0, 8)}…{publicKey?.slice(-6)}</code> requires testnet XLM before making contract transactions.
            </p>
            <div className="funding-actions">
              <button
                type="button"
                className="btn btn-primary btn-glow"
                onClick={handleFund}
                disabled={funding}
              >
                {funding ? (
                  <>
                    <span className="spinner" /> Funding from Friendbot…
                  </>
                ) : (
                  '⚡ 1-Click Fund (10,000 test XLM)'
                )}
              </button>
              <a
                href={friendbotUrl(publicKey)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                Direct Friendbot ↗
              </a>
              <a
                href={laboratoryFundUrl(publicKey)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                Stellar Laboratory ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Catalog & Purchase Section */}
      <div className="menu-section" id="purchase-section">
        <div className="catalog-header-group">
          <div>
            <h3>Hardware Catalog</h3>
            <p className="hint">
              Smart contract invocation: <code>pay(customer, token, amount, order_id)</code>
            </p>
          </div>

          {/* Search bar */}
          <div className="menu-search">
            <span className="menu-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search hardware by name, category, or specs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search hardware catalog"
            />
            {searchQuery && (
              <button
                type="button"
                className="menu-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="category-pills-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Purchase Status Notifications */}
        <div ref={purchaseStatusRef} className="purchase-status">
          {purchaseBlockReason && (
            <div className="alert alert-info" role="status">
              <span className="alert-icon">ℹ️</span> {purchaseBlockReason}
            </div>
          )}
          {error && (
            <div className="alert alert-error" role="alert">
              <span className="alert-icon">⚠️</span> {error}
            </div>
          )}
          {message && (
            <div className="alert alert-success" role="status">
              <span className="alert-icon">✅</span> {message}
            </div>
          )}
          {lastTxHash && typeof lastTxHash === 'string' && (
            <div className="tx-hash-badge">
              <span>Verified On-Chain:</span>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${lastTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {lastTxHash.slice(0, 24)}… ↗
              </a>
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="menu-no-results">
            <span className="no-results-icon">🔎</span>
            <p>No hardware items match &quot;{searchQuery}&quot;</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map((item, index) => {
              const priceXLM = item.price / 1_000_000;
              const priceUSD = (priceXLM * 0.12).toFixed(2);
              return (
                <article key={item.id} className="menu-card" style={{ '--i': index }}>
                  {item.tag && <span className="card-top-tag">{item.tag}</span>}

                  <div className="menu-card-header">
                    <span className="menu-emoji">{item.emoji}</span>
                    <span className="menu-category-tag">{item.category || 'Tech'}</span>
                  </div>

                  <h4>{item.name}</h4>
                  <p className="menu-item-desc">{item.desc}</p>

                  {item.specs && (
                    <div className="specs-chips">
                      {item.specs.map((spec) => (
                        <span key={spec} className="spec-chip">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="menu-card-footer">
                    <div className="price-group">
                      <span className="menu-price">{priceXLM.toFixed(2)} XLM</span>
                      <span className="menu-price-sub">≈ ${priceUSD} USD</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-purchase"
                      onClick={() => handlePay(item)}
                      disabled={loading}
                      aria-busy={action === `pay-${item.id}`}
                    >
                      {action === `pay-${item.id}` ? (
                        <>
                          <span className="spinner" /> Signing…
                        </>
                      ) : (
                        'Instant Pay ⚡'
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Store Initialization Section */}
      <div className="init-section">
        <div className="init-section-header">
          <div>
            <h3>Owner Protocol Controls</h3>
            <p className="hint">
              Initialize store instance on-chain: <code>init(owner, name)</code>
            </p>
          </div>
          <span className="badge-initialized">Instance Protected</span>
        </div>

        <div className="form-row">
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Store instance name"
            disabled={loading}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleInit}
            disabled={loading}
          >
            {action === 'init' ? (
              <>
                <span className="spinner" /> Initializing…
              </>
            ) : (
              'Init Store Instance'
            )}
          </button>
        </div>
      </div>

      <PurchaseConfirmModal
        item={pendingItem}
        open={confirmOpen}
        onConfirm={executePay}
        onCancel={cancelPay}
        onConnect={handleModalConnect}
        connected={connected}
        connecting={connecting}
        confirming={loading && action?.startsWith('pay-')}
        phase={payPhase}
        error={modalError}
      />
    </section>
  );
}
