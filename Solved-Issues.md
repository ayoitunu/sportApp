# Solved Issues

A running log of deployment and setup issues encountered and how they were resolved.

---

## 1. Supabase `Failed to fetch` on Login

**Error:** `TypeError: Failed to fetch` at `supabase.auth.signInWithPassword` in `LoginForm.tsx:19`

**Cause:** New Supabase project had no database schema — tables, enums, RLS policies and views did not exist yet.

**Solution:** Ran all 7 migration files in order via the Supabase SQL Editor as a single combined script:
- `001_enums.sql` — enum types
- `002_profiles.sql` — profiles table + triggers
- `003_sports_teams_players.sql` — sports, teams, players, user_favorite_teams
- `004_games.sql` — games, team_historical_stats
- `005_checkins_suggestions.sql` — check_ins, suggestion_templates
- `006_views.sql` — game_emotion_summary, game_team_participants views
- `007_rls_policies.sql` — RLS + private.is_admin() helper

---

## 2. Vercel Build Cancelled by Ignore Command

**Error:** `The Deployment has been canceled as a result of running the command defined in the "Ignored Build Step" setting.`

**Cause:** The `ignoreCommand` in `vercel.json` ran a `git diff` check. On the very first deploy there is no previous commit to diff against, so it always exited 0 (skip). The Vercel dashboard also had its own "Ignored Build Step" setting that overrode `vercel.json`.

**Solution:**
1. Removed `ignoreCommand` from `vercel.json` entirely for the first deploy
2. In Vercel dashboard → **Settings → General → Ignored Build Step**, changed Behavior to **"Only build if there are changes in a folder"** and set the command to:
   ```
   git diff HEAD^ HEAD --quiet -- apps/web/ packages/ supabase/
   ```

---

## 3. Vercel Doubled Output Directory Path

**Error:** `The Next.js output directory "apps/web/.next" was not found at "/vercel/path0/apps/web/apps/web/.next"`

**Cause:** Vercel's dashboard had `apps/web/.next` set as the Output Directory in project settings. Vercel resolved this path relative to the detected app root (`apps/web/`), doubling the path to `apps/web/apps/web/.next`.

**Solution:** Removed `outputDirectory` from `vercel.json` and cleared the Output Directory field in **Vercel → Settings → General → Build & Output Settings**. Vercel's Next.js preset finds `.next` automatically when the framework is detected.

---

## 4. Vercel Deploying from Wrong Branch / Old Commit

**Cause:** Vercel was connected to `main` and kept deploying commit `ab16e39` even after fixes were pushed to the `web` branch, because those fixes had not been merged into `main`.

**Solution:** After every fix on the `web` branch, merge into `main` and push both:
```bash
git checkout main && git merge web --no-edit && git push origin main && git checkout web
```

---

## 5. Turbo.json Warning — Env Vars Not Declared

**Warning:** `SUPABASE_SERVICE_ROLE_KEY is set on your Vercel project but missing from turbo.json`

**Cause:** Turbo uses env var declarations to generate cache keys. Undeclared vars are invisible to the cache and trigger a warning.

**Solution:** Added all three Supabase env vars to the `build` task in `turbo.json`:
```json
"env": [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
]
```

---

## 6. Netlify — "Project to Deploy" Is a Monorepo Picker

**Cause:** Netlify detected the repo as a Turborepo monorepo and showed a dropdown to pick which workspace to deploy instead of a base directory field.

**Solution:** Select **`@sport-fan/web`** (`apps/web`) from the dropdown. Netlify's monorepo support handles running the build from the repo root automatically, so turbo can still reach `packages/` during the build.

---

## 7. Supabase GitHub Integration — Which Branch to Connect

**Question:** Should Supabase connect to `main` or the `web` branch?

**Answer:** Connect to `main`. Supabase's GitHub integration tracks database migrations in `supabase/migrations/`, which lives at the repo root and is always merged into `main`. The `web` branch only contains app code.

---

## 8. Netlify — 404 on Root URL

**Error:** Visiting `sport-fan-app.netlify.app` showed a Next.js 404 page.

**Cause:** No `page.tsx` existed at the app root (`/`). The fan routes live under `/(fan)/games` and auth under `/(auth)/login` — there was nothing to handle `/` itself.

**Solution:** Added `apps/web/src/app/page.tsx` — a server component that checks auth and redirects to `/games` (logged in) or `/login` (not logged in).

---

## 9. Netlify — Deploy Not Triggered by Push to `web` Branch

**Cause:** Netlify was configured to watch the `main` branch. Pushing to `web` did not trigger a deploy.

**Solution:** The correct workflow is to merge `web` into `main` after each batch of changes:
```bash
git checkout main && git merge web && git push origin main && git checkout web
```
This is also the right long-term pattern — `main` = production, `web` / `mobile` = feature branches.

---

## General Notes

- **Build must run from repo root** — `packages/` (`@sport-fan/types`, `@sport-fan/shared-logic`) live outside `apps/web/`. Setting the base/root directory to `apps/web/` breaks the build because turbo cannot reach those packages.
- **Branch strategy:** `web` branch for all web app work; merge into `main` to trigger deploys.
- **`.env.local` is gitignored** — Supabase credentials are never committed. Add them manually as environment variables in the deployment platform dashboard.
