'use client'
import { use, useEffect } from 'react'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useGame } from '@/hooks/useGames'
import { useGameAnalytics } from '@/hooks/useGameAnalytics'
import { FanSentimentComparison } from '@/components/game-analytics/FanSentimentComparison'
import { MoodPieChart } from '@/components/game-analytics/MoodPieChart'
import { TeamHistoryStats } from '@/components/game-analytics/TeamHistoryStats'
import { isGameStarted } from '@sport-fan/shared-logic'

export default function GameDetailPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params)
  const queryClient = useQueryClient()
  const { data: game, isLoading } = useGame(gameId)

  // Subscribe to Realtime updates for this game
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`game-${gameId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`,
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['game', gameId] })
        queryClient.invalidateQueries({ queryKey: ['game-analytics', gameId] })
      })
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [gameId, queryClient])

  const { data: analytics } = useGameAnalytics(
    gameId,
    game?.home_team_id ?? '',
    game?.away_team_id ?? ''
  )

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-28 bg-gray-100 rounded-2xl" /><div className="h-48 bg-gray-100 rounded-2xl" /></div>
  if (!game) return <p className="text-red-600">Game not found.</p>

  const started = isGameStarted(game.scheduled_at)
  const finished = game.status === 'finished'

  return (
    <div className="space-y-6">
      {/* Game header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            game.status === 'live' ? 'bg-red-100 text-red-700' :
            finished ? 'bg-gray-100 text-gray-600' :
            'bg-blue-100 text-blue-700'
          }`}>
            {game.status === 'live' ? '🔴 LIVE' : game.status.charAt(0).toUpperCase() + game.status.slice(1)}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(game.scheduled_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <p className="text-2xl font-black text-gray-900">{game.home_team.name}</p>
            <p className="text-xs text-gray-400">{game.home_team.league}</p>
          </div>
          <div className="text-center">
            {finished && game.home_score !== null ? (
              <p className="text-4xl font-black text-gray-900">{game.home_score} – {game.away_score}</p>
            ) : (
              <p className="text-lg font-bold text-gray-400">vs</p>
            )}
          </div>
          <div className="flex-1 text-center">
            <p className="text-2xl font-black text-gray-900">{game.away_team.name}</p>
            <p className="text-xs text-gray-400">{game.away_team.league}</p>
          </div>
        </div>
      </div>

      {/* Check-in CTAs */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/games/${gameId}/pre-checkin`}
          className="rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white text-center hover:bg-brand-700 transition-colors"
        >
          Before game check-in
        </Link>
        <Link
          href={`/games/${gameId}/post-checkin`}
          className={`rounded-xl py-3 text-sm font-semibold text-center transition-colors ${
            finished
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
          }`}
        >
          {finished ? 'After game check-in' : 'After game (not yet)'}
        </Link>
      </div>

      {/* Fan sentiment analytics */}
      {analytics && (analytics.pre || analytics.post) && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Fan Sentiment</h2>
          {analytics.pre && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Before the game</h3>
              <FanSentimentComparison
                data={analytics.pre.comparison}
                homeTeam={game.home_team.name}
                awayTeam={game.away_team.name}
                homeTotal={analytics.pre.homeTotal}
                awayTotal={analytics.pre.awayTotal}
              />
              <div className="grid grid-cols-2 gap-4">
                <MoodPieChart data={analytics.pre.home} title={`${game.home_team.short_name ?? game.home_team.name} fans`} />
                <MoodPieChart data={analytics.pre.away} title={`${game.away_team.short_name ?? game.away_team.name} fans`} />
              </div>
            </div>
          )}
          {analytics.post && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">After the game</h3>
              <FanSentimentComparison
                data={analytics.post.comparison}
                homeTeam={game.home_team.name}
                awayTeam={game.away_team.name}
                homeTotal={analytics.post.homeTotal}
                awayTotal={analytics.post.awayTotal}
              />
            </div>
          )}
        </div>
      )}

      {/* Team history stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TeamHistoryStats teamId={game.home_team_id} teamName={game.home_team.name} />
        <TeamHistoryStats teamId={game.away_team_id} teamName={game.away_team.name} />
      </div>
    </div>
  )
}
