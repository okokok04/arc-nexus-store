<script setup>
const CONTRACT_ID = 'CDRGTQ466OLVQDYDTZKXY4J5AWJOJSIJSN3U2CSWHYXD4L7JYU5VXY6N'
const short = CONTRACT_ID.slice(0, 6) + '…' + CONTRACT_ID.slice(-6)

const features = [
  { icon: '🔌', title: 'Wallet-native', desc: 'Freighter connect/disconnect with network + account checks before every signature — no email, no password.' },
  { icon: '⛓️', title: 'Real on-chain calls', desc: '`init` and `pay` are built, simulated, signed, and submitted via the Stellar SDK — never mocked.' },
  { icon: '🚰', title: 'One-click funding', desc: 'Testnet auto-funding via Friendbot, with a Stellar Laboratory fallback if the API is rate-limited.' },
  { icon: '📡', title: 'Live event stream', desc: 'Polls Soroban RPC `getEvents` for `init` / `pay` contract events in real time — straight from the ledger.' },
  { icon: '🛰️', title: 'Actually monitored', desc: 'Sentry error tracking + GA4 analytics wired in, activating automatically once DSN/measurement ID are set.' },
  { icon: '📱', title: 'Mobile responsive', desc: 'Single-column layout below 640px — though wallet signing itself still needs a desktop browser extension.' },
]

const steps = ['Connect Freighter', 'Fund testnet account', 'Buy a menu item', 'Confirm on-chain']
</script>

<template>
  <div class="anx-hero">
    <div class="anx-hero-glow" aria-hidden="true" />

    <div class="anx-eyebrow">
      <span class="anx-dot" />
      Testnet · live contract
    </div>

    <h1 class="anx-title">Arc Nexus Store</h1>
    <p class="anx-tagline">
      A Soroban-powered restaurant/store payment dApp on Stellar.
      Connect a wallet, the contract <em>is</em> the payment processor —
      no backend, no custodian, settles in ~5 seconds.
    </p>

    <div class="anx-cta-row">
      <a class="anx-btn anx-btn-primary" href="https://arc-restaurant-git.vercel.app/" target="_blank" rel="noreferrer">
        Try the live demo ↗
      </a>
      <a class="anx-btn anx-btn-secondary" href="/guide/introduction">Read the docs</a>
      <a class="anx-btn anx-btn-ghost" href="https://github.com/okokok04/arc-nexus-store" target="_blank" rel="noreferrer">
        View source ↗
      </a>
    </div>

    <div class="anx-info-card">
      <div class="anx-info-item">
        <span class="anx-info-label">Network</span>
        <span class="anx-badge">TESTNET</span>
      </div>
      <div class="anx-info-item">
        <span class="anx-info-label">Contract</span>
        <code class="anx-mono">{{ short }}</code>
      </div>
      <div class="anx-info-item">
        <span class="anx-info-label">Contract tests</span>
        <span class="anx-badge anx-badge-ok">4 / 4 passing</span>
      </div>
      <div class="anx-info-item">
        <span class="anx-info-label">Stack</span>
        <span class="anx-info-value">React · Soroban · Rust</span>
      </div>
    </div>

    <div class="anx-steps">
      <template v-for="(s, i) in steps" :key="s">
        <span class="anx-step">{{ s }}</span>
        <span v-if="i < steps.length - 1" class="anx-step-arrow">→</span>
      </template>
    </div>

    <div class="anx-feature-grid">
      <div v-for="f in features" :key="f.title" class="anx-feature-card">
        <div class="anx-feature-icon">{{ f.icon }}</div>
        <h3>{{ f.title }}</h3>
        <p v-html="f.desc" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.anx-hero {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 4.5rem 1.5rem 3rem;
  text-align: center;
}

.anx-hero-glow {
  position: absolute;
  inset: -10% -10% auto -10%;
  height: 420px;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(circle at 20% 10%, rgba(0, 242, 255, 0.16), transparent 45%),
    radial-gradient(circle at 82% 25%, rgba(168, 85, 247, 0.18), transparent 50%);
  filter: blur(10px);
}

.anx-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(0, 242, 255, 0.08);
  border: 1px solid rgba(0, 242, 255, 0.3);
  color: #7fe9f0;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-family: 'Inter', system-ui, sans-serif;
}

.anx-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2ee68a;
  box-shadow: 0 0 8px #2ee68a;
  animation: anx-pulse 2s ease-in-out infinite;
}

@keyframes anx-pulse {
  0%, 100% { box-shadow: 0 0 6px #2ee68a; }
  50% { box-shadow: 0 0 14px #2ee68a, 0 0 4px #2ee68a; }
}

.anx-title {
  margin: 1.25rem 0 0.75rem;
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.05;
  background: linear-gradient(120deg, #00f2ff, #a855f7, #00f2ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: anx-shift 6s ease-in-out infinite;
}

@keyframes anx-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.anx-tagline {
  max-width: 640px;
  margin: 0 auto;
  color: var(--vp-c-text-2);
  font-size: 1.08rem;
  line-height: 1.6;
}

.anx-cta-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin: 2rem 0;
}

.anx-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.35rem;
  border-radius: 0.8rem;
  font-weight: 600;
  font-size: 0.92rem;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.15s ease, border-color 0.15s ease;
}

.anx-btn-primary {
  background: linear-gradient(135deg, #00f2ff, #00c2d4);
  color: #031014;
  box-shadow: 0 4px 24px -6px rgba(0, 242, 255, 0.55);
}

.anx-btn-primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
  box-shadow: 0 6px 30px -4px rgba(0, 242, 255, 0.75);
}

.anx-btn-secondary {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.anx-btn-secondary:hover {
  border-color: #00f2ff;
  background: rgba(0, 242, 255, 0.08);
  transform: translateY(-1px);
}

.anx-btn-ghost {
  color: var(--vp-c-text-2);
}

.anx-btn-ghost:hover {
  color: var(--vp-c-text-1);
}

.anx-info-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(18, 20, 31, 0.75), rgba(18, 20, 31, 0.4));
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(10px);
  text-align: left;
  margin-bottom: 2.25rem;
}

.anx-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.anx-info-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
}

.anx-info-value {
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.anx-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  color: #7fe9f0;
  background: none;
  padding: 0;
}

.anx-badge {
  display: inline-flex;
  align-self: flex-start;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(0, 242, 255, 0.1);
  color: #7fe9f0;
  border: 1px solid rgba(0, 242, 255, 0.35);
}

.anx-badge-ok {
  background: rgba(46, 230, 138, 0.12);
  color: #7cf0b6;
  border-color: rgba(46, 230, 138, 0.4);
}

.anx-steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 3rem;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.anx-step {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px dashed var(--vp-c-divider);
  white-space: nowrap;
}

.anx-step-arrow {
  color: #00f2ff;
  opacity: 0.7;
}

.anx-feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  text-align: left;
}

.anx-feature-card {
  padding: 1.35rem;
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(18, 20, 31, 0.7), rgba(18, 20, 31, 0.35));
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.anx-feature-card:hover {
  border-color: rgba(0, 242, 255, 0.35);
  transform: translateY(-2px);
}

.anx-feature-icon {
  font-size: 1.6rem;
  margin-bottom: 0.6rem;
}

.anx-feature-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  margin: 0 0 0.4rem;
  color: var(--vp-c-text-1);
}

.anx-feature-card p {
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  margin: 0;
}

.anx-feature-card :deep(code) {
  background: rgba(0, 242, 255, 0.1);
  color: #7fe9f0;
  padding: 0.1rem 0.35rem;
  border-radius: 0.4rem;
  font-size: 0.82rem;
}

@media (max-width: 640px) {
  .anx-info-card {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
