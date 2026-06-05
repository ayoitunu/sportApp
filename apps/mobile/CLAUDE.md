# Mobile App — `apps/mobile/`

Expo 52 / React Native 0.76 iOS + Android app. Part of the Sport Fan Emotion & Mental Health monorepo.
See root `CLAUDE.md` for shared packages, database, and Supabase instructions.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo 52, React Native 0.76, TypeScript |
| Styling | NativeWind v4 |
| Charts | Victory Native |
| Data fetching | TanStack Query v5 |
| State | Zustand |
| Auth | `@supabase/supabase-js` + AsyncStorage adapter + deep link OAuth |

## Commands

```bash
# Run mobile dev server (from repo root)
pnpm --filter @sport-fan/mobile start
```

## Environment Variables

File: `apps/mobile/.env.local`
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Auth Flow

- `@supabase/supabase-js` with AsyncStorage adapter
- Deep link OAuth callback for social sign-in

## Coding Conventions

- TypeScript strict mode
- No `any` — use `unknown` and narrow
- NativeWind v4 for all styling
- TanStack Query for all reads
- One check-in per fan per game per phase — enforced by DB unique constraint
- `week_start` on `games` is always the Monday of the game's week (use `getWeekStart()` from shared-logic)
- External sports API calls happen only in Edge Functions — never in the client
- `@/` alias is handled by `babel-plugin-module-resolver` (not tsconfig paths — Metro ignores those)
- Alias maps `@` → `./src` (lib and stores live in `apps/mobile/src/`)

## Deployment (Expo)

- Build for stores: `eas build --platform android` / `eas build --platform ios`
