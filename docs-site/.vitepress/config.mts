import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Arc Nexus Store',
  description: 'Docs for Arc Nexus Store — a Soroban-powered restaurant/store payment dApp on Stellar.',
  lang: 'en-US',
  appearance: 'force-dark',
  lastUpdated: true,
  cleanUrls: true,
  srcExclude: ['README.md'],

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
      },
    ],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#00f2ff' }],
    ['meta', { property: 'og:title', content: 'Arc Nexus Store — Docs' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Soroban-powered restaurant/store payments on Stellar — architecture, contract API, deployment & growth docs.',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
  ],

  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo.svg' },
    siteTitle: 'Arc Nexus Store',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Integration', link: '/integration/frontend-integration' },
      { text: 'Deploy', link: '/deploy/testnet-deployment' },
      { text: 'Product', link: '/product/roadmap' },
      {
        text: 'Live Demo ↗',
        link: 'https://arc-restaurant-git.vercel.app/',
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        collapsed: false,
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Architecture', link: '/guide/architecture' },
          { text: 'Smart Contract', link: '/guide/smart-contract' },
        ],
      },
      {
        text: 'Integration',
        collapsed: false,
        items: [
          { text: 'Frontend ↔ Contract', link: '/integration/frontend-integration' },
          { text: 'Error Handling', link: '/integration/error-handling' },
          { text: 'Testing', link: '/integration/testing' },
        ],
      },
      {
        text: 'Deployment',
        collapsed: false,
        items: [
          { text: 'Testnet Deployment', link: '/deploy/testnet-deployment' },
          { text: 'Manual Deploy', link: '/deploy/manual-deploy' },
          { text: 'Environment Variables', link: '/reference/environment-variables' },
        ],
      },
      {
        text: 'Product & Growth',
        collapsed: false,
        items: [
          { text: 'Demo Script', link: '/product/demo-script' },
          { text: 'User Onboarding Form', link: '/product/onboarding-form' },
          { text: 'Growth & Recruitment', link: '/product/growth' },
          { text: 'Roadmap & Iteration Log', link: '/product/roadmap' },
        ],
      },
      {
        text: 'Reference',
        collapsed: false,
        items: [
          { text: 'Submission Checklist', link: '/reference/submission-checklist' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/okokok04/arc-nexus-store' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Soroban-powered restaurant payments on Stellar — no backend, no custodian.',
      copyright: 'MIT License — Arc Nexus Store',
    },

    outline: {
      level: [2, 3],
    },
  },
})
