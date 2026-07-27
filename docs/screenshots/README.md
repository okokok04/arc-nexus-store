# Screenshots

- `desktop-ui.png` — Nexus Store dashboard at 1280×800, captured from the running app (`npm run dev` + Playwright, `scripts/capture_screenshots.mjs`)
- `mobile-ui.png` — same app at a 375px mobile viewport, showing the stacked responsive layout

- `sentry-dashboard.png` — a real production error captured in Sentry (Freighter unavailable on Mobile Safari/iOS), confirming `VITE_SENTRY_DSN` is live
- `ga4-dashboard.png` — GA4 Realtime overview showing a real `purchase` event and a `Purchasers` segment, confirming `VITE_GA_MEASUREMENT_ID` is live

Regenerate the desktop/mobile screenshots:

```bash
npm install
npm run dev &          # or: npx vite
node scripts/capture_screenshots.mjs
```
