import { trackEvent } from '../lib/monitoring.js';

const FEEDBACK_URL =
  import.meta.env.VITE_FEEDBACK_URL || 'mailto:manhcotlee00@gmail.com?subject=Arc%20Nexus%20Store%20feedback';

export default function FeedbackLink() {
  return (
    <p className="feedback-link">
      <a
        href={FEEDBACK_URL}
        target={FEEDBACK_URL.startsWith('mailto:') ? undefined : '_blank'}
        rel={FEEDBACK_URL.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        onClick={() => trackEvent('feedback_click')}
      >
        Send feedback
      </a>
    </p>
  );
}
