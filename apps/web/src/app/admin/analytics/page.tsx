import { createClient } from '@/lib/supabase/server'
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts'
import type { EmotionType } from '@sport-fan/types'

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const [
    { data: rawSummary },
    { data: rawCheckIns },
    { count: fanCount },
    { count: activeGameCount },
  ] = await Promise.all([
    supabase.from('game_emotion_summary').select('emotion, fan_count'),
    supabase
      .from('check_ins')
      .select('created_at, game_id, game:games(home_team:teams!home_team_id(name), away_team:teams!away_team_id(name))')
      .order('created_at', { ascending: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'fan'),
    supabase.from('games').select('*', { count: 'exact', head: true }).in('status', ['scheduled', 'live']),
  ])

  // ── Emotion totals (aggregate across all games) ────────────────────────────
  const emotionMap: Partial<Record<EmotionType, number>> = {}
  for (const row of rawSummary ?? []) {
    const em = row.emotion as EmotionType
    emotionMap[em] = (emotionMap[em] ?? 0) + (row.fan_count as number)
  }
  const emotionTotals = Object.entries(emotionMap)
    .map(([emotion, total]) => ({ emotion: emotion as EmotionType, total: total ?? 0 }))
    .sort((a, b) => b.total - a.total)

  // ── Weekly volume ──────────────────────────────────────────────────────────
  const weekMap: Record<string, number> = {}
  for (const row of rawCheckIns ?? []) {
    const d = new Date(row.created_at)
    // Monday of the week
    const day = d.getDay()
    const diff = (day === 0 ? -6 : 1 - day)
    const mon = new Date(d)
    mon.setDate(d.getDate() + diff)
    const key = mon.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    weekMap[key] = (weekMap[key] ?? 0) + 1
  }
  const weeklyVolume = Object.entries(weekMap).map(([week, count]) => ({ week, count }))

  // ── Top games by check-in count ────────────────────────────────────────────
  const gameMap: Record<string, number> = {}
  for (const row of rawCheckIns ?? []) {
    const game = row.game as { home_team: { name: string }; away_team: { name: string } } | null
    if (!game) continue
    const label = `${game.home_team.name} vs ${game.away_team.name}`
    gameMap[label] = (gameMap[label] ?? 0) + 1
  }
  const topGames = Object.entries(gameMap)
    .map(([game, count]) => ({ game, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const totalCheckIns = rawCheckIns?.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Aggregate fan engagement across all games.</p>
      </div>
      <AnalyticsCharts
        emotionTotals={emotionTotals}
        weeklyVolume={weeklyVolume}
        topGames={topGames}
        totalCheckIns={totalCheckIns}
        totalFans={fanCount ?? 0}
        activeGames={activeGameCount ?? 0}
      />
    </div>
  )
}
