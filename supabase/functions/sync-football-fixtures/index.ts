import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const API_FOOTBALL_KEY = Deno.env.get('API_FOOTBALL_KEY')!

// API-Football league IDs to sync (configurable)
const LEAGUE_IDS = [39, 140, 135, 78] // Premier League, La Liga, Serie A, Bundesliga
const SEASON = 2025

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

  // Get the soccer sport ID
  const { data: sport } = await supabase
    .from('sports')
    .select('id')
    .eq('name', 'soccer')
    .single()

  if (!sport) {
    return new Response(JSON.stringify({ error: 'Soccer sport not found' }), { status: 500 })
  }

  const weekStart = getMondayOfWeek(new Date())
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)

  let synced = 0
  const errors: string[] = []

  for (const leagueId of LEAGUE_IDS) {
    try {
      const res = await fetch(
        `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${SEASON}&from=${toDateStr(weekStart)}&to=${toDateStr(weekEnd)}`,
        { headers: { 'x-apisports-key': API_FOOTBALL_KEY } }
      )
      const json = await res.json() as { response: unknown[] }

      for (const fixture of json.response as {
        fixture: { id: number; date: string; venue: { name: string } }
        teams: { home: { id: number; name: string; logo: string }; away: { id: number; name: string; logo: string } }
        league: { name: string; country: string }
        goals: { home: number | null; away: number | null }
        fixture: { status: { short: string } }
      }[]) {
        const { fixture: fix, teams, league, goals } = fixture

        // Upsert home team
        const { data: homeTeam } = await supabase
          .from('teams')
          .upsert({
            sport_id: sport.id,
            name: teams.home.name,
            logo_url: teams.home.logo,
            country: league.country,
            league: league.name,
            external_id: teams.home.id.toString(),
          }, { onConflict: 'sport_id,external_id' })
          .select('id')
          .single()

        // Upsert away team
        const { data: awayTeam } = await supabase
          .from('teams')
          .upsert({
            sport_id: sport.id,
            name: teams.away.name,
            logo_url: teams.away.logo,
            country: league.country,
            league: league.name,
            external_id: teams.away.id.toString(),
          }, { onConflict: 'sport_id,external_id' })
          .select('id')
          .single()

        if (!homeTeam || !awayTeam) continue

        const statusMap: Record<string, string> = {
          'NS': 'scheduled', 'TBD': 'scheduled',
          '1H': 'live', 'HT': 'live', '2H': 'live', 'ET': 'live',
          'FT': 'finished', 'AET': 'finished', 'PEN': 'finished',
          'PST': 'cancelled', 'CANC': 'cancelled',
        }
        const status = statusMap[fix.status.short] ?? 'scheduled'
        const outcome = status === 'finished' && goals.home !== null && goals.away !== null
          ? goals.home > goals.away ? 'home_win' : goals.away > goals.home ? 'away_win' : 'draw'
          : null

        await supabase.from('games').upsert({
          sport_id: sport.id,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          scheduled_at: fix.date,
          status,
          outcome,
          home_score: goals.home,
          away_score: goals.away,
          venue: fix.venue?.name ?? null,
          external_id: fix.id.toString(),
          week_start: toDateStr(weekStart),
        }, { onConflict: 'external_id' })

        synced++
      }
    } catch (err) {
      errors.push(`League ${leagueId}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return new Response(
    JSON.stringify({ synced, errors }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
