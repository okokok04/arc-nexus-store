import { trackEvent } from '../lib/monitoring.js';

const FEEDBACK_URL =
  import.meta.env.VITE_FEEDBACK_URL || 'https://docs.google.com/forms/d/e/1FAIpQLSe-9bQUDVFaiBA04WXpTfBHxT3wMfCDB6-Q2FvwzgE8XMeiFg/viewform';

export default function FeedbackLink() {
  return (
    <div className="footer-links-container">
      <div className="footer-nav">
        <a
          href="https://arc-nexus-store.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-nav-link"
        >
          📖 Docs
        </a>
        <span className="footer-dot">•</span>
        <a
          href="https://github.com/okokok04/arc-nexus-store"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-nav-link"
        >
          🐙 GitHub
        </a>
        <span className="footer-dot">•</span>
        <a
          href="https://stellar.expert/explorer/testnet"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-nav-link"
        >
          🔍 Stellar Expert
        </a>
        <span className="footer-dot">•</span>
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-feedback-highlight"
          onClick={() => trackEvent('feedback_click')}
        >
          💬 Give Feedback & Earn Testnet Rep ↗
        </a>
      </div>
      <p className="footer-copyright">
        Arc Nexus Store • Built on <strong>Stellar Soroban</strong> • Testnet Environment
      </p>
    </div>
  );
}
