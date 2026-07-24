import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let gaLoaded = false;

/** Initialize Sentry error tracking and GA4 analytics if DSNs/IDs are configured. */
export function initMonitoring() {
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.2,
    });
  }

  if (GA_MEASUREMENT_ID && typeof document !== 'undefined') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
    gaLoaded = true;
  }
}

/** Report a caught error to Sentry (falls back to console when Sentry isn't configured). */
export function captureException(error, context) {
  if (SENTRY_DSN) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } else {
    console.error(error, context);
  }
}

/** Track a product event in GA4 (no-op when analytics isn't configured). */
export function trackEvent(name, params) {
  if (gaLoaded && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
