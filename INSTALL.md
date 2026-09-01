# Installation & Running

## Prerequisites

- **Node.js ≥ 18** (tested on Node 20)
- npm (comes with Node)

## Step-by-step

### 1. Install dependencies

```bash
npm install
```

This installs React, Vite, React Router, @hello-pangea/dnd, Plus Jakarta Sans (self-hosted font), and all dev tooling. No postinstall scripts run — the install is fast and exits cleanly.

### 2. Start the dev server

```bash
npm run dev
```

Vite starts on `0.0.0.0:5173`. Open the URL printed in the terminal.

On first load the app detects an empty localStorage store and seeds 11 realistic demo tasks across all three columns. Subsequent reloads use your saved data.

### 3. Production build (optional)

```bash
npm run build
```

Output goes to `dist/`. Serve with `npm run preview`.

## No .env required

The app needs zero configuration. An `.env.example` file is provided for reference; it's empty because the app is fully self-contained.
