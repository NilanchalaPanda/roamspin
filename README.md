# RoamSpin

A local-first React + TypeScript + Vite travel roulette. The destination catalogue lives in `src/data/` and there is no database or account system.

## Run locally

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

Import the repository into Vercel. The project is already configured for Vite and SPA-style routes with `vercel.json`.

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

The rewrite in `vercel.json` makes routes such as `/destination/dest_0001` resolve to the React app on a direct browser refresh instead of returning a Vercel 404.

## Location privacy

Users have two origin options:

1. Choose a city from the curated city picker.
2. Click **Use my location** to use browser geolocation.

Browser location is kept in React state only. It is not written to localStorage, the destination dataset, or a server.

## Radius note

The map circle always follows the selected origin. The existing 755-destination catalogue currently stores road-distance estimates from Mumbai, so those stored distance fields remain the source for the roulette's numeric radius filter. For a fully origin-aware radius filter for every Indian destination, add latitude/longitude to every destination record; the repository boundary is intentionally isolated so that can be added without changing the UI.

## Data

- `src/data/destinations.json` — local destination records
- `src/data/destinations.csv` — spreadsheet export
- `src/data/origins.ts` — city picker coordinates
- `src/data/tripOptions.ts` — trip-game options

## CARTO map API key

The dark CARTO basemap now requires a CARTO Basemaps API key for external applications. The app reads it from the Vite environment variable `VITE_CARTO_API_KEY`.

### Local development

Create `.env.local` in the project root:

```env
VITE_CARTO_API_KEY=your_carto_key_here
```

Then restart Vite:

```bash
npm run dev
```

Do **not** commit `.env.local`. It is already covered by `.gitignore`.

### Vercel

In the Vercel project dashboard go to **Settings → Environment Variables** and add:

- Name: `VITE_CARTO_API_KEY`
- Value: your CARTO Basemaps key
- Environments: Production, Preview, Development as appropriate

Then redeploy. Because Vite exposes `VITE_*` variables to browser code, this is not a server-side secret. Restrict the CARTO key to your production domain (for example `yourdomain.com` and `*.vercel.app` if needed) in the CARTO dashboard.

The app falls back to OpenStreetMap tiles if the variable is missing, so the map remains usable during local setup. CARTO attribution remains visible when CARTO is used.

