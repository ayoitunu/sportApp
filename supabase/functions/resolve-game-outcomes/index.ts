import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const API_FOOTBALL_KEY = Deno.env.get('API_FOOTBALL_KEY')!
const BALLDONTLIE_KEY = Deno.env.get('BALLDONTLIE_KEY')!

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Find games that are live or scheduled but started more than 2 hours ago
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  const { data: games } = await supabase
    .from('games')
    .select('id, external_id, status, scheduled_at, sport:sports(name)')
    .or(`status.eq.live,and(status.eq.scheduled,scheduled_at.lte.${twoHoursAgo})`)
    .not('external_id', 'is', null)
    .limit(20)

  if (!games || games.length === 0) {
    return new Response(JSON.stringify({ resolved: 0 }), { headers: { 'Content-Type': 'application/json' } })
  }

  let resolved = 0

  for (const game of games) {
    const sport = (game.sport as { name: string } | null)?.name
    try {
      if (sport === 'soccer' && game.external_id) {
        const res = await fetch(
          `https://v3.football.api-sports.io/fixtures?id=${game.external_id}`,
          { headers: { 'x-apisports-key': API_FOOTBALL_KEY } }
        )
        const json = await res.json() as { response: unknown[] }
        const fixture = (json.response as { goals: { home: number | null; away: number | null }; fixture: { status: { short: string } } }[])[0]
        if (!fixture) continue

        const statusMap: Record<string, string> = {
          'FT': 'finished', 'AET': 'finished', 'PEN': 'finished',
          '1H': 'live', 'HT': 'live', '2H': 'live', 'ET': 'live',
        }
        const newStatus = statusMap[fixture.fixture.status.short]
        if (!newStatus) continue

        const { goals } = fixture
        const outcome = newStatus === 'finished' && goals.home !== null && goals.away !== null
          ? goals.home > goals.away ? 'home_win' : goals.away > goals.home ? 'away_win' : 'draw'
          : null

        await supabase.from('games').update({
          status: newStatus,
          home_score: goals.home,
          away_score: goals.away,
          outcome,
        }).eq('id', game.id)

        resolved++
      } else if (sport === 'basketball' && game.external_id) {
        const res = await fetch(
          `https://api.balldontlie.io/v1/games/${game.external_id}`,
          { headers: { Authorization: BALLDONTLIE_KEY } }
        )
        const data = await res.json() as {
          status: string; period: number
          home_team_score: number; visitor_team_score: number
        }

        const newStatus = data.status === 'Final' ? 'finished' : data.period > 0 ? 'live' : 'scheduled'
        const outcome = newStatus === 'finished'
          ? data.home_team_score > data.visitor_team_score ? 'home_win' : 'away_win'
          : null

        await supabase.from('games').update({
          status: newStatus,
          home_score: data.home_team_score || null,
          away_score: data.visitor_team_score || null,
          outcome,
        }).eq('id', game.id)

        resolved++
      }
    } catch (_err) {
      // Continue resolving other games even if one fails
    }
  }

  return new Response(
    JSON.stringify({ resolved, total: games.length }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
