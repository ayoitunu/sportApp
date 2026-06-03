-- Postgres enum types for the Sport Fan app.
-- All enums are prefixed with nothing — they live in the public schema.

CREATE TYPE sport_type AS ENUM ('soccer', 'basketball');
CREATE TYPE game_status AS ENUM ('scheduled', 'live', 'finished', 'cancelled');
CREATE TYPE game_outcome AS ENUM ('home_win', 'away_win', 'draw');
CREATE TYPE check_in_phase AS ENUM ('pre_game', 'post_game');
CREATE TYPE emotion_type AS ENUM (
  'excited', 'nervous', 'anxious', 'hopeful',
  'stressed', 'calm', 'happy', 'devastated',
  'frustrated', 'proud', 'disappointed', 'relieved'
);
CREATE TYPE app_role AS ENUM ('fan', 'admin');
