-- Suggestion templates (admin-managed content) and fan check-ins.

CREATE TABLE public.suggestion_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase       check_in_phase NOT NULL,
  outcome     game_outcome,
  emotion     emotion_type NOT NULL,
  text        text NOT NULL,
  tone        text,
  is_active   boolean NOT NULL DEFAULT true,
  created_by  uuid REFERENCES public.profiles(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX suggestion_phase_emotion_idx
  ON public.suggestion_templates(phase, emotion, outcome)
  WHERE is_active = true;

CREATE TRIGGER suggestion_templates_set_updated_at
  BEFORE UPDATE ON public.suggestion_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.check_ins (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id       uuid NOT NULL REFERENCES public.games(id),
  team_id       uuid NOT NULL REFERENCES public.teams(id),
  phase         check_in_phase NOT NULL,
  emotion       emotion_type NOT NULL,
  notes         text,
  suggestion_id uuid REFERENCES public.suggestion_templates(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, game_id, phase)
);

CREATE INDEX check_ins_game_id_idx   ON public.check_ins(game_id);
CREATE INDEX check_ins_user_id_idx   ON public.check_ins(user_id);
CREATE INDEX check_ins_emotion_idx   ON public.check_ins(emotion);
