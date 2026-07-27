# Level 4 Submission — Arc Nexus Store

Arc Nexus Store is a Soroban-powered restaurant/store payment dApp on Stellar. Customers connect a Freighter wallet, the owner initializes the store on-chain, and every purchase calls the deployed `restaurant` contract directly (`init` / `pay`) — no backend, no custodian.

## Requirements Checklist

### 1. Production MVP

- [x] Store initialization (`init(owner, name)`)
- [x] On-chain purchase (`pay(customer, token, amount, order_id)`)
- [x] Read-only views: `get_owner`, `get_name`, `get_balance`, `get_order_count`
- [x] Frontend fully functional (wallet connect, funding, init, pay, live event stream)
- [x] Loading states and error handling (see `src/lib/account.js` `formatStellarError`, `RestaurantPanel.jsx`)
- [x] Mobile responsive UI (`src/index.css`, `@media (max-width: 640px / 400px)`)

**Evidence**: `docs/screenshots/desktop-ui.png`, `docs/screenshots/mobile-ui.png` (captured from the running app, see below)

### 2. 10+ User Onboarding

- [ ] 10+ real users connected a wallet and completed a purchase
- [ ] Feedback collected from real testers

**Status**: Not started. See `docs/USER_RECRUITMENT.md` for the recruitment plan and the tracking sheet to fill in as real users test the app. This section must only be marked complete once it lists real transaction hashes and real feedback — no simulated data.

### 3. Monitoring & Analytics

- [x] Sentry + GA4 wired in `src/lib/monitoring.js` (`initMonitoring`, `captureException`, `trackEvent`)
- [x] Product events tracked: `restaurant_init`, `purchase`, `feedback_click`
- [ ] `VITE_SENTRY_DSN` / `VITE_GA_MEASUREMENT_ID` confirmed set in the Vercel project's environment variables (production)

**Status**: Code is ready; still needs a real Sentry project + GA4 property, with the DSN/measurement ID set on Vercel and verified with a live event.

### 4. Deployment

- [x] Frontend deployed to Vercel — see README "Live Demo"
- [x] Contract deployed to Stellar Testnet — contract ID in README
- [x] CI/CD: `.github/workflows/ci.yml` (lint/test/build), `deploy-contract.yml` (testnet deploy)

### 5. Documentation

- [x] README (features, contract API, getting started, project structure)
- [x] `docs/ARCHITECTURE.md`, `docs/API_INTEGRATION.md`, `docs/COMPONENTS.md`, `docs/DEPLOYMENT.md`, `docs/TESTNET_DEPLOYMENT.md`, `docs/MANUAL-DEPLOY.md`, `docs/TESTING.md`

### 6. 15+ Git Commits

- [x] 56+ commits in `git log`

### 7. Live Demo

- [x] Screenshots: `docs/screenshots/desktop-ui.png`, `docs/screenshots/mobile-ui.png`
- [ ] Demo video (README currently lists this as pending)

## Contract Test Output

```text
running 4 tests
test test::test_init_sets_owner_and_name ... ok
test test::test_init_twice_panics - should panic ... ok
test test::test_pay_zero_amount_panics - should panic ... ok
test test::test_pay_transfers_tokens_and_updates_balance ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; finished in 0.03s
```

## Outstanding Before Final Submission

1. Recruit 10+ real testnet users, record their tx hashes and feedback (`docs/USER_RECRUITMENT.md`).
2. Set real `VITE_SENTRY_DSN` / `VITE_GA_MEASUREMENT_ID` on Vercel and confirm events land in each dashboard.
3. Record and publish the demo video; update the README "Live Demo" section with the link.
4. Take a screenshot of the Sentry/GA4 dashboard once real traffic is flowing, and add it to `docs/screenshots/`.
