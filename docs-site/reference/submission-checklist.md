# Submission Checklist

Tracking checklist for the project's staged requirements (Level 4 → Level 5). Kept here as a
living reference — check the source docs linked below for the latest raw numbers.

## 1. Production MVP

- [x] Store initialization (`init(owner, name)`)
- [x] On-chain purchase (`pay(customer, token, amount, order_id)`)
- [x] Read-only views: `get_owner`, `get_name`, `get_balance`, `get_order_count`
- [x] Frontend fully functional (wallet connect, funding, init, pay, live event stream)
- [x] Loading states and error handling (`formatStellarError`, `RestaurantPanel.jsx`)
- [x] Mobile-responsive UI (`src/index.css`, `@media (max-width: 640px / 400px)`)

## 2. User onboarding (Level 4 → 10+, Level 5 → 50+)

- [x] 54 real Google Form responses collected (see [Growth & Recruitment](/product/growth))
- [x] Feedback collected from real testers, exported and kept in-repo as a backup
- [x] On-chain activity independently verified via direct RPC (`get_order_count = 78`,
      `get_balance = 769.5 XLM` on the current contract)

::: warning Keep automated and human activity separate
The automated smoke-test wallets described in [Growth & Recruitment](/product/growth) prove
the contract/frontend handle distinct wallets correctly — they do **not** count toward the
human-tester target. Only the Google Form / response sheet does.
:::

## 3. Monitoring & analytics

- [x] Sentry + GA4 wired in `src/lib/monitoring.js`
- [x] Product events tracked: `restaurant_init`, `purchase`, `feedback_click`
- [ ] `VITE_SENTRY_DSN` / `VITE_GA_MEASUREMENT_ID` confirmed set in Vercel's **production**
      environment variables, with a real captured event as proof

## 4. Deployment

- [x] Frontend deployed to Vercel — [arc-restaurant-git.vercel.app](https://arc-restaurant-git.vercel.app/)
- [x] Contract deployed to Stellar Testnet — `CDRGTQ466OLVQDYDTZKXY4J5AWJOJSIJSN3U2CSWHYXD4L7JYU5VXY6N`
- [x] CI/CD: `ci.yml` (lint/test/build), `deploy-contract.yml` (manual testnet deploy)

## 5. Documentation

- [x] README (features, contract API, getting started, project structure)
- [x] This docs site — architecture, contract API, integration, deployment, growth

## 6. 15+ git commits

- [x] 56+ commits in `git log`

## 7. Live demo

- [x] Screenshots — see below
- [ ] Demo video recorded and linked (script ready — see [Demo Script](/product/demo-script))

## Screenshots

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin-top:1rem">
  <img src="/screenshots/desktop-ui.png" alt="Desktop UI" style="border-radius:0.75rem;border:1px solid var(--vp-c-divider)" />
  <img src="/screenshots/mobile-ui.png" alt="Mobile UI" style="border-radius:0.75rem;border:1px solid var(--vp-c-divider)" />
  <img src="/screenshots/sentry-dashboard.png" alt="Sentry dashboard" style="border-radius:0.75rem;border:1px solid var(--vp-c-divider)" />
  <img src="/screenshots/ga4-dashboard.png" alt="GA4 dashboard" style="border-radius:0.75rem;border:1px solid var(--vp-c-divider)" />
</div>

## Outstanding before final submission

1. Set real `VITE_SENTRY_DSN` / `VITE_GA_MEASUREMENT_ID` on Vercel and confirm events land in
   each dashboard.
2. Record and publish the demo video; update the README "Live Demo" section with the link.
