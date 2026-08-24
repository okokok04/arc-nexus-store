# Arc Nexus Store — Docs

Documentation site for [Arc Nexus Store](../README.md), built with
[VitePress](https://vitepress.dev). Separate `package.json`/`node_modules` from the main
dApp on purpose, so the docs toolchain never touches the app's Vite/Tailwind setup.

## Develop

```bash
npm install       # from this directory, or `npm run docs:install` from the repo root
npm run dev        # or `npm run docs:dev` from the repo root
```

## Build

```bash
npm run build      # or `npm run docs:build` from the repo root
npm run preview     # serve the built output locally
```

Output goes to `.vitepress/dist`.

## Deploy

Any static host works. For Vercel specifically, create a **separate** project rooted at
`docs-site/` (Project Settings → Root Directory):

- Framework preset: **Other** (or VitePress, if offered)
- Build command: `npm run build`
- Output directory: `.vitepress/dist`

## Structure

```text
.vitepress/
  config.mts       nav, sidebar, search, site metadata
  theme/           dark aurora/glass theme matching the app's own brand (src/index.css)
guide/              product overview, setup, architecture, contract API
integration/       frontend <-> contract wiring, error handling, testing
deploy/             testnet deployment, manual deploy
product/           demo script, onboarding form, growth, roadmap
reference/          environment variables, submission checklist
public/             favicon, logo, screenshots
```
