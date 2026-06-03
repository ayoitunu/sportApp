-- Games and team historical statistics.

CREATE TABLE public.games (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id        uuid NOT NULL REFERENCES public.sports(id),
  home_team_id    uuid NOT NULL REFERENCES public.teams(id),
  away_team_id    uuid NOT NULL REFERENCES public.teams(id),
  scheduled_at    timestamptz NOT NULL,
  status          game_status NOT NULL DEFAULT 'scheduled',
  outcome         game_outcome,
  home_score      integer,
  away_score      integer,
  venue           text,
  external_id     text UNIQUE,
  week_start      date NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_self_play CHECK (home_team_id <> away_team_id)
);

CREATE INDEX games_week_start_idx ON public.games(week_start);
CREATE INDEX games_sport_id_idx   ON public.games(sport_id);
CREATE INDEX games_status_idx     ON public.games(status);

CREATE TRIGGER games_set_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.team_historical_stats (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id        uuid NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
  total_games    integer NOT NULL DEFAULT 0,
  wins           integer NOT NULL DEFAULT 0,
  losses         integer NOT NULL DEFAULT 0,
  draws          integer NOT NULL DEFAULT 0,
  avg_possession numeric(5,2),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER team_stats_set_updated_at
  BEFORE UPDATE ON public.team_historical_stats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
