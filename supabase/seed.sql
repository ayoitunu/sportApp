-- Seed data for local development.
-- Run automatically by: supabase db reset

-- ── Sports ───────────────────────────────────────────────────────────────────
INSERT INTO public.sports (name, display, is_active) VALUES
  ('soccer',     'Soccer / Football', true),
  ('basketball', 'Basketball',        true);

-- ── Soccer Teams (Premier League sample) ────────────────────────────────────
INSERT INTO public.teams (sport_id, name, short_name, country, league)
SELECT s.id, t.name, t.short_name, t.country, t.league
FROM public.sports s,
  (VALUES
    ('Arsenal',           'ARS', 'England', 'Premier League'),
    ('Manchester City',   'MCI', 'England', 'Premier League'),
    ('Liverpool',         'LIV', 'England', 'Premier League'),
    ('Chelsea',           'CHE', 'England', 'Premier League'),
    ('Manchester United', 'MNU', 'England', 'Premier League'),
    ('Tottenham Hotspur', 'TOT', 'England', 'Premier League')
  ) AS t(name, short_name, country, league)
WHERE s.name = 'soccer';

-- ── Basketball Teams (NBA sample) ────────────────────────────────────────────
INSERT INTO public.teams (sport_id, name, short_name, country, league)
SELECT s.id, t.name, t.short_name, t.country, t.league
FROM public.sports s,
  (VALUES
    ('Los Angeles Lakers', 'LAL', 'USA', 'NBA'),
    ('Boston Celtics',     'BOS', 'USA', 'NBA'),
    ('Golden State Warriors', 'GSW', 'USA', 'NBA'),
    ('Miami Heat',         'MIA', 'USA', 'NBA')
  ) AS t(name, short_name, country, league)
WHERE s.name = 'basketball';

-- ── Sample Games (current week) ───────────────────────────────────────────────
-- Soccer: Arsenal vs Man City
INSERT INTO public.games (sport_id, home_team_id, away_team_id, scheduled_at, status, week_start)
SELECT
  s.id,
  home.id,
  away.id,
  (date_trunc('week', now()) + interval '2 days' + interval '15 hours'),
  'scheduled',
  date_trunc('week', now())::date
FROM public.sports s
JOIN public.teams home ON home.name = 'Arsenal'     AND home.sport_id = s.id
JOIN public.teams away ON away.name = 'Manchester City' AND away.sport_id = s.id
WHERE s.name = 'soccer';

-- Basketball: Lakers vs Celtics
INSERT INTO public.games (sport_id, home_team_id, away_team_id, scheduled_at, status, week_start)
SELECT
  s.id,
  home.id,
  away.id,
  (date_trunc('week', now()) + interval '3 days' + interval '19 hours'),
  'scheduled',
  date_trunc('week', now())::date
FROM public.sports s
JOIN public.teams home ON home.name = 'Los Angeles Lakers' AND home.sport_id = s.id
JOIN public.teams away ON away.name = 'Boston Celtics'     AND away.sport_id = s.id
WHERE s.name = 'basketball';

-- ── Suggestion Templates ──────────────────────────────────────────────────────
-- Pre-game suggestions (outcome is NULL for pre-game)
INSERT INTO public.suggestion_templates (phase, outcome, emotion, text, tone) VALUES
  ('pre_game', NULL, 'excited',  'Channel that energy — the beautiful game is about to begin! Take a deep breath and enjoy every moment.', 'encouraging'),
  ('pre_game', NULL, 'excited',  'Your excitement is part of what makes sport so powerful. Soak it all in!', 'celebratory'),
  ('pre_game', NULL, 'nervous',  'A little nervousness means you care. That caring is what makes being a fan so special.', 'reassuring'),
  ('pre_game', NULL, 'nervous',  'Those butterflies are normal — it shows how much this game means to you. You''ve got this!', 'hopeful'),
  ('pre_game', NULL, 'anxious',  'Sport is unpredictable, and that''s what makes it beautiful. Whatever happens, enjoy the journey.', 'calming'),
  ('pre_game', NULL, 'anxious',  'Take a moment to breathe. The game will unfold on its own terms — you''re here to enjoy it.', 'calming'),
  ('pre_game', NULL, 'hopeful',  'Hope is the heartbeat of every fan. Keep believing!', 'hopeful'),
  ('pre_game', NULL, 'hopeful',  'Your hope is your team''s invisible twelfth player. Go cheer them on!', 'encouraging'),
  ('pre_game', NULL, 'stressed', 'Remember: sport is meant to bring joy. Take it one minute at a time.', 'calming'),
  ('pre_game', NULL, 'stressed', 'Step back and take a breath. Winning or losing, your team appreciates your unwavering support.', 'reassuring'),
  ('pre_game', NULL, 'calm',     'A calm mind is a fan''s superpower. Enjoy the game with a clear head!', 'encouraging'),
  ('pre_game', NULL, 'calm',     'Your peace of mind will make this match even more enjoyable. Savour every play.', 'positive'),
  ('pre_game', NULL, 'proud',    'Pride in your team is something truly special. Wear it with joy!', 'celebratory'),
  ('pre_game', NULL, 'happy',    'Your happiness is contagious — share it with fellow fans!', 'celebratory'),

-- Post-game suggestions: WIN
  ('post_game', 'home_win', 'happy',   'What a day to be a fan! Celebrate with joy — you''ve earned this moment.', 'celebratory'),
  ('post_game', 'home_win', 'happy',   'Soak in every bit of this victory. Moments like these are what sport is all about!', 'celebratory'),
  ('post_game', 'home_win', 'excited', 'Victory tastes sweet — savour it! Your energy helped drive the team forward.', 'celebratory'),
  ('post_game', 'home_win', 'proud',   'Your pride is well-placed. What a performance to be part of!', 'celebratory'),
  ('post_game', 'home_win', 'relieved','Relief and joy — what a combination! Your belief never wavered.', 'positive'),
  ('post_game', 'home_win', 'calm',    'A calm fan, a big win. You handled the pressure beautifully — just like the team.', 'celebratory'),
  ('post_game', 'away_win', 'happy',   'What a day to be a fan! Celebrate with joy — you''ve earned this moment.', 'celebratory'),
  ('post_game', 'away_win', 'excited', 'Victory tastes sweet — savour it! Your energy helped drive the team forward.', 'celebratory'),
  ('post_game', 'away_win', 'proud',   'Your pride is well-placed. What a performance to be part of!', 'celebratory'),

-- Post-game suggestions: LOSS
  ('post_game', 'home_win', 'disappointed', 'It stings now, and that''s okay. Your loyalty through tough moments defines true fandom.', 'hopeful'),
  ('post_game', 'home_win', 'disappointed', 'Every champion has tough days. How the team responds next time is what matters most.', 'encouraging'),
  ('post_game', 'home_win', 'devastated',   'It''s okay to feel this deeply — it shows how much you care. Tomorrow the sun rises, and so does hope.', 'hopeful'),
  ('post_game', 'home_win', 'devastated',   'Being a fan means riding the highs and lows together. Your team needs supporters like you most after tough losses.', 'encouraging'),
  ('post_game', 'home_win', 'frustrated',   'That frustration is valid. Give yourself a moment, then remember: every season has its turning points.', 'calming'),
  ('post_game', 'home_win', 'stressed',     'Let the tension go. You showed up, you cared — that''s what being a fan is. Rest up and reset.', 'calming'),
  ('post_game', 'away_win', 'disappointed', 'It stings now, and that''s okay. Your loyalty through tough moments defines true fandom.', 'hopeful'),
  ('post_game', 'away_win', 'devastated',   'It''s okay to feel this deeply — it shows how much you care. Tomorrow the sun rises, and so does hope.', 'hopeful'),
  ('post_game', 'away_win', 'frustrated',   'That frustration is valid. Give yourself a moment, then remember: every season has its turning points.', 'calming'),

-- Post-game suggestions: DRAW
  ('post_game', 'draw', 'calm',         'A point shared, momentum maintained. Sometimes the draw is the most dramatic result of all.', 'positive'),
  ('post_game', 'draw', 'disappointed', 'A draw feels like a missed chance, but the team fought and didn''t give up. That resilience matters.', 'encouraging'),
  ('post_game', 'draw', 'relieved',     'A hard-earned point — nothing to be disappointed about. The team showed character.', 'positive'),
  ('post_game', 'draw', 'frustrated',   'Draws can be frustrating, but they show the competitive spirit of the sport. Onward!', 'encouraging');
