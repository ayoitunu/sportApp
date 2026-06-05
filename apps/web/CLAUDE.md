# Web App — `apps/web/`

Next.js 15 fan UI + admin dashboard. Part of the Sport Fan Emotion & Mental Health monorepo.
See root `CLAUDE.md` for shared packages, database, and Supabase instructions.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Charts | Recharts |
| Data fetching | TanStack Query v5 |
| State | Zustand |
| Auth | `@supabase/ssr` + `middleware.ts` |
| Testing | Vitest (unit), Playwright (E2E) |

## Git Branch

All web development happens on the `web` branch. Only commit and push web-related changes from this branch.

```bash
# Switch to web branch
git checkout web

# Push web changes (never push mobile-only changes from here)
git push origin web
```

To merge finished web work into `main`:
```bash
git checkout main && git merge web && git push origin main
```

## Commands

```bash
# Run web dev server (from repo root)
pnpm --filter @sport-fan/web dev

# Run E2E tests (requires web dev server running)
pnpm --filter @sport-fan/web test:e2e
```

## Environment Variables

File: `apps/web/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never expose to client
```

## Auth Flow

- `@supabase/ssr` + `middleware.ts` handles token refresh and admin route guarding
- `/admin/*` routes are protected in `middleware.ts` by reading `user.app_metadata.role`

## Coding Conventions

- TypeScript slightly relaxed strict mode: no `exactOptionalPropertyTypes`, no `noUncheckedIndexedAccess` — incompatible with `@supabase/ssr`
- No `any` — use `unknown` and narrow
- Standard Tailwind for all styling
- **Server Actions for all Supabase writes** — never mutate from client components directly
- TanStack Query for all reads
- One check-in per fan per game per phase — enforced by DB unique constraint
- `week_start` on `games` is always the Monday of the game's week (use `getWeekStart()` from shared-logic)
- External sports API calls happen only in Edge Functions — never in the client

## Deployment (Netlify — preferred / Vercel)

- Both configs live at repo root (`netlify.toml`, `vercel.json`)
- **Root Directory must be blank (repo root)** in both Netlify and Vercel dashboards — the build *must* start from root so turbo can reach `packages/` before building the web app
- Build command: `pnpm turbo run build --filter=@sport-fan/web...` — turbo builds shared packages first automatically
- Publish/output directory: `apps/web/.next`
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `next.config.ts` has `typescript.ignoreBuildErrors: true` — Supabase join query types need `supabase gen types --linked` from a live DB to resolve correctly
- **Ignore rules** skip the build automatically when only `apps/mobile/` or unrelated files change — deploys only trigger on changes to `apps/web/`, `packages/`, or `supabase/`
