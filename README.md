# RoamSpin 🎡

> **Stop arguing. Spin. Go.**

RoamSpin is an open-source, gamified travel decision engine for groups who can't decide where to go.

Instead of endlessly searching for destinations, you set a few constraints — budget, radius, trip length, vibes, states — and let the wheel make the decision.

The project is intentionally **local-first** right now. The destination catalogue lives in the repository, while the application is designed so the data layer can later be swapped for an API/database without rewriting the UI.

## ✨ What makes RoamSpin different?

### 🎡 Blind destination roulette

The wheel does **not reveal destination names before the spin**.

It shows a mystery wheel, spins, builds suspense, and only reveals the selected destination after the animation finishes.

### 🪄 Jugaad-aware budgets

Travel budgets are split into:

- **Fixed costs** — costs that generally cannot be optimized away.
- **Jugaad / floor estimate** — realistic lower-cost travel using cheaper transport, shared stays, etc.
- **Comfort estimate** — a more comfortable version of the same trip.

This prevents an expensive-looking destination from being incorrectly excluded just because you prefer travelling cheaply.

### 🗺️ Visual radius planning

The radius isn't just a number.

The map draws the actual boundary around the selected origin, so increasing the radius gives immediate visual feedback about the search area.

Users can either:

- choose a city, or
- use their browser location.

### 🎯 Multi-vibe filtering

Choose one or multiple vibes:

- Beach
- Mountains
- Adventure
- Food
- Nightlife
- Nature
- History
- Slow / chill

For example:

> `Beach + Adventure + Food`

### 🇮🇳 India-wide catalogue

The repository currently contains **755+ destinations** across India, including both popular and lesser-known destinations.

### 🎲 Build the trip after the spin

Getting the destination is only half the game.

After the destination is selected, RoamSpin can randomize additional trip ingredients such as:

- Stay
- Activity
- Food challenge
- Group rule

So the game becomes:

**Where are we going? → What are we doing? → What is the trip rule?**

---

## 🖥️ Screens

### Home / Roulette

The main experience combines filters, the mystery wheel and the final destination reveal.

### Explore

Browse the full destination catalogue with:

- Search
- State filtering
- Sorting
- Infinite loading
- Destination details

### Destination

Every destination has a shareable route:

```text
/destination/<destination-id>
```

### Radius Map

The map reacts to the selected origin and radius in real time.

---

## 🧱 Architecture

RoamSpin uses a deliberately simple separation of concerns:

```text
                    ┌──────────────────┐
                    │  Local Dataset   │
                    │ destinations.json│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Repository     │
                    │ data access layer│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      Domain      │
                    │ typed models +   │
                    │ filtering logic  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Hooks / State    │
                    │ roulette + UI    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ React Components │
                    └──────────────────┘
```

### Project structure

```text
src/
├── components/        # Reusable UI components
├── data/               # Local destination and game data
├── domain/             # Domain types/models
├── hooks/              # Stateful application behaviour
├── repositories/       # Data access abstraction
├── utils/              # Shared utilities
├── App.tsx
├── main.tsx
└── styles.css

public/                 # Static assets
scripts/                # Development/data utilities, if present
```

The important boundary is:

```text
React UI
   ↓
Hooks / domain
   ↓
Repository
   ↓
Data source
```

That means a future migration can become:

```text
React UI
   ↓
Hooks / domain
   ↓
Repository
   ↓
REST API
   ↓
PostgreSQL
```

without making every component database-aware.

---

## 🚀 Run locally

### Requirements

- Node.js 18+ (Node 20+ recommended)
- npm

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env.local
```

Add your CARTO key:

```env
VITE_CARTO_API_KEY=your_carto_key
```

Then start development:

```bash
npm run dev
```

Open the URL printed by Vite.

---

## 🗺️ Maps

RoamSpin uses Leaflet for the interactive map and CARTO for the basemap.

The API key is intentionally supplied through:

```env
VITE_CARTO_API_KEY=...
```

Do **not** commit `.env.local`.

Because `VITE_*` variables are browser-side variables, treat the CARTO key as a public client credential rather than a backend secret. Restrict the key to the domains where you intend to use it.

If you want to contribute without a CARTO key, the application should retain its map fallback behaviour where configured.

---

## 📊 Data

The current destination data is stored locally.

Typical files include:

```text
src/data/
├── destinations.json
├── destinations.csv
├── schema.ts
├── tripOptions.ts
└── README.md
```

The JSON is the runtime source for the application.

The CSV is useful for:

- bulk editing
- research
- spreadsheet review
- future data pipelines

### Destination model

The catalogue contains structured fields such as:

```ts
{
  id: string;
  name: string;
  state: string;
  country: string;
  region: string;
  kind: string;
  tags: string[];
  recommendedDays: number;
  estimatedDriveHoursFromMumbai?: number;
  estimatedRoadDistanceKmFromMumbai?: number;
  estimatedBudgetPerPersonINR?: number;
  description: string;
  isMumbaiShortlist?: boolean;
}
```

Additional budget/source fields may exist in the current dataset.

### Data quality

Destination information can change over time — particularly:

- transport availability
- ticket prices
- accommodation prices
- road travel times
- entry fees
- seasonal accessibility

Contributors should avoid inventing precise numbers when reliable sources are unavailable.

If a value is uncertain, prefer a documented estimate or leave it unknown.

---

## 🧪 Build

Create a production build:

```bash
npm run build
```

Preview it locally:

```bash
npm run preview
```

---

## ▲ Deploying to Vercel

RoamSpin is designed for Vercel.

### Option 1 — Vercel dashboard

1. Push the repository to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Vercel should detect Vite automatically.
5. Add:

```text
VITE_CARTO_API_KEY
```

under **Environment Variables**. 6. Deploy.

### Option 2 — Vercel CLI

Install the CLI:

```bash
npm i -g vercel
```

Then:

```bash
vercel
```

For production:

```bash
vercel --prod
```

The repository includes the SPA rewrite configuration needed for client-side routes such as:

```text
/explore
/destination/<id>
```

so refreshing those URLs doesn't turn into a 404.

---

## 📈 Vercel Analytics

RoamSpin uses the React/Vite version of Vercel Analytics.

Install:

```bash
npm install @vercel/analytics
```

Then in `src/main.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/react";
```

Render it once at the application root:

```tsx
<React.StrictMode>
  <App />
  <Analytics />
</React.StrictMode>
```

Do **not** use:

```tsx
@vercel/analytics/next
```

because RoamSpin is a Vite + React application, not Next.js.

---

# 🤝 Contributing

RoamSpin is open source and contributions are welcome.

There are several particularly useful ways to contribute.

### 🗺️ Add destinations

Add missing destinations, especially:

- lesser-known locations
- regional destinations
- weekend destinations
- low-budget destinations
- destinations reachable by public transport

Please include a reliable source where possible.

### 💰 Improve budget data

The most valuable future improvement is replacing broad estimates with structured cost components:

```text
transport
├── general
├── sleeper
├── bus
├── shared_cab
└── private_cab

stay
├── hostel
├── homestay
├── budget_hotel
└── resort

food
├── street
├── local
└── restaurant

fixed
├── entry_fee
├── permit
├── ferry
└── mandatory_ticket
```

This would make the Jugaad budget calculation explainable rather than heuristic.

### 🧩 Build features

Good areas for contributions:

- Better destination recommendations
- More game modes
- Group voting
- Shareable trip links
- Save/favourite destinations
- Trip history
- Collaborative multiplayer roulette
- Better accessibility
- PWA/offline support
- Better maps
- Seasonal recommendations
- Public-transport-aware routing

---

# 🐛 Reporting issues

Please open a GitHub Issue with:

1. What you expected
2. What happened
3. Steps to reproduce
4. Browser/device
5. Screenshot or screen recording if useful

For data issues, include the destination name and the field that needs correction.

---

# 💡 Feature requests

Before opening a feature request, check existing issues.

When proposing a feature, explain:

- What problem it solves
- Who benefits
- How it could work
- Whether you would be willing to contribute the implementation

---

# 📜 License

This project is released under the **MIT License**.

See [`LICENSE`](./LICENSE).

---

# 🙌 Philosophy

RoamSpin exists for a very simple reason:

> **Three friends shouldn't spend two hours deciding where to spend three days.**

Set the rules.

Spin the wheel.

Go somewhere.

---

## ⭐ If you like it

If RoamSpin helps you decide your next trip, consider:

- ⭐ starring the repository
- 🐛 opening useful issues
- 🗺️ contributing destinations
- 💰 improving cost data
- 🔀 submitting a pull request
- 📣 sharing it with your travel group

Made for people who say:

**"Bro, anywhere is fine."**

…and then reject every destination.
