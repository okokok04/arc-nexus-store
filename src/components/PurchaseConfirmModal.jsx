import { createPortal } from 'react-dom';
import TransactionStepper from './TransactionStepper.jsx';

const PHASE_LABELS = {
  confirm: null,
  simulating: 'Simulating invocation on Soroban RPC…',
  preparing: 'Assembling transaction & Soroban resource footprint…',
  'awaiting-signature': 'Freighter popup requested — click Approve in wallet popup to sign.',
  submitting: 'Submitting signed transaction to Stellar validators…',
  confirming: 'Waiting for ledger consensus confirmation…',
};

export default function PurchaseConfirmModal({
  item,
  open,
  onConfirm,
  onCancel,
  onConnect,
  confirming,
  connecting,
  connected,
  phase,
  error,
}) {
  if (!open || !item) return null;

  const phaseLabel = PHASE_LABELS[phase] || null;
  const needsWallet = !connected;
  const priceXLM = item.price / 1_000_000;
  const priceUSD = (priceXLM * 0.12).toFixed(2);

  const content = (
    <div className="modal-overlay" role="presentation" onClick={confirming ? undefined : onCancel}>
      <div
        className="modal-card modal-card-cyber"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-row">
          <div className="modal-header-text">
            <span className="modal-tag">On-Chain Checkout</span>
            <h3 id="purchase-confirm-title">Order Confirmation</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            disabled={confirming}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Item Preview Card */}
        <div className="modal-item-card">
          <span className="modal-item-emoji">{item.emoji}</span>
          <div className="modal-item-info">
            <h4 className="modal-item-name">{item.name}</h4>
            <span className="modal-item-category">{item.category || 'Hardware'}</span>
            <p className="modal-item-subdesc">{item.desc}</p>
          </div>
        </div>

        {/* Price & Gas Breakdown */}
        <div className="modal-breakdown">
          <div className="breakdown-row">
            <span className="breakdown-label">Item Price</span>
            <div className="breakdown-value">
              <strong>{priceXLM.toFixed(2)} XLM</strong>
              <span className="breakdown-usd">≈ ${priceUSD} USD</span>
            </div>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-label">Network Fee (Testnet)</span>
            <span className="breakdown-value text-green">~0.10 XLM (Covered)</span>
          </div>
          <div className="breakdown-divider" />
          <div className="breakdown-row total-row">
            <span className="breakdown-label font-bold">Total Amount</span>
            <span className="breakdown-value text-cyan font-bold">{priceXLM.toFixed(2)} XLM</span>
          </div>
        </div>

        {needsWallet && (
          <div className="alert alert-info modal-phase-alert" role="status">
            <span className="alert-icon">🔗</span>
            <div>
              <strong>Wallet Not Connected</strong>
              <p>Connect your Freighter wallet to sign and submit this purchase.</p>
            </div>
          </div>
        )}

        {!needsWallet && !confirming && !error && (
          <div className="modal-instruction-box">
            <span className="instruction-step">1. Click Confirm</span>
            <span className="instruction-arrow">→</span>
            <span className="instruction-step">2. Approve in Freighter popup</span>
            <span className="instruction-arrow">→</span>
            <span className="instruction-step">3. Instant Ledger Confirmation</span>
          </div>
        )}

        {/* Transaction Stepper */}
        {confirming && (
          <div className="modal-stepper-container">
            <TransactionStepper phase={phase} />
          </div>
        )}

        {confirming && phaseLabel && (
          <div className="alert alert-info modal-phase-alert" role="status">
            <span className="spinner" />
            <span>{phaseLabel}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error modal-error-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Transaction Error</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={confirming}
          >
            {error ? 'Dismiss' : 'Cancel'}
          </button>

          {needsWallet ? (
            <button
              type="button"
              className="btn btn-primary btn-glow"
              onClick={onConnect}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <span className="spinner" /> Connecting…
                </>
              ) : (
                'Connect Freighter Wallet'
              )}
            </button>
          ) : !error ? (
            <button
              type="button"
              className="btn btn-primary btn-glow"
              onClick={onConfirm}
              disabled={confirming}
            >
              {confirming ? (
                <>
                  <span className="spinner" /> Processing…
                </>
              ) : (
                'Authorize & Pay XLM ⚡'
              )}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-glow"
              onClick={onConfirm}
              disabled={confirming}
            >
              Retry Payment ↻
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
