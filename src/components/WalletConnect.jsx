import { useState } from 'react';
import { useWalletContext } from '../context/WalletContext.jsx';

function truncateKey(key) {
  if (!key) return '';
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

export default function WalletConnect() {
  const { publicKey, connecting, error, connected, connect, disconnect } = useWalletContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="wallet-header">
      <div className="brand-group">
        <div className="brand-logo">
          <span className="brand-icon">⚡</span>
          <div className="brand-text">
            <h1>ARC NEXUS <span className="brand-version">v2.5</span></h1>
            <span className="brand-tagline">Soroban On-Chain Commerce</span>
          </div>
        </div>
        <div className="network-pill">
          <span className="network-dot" />
          <span className="network-name">Testnet</span>
        </div>
      </div>

      <div className="wallet-actions">
        {error && (
          <div className="alert alert-error wallet-error-pill" role="alert">
            {error}
          </div>
        )}

        {connected ? (
          <div className="wallet-connected-group">
            <button
              type="button"
              className="wallet-badge-btn"
              onClick={handleCopy}
              title={`Click to copy: ${publicKey}`}
            >
              <span className="dot dot-active" />
              <span className="wallet-key">{truncateKey(publicKey)}</span>
              <span className="copy-badge">{copied ? 'Copied! ✓' : 'Copy'}</span>
            </button>
            <a
              href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title="View on Stellar Expert"
            >
              Explorer ↗
            </a>
            <button type="button" className="btn btn-ghost btn-sm" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-glow"
            onClick={connect}
            disabled={connecting}
          >
            {connecting ? (
              <>
                <span className="spinner" /> Connecting…
              </>
            ) : (
              <>
                <span className="btn-icon">🔗</span> Connect Freighter
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
