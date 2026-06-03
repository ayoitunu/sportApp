-- Register Edge Function cron schedules via pg_cron + pg_net.
-- Run this in the Supabase SQL editor after deploying Edge Functions.

-- Daily at 2 AM UTC: sync football fixtures for the current week
SELECT cron.schedule(
  'sync-football-fixtures',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/sync-football-fixtures',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);

-- Daily at 2 AM UTC: sync basketball fixtures
SELECT cron.schedule(
  'sync-basketball-fixtures',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/sync-basketball-fixtures',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);

-- Every 15 minutes: resolve game outcomes
SELECT cron.schedule(
  'resolve-game-outcomes',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/resolve-game-outcomes',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);
