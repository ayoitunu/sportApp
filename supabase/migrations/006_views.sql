-- Analytics views used by chart components.

-- Emotion distribution per (game, team, phase) — feeds bar/pie charts.
CREATE VIEW public.game_emotion_summary AS
SELECT
  c.game_id,
  c.team_id,
  c.phase,
  c.emotion,
  count(*)::integer AS fan_count
FROM public.check_ins c
GROUP BY c.game_id, c.team_id, c.phase, c.emotion;

-- Total distinct participants per (game, team, phase).
CREATE VIEW public.game_team_participants AS
SELECT
  c.game_id,
  c.team_id,
  c.phase,
  count(DISTINCT c.user_id)::integer AS participant_count
FROM public.check_ins c
GROUP BY c.game_id, c.team_id, c.phase;
