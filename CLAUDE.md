# Sport Fan Emotion & Mental Health App

## Project Overview

Non-clinical, non-prescriptive sports fan emotion support app. Engages fans before and after matches, shows their emotional state, and offers positive suggestions. Includes per-game fan sentiment analytics and an admin dashboard that controls both web and mobile.

**Phase 1 sports:** Soccer/Football, Basketball  
**Non-clinical disclaimer:** All suggestions are positive encouragement only — no diagnosis, no prescription, no clinical claims.

## Architecture

Turborepo monorepo with pnpm workspaces.

```
sport-fan-app/
├── apps/
│   ├── web/        Next.js 15 App Router — fan UI + admin dashboard
│   └── mobile/     Expo 52 (React Native 0.76) — iOS + Android
├── packages/
│   ├── types/        @sport-fan/types — DB types + domain enums
│   ├── shared-logic/ @sport-fan/shared-logic — emotion engine, suggestion engine, utils
│   └── config/       shared ESLint, Prettier, TSConfig
├── supabase/
│   ├── migrations/   SQL migration files (applied in numbered order)
│   ├── seed.sql
│   └── functions/    Deno Edge Functions (sports data sync)
├── netlify.toml      Netlify deployment config (builds from repo root via turbo)
└── vercel.json       Vercel deployment config (builds from repo root via turbo)
```

## Tech Stack

| Layer | Technology |
|---|---|
| Web frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Mobile frontend | Expo (React Native), TypeScript, NativeWind v4 |
| Backend / DB | Supabase (Postgres, Auth, Realtime, Edge Functions) |
| Charts (web) | Recharts |
| Charts (mobile) | Victory Native |
| Data fetching | TanStack Query v5 (both apps) |
| State | Zustand (both apps) |
| Monorepo | Turborepo + pnpm workspaces |
| Testing | Vitest (unit), Playwright (E2E web) |

## Key Commands

```bash
# Run everything in dev mode
pnpm dev

# Build all packages and apps
pnpm build

# Type-check all workspaces
pnpm typecheck

# Lint all workspaces
pnpm lint

# Run web only
pnpm --filter @sport-fan/web dev

# Run mobile only
pnpm --filter @sport-fan/mobile start

# Supabase local dev
supabase start
supabase db push                          # apply migrations
supabase db reset                         # reset + re-apply all migrations + seed
supabase gen types typescript --local > packages/types/src/database.types.ts

# Invoke an Edge Function locally
supabase functions invoke sync-football-fixtures

# Run unit tests
pnpm --filter @sport-fan/shared-logic test

# Run E2E tests (requires web dev server running)
pnpm --filter @sport-fan/web test:e2e
```

## Environment Variables

### apps/web/.env.local
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never expose to client
```

### apps/mobile/.env.local
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

### Supabase Vault (Edge Functions only — never in .env files)
```
API_FOOTBALL_KEY     # api-football.com — soccer fixtures
BALLDONTLIE_KEY      # balldontlie.io — basketball fixtures
```

## Database

All tables live in the `public` schema. Migrations are in `supabase/migrations/` numbered `001_` through `007_`.

Key tables: `profiles`, `sports`, `teams`, `players`, `games`, `team_historical_stats`, `check_ins`, `suggestion_templates`, `user_favorite_teams`

Key views: `game_emotion_summary`, `game_team_participants`

**RLS is enabled on all tables.** The `private.is_admin()` SECURITY DEFINER function is used in all admin policies — never inline `role = 'admin'` checks directly in policies (causes recursion).

Admin role is set via Supabase service role only (`auth.admin.updateUserById`) — never from the client.

## Package Conventions

- `@sport-fan/types` — never hand-edit `database.types.ts`; always regenerate with `supabase gen types`
- `@sport-fan/shared-logic` — pure functions only; no Supabase imports, no React imports, no side effects
- Emotion type has exactly 12 values; `EMOTION_META` in `shared-logic` must cover all 12
- Suggestion selection is always random from matching active templates — `pickSuggestion()` in shared-logic
- Both packages compile to **CommonJS** (`module: "CommonJS"` in tsconfig) — do not change to ESM
- Both packages must be built (`dist/` exists) before the web or mobile app can compile
- `@sport-fan/config/tsconfig/*` cannot be used in `extends` — TypeScript cannot resolve workspace package names there; always inline compiler options directly in each package's `tsconfig.json`

## Deployment

### Web (Netlify — preferred) / Vercel
- Both configs live at repo root (`netlify.toml`, `vercel.json`)
- **Root Directory must be blank (repo root)** in both Netlify and Vercel dashboards
- Build command: `pnpm turbo run build --filter=@sport-fan/web...` — turbo builds packages first automatically
- Publish/output directory: `apps/web/.next`
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `next.config.ts` has `typescript.ignoreBuildErrors: true` — Supabase join query types need `supabase gen types --linked` from a live DB to resolve correctly

### Mobile (Expo)
- `@/` alias is handled by `babel-plugin-module-resolver` (not tsconfig paths — Metro ignores those)
- Alias maps `@` → `./src` (lib and stores live in `apps/mobile/src/`)
- Build for stores: `eas build --platform android` / `eas build --platform ios`

## Coding Conventions

- TypeScript strict mode everywhere (web uses slightly relaxed: no `exactOptionalPropertyTypes`, no `noUncheckedIndexedAccess` — incompatible with `@supabase/ssr`)
- No `any` — use `unknown` and narrow
- Tailwind for all styling (web: standard Tailwind, mobile: NativeWind)
- Server Actions for all Supabase writes from the web app (never mutate from client components directly)
- TanStack Query for all reads in both apps
- One check-in per fan per game per phase — enforced by DB unique constraint
- `week_start` on `games` is always the Monday of the game's week (use `getWeekStart()` from shared-logic)
- External sports API calls happen only in Edge Functions — never in the client

## Auth Flow

- Web: `@supabase/ssr` + `middleware.ts` handles token refresh and admin route guarding
- Mobile: `@supabase/supabase-js` with AsyncStorage adapter + deep link OAuth callback
- `/admin/*` routes are protected in `middleware.ts` by reading `user.app_metadata.role`

## External Sports Data

Games, teams, and results are synced into Supabase by three Edge Functions on cron schedules:
- `sync-football-fixtures` — daily at 2 AM (API-Football, 100 req/day free tier)
- `sync-basketball-fixtures` — daily at 2 AM (BallDontLie)
- `resolve-game-outcomes` — every 15 minutes (polls results, updates game status + score)

Clients never call external sports APIs. All data comes from Supabase tables.
