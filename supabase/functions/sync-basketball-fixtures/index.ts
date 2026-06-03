import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const BALLDONTLIE_KEY = Deno.env.get('BALLDONTLIE_KEY')!

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10)
}

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: sport } = await supabase
    .from('sports')
    .select('id')
    .eq('name', 'basketball')
    .single()

  if (!sport) {
    return new Response(JSON.stringify({ error: 'Basketball sport not found' }), { status: 500 })
  }

  const weekStart = getMondayOfWeek(new Date())
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)

  const res = await fetch(
    `https://api.balldontlie.io/v1/games?start_date=${toDateStr(weekStart)}&end_date=${toDateStr(weekEnd)}&per_page=100`,
    { headers: { Authorization: BALLDONTLIE_KEY } }
  )
  const json = await res.json() as { data: unknown[] }

  let synced = 0
  for (const game of json.data as {
    id: number
    date: string
    home_team: { id: number; full_name: string; abbreviation: string }
    visitor_team: { id: number; full_name: string; abbreviation: string }
    home_team_score: number
    visitor_team_score: number
    status: string
    period: number
  }[]) {
    const upsertTeam = async (teamData: { id: number; full_name: string; abbreviation: string }) => {
      const { data } = await supabase
        .from('teams')
        .upsert({
          sport_id: sport.id,
          name: teamData.full_name,
          short_name: teamData.abbreviation,
          country: 'USA',
          league: 'NBA',
          external_id: teamData.id.toString(),
        }, { onConflict: 'sport_id,external_id' })
        .select('id')
        .single()
      return data
    }

    const [homeTeam, awayTeam] = await Promise.all([
      upsertTeam(game.home_team),
      upsertTeam(game.visitor_team),
    ])

    if (!homeTeam || !awayTeam) continue

    const status = game.status === 'Final' ? 'finished'
      : game.period > 0 ? 'live'
      : 'scheduled'
    const outcome = status === 'finished'
      ? game.home_team_score > game.visitor_team_score ? 'home_win' : 'away_win'
      : null

    await supabase.from('games').upsert({
      sport_id: sport.id,
      home_team_id: homeTeam.id,
      away_team_id: awayTeam.id,
      scheduled_at: game.date,
      status,
      outcome,
      home_score: game.home_team_score || null,
      away_score: game.visitor_team_score || null,
      external_id: game.id.toString(),
      week_start: toDateStr(weekStart),
    }, { onConflict: 'external_id' })

    synced++
  }

  return new Response(
    JSON.stringify({ synced }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
