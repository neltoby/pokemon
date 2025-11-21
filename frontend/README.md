# Frontend – PokéDex Favorites (React + TypeScript + Vite)

This is the React frontend for the PokéDex Favorites project. It lists the first 150 Pokémon, supports infinite scrolling, shows Pokémon details, and lets users mark favorites that persist via the backend.

The app is optimized for performance with virtualized lists, client‑side request de‑duplication, and backend caching. It expects the backend to expose a proxy to the public PokéAPI plus a favorites API.

## Tech Stack
- React 19 + TypeScript
- Vite 7 (dev/build tooling)
- Tailwind CSS v4 (utility styling)
- react-window + react-window-infinite-loader (virtualized infinite list)
- Axios (HTTP) with in‑flight de‑duplication

## High‑Level Architecture
- State management uses a lightweight Context + Reducer store to centralize list, favorites, details, selection, and UI filters.
  - Provider: `frontend/src/context/pokemon-store-provider.tsx:1`
  - Hooks: `frontend/src/hooks/*`
- Data fetching
  - Pokémon list pages: `frontend/src/hooks/use-pokemon-list.ts:1` (infinite loading + client filtering)
  - Pokémon details: `frontend/src/hooks/use-pokemon-details.ts:1` (lazy per selection with per‑id status)
  - Favorites: `frontend/src/hooks/use-favorites.ts:1` (initial load, optimistic toggle)
- API client
  - Base URL via `VITE_API_BASE_URL`; Axios instance and `getJSON` helper with in‑flight de‑duplication: `frontend/src/api/client.ts:1`
- UI
  - Virtualized list and rows: `frontend/src/components/pokemon/PokemonList.tsx:1` + `frontend/src/components/pokemon/PokemonListItem.tsx:1`
  - Details panel: `frontend/src/components/pokemon/PokemonDetailPanel.tsx:1`
  - Search + favorites‑only toggle: `frontend/src/components/pokemon/SearchBar.tsx:1`, `frontend/src/components/pokemon/FavoritesFilterToggle.tsx:1`
  - App wiring: `frontend/src/main.tsx:1`, `frontend/src/App.tsx:1`

## Features
- Infinite scrolling for the first 150 Pokémon (50 per page)
- Virtualized rendering for smooth scroll on large lists
- Pokémon details view with types, abilities, and evolution line
- Favorites management with optimistic UI and server persistence
- Search by name + “favorites only” filter

## API Contracts (consumed)
- `GET /api/pokemon?limit=50&offset=0` → `{ items: PokemonSummary[], hasMore: boolean, nextOffset: number|null }`
- `GET /api/pokemon/:nameOrId` → `PokemonDetails`
- `GET /api/favorites` → `Favorite[]`
- `POST /api/favorites` → body `{ pokemonId, pokemonName }`
- `DELETE /api/favorites/:pokemonId`

The backend caps list pages at 150 total items and sets cache headers. See backend README for details.

## Project Structure
```
src/
  api/                 # Axios client + typed API modules
  components/          # Layout + Pokémon UI components
  context/             # Context + reducer (central store)
  hooks/               # Data + UI hooks
  styles/              # Tailwind entry + global styles
  App.tsx              # Page composition
  main.tsx             # App bootstrap
```

Notable files to explore:
- `frontend/src/api/pokemon-api.ts:1` – typed API for list pages and details
- `frontend/src/hooks/use-pokemon-list.ts:1` – infinite scrolling, filtering
- `frontend/src/components/pokemon/PokemonList.tsx:1` – react‑window + infinite loader

## Getting Started
### Prerequisites
- Node 18+ (Node 20 recommended for parity with backend)
- Yarn (v1 or v4). Examples below use Yarn v1.
- Running backend (default at `http://localhost:4000`).

### Install
```
yarn install
```

### Configure
Create `.env` (optional) to point to your backend if not default:
```
VITE_API_BASE_URL=http://localhost:4000
```

### Run (Dev)
```
yarn dev
```
Open http://localhost:5173 and ensure the backend is reachable.

### Build & Preview
```
yarn build
yarn preview
```

## NPM/Yarn Scripts
- `yarn dev` – start Vite dev server
- `yarn build` – type‑check then build production assets
- `yarn preview` – preview the production build
- `yarn lint` – run ESLint with the configured rules

## Data Flow Overview
1) On app load, favorites are fetched and stored.
2) The Pokémon list loads the first page (50). As you scroll, `react-window-infinite-loader` signals the hook to fetch the next page until 150 items are reached.
3) Selecting a Pokémon triggers a details fetch that is cached by ID in the store.
4) Toggling favorite posts/deletes to the server and updates the store optimistically.

## Performance Techniques
- Virtualized list (react‑window) to render only visible rows.
- Infinite loading (react‑window‑infinite‑loader) to avoid fetching unused pages.
- Client request de‑duplication for GETs so duplicate in‑flight requests coalesce.
- Memoized selectors and stable item keys to minimize re‑renders.

## Accessibility & UX
- Icons are accessible SVGs; favorite actions expose clear affordances.
- List rows are large tap targets; selection and loading states are distinct.
- Consider additional a11y improvements (focus management and ARIA labels) if expanding.

## Troubleshooting
- “Nothing shows under favorites‑only after refresh”
  - Ensure the backend `/api/favorites` is reachable and `VITE_API_BASE_URL` is set correctly.
- “Double fetches in dev”
  - Dev StrictMode remount is disabled in `frontend/src/main.tsx:1` to avoid double effects.
- “Infinite scroll doesn’t load more”
  - Confirm the backend returns `{ hasMore: true, nextOffset }` until 150 items.
- TypeScript build errors for react‑window
  - Types are included via `@types/react-window`. Reinstall deps if needed.

## Conventions
- Type‑only imports with `import type …` to satisfy `verbatimModuleSyntax`.
- Module‑scoped hooks/components; co‑located component styles.
- ESLint configured via `eslint.config.js:1` with TypeScript rules.

## Deploying
- Build with `yarn build`; deploy the `dist/` folder to any static host (Netlify, Vercel, S3/CloudFront).
- Provide `VITE_API_BASE_URL` at build time to match your backend URL.

## Roadmap Ideas
- Persist client cache across reloads (e.g., React Query + persist).
- Skeletons for details panel; offline favorites queue.
- Unit tests for hooks and reducers.

---

For the backend service, see the backend README for architecture, operations, and performance considerations.
