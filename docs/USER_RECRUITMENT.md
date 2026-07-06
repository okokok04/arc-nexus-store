# PHASE 4: User Recruitment, Monitoring & Analytics Setup

## 🎯 Objectives

1. ✅ Setup Sentry error tracking
2. ✅ Configure Google Analytics 4
3. ✅ Recruit 10+ testnet users
4. ✅ Monitor user transactions
5. ✅ Collect feedback & testimonials
6. ✅ Prepare for demo video

---

## 📊 Part 1: Monitoring & Analytics Setup

### 1.1 Sentry Error Tracking

#### Create Sentry Account
1. Go to [sentry.io](https://sentry.io)
2. Sign up with GitHub (recommended)
3. Create new project: **Stellar Escrow**
4. Select **React** platform
5. Copy your DSN (Data Source Name)

#### Installation

```bash
npm install @sentry/react @sentry/tracing
```

#### Configure Sentry

Create `src/config/sentry.ts`:

```typescript
import * as Sentry from '@sentry/react'

export function initSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
    integrations: [new Sentry.Replay()],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}
```

#### Update main.tsx

```typescript
import { initSentry } from '@/config/sentry'

initSentry()

ReactDOM.createRoot(document.getElementById('root')!)
  .render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
```

#### Usage in Components

```typescript
import * as Sentry from '@sentry/react'

// Error boundary
export const ErrorBoundary = Sentry.withErrorBoundary(YourComponent, {
  fallback: <ErrorFallback />,
  showDialog: true,
})

// Manual error capture
try {
  // risky operation
} catch (error) {
  Sentry.captureException(error)
}

// Track user interactions
Sentry.captureMessage('User created escrow', 'info')
```

#### .env.local

```env
VITE_SENTRY_DSN=https://YOUR_KEY@sentry.io/PROJECT_ID
```

---

### 1.2 Google Analytics 4 Setup

#### Create Google Analytics Account
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create new property: **Stellar Escrow**
3. Setup web stream for your domain
4. Copy **Measurement ID** (G-XXXXXXXXXX)

#### Installation

```bash
npm install @react-google-analytics/core gtag
```

#### Configure GA4

Create `src/config/analytics.ts`:

```typescript
export function initGoogleAnalytics() {
  const measurementId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID

  // Load gtag script
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.async = true
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', measurementId, {
    page_path: window.location.pathname,
  })

  return gtag
}
```

#### Track Events

```typescript
// Custom event tracking
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams)
  }
}

// Usage in components
trackEvent('escrow_created', {
  amount: 1000,
  token: 'XLM',
  currency: 'USD',
})

trackEvent('payment_released', {
  buyer: 'user123',
  seller: 'user456',
  amount: 1000,
})
```

#### Update main.tsx

```typescript
import { initGoogleAnalytics } from '@/config/analytics'

initGoogleAnalytics()
```

#### .env.local

```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

### 1.3 Custom Event Tracking

Create `src/hooks/useTracking.ts`:

```typescript
import { useEffect } from 'react'

export function useTracking(eventName: string, properties?: Record<string, any>) {
  useEffect(() => {
    // Track in Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, properties)
    }

    // Track in Sentry
    import('@sentry/react').then((Sentry) => {
      Sentry.captureMessage(`Event: ${eventName}`, 'info')
    })

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`📊 Event tracked: ${eventName}`, properties)
    }
  }, [eventName, properties])
}
```

---

## 👥 Part 2: User Recruitment Strategy

### 2.1 Target Communities

#### Discord Servers
- **Stellar Developer Community**
  - Server: https://discord.gg/stellardev
  - Channel: #projects or #showcase
  - Message template:
    ```
    🚀 Introducing Stellar Escrow - Secure P2P Transactions
    
    Hey! I've built a decentralized escrow platform on Stellar Soroban.
    Looking for testnet users to help test and provide feedback.
    
    Features:
    ✅ Secure escrow agreements
    ✅ Freighter wallet integration
    ✅ Real-time payment release
    ✅ Dispute resolution
    
    Get started: [link]
    Earn feedback rewards! 🎁
    
    Questions? Reply here or DM me
    ```

- **Stellar Community Foundation**
- **Cryptocurrency subreddits**
- **Web3 Discord networks**

#### Reddit Communities
- **r/stellar** - Main Stellar subreddit
  - Post: "Seeking beta testers for Stellar Escrow MVP"
  - Offer feedback rewards
  
- **r/cryptocurrency** - Broader crypto audience
- **r/Bitcoin** - Store of value use case
- **r/freelance** - Target gig workers

#### Twitter/X Outreach
- Tweet announcing testnet launch
- Tag @StellarOrg, @SorobanOrg
- Ask for retweets from dev community
- Share demo video when ready

#### Product Hunt
- Create Product Hunt post
- Target crypto & developer category
- Ask for votes and feedback

---

### 2.2 User Onboarding Flow

#### Step 1: Wallet Setup
```
User visits website
↓
Clicks "Connect Wallet"
↓
Installs Freighter (if needed)
↓
Creates/imports Stellar account
↓
Gets testnet XLM from friendbot
```

#### Step 2: First Transaction
```
Create escrow (as buyer)
↓
Fund escrow with testnet XLM
↓
Share with friend/seller
↓
Friend confirms delivery
↓
Payment released ✅
```

#### Step 3: Feedback Collection

Create feedback form at `/feedback`:

```typescript
// Create src/pages/FeedbackPage.tsx
export default function FeedbackPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Feedback Matters! 🙏</h1>
      
      <form className="space-y-6">
        <div>
          <label>How easy was it to use Stellar Escrow?</label>
          <select>
            <option>Very Easy (5 stars)</option>
            <option>Easy (4 stars)</option>
            <option>Neutral (3 stars)</option>
            <option>Difficult (2 stars)</option>
            <option>Very Difficult (1 star)</option>
          </select>
        </div>

        <div>
          <label>What was the biggest challenge?</label>
          <textarea placeholder="Tell us..."></textarea>
        </div>

        <div>
          <label>Would you use this again?</label>
          <div>
            <input type="radio" name="recommend" value="yes" /> Yes
            <input type="radio" name="recommend" value="maybe" /> Maybe
            <input type="radio" name="recommend" value="no" /> No
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Feedback
        </button>
      </form>
    </div>
  )
}
```

---

### 2.3 Incentive Program (Optional)

| Tier | Users | Reward | Conditions |
|------|-------|--------|-----------|
| **Alpha Tester** | First 3 | $50 USDC | Complete 3+ escrows |
| **Beta Tester** | Next 7 | $25 USDC | Complete 2+ escrows + feedback |
| **Community** | 10+ | Recognition | Mention in README + Discord |

---

## 📹 Part 3: Demo Video Preparation

### 3.1 Demo Script

**Duration**: 3-5 minutes

```
[0:00-0:15] Intro
- Title: "Stellar Escrow - Secure P2P Transactions"
- Show key features on screen

[0:15-0:45] Setup
- Show wallet connection
- Display account balance

[0:45-2:00] Create Escrow
- Fill out form (buyer, seller, amount, description)
- Submit form
- Show confirmation

[2:00-3:00] Deposit & Confirm
- Buyer deposits funds
- Confirmation screen
- Show loading states

[3:00-4:00] Complete Transaction
- Seller confirms delivery
- Payment released
- Show success message + event logs

[4:00-4:30] Key Points
- Highlight security features
- Mention 1% fee
- Show transaction history

[4:30-5:00] Call to Action
- Link to live app
- GitHub repo
- Feedback form
```

### 3.2 Recording Setup

**Tools**:
- OBS Studio (free screen recorder)
- or ScreenFlow (Mac)
- or Camtasia (paid, professional)

**Settings**:
- Resolution: 1920x1080
- Framerate: 30-60 FPS
- Bitrate: 5000+ kbps
- Audio: Clear microphone

**Steps**:
1. Open application in clean browser
2. Create new recording
3. Follow demo script
4. Record wallet interactions (may need testnet setup)
5. Edit video:
   - Add intro/outro
   - Add captions
   - Add background music
   - Color grade if needed

### 3.3 Video Publishing

**Platforms**:
1. **YouTube**
   - Upload with description & links
   - Tag: #StellarEscrow #Soroban #Web3
   - Add to README

2. **Twitter/X**
   - Tweet with video embed
   - Include demo link

3. **Reddit**
   - Post to r/stellar with video
   - Ask for feedback

4. **Product Hunt**
   - Embed in Product Hunt post

---

## 📈 Monitoring Dashboard

### 3.1 Track These Metrics

```
User Metrics:
- Total users (Sentry)
- Daily active users (GA4)
- User retention rate
- Geographic distribution

Transaction Metrics:
- Total escrows created
- Total volume (XLM)
- Average transaction size
- Completion rate

Error Metrics:
- Error rate (Sentry)
- Most common errors
- User impact
- Resolution time

Engagement Metrics:
- Average session duration
- Pages per session
- Bounce rate
- Feedback submission rate
```

### 3.2 Create Analytics Dashboard

**Google Analytics Custom Dashboard**:
1. Go to Analytics → Dashboards
2. Create new dashboard
3. Add cards for:
   - User count
   - Transaction events
   - Error count
   - Unique users by country

**Sentry Dashboard**:
1. Go to Sentry → Issues
2. Filter by project
3. Monitor for:
   - New issues
   - Error rate spikes
   - Performance degradation

---

## 🎯 User Recruitment Checklist

- [ ] Discord servers identified (5+)
- [ ] Reddit communities list (3+)
- [ ] Twitter draft ready
- [ ] Product Hunt account created
- [ ] Feedback form deployed
- [ ] Analytics tracking active
- [ ] Error monitoring active
- [ ] First 3 users recruited
- [ ] Testnet escrows completed (3+)
- [ ] Feedback collected
- [ ] Issues documented

---

## 📋 Success Criteria for PHASE 4

| Metric | Target | Status |
|--------|--------|--------|
| Sentry configured | ✅ | Deploy & setup |
| GA4 configured | ✅ | Deploy & setup |
| Users recruited | 10+ | Ongoing |
| Escrows tested | 20+ | Track in GA4 |
| Feedback forms | 5+ | Document |
| Demo video | Ready | Record & edit |
| Issues documented | <5 critical | Monitor Sentry |

---

## 🔗 Resources

### Community Channels
- [Stellar Discord](https://discord.gg/stellardev)
- [r/stellar](https://reddit.com/r/stellar)
- [Twitter @StellarOrg](https://twitter.com/stellar)

### Analytics Platforms
- [Sentry](https://sentry.io)
- [Google Analytics](https://analytics.google.com)

### Video Tools
- [OBS Studio](https://obsproject.com) (Free)
- [ScreenFlow](https://www.telestream.net/screenflow) (Mac)
- [Camtasia](https://www.camtasiastore.com) (Paid)

---

**Next**: PHASE 5 - Production Deployment & Final Submission

---

*Last Updated: 2026-07-06*
