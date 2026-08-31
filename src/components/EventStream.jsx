import { useEventStream } from '../hooks/useEventStream.js';

export default function EventStream() {
  const { events, loading, error, refresh } = useEventStream(true);

  return (
    <section className="panel event-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-title-icon">📡</span>
          <div>
            <h2>Live Soroban Ledger Events</h2>
            <p className="panel-subtitle">
              Continuous RPC polling of contract topics (<code>pay</code>, <code>init</code>)
            </p>
          </div>
        </div>

        <div className="event-header-actions">
          <span className="stream-badge-pulse">
            <span className="pulse-dot" />
            POLLING (5s)
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : '↻ Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {events.length === 0 && !loading && !error && (
        <div className="empty-state">
          <span className="empty-icon">🛰️</span>
          <p>Listening for contract events…</p>
          <span className="empty-sub">Submit an on-chain purchase to emit the next event payload.</span>
        </div>
      )}

      <ul className="event-list">
        {events.map((evt) => {
          const isPay = evt.topics?.some(t => String(t).includes('pay')) || evt.topics?.[0] === 'pay';
          return (
            <li key={evt.id} className={`event-item ${isPay ? 'event-pay' : 'event-init'}`}>
              <div className="event-meta">
                <div className="event-tags">
                  <span className={`event-type-badge ${isPay ? 'badge-pay' : 'badge-init'}`}>
                    {isPay ? '⚡ CONTRACT_PAY' : '🔑 CONTRACT_INIT'}
                  </span>
                  <span className="event-ledger">Block #{evt.ledger}</span>
                </div>

                {evt.txHash && (
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${evt.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-tx-link"
                    title="View Transaction on Stellar Expert"
                  >
                    Tx: {evt.txHash.slice(0, 10)}…{evt.txHash.slice(-4)} ↗
                  </a>
                )}
              </div>

              <div className="event-data-wrapper">
                <pre className="event-data">
                  {JSON.stringify(
                    {
                      topics: evt.topics,
                      payload: evt.value,
                      timestamp: evt.timestamp || new Date().toISOString(),
                    },
                    (key, value) => (typeof value === 'bigint' ? value.toString() : value),
                    2
                  )}
                </pre>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
