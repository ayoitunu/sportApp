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


export default function GameDetailPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params)
  const queryClient = useQueryClient()
  const { data: game, isLoading } = useGame(gameId)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`game-${gameId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`,
      }, (_payload) => {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-36 bg-pitch-800 rounded-2xl animate-pulse" />
        <div className="h-12 bg-pitch-800 rounded-xl animate-pulse" />
        <div className="h-48 bg-pitch-800 rounded-2xl animate-pulse" />
      </div>
    )
  }
  if (!game) return <p className="text-red-400">Game not found.</p>

  const isLive = game.status === 'live'
  const finished = game.status === 'finished'

  return (
    <div className="space-y-5">
      {/* Game header card */}
      <div className="rounded-2xl bg-pitch-900 border border-pitch-700 p-6">
        {/* Status + date */}
        <div className="flex items-center justify-between mb-5">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-live-500 uppercase tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-live-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-live-500" />
              </span>
              Live
            </span>
          ) : (
            <span className={`text-xs font-semibold uppercase tracking-wide ${finished ? 'text-gray-500' : 'text-sky-400'}`}>
              {finished ? 'Full Time' : 'Upcoming'}
            </span>
          )}
          <span className="text-xs text-gray-600">
            {new Date(game.scheduled_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {/* Teams + score */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-display text-3xl font-bold uppercase tracking-tight text-white leading-none">{game.home_team.name}</p>
            <p className="text-xs text-gray-600 mt-1">{game.home_team.league}</p>
          </div>
          <div className="text-center flex-shrink-0">
            {finished && game.home_score !== null ? (
              <p className="font-display text-5xl font-bold text-white tabular-nums">
                {game.home_score}<span className="text-gray-600 mx-2">–</span>{game.away_score}
              </p>
            ) : (
              <p className="font-display text-2xl font-bold text-gray-600">VS</p>
            )}
          </div>
          <div className="flex-1 text-right">
            <p className="font-display text-3xl font-bold uppercase tracking-tight text-white leading-none">{game.away_team.name}</p>
            <p className="text-xs text-gray-600 mt-1">{game.away_team.league}</p>
          </div>
        </div>
      </div>

      {/* Check-in CTAs */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/games/${gameId}/pre-checkin`}
          className="rounded-xl bg-live-500 py-3 text-sm font-bold text-pitch-950 text-center hover:bg-live-400 transition-colors"
        >
          Before game check-in
        </Link>
        <Link
          href={`/games/${gameId}/post-checkin`}
          className={`rounded-xl py-3 text-sm font-bold text-center transition-colors ${
            finished
              ? 'bg-pitch-700 text-white hover:bg-pitch-600'
              : 'bg-pitch-800 text-gray-600 cursor-not-allowed pointer-events-none border border-pitch-700'
          }`}
        >
          {finished ? 'After game check-in' : 'After game (not yet)'}
        </Link>
      </div>

      {/* Fan sentiment analytics */}
      {analytics && (analytics.pre || analytics.post) && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold uppercase text-white tracking-tight">Fan Sentiment</h2>
          {analytics.pre && (
            <div className="bg-pitch-900 rounded-2xl border border-pitch-700 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Before the game</h3>
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
            <div className="bg-pitch-900 rounded-2xl border border-pitch-700 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">After the game</h3>
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
