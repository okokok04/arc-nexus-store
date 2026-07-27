# Screenshots

- `desktop-ui.png` — Nexus Store dashboard at 1280×800, captured from the running app (`npm run dev` + Playwright, `scripts/capture_screenshots.mjs`)
- `mobile-ui.png` — same app at a 375px mobile viewport, showing the stacked responsive layout

Still needed for submission:
- Sentry dashboard screenshot (once `VITE_SENTRY_DSN` is set on Vercel and a real error has been captured)
- GA4 realtime/events dashboard screenshot (once `VITE_GA_MEASUREMENT_ID` is set on Vercel and a real session has been tracked)

Regenerate the desktop/mobile screenshots:

```bash
npm install
npm run dev &          # or: npx vite
node scripts/capture_screenshots.mjs
```
