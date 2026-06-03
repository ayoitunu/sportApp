-- Row Level Security policies for all tables.
-- IMPORTANT: The private.is_admin() helper is SECURITY DEFINER to avoid
-- recursion when the planner tries to resolve the profiles table inside
-- a policy on profiles itself.

-- ── Helper schema & function ──────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT role = 'admin'
  FROM public.profiles
  WHERE id = (SELECT auth.uid());
$$;

-- ── Enable RLS ────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_historical_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_teams ENABLE ROW LEVEL SECURITY;

-- ── profiles ─────────────────────────────────────────────────────────────────
CREATE POLICY "profiles_read_own" ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- The new-user trigger inserts into profiles with SECURITY DEFINER,
-- so no INSERT policy is needed for authenticated users.

-- ── sports ────────────────────────────────────────────────────────────────────
CREATE POLICY "sports_read_all" ON public.sports
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "sports_admin_all" ON public.sports
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ── teams ─────────────────────────────────────────────────────────────────────
CREATE POLICY "teams_read_all" ON public.teams
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "teams_admin_all" ON public.teams
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ── players ───────────────────────────────────────────────────────────────────
CREATE POLICY "players_read_all" ON public.players
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "players_admin_all" ON public.players
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ── games ─────────────────────────────────────────────────────────────────────
CREATE POLICY "games_read_public" ON public.games
  FOR SELECT TO anon, authenticated
  USING (status IN ('scheduled', 'live', 'finished'));

CREATE POLICY "games_admin_all" ON public.games
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ── team_historical_stats ─────────────────────────────────────────────────────
CREATE POLICY "stats_read_all" ON public.team_historical_stats
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "stats_admin_all" ON public.team_historical_stats
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ── check_ins ─────────────────────────────────────────────────────────────────
CREATE POLICY "checkins_read_own" ON public.check_ins
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "checkins_insert_own" ON public.check_ins
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "checkins_admin_all" ON public.check_ins
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ── suggestion_templates ──────────────────────────────────────────────────────
CREATE POLICY "suggestions_read_active" ON public.suggestion_templates
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "suggestions_admin_all" ON public.suggestion_templates
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ── user_favorite_teams ───────────────────────────────────────────────────────
CREATE POLICY "favorites_crud_own" ON public.user_favorite_teams
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "favorites_admin_all" ON public.user_favorite_teams
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());
