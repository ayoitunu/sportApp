# Sport Fan Emotion & Mental Health App

## Project Overview

Non-clinical, non-prescriptive sports fan emotion support app. Engages fans before and after matches, shows their emotional state, and offers positive suggestions. Includes per-game fan sentiment analytics and an admin dashboard that controls both web and mobile.

**Phase 1 sports:** Soccer/Football, Basketball  
**Non-clinical disclaimer:** All suggestions are positive encouragement only — no diagnosis, no prescription, no clinical claims.

> App-specific instructions live in their own CLAUDE.md files:
> - Web: `apps/web/CLAUDE.md`
> - Mobile: `apps/mobile/CLAUDE.md`

---

## Monorepo Structure

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
└── vercel.json       Vercel deployment config (not in use — Netlify is the active deployment platform)
```

## Shared Commands

```bash
# Run everything in dev mode
pnpm dev

# Build all packages and apps
pnpm build

# Type-check all workspaces
pnpm typecheck

# Lint all workspaces
pnpm lint

# Run unit tests
pnpm --filter @sport-fan/shared-logic test
```

## Shared Packages

- `@sport-fan/types` — never hand-edit `database.types.ts`; always regenerate with `supabase gen types`
- `@sport-fan/shared-logic` — pure functions only; no Supabase imports, no React imports, no side effects
- Emotion type has exactly 12 values; `EMOTION_META` in `shared-logic` must cover all 12
- Suggestion selection is always random from matching active templates — `pickSuggestion()` in shared-logic
- Both packages compile to **CommonJS** (`module: "CommonJS"` in tsconfig) — do not change to ESM
- Both packages must be built (`dist/` exists) before the web or mobile app can compile
- `@sport-fan/config/tsconfig/*` cannot be used in `extends` — TypeScript cannot resolve workspace package names there; always inline compiler options directly in each package's `tsconfig.json`

## Database

All tables live in the `public` schema. Migrations are in `supabase/migrations/` numbered `001_` through `007_`.

Key tables: `profiles`, `sports`, `teams`, `players`, `games`, `team_historical_stats`, `check_ins`, `suggestion_templates`, `user_favorite_teams`

Key views: `game_emotion_summary`, `game_team_participants`

**RLS is enabled on all tables.** The `private.is_admin()` SECURITY DEFINER function is used in all admin policies — never inline `role = 'admin'` checks directly in policies (causes recursion).

Admin role is set via Supabase service role only (`auth.admin.updateUserById`) — never from the client.

## Supabase Local Dev

```bash
supabase start
supabase db push                          # apply migrations
supabase db reset                         # reset + re-apply all migrations + seed
supabase gen types typescript --local > packages/types/src/database.types.ts

# Invoke an Edge Function locally
supabase functions invoke sync-football-fixtures
```

### Supabase Vault (Edge Functions only — never in .env files)
```
API_FOOTBALL_KEY     # api-football.com — soccer fixtures
BALLDONTLIE_KEY      # balldontlie.io — basketball fixtures
```

## Deployment

**Active platform: Netlify** (`sport-fan-app.netlify.app`)  
Vercel is no longer in use.

- Build command: `pnpm turbo run build --filter=@sport-fan/web...`
- Publish directory: `apps/web/.next`
- Production branch: `main`
- Plugin: `@netlify/plugin-nextjs`

**Deploy workflow:**
```bash
# Work on web branch
git checkout web
# ... make changes, commit ...
git push origin web

# Merge to main to trigger Netlify deploy
git checkout main && git merge web && git push origin main && git checkout web
```

**Stable version tag:** `stable-version1` = commit `0657a77` (deployed 2026-06-05)  
To revert: `git checkout main && git reset --hard stable-version1 && git push --force origin main`

## Seeding Production Data

Run `supabase/seed.sql` in the Supabase dashboard SQL Editor to populate sports, teams, and sample games. The seed uses `date_trunc('week', now())` so sample games always land in the current week.

## External Sports Data

Games, teams, and results are synced into Supabase by three Edge Functions on cron schedules:
- `sync-football-fixtures` — daily at 2 AM (API-Football, 100 req/day free tier)
- `sync-basketball-fixtures` — daily at 2 AM (BallDontLie)
- `resolve-game-outcomes` — every 15 minutes (polls results, updates game status + score)

Clients never call external sports APIs. All data comes from Supabase tables.
