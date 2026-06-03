-- Sports, teams, and players.

CREATE TABLE public.sports (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       sport_type UNIQUE NOT NULL,
  display    text NOT NULL,
  icon_url   text,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.teams (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id    uuid NOT NULL REFERENCES public.sports(id),
  name        text NOT NULL,
  short_name  text,
  logo_url    text,
  country     text,
  league      text,
  external_id text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sport_id, external_id)
);

CREATE INDEX teams_sport_id_idx ON public.teams(sport_id);

CREATE TABLE public.players (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name        text NOT NULL,
  position    text,
  photo_url   text,
  external_id text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX players_team_id_idx ON public.players(team_id);
CREATE INDEX players_featured_idx ON public.players(team_id, is_featured) WHERE is_featured = true;

CREATE TABLE public.user_favorite_teams (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, team_id)
);
