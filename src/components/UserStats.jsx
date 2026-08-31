import { useState, useEffect, useCallback } from 'react';
import { useWalletContext } from '../context/WalletContext.jsx';
import { getContractBalance, getOrderCount } from '../lib/soroban.js';

export default function UserStats() {
  const { publicKey, connected } = useWalletContext();
  const [stats, setStats] = useState({ balance: null, orders: null });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshStats = useCallback(async () => {
    if (!publicKey) return;
    setRefreshing(true);
    try {
      const [bal, count] = await Promise.all([
        getContractBalance(publicKey),
        getOrderCount(publicKey),
      ]);
      if (typeof bal === 'number') setStats(prev => ({ ...prev, balance: bal }));
      if (typeof count === 'number') setStats(prev => ({ ...prev, orders: count }));
      setLastUpdate(new Date());
    } catch {
      // Keep existing stats on error
    } finally {
      setRefreshing(false);
    }
  }, [publicKey]);

  useEffect(() => {
    refreshStats();
    const id = setInterval(refreshStats, 12000);
    return () => clearInterval(id);
  }, [refreshStats]);

  const formatXLM = (stroops) =>
    typeof stroops === 'number' ? `${(stroops / 1_000_000).toFixed(2)}` : '—';

  const formatUSD = (stroops) => {
    if (typeof stroops !== 'number') return '—';
    const xlm = stroops / 1_000_000;
    return `≈ $${(xlm * 0.12).toFixed(2)} USD`;
  };

  const timeAgo = lastUpdate
    ? `${Math.max(1, Math.round((Date.now() - lastUpdate.getTime()) / 1000))}s ago`
    : 'syncing…';

  return (
    <section className="panel stats-dashboard-panel" aria-label="Contract Statistics">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-title-icon">📊</span>
          <div>
            <h2>Protocol Telemetry</h2>
            <p className="panel-subtitle">Real-time Soroban ledger state & volume</p>
          </div>
        </div>

        <div className="stats-header-actions">
          <span className="live-indicator">
            <span className="live-dot" />
            LIVE RPC
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-xs refresh-btn"
            onClick={refreshStats}
            disabled={refreshing || !connected}
            title="Refresh contract statistics"
          >
            <span className={`refresh-icon ${refreshing ? 'spinning' : ''}`}>↻</span>
            <span className="refresh-label">{timeAgo}</span>
          </button>
        </div>
      </div>

      <div className="user-stats-panel">
        <div className="user-stat-item stat-card-highlight">
          <div className="stat-card-top">
            <span className="user-stat-icon">📦</span>
            <span className="stat-trend-badge positive">+On-Chain</span>
          </div>
          <span className="user-stat-value">{stats.orders ?? '—'}</span>
          <span className="user-stat-label">Total Completed Orders</span>
          <div className="stat-card-bar">
            <div className="stat-bar-fill fill-cyan" style={{ width: `${Math.min(100, ((stats.orders || 0) / 100) * 100)}%` }} />
          </div>
        </div>

        <div className="user-stat-item stat-card-highlight">
          <div className="stat-card-top">
            <span className="user-stat-icon">💎</span>
            <span className="stat-usd-estimate">{formatUSD(stats.balance)}</span>
          </div>
          <span className="user-stat-value">{formatXLM(stats.balance)} <span className="unit">XLM</span></span>
          <span className="user-stat-label">Store Revenue Vault</span>
          <div className="stat-card-bar">
            <div className="stat-bar-fill fill-purple" style={{ width: `${Math.min(100, (((stats.balance || 0) / 1_000_000) / 1000) * 100)}%` }} />
          </div>
        </div>

        <div className="user-stat-item">
          <div className="stat-card-top">
            <span className="user-stat-icon">⚡</span>
            <span className={`status-pill ${connected ? 'status-online' : 'status-offline'}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <span className="user-stat-value">{connected ? 'Freighter v4' : 'No Wallet'}</span>
          <span className="user-stat-label">Active Signer</span>
        </div>

        <div className="user-stat-item">
          <div className="stat-card-top">
            <span className="user-stat-icon">🔒</span>
            <span className="stat-trend-badge neutral">Soroban v22</span>
          </div>
          <span className="user-stat-value">Auth Guaranteed</span>
          <span className="user-stat-label">Security Protocol</span>
        </div>
      </div>
    </section>
  );
}
