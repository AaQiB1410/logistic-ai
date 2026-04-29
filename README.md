# LogisticAI — Global Risk Intelligence Platform

AI-powered decision support for cold chain, pharmaceuticals, and temperature-sensitive cargo logistics.

## Hackathon MVP — Feature Overview

### Pages
- **Landing Page** — Hero section, feature grid, stats, CTA
- **Fleet Dashboard** — Container tracking cards with risk gauges, temperature bars, filter tabs
- **Container Detail** — Full telemetry, environmental data, AI recommendations
- **Live Alerts** — Real-time alert feed with risk ranking sidebar
- **AI Assistant** — Claude-powered chatbot with full fleet awareness

### Tech Stack
- React 18 + Vite
- Pure CSS (no Tailwind dependency — custom design system in `src/index.css`)
- Anthropic Claude API (claude-sonnet-4-20250514) for the AI Assistant
- Mock data only (no backend required)

---

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

---

## AI Assistant Setup

The AI Assistant uses the Anthropic API. You need to configure your API key.

**Option 1 — Vite env variable (recommended)**

Create a `.env` file in the project root:
```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Then in `src/pages/AIAssistant.jsx`, update the fetch call headers:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
},
```

**Option 2 — Backend proxy (production)**

In production, never expose API keys in the browser. Route requests through your own backend:
```
POST /api/chat → your server → Anthropic API
```

---

## Project Structure

```
logistic-ai/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Root with routing
    ├── index.css             # Global design system
    ├── data/
    │   └── containers.js     # Mock data (swap for API calls)
    ├── components/
    │   ├── Navbar.jsx
    │   ├── ContainerCard.jsx
    │   ├── RiskGauge.jsx
    │   └── TempBar.jsx
    └── pages/
        ├── Landing.jsx
        ├── Dashboard.jsx
        ├── DetailPanel.jsx
        ├── Alerts.jsx
        └── AIAssistant.jsx
```

---

## Adding a Real Backend / Shipping API

All mock data lives in `src/data/containers.js`.

To connect a real API, replace the `CONTAINERS` and `ALERTS` exports with async fetch calls:

```js
// src/data/containers.js
export async function fetchContainers() {
  const resp = await fetch('/api/containers')
  return resp.json()
}
```

Then in each page component, use `useEffect` + `useState` to load:
```js
const [containers, setContainers] = useState([])
useEffect(() => {
  fetchContainers().then(setContainers)
}, [])
```

The component structure, UI, and design remain completely unchanged.

---

## Design System

Colors, fonts, and spacing are defined as CSS variables in `src/index.css`:

```css
--navy, --navy2..5     Background layers
--cyan, --cyan2..4     Primary accent
--green                Success / nominal
--amber                Warning
--red                  Critical
--font-display         Syne (headings)
--font-body            DM Sans (body)
--font-mono            IBM Plex Mono (data)
```

---

## License

MIT — Built for hackathon demonstration purposes.