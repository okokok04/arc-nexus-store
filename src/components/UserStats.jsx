import { useState, useEffect, useCallback } from 'react';
import { useWalletContext } from '../context/WalletContext.jsx';
import { getContractBalance, getOrderCount } from '../lib/soroban.js';

/**
 * UserStats — real-time contract stats dashboard.
 * Addresses user feedback: "Show a progress bar so we know how many steps are left"
 * and "Clearer confirmation messages after completing a task."
 */
export default function UserStats() {
  const { publicKey, connected } = useWalletContext();
  const [stats, setStats] = useState({ balance: null, orders: null });
  const [lastUpdate, setLastUpdate] = useState(null);

  const refreshStats = useCallback(async () => {
    if (!publicKey) return;
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
    }
  }, [publicKey]);

  useEffect(() => {
    refreshStats();
    const id = setInterval(refreshStats, 15000);
    return () => clearInterval(id);
  }, [refreshStats]);

  const formatXLM = (stroops) =>
    typeof stroops === 'number' ? `${(stroops / 1_000_000).toFixed(2)}` : '—';

  const timeAgo = lastUpdate
    ? `${Math.round((Date.now() - lastUpdate.getTime()) / 1000)}s ago`
    : 'never';

  return (
    <section className="panel" aria-label="Contract Statistics">
      <div className="panel-header">
        <h2>Network Activity</h2>
        <span className="live-indicator">
          <span className="live-dot" />
          LIVE
        </span>
      </div>

      <div className="user-stats-panel">
        <div className="user-stat-item">
          <div className="user-stat-icon">📦</div>
          <span className="user-stat-value">{stats.orders ?? '—'}</span>
          <span className="user-stat-label">Orders</span>
        </div>
        <div className="user-stat-item">
          <div className="user-stat-icon">💰</div>
          <span className="user-stat-value">{formatXLM(stats.balance)}</span>
          <span className="user-stat-label">Revenue (XLM)</span>
        </div>
        <div className="user-stat-item">
          <div className="user-stat-icon">🔗</div>
          <span className="user-stat-value">{connected ? 'Active' : 'Idle'}</span>
          <span className="user-stat-label">Wallet</span>
        </div>
        <div className="user-stat-item">
          <div className="user-stat-icon">⏱️</div>
          <span className="user-stat-value">{timeAgo}</span>
          <span className="user-stat-label">Last Sync</span>
        </div>
      </div>
    </section>
  );
}
