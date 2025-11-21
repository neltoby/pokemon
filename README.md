# Pokémon Monorepo

Monorepo for the Pokémon application consisting of a backend API proxy with favorites persistence and a Vite/React frontend. The monorepo consolidates the original repositories while preserving their Git history.

- Backend: Node.js + TypeScript + Express 5, MongoDB (Mongoose), PokeAPI integration with caching and retries
- Frontend: Vite + React + TypeScript + Tailwind, virtualized list, favorites management

## Monorepo Layout

```
pokemon/
  backend/   # API + persistence
  frontend/  # Web UI
```

- `backend` — Node 22.x, Express, Mongoose, class-validator, axios + axios-retry
- `frontend` — Vite + React 19, Tailwind v4 (via @tailwindcss/vite), react-window

## Migration History

The project was originally split into two repositories (`pokemon-backend` and `pokemon-frontend`). They were merged into this monorepo using `git filter-repo`, preserving full history for both:

- Backend history lives under `/backend`
- Frontend history lives under `/frontend`

This layout makes it easier to manage both apps together while keeping commit history intact.

## How The Merge Was Performed

Prerequisites:

- Install `git filter-repo` (e.g., `brew install git-filter-repo` or `pipx install git-filter-repo`).

Steps (one-time import into a new monorepo):

```bash
# 1) Initialize monorepo
mkdir pokemon && cd pokemon && git init

# 2) Import backend into /backend
git remote add backend <git@...:pokemon-backend.git>
git fetch backend
git checkout -b import/backend backend/main
git filter-repo --to-subdirectory-filter backend

git checkout -b main
# Merge into main as a single history line
git merge --allow-unrelated-histories import/backend -m "Import backend history into /backend"

# 3) Import frontend into /frontend
git remote add frontend <git@...:pokemon-frontend.git>
git fetch frontend
git checkout -b import/frontend frontend/main
git filter-repo --to-subdirectory-filter frontend

git checkout main
git merge --allow-unrelated-histories import/frontend -m "Import frontend history into /frontend"
```

Verification:

```bash
git log --oneline -- backend
git log --oneline -- frontend
git shortlog -sne -- backend
git shortlog -sne -- frontend
```

Notes:

- Author dates, messages, and commit topology are preserved; paths are rewritten under their respective subdirectories.
- Use `--to-subdirectory-filter` on an import branch per repo to avoid mixing paths.

---

## Backend

Stack

- Node.js 22.x, TypeScript
- Express 5, CORS, compression, rate limiting
- MongoDB with Mongoose
- axios with axios-retry; HTTP keep-alive; basic LRU caching + concurrency control for PokeAPI calls
- class-validator + class-transformer for DTO validation

Architecture

- Entry/composition: `src/server.ts` and `src/app.ts`
- Layers
  - `application/` — use cases (business actions)
  - `domain/` — entities and repository/gateway interfaces
  - `infrastructure/` — db (Mongoose), http (PokeAPI gateway), web (Express setup)
  - `interface-adapters/` — controllers (framework-agnostic)
- Express app factory and middleware: `src/infrastructure/web/express-app-factory.web.ts`
- PokeAPI gateway with LRU cache and concurrency limits: `src/infrastructure/http/pokemon-apigateway.http.ts`
- Validation helper: `src/shared/validation/validate-dto.ts`

API Routes

- `GET /health` — health check
- `GET /api/pokemon?limit=&offset=` — lists first 150 Pokémon, paginated, with cache headers
- `GET /api/pokemon/:nameOrId` — returns details (abilities, types, evolutions), cached
- `GET /api/favorites` — list favorites
- `POST /api/favorites` — body: `{ pokemonId, pokemonName }`; idempotent add
- `DELETE /api/favorites/:pokemonId` — remove by Pokémon ID

Configuration

- Environment (`src/config/env.ts`):
  - `PORT` (default `4000`)
  - `MONGO_URI` (default `mongodb://localhost:27017/pokemon_app`)
  - `POKEAPI_BASE_URL` (default `https://pokeapi.co/api/v2`)
  - `FRONT_END_URL` (default `http://localhost:5173`)
- CORS allows only `FRONT_END_URL`
- Rate limit on PokeAPI-proxy routes

Local Development

1) Start MongoDB via Docker (optional, if no local Mongo):

```bash
cd backend
docker compose up -d
```

2) Backend env (`backend/.env`):

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/pokemon_app
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
FRONT_END_URL=http://localhost:5173
```

3) Install and run:

```bash
cd backend
yarn
yarn dev
```

Build/Run (production)

```bash
cd backend
yarn
yarn build
# Run compiled server
yarn start
```

---

## Frontend

Stack

- Vite + React 19 + TypeScript
- Tailwind v4 via `@tailwindcss/vite`
- `react-window` for virtualization; simple infinite loader
- Axios client with in-flight de-dup for GET requests

Architecture

- Entry: `src/main.tsx`; App shell: `src/App.tsx`
- API modules: `src/api` (`pokemon-api.ts`, `favourite-api.ts`, `client.ts`)
- Global state: context + reducer in `src/context/pokemon-store-provider.tsx`
- Hooks for data/UI: `src/hooks` (list, details, favorites, selection, filters)
- UI components: `src/components` (layout and Pokémon widgets)

Configuration

- Env: `VITE_API_BASE_URL` (defaults to `http://localhost:4000`)
- Global styles: `src/styles/index.css`

Local Development

```bash
cd frontend
yarn
yarn dev  # http://localhost:5173
```

Build/Preview

```bash
cd frontend
yarn build
yarn preview
```

---

## End-to-End Local Setup

- Terminal 1: `cd backend && docker compose up -d` (MongoDB on 27017)
- Terminal 2: `cd backend && yarn && yarn dev` (API on `:4000`)
- Terminal 3: `cd frontend && yarn && yarn dev` (Web on `:5173`)
- Open `http://localhost:5173` (frontend will call `http://localhost:4000` unless `VITE_API_BASE_URL` overrides it)

---

## Deployment

Backend (Render)

- Node 22.x runtime
- Build command: `yarn && yarn build`
- Start command: `yarn start`
- Env vars:
  - `PORT` — provided by Render
  - `MONGO_URI` — Atlas/Render Mongo connection string
  - `POKEAPI_BASE_URL` — `https://pokeapi.co/api/v2`
  - `FRONT_END_URL` — your Vercel domain (e.g., `https://<project>.vercel.app`)

Frontend (Vercel)

- Framework preset: Vite (static output)
- Build command: `yarn build`
- Output directory: `dist`
- Env vars: `VITE_API_BASE_URL` pointing to the Render backend URL

CORS

- Ensure backend `FRONT_END_URL` matches the exact frontend origin in each environment.

---

## Quality & Conventions

- Lint/format
  - Backend: ESLint + Prettier (`.eslintrc.cjs`, `.prettierrc`)
  - Frontend: ESLint (`eslint.config.js`)
- Type checking: TypeScript across both apps
- Error handling: centralized Express error/not-found middleware; validation errors via class-validator

---

## Troubleshooting

- Mongo connection errors: confirm Docker is running and `MONGO_URI` is reachable
- CORS errors: set `FRONT_END_URL` to exact frontend origin (dev/prod)
- PokeAPI rate limits/timeouts: axios retries are enabled; check logs; reduce load
- 404s: verify routes and `VITE_API_BASE_URL`

---

## Notes

- The backend limits list queries to the first 150 Pokémon (Gen 1) and applies cache headers.
- The PokeAPI gateway uses an in-memory LRU cache with TTL and caps concurrent upstream requests for stability.
- Favorites persistence is idempotent on `pokemonId` and sorted by most recent.

