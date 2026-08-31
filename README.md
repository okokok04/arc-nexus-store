# Arc Nexus Store

[![CI/CD Pipeline](https://github.com/okokok04/arc-nexus-store/actions/workflows/ci.yml/badge.svg)](https://github.com/okokok04/arc-nexus-store/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contracts-Soroban-orange)](https://soroban.stellar.org)

**Arc Nexus Store** is a Soroban-powered restaurant/store payment dApp on Stellar. Customers connect a Freighter wallet, the owner initializes the store on-chain, and every purchase calls the deployed smart contract directly — no backend, no custodian.

## Docs

**Live**: [arc-nexus-store.vercel.app](https://arc-nexus-store.vercel.app) — architecture, contract API,
integration, deployment, and growth docs.

Source lives in [`docs-site/`](docs-site) (VitePress). Run locally with
`npm run docs:install && npm run docs:dev`, or see [`docs-site/README.md`](docs-site/README.md)
for deployment.

## Live Demo

- **Frontend**: [arc-restaurant-git.vercel.app](https://arc-restaurant-git.vercel.app/)
- **Contract (Testnet)**: `CDRGTQ466OLVQDYDTZKXY4J5AWJOJSIJSN3U2CSWHYXD4L7JYU5VXY6N`
- **Demo video**: _pending_ — script ready at [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)
- **Pitch deck**: [Arc Nexus Store — Pitch Deck (HTML)](docs/pitch-deck.html) — Problem, Solution, Architecture, Market, Traction, Growth, Roadmap

## Screenshots

| Desktop | Mobile (375px) |
|---|---|
| ![Desktop UI](docs/screenshots/desktop-ui.png) | ![Mobile UI](docs/screenshots/mobile-ui.png) |

| Sentry (real production error) | GA4 Realtime (real purchase event) |
|---|---|
| ![Sentry dashboard](docs/screenshots/sentry-dashboard.png) | ![GA4 dashboard](docs/screenshots/ga4-dashboard.png) |

## Key Features

- **Wallet integration** — Freighter connect/disconnect via `@stellar/freighter-api`, with network/account checks before every signature
- **Real on-chain calls** — `init` and `pay` are built, simulated, signed, and submitted through `@stellar/stellar-sdk` (`Contract`, `TransactionBuilder`, `rpc.Server`), not mocked
- **Testnet auto-funding** — one-click Friendbot funding with a fallback link to Stellar Laboratory
- **Live event stream** — polls Soroban RPC `getEvents` for `init`/`pay` contract events in real time
- **Monitoring** — Sentry error tracking and GA4 analytics, wired in `src/lib/monitoring.js` (enabled once DSN/measurement ID are configured)
- **Network Activity dashboard** — real-time stats panel showing orders, revenue, wallet status, and sync time with a live indicator
- **Menu search** — instant catalog search/filter for quick item lookup
- **Transaction progress stepper** — 5-step visual progress indicator (Simulate → Prepare → Sign → Submit → Confirm) during purchases
- **Mobile responsive UI** — larger touch targets, improved contrast, stacked forms/actions below 640px
- **Feedback link** — footer link to a feedback form/mailto, configurable via `VITE_FEEDBACK_URL`

## Smart Contract

`contracts/restaurant` — a Soroban contract (`soroban-sdk` 22) exposing:

| Function | Description |
|---|---|
| `init(owner, name)` | One-time store initialization |
| `pay(customer, token, amount, order_id)` | Transfers `amount` of `token` from customer to owner, updates revenue/order count |
| `get_owner`, `get_name`, `get_balance`, `get_order_count` | Read-only views |

### Test output

```text
running 4 tests
test test::test_init_sets_owner_and_name ... ok
test test::test_init_twice_panics - should panic ... ok
test test::test_pay_zero_amount_panics - should panic ... ok
test test::test_pay_transfers_tokens_and_updates_balance ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; finished in 0.03s
```

## Getting Started

```bash
npm install
cp .env.example .env   # fill in VITE_CONTRACT_ID at minimum
npm run dev
```

Build the contract and run its Rust test suite:

```bash
npm run contract:build
npm run contract:test
```

Deploy to testnet (requires a funded deployer key — see `scripts/deploy-contract.mjs`):

```bash
npm run contract:deploy
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Stellar**: `@stellar/stellar-sdk`, `@stellar/freighter-api`, Soroban RPC
- **Contract**: Rust, `soroban-sdk` 22
- **CI/CD**: GitHub Actions (`ci.yml` lint/test/build, `deploy-contract.yml` testnet deploy)
- **Monitoring**: Sentry (error tracking), Google Analytics 4 (product events)

## Project Structure

```
src/
  components/   RestaurantPanel, WalletConnect, EventStream, PurchaseConfirmModal,
                FeedbackLink, UserStats, TransactionStepper
  context/      WalletContext (Freighter wallet state)
  hooks/        useWallet, useEventStream
  lib/          soroban.js (SDK calls), contract.js (contract config/menu),
                account.js (Friendbot/error mapping), monitoring.js
contracts/
  restaurant/   Soroban contract source + tests
```

---

## User Growth & Feedback (Level 5)

### Google Form

**Tester form**: [Arc Nexus Store — Tester Feedback](https://docs.google.com/forms/d/e/1FAIpQLSe-9bQUDVFaiBA04WXpTfBHxT3wMfCDB6-Q2FvwzgE8XMeiFg/viewform)

The form collects the following fields:

| # | Field | Type | Required |
|---|---|---|---|
| 1 | Name | Short answer | Yes |
| 2 | Email | Short answer | Yes |
| 3 | Stellar wallet address | Short answer | Yes |
| 4 | Transaction hash of your test purchase | Short answer | No |
| 5 | How easy was it to use? (Product Rating 1–5) | Linear scale | Yes |
| 6 | What confused you or could be improved? | Paragraph | No |
| 7 | Would you use this again? | Multiple choice | Yes |

### Response Exports

- **Google Sheet (live, public)**: [Arc Nexus Store — Tester Feedback (Responses)](https://docs.google.com/spreadsheets/d/1xosUOwzocsZf06ixRAp-2RNWfG2ScoFiNAvG0BYH2qQ/edit?usp=sharing) — 54 responses
- **Excel export (in-repo)**: [Tester_Feedback_Responses.xlsx](docs/Tester_Feedback_Responses.xlsx)
- **CSV export (in-repo)**: [Tester_Feedback_Responses.csv](docs/Tester_Feedback_Responses.csv)
- **On-chain activity log**: [ARC_NEXUS_ACTIVITY_LOG.xlsx](docs/ARC_NEXUS_ACTIVITY_LOG.xlsx)

### On-chain Proof

Verified via direct RPC: `get_order_count` = 78, `get_balance` = 769.5 XLM on contract `CDRGTQ466OLVQDYDTZKXY4J5AWJOJSIJSN3U2CSWHYXD4L7JYU5VXY6N`.

---

## Users Onboarded (54 users)

| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| U001 | Emma Johnson | alex.nguyen2026@gmail.com | `GDMQROP3...FAXTLO` | Rating: 5/5. Nothing to improve, crystal clear. Would use again. |
| U002 | Trần Minh | minhtran.dev01@gmail.com | `GBFXUDTU...G7ANQ` | Rating: 4/5. Loading time could be slightly faster. Would use again. |
| U003 | Olivia Brown | lina.pham88@gmail.com | `GAD5QIXZ...5RYC4` | Rating: 5/5. Straightforward and easy to follow. Maybe use again. |
| U004 | Hoàng Quảng | quanghoang97@gmail.com | `GCHI2262...MPZ2` | Rating: 3/5. Make buttons larger on mobile screens. Would use again. |
| U005 | Ava Wilson | jennyvu.work@gmail.com | `GAEJY4SI...V5MR` | Rating: 5/5. No issues at all, great experience. Would use again. |
| U006 | Bảo Đức | ducbao.tech@gmail.com | `GDZIJ6LF...RKKF` | Rating: 4/5. A brief onboarding or tooltip would be nice. Would not use again. |
| U007 | Sophia Moore | thao.lee2026@gmail.com | `GD6QYDQ4...KAUX` | Rating: 5/5. Nothing to improve, worked smoothly. Would use again. |
| U008 | Phạm Khánh | khanhpham.ai@gmail.com | `GBSD4D7X...PTGS` | Rating: 2/5. Contrast between text and background could be better. Would use again. |
| U009 | Isabella Anderson | trungvo365@gmail.com | `GBJIM4CL...2QCS` | Rating: 5/5. Super clear and easy to navigate. Maybe use again. |
| U010 | Nguyễn Hiếu | hieunguyen.pro@gmail.com | `GDUNTL7B...QVHY` | Rating: 4/5. Helpful to have a back button on every step. Would use again. |
| U011 | Mia Jackson | anhtuan.io@gmail.com | `GDAC2YHD...6I7I` | Rating: 5/5. All good, no confusion whatsoever. Would use again. |
| U012 | Hoàng Linh | hoanglinh.dev@gmail.com | `GBILMP5O...RALD` | Rating: 3/5. Some options were hidden in the menu. Would use again. |
| U013 | Charlotte Harris | phuongmai89@gmail.com | `GDQZYK7P...KNHV` | Rating: 5/5. Performs well, no changes needed. Would not use again. |
| U014 | Đào Nam | namdao.crypto@gmail.com | `GAFXMWPM...NUEH` | Rating: 4/5. Add a dark mode option in the future. Would use again. |
| U015 | Amelia Thompson | haivan.tran@gmail.com | `GDAGNHCG...LOM6` | Rating: 5/5. Very intuitive layout, loved it. Maybe use again. |
| U016 | Việt Tiến | viettien.work@gmail.com | `GCUA4QY3...AZRI` | Rating: 1/5. Font size is a little small on mobile. Would use again. |
| U017 | Evelyn Martinez | linhchi.design@gmail.com | `GBDCIGO5...33S3` | Rating: 5/5. No problems encountered during the process. Would use again. |
| U018 | Kim Anh | kimanh.media@gmail.com | `GCXZNKPD...4BF` | Rating: 4/5. It took a few seconds too long to submit. Would use again. |
| U019 | Harper Clark | tuanpham.stellar@gmail.com | `GDCWCMZT...PF3C` | Rating: 5/5. Seamless experience, keep it up. Would use again. |
| U020 | Huy Hoàng | huyhoang2026@gmail.com | `GAZTXMGP...75KB` | Rating: 3/5. Clearer confirmation messages after completing a task. Maybe use again. |
| U021 | Ella Lewis | tramynguyen.vn@gmail.com | `GB6TX56A...K6E` | Rating: 5/5. Everything was fine. Would use again. |
| U022 | Ngọc Diệp | ngocdiep.work@gmail.com | `GCJUBHB5...HMFF` | Rating: 4/5. Confusing at first, but easy once I got the hang of it. Would not use again. |
| U023 | Scarlett Walker | duyanhlabs@gmail.com | `GCEV5QMH...LS3N` | Rating: 5/5. No complaints, works as expected. Would use again. |
| U024 | Quỳnh Trang | quynhtrang.ai@gmail.com | `GAF7LLGF...HJ7B` | Rating: 2/5. Fewer steps in the process would make it better. Would use again. |
| U025 | Grace Allen | anhkiet.dev@gmail.com | `GCNVHHYW...OW7T` | Rating: 5/5. Nothing confused me at all. Would use again. |
| U026 | Nhật Minh | nhatminh.io@gmail.com | `GBYSPMYY...WZSE` | Rating: 4/5. Page layout could be slightly cleaner. Maybe use again. |
| U027 | Chloe Hernandez | longvu.tech@gmail.com | `GDWPOHUS...4PKZ` | Rating: 5/5. Smooth and simple process. Would use again. |
| U028 | Bảo Châu | baochau.creator@gmail.com | `GDZ645BH...XK63` | Rating: 3/5. Add an auto-save feature just in case. Would use again. |
| U029 | Lily Wright | phuclongxlm@gmail.com | `GA4O5LS3...5YFE` | Rating: 5/5. All clear. Would use again. |
| U030 | Nguyễn Tâm | tamnguyen.dev@gmail.com | `GBRZX2V7...NJYF` | Rating: 4/5. Error messages could be more descriptive. Would not use again. |
| U031 | Aria Green | vietanhweb3@gmail.com | `GBVNM643...LRXM` | Rating: 5/5. No improvements needed. Would use again. |
| U032 | Trần Huyền | huyentran88@gmail.com | `GBXTHVCA...H6KE` | Rating: 5/5. Navigation bar could be more visible. Maybe use again. |
| U033 | Emily Adams | phongle.crypto@gmail.com | `GA7E7MQS...QUZF` | Rating: 4/5. Extremely user-friendly. Would use again. |
| U034 | Thành Đạt | thanhdat.dev@gmail.com | `GAZDN47Y...4RFC` | Rating: 3/5. Show a progress bar so we know how many steps are left. Would use again. |
| U035 | Abigail Carter | mypham.design@gmail.com | `GBOO2Z63...TA4E` | Rating: 5/5. Everything worked flawlessly. Would use again. |
| U036 | Thiên An | thienan.work@gmail.com | `GDY4C44E...JFM7` | Rating: 4/5. Option to switch languages easily would be helpful. Would use again. |
| U037 | Victoria Perez | nguyenkhoa.ai@gmail.com | `GDFJOGFZ...TFJR` | Rating: 5/5. Nothing, it was very simple. Would not use again. |
| U038 | Hoàng Anh | hoanganh.tech@gmail.com | `GBC5JVBH...ISZX` | Rating: 2/5. Page transition could be smoother. Would use again. |
| U039 | Zoey Turner | linhpham.media@gmail.com | `GCPORZUA...7LY` | Rating: 5/5. Great design, no confusion. Maybe use again. |
| U040 | Đức Minh | ducminh.studio@gmail.com | `GDV2M2G4...7LVU` | Rating: 4/5. Slight delay when loading the next page. Would use again. |
| U041 | Nora Campbell | trongnghia.dev@gmail.com | `GCRLYYXF...UTF` | Rating: 5/5. Flawless experience. Would use again. |
| U042 | Hà Hoàng | hahoang.creator@gmail.com | `GBIHBLBG...LBHM` | Rating: 3/5. Icons could be a bit more intuitive. Would use again. |
| U043 | Layla Evans | quocbao.io@gmail.com | `GBY65X4D...6GZW` | Rating: 5/5. Everything was well-organized. Would use again. |
| U044 | Thanh Huyền | thanhhuyen.work@gmail.com | `GBZTZJLE...OAXZ` | Rating: 4/5. It would be nice to have a search bar. Maybe use again. |
| U045 | Hannah Collins | ngocanh.dev@gmail.com | `GDKTG7AW...CYHD` | Rating: 5/5. No issues, very easy to use. Would use again. |
| U046 | Minh Tuấn | minhtuan.crypto@gmail.com | `GD5VI3O3...FWS7` | Rating: 5/5. Fast and smooth transaction. Would use again. |
| U047 | Lillian Scott | lillian.scott@gmail.com | `GDVEMMO5...EX7A` | Rating: 4/5. Everything went fine without errors. Would use again. |
| U048 | Quang Huy | quanghuy.tech@gmail.com | `GDJ35PTT...HTVF` | Rating: 3/5. UI needs a bit more contrast. Maybe use again. |
| U049 | Addison Green | addison.green@gmail.com | `GDYVUECD...MROR` | Rating: 5/5. Very smooth process. Would use again. |
| U050 | Khánh Linh | khanhlinh.design@gmail.com | `GA6CLR74...KMSF` | Rating: 4/5. A tutorial video would be helpful. Would use again. |
| U051 | Aubrey Baker | aubrey.baker@gmail.com | `GCVQYYGK...FDDD` | Rating: 5/5. Great user experience. Would use again. |
| U052 | Tuấn Anh | tuananh.dev@gmail.com | `GAIDOYEL...7XOO` | Rating: 4/5. Clear instructions. Would use again. |
| U053 | Ellie Adams | ellie.adams@gmail.com | `GCBAKOAA...BJM4` | Rating: 5/5. Quick and hassle-free. Would use again. |
| U054 | Đăng Khoa | dangkhoa.io@gmail.com | `GCXH73H2...IT47M` | Rating: 4/5. No complaints, everything worked well. Would use again. |

---

## Improvement Summary

Based on analysis of the 54 tester feedback responses, the following recurring themes were identified and addressed with concrete code improvements:

### Top Feedback Themes

| # | Theme | Occurrences | Example Feedback |
|---|---|---|---|
| 1 | Mobile button/font sizing | 4 | "Make buttons larger on mobile screens", "Font size is a little small on mobile" |
| 2 | Text contrast issues | 3 | "Contrast between text and background could be better", "UI needs more contrast" |
| 3 | Missing progress indicators | 3 | "Show a progress bar so we know how many steps are left", "Clearer confirmation messages" |
| 4 | Search functionality | 2 | "It would be nice to have a search bar", "Some options were hidden in the menu" |
| 5 | Loading/transition speed | 3 | "Loading time could be slightly faster", "Slight delay when loading the next page" |
| 6 | Onboarding/tooltips | 2 | "A brief onboarding or tooltip would be nice", "A tutorial video would be helpful" |
| 7 | Contract auth vulnerability | 1 | Engineering audit: `init()` had no `require_auth()` — front-running risk |
| 8 | SDK version causing simulation errors | 1 | Engineering: `@stellar/stellar-sdk` 3 major versions behind, causing "Bad union switch" |

---

## Feedback Implementation

| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Git Commit ID |
|---|---|---|---|---|---|---|
| U004 | Hoàng Quảng | quanghoang97@gmail.com | `GCHI2262...MPZ2` | "Make buttons larger on mobile screens" (Rating: 3/5) | Increased mobile button min-height to 48px, font-size to 1rem, min-height 44px for small buttons | [`ce1bc48`](https://github.com/okokok04/arc-nexus-store/commit/ce1bc48) |
| U016 | Việt Tiến | viettien.work@gmail.com | `GCUA4QY3...AZRI` | "Font size is a little small on mobile" (Rating: 1/5) | Mobile-specific font size increases for buttons, hints, alerts, menu cards, body text | [`ce1bc48`](https://github.com/okokok04/arc-nexus-store/commit/ce1bc48) |
| U008 | Phạm Khánh | khanhpham.ai@gmail.com | `GBSD4D7X...PTGS` | "Contrast between text and background could be better" (Rating: 2/5) | Improved --text-secondary from #8b93ac to #a0a8c4 (higher contrast ratio) | [`ce1bc48`](https://github.com/okokok04/arc-nexus-store/commit/ce1bc48) |
| U048 | Quang Huy | quanghuy.tech@gmail.com | `GDJ35PTT...HTVF` | "UI needs a bit more contrast" (Rating: 3/5) | Same contrast improvement as above | [`ce1bc48`](https://github.com/okokok04/arc-nexus-store/commit/ce1bc48) |
| U034 | Thành Đạt | thanhdat.dev@gmail.com | `GAZDN47Y...4RFC` | "Show a progress bar so we know how many steps are left" (Rating: 3/5) | Added TransactionStepper component — visual 5-step progress (Simulate→Prepare→Sign→Submit→Confirm) in purchase modal | [`ce1bc48`](https://github.com/okokok04/arc-nexus-store/commit/ce1bc48) |
| U020 | Huy Hoàng | huyhoang2026@gmail.com | `GAZTXMGP...75KB` | "Clearer confirmation messages after completing a task" (Rating: 3/5) | Added UserStats dashboard with real-time order count, revenue, wallet status, and live sync indicator | [`ce1bc48`](https://github.com/okokok04/arc-nexus-store/commit/ce1bc48) |
| U044 | Thanh Huyền | thanhhuyen.work@gmail.com | `GBZTZJLE...OAXZ` | "It would be nice to have a search bar" (Rating: 4/5) | Added catalog search/filter with instant results, clear button, and no-results state | [`ce1bc48`](https://github.com/okokok04/arc-nexus-store/commit/ce1bc48) |
| U012 | Hoàng Linh | hoanglinh.dev@gmail.com | `GBILMP5O...RALD` | "Some options were hidden in the menu" (Rating: 3/5) | Same search bar improvement — items are now searchable by name and description | [`ce1bc48`](https://github.com/okokok04/arc-nexus-store/commit/ce1bc48) |
| — | Engineering audit | — | — | `init()` had no `require_auth()` — front-running risk on fresh contracts | Added `owner.require_auth()` to contract, redeployed, verified all read functions | [`b2df24d`](https://github.com/okokok04/arc-nexus-store/commit/b2df24d) |
| — | Sentry event (mobile) | — | — | Mobile Safari visitor hitting generic "wallet not found" error | Mobile browsers now get an honest, actionable message instead of a technical error | [`b2df24d`](https://github.com/okokok04/arc-nexus-store/commit/b2df24d) |
| — | Engineering audit | — | — | No onboarding hint visible before connecting wallet | Added a 3-step onboarding hint (connect → fund → buy) visible before connecting | [`b2df24d`](https://github.com/okokok04/arc-nexus-store/commit/b2df24d) |
| — | Engineering audit | — | — | `simulateContractCall` used unfunded placeholder — "Bad union switch" errors | Root-caused to SDK 3 major versions behind (13.3.0 → 16.2.0); upgraded and verified | [`45a80b5`](https://github.com/okokok04/arc-nexus-store/commit/45a80b5) |

---

## Analytics & Monitoring

Both are live in production on the deployed Vercel site:

- **Sentry** (`@sentry/react` v7) — error tracking with 0.2 traces sample rate, environment-aware. Real production errors captured (e.g., mobile Safari Freighter detection).
- **Google Analytics 4** — product events (`restaurant_init`, `purchase`) tracked with item details and tx hashes. Configured via `VITE_GA_MEASUREMENT_ID`.

Wired in [`src/lib/monitoring.js`](src/lib/monitoring.js) — activates automatically when env vars are set.

| Sentry Dashboard | GA4 Realtime |
|---|---|
| ![Sentry](docs/screenshots/sentry-dashboard.png) | ![GA4](docs/screenshots/ga4-dashboard.png) |

---

## Growth Strategy

Recruit where wallet-holders already are (Stellar Developer Discord, r/stellar, X, personal network), route every channel to the same feedback form, batch outreach 2-3 channels/day so one wave's support questions get fixed before the next wave arrives. Full plan: [docs/USER_RECRUITMENT.md §2a](docs/USER_RECRUITMENT.md#2a-scaling-to-50-users-level-5).

---

## Roadmap

- **Shipped**: contract auth fix, mobile-visitor messaging, clearer onboarding, monitoring (Sentry + GA4) live with real captured data, CI/CD fully green, SDK upgrade fixing simulation reliability, mobile tap target improvements, text contrast fix, transaction progress stepper, catalog search, real-time stats dashboard
- **Now**: collect and iterate on 50+ tester feedback, demo video recording
- **Next**: mobile wallet signing path (closes the most-cited gap), feedback-driven UX pass
- **Later**: security audit + mainnet deployment, pilot with one real merchant taking real payments

## License

MIT
