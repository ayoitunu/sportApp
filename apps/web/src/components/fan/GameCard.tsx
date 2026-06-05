'use client'
import Link from 'next/link'
import type { Game } from '@sport-fan/types'

interface Props {
  game: Game
  index?: number
}

export function GameCard({ game, index = 0 }: Props) {
  const date = new Date(game.scheduled_at)
  const isLive = game.status === 'live'
  const isFinished = game.status === 'finished'

  const delayClass = [
    'delay-0', 'delay-75', 'delay-150', 'delay-225', 'delay-300', 'delay-375',
  ][Math.min(index, 5)]

  return (
    <Link
      href={`/games/${game.id}`}
      style={{ opacity: 0 }}
      className={`group block rounded-2xl border border-pitch-700 bg-pitch-900 hover:border-live-500/60 hover:bg-pitch-800 transition-all duration-200 overflow-hidden animate-card-reveal ${delayClass}`}
    >
      {/* Top strip — status + date */}
      <div className="flex items-center justify-between px-5 pt-4 pb-0">
        <StatusBadge status={game.status} isLive={isLive} />
        <span className="text-xs text-gray-500 tabular-nums">
          {date.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}
          {' · '}
          {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Teams + score row */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        {/* Home team */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-2xl font-bold uppercase tracking-tight text-white leading-none truncate">
            {game.home_team.name}
          </p>
          {game.home_team.short_name && (
            <p className="text-xs text-gray-500 mt-0.5">{game.home_team.short_name}</p>
          )}
        </div>

        {/* Score / vs */}
        <div className="text-center flex-shrink-0 px-2">
          {isFinished && game.home_score !== null && game.away_score !== null ? (
            <p className="font-display text-3xl font-bold text-white tabular-nums">
              {game.home_score}<span className="text-gray-500 mx-1">–</span>{game.away_score}
            </p>
          ) : isLive ? (
            <p className="font-display text-xl font-bold text-live-500 tracking-widest animate-pulse">LIVE</p>
          ) : (
            <p className="font-display text-lg font-semibold text-gray-600">VS</p>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 min-w-0 text-right">
          <p className="font-display text-2xl font-bold uppercase tracking-tight text-white leading-none truncate">
            {game.away_team.name}
          </p>
          {game.away_team.short_name && (
            <p className="text-xs text-gray-500 mt-0.5">{game.away_team.short_name}</p>
          )}
        </div>
      </div>

      {/* Venue */}
      {game.venue && (
        <div className="px-5 pb-3 -mt-1">
          <p className="text-xs text-gray-600 text-center">{game.venue}</p>
        </div>
      )}

      {/* Bottom amber accent line — appears on hover */}
      <div className="h-0.5 w-0 group-hover:w-full bg-live-500 transition-all duration-300" />
    </Link>
  )
}

function StatusBadge({ status, isLive }: { status: string; isLive: boolean }) {
  if (isLive) {
    return (
      <span className="relative inline-flex items-center gap-1.5 text-xs font-bold text-live-500 uppercase tracking-wide">
        <span className="relative flex h-2 w-2">
          <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-live-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-live-500" />
        </span>
        Live
      </span>
    )
  }

  const styles: Record<string, string> = {
    scheduled: 'text-sky-400',
    finished:  'text-gray-500',
    cancelled: 'text-yellow-500',
  }

  const labels: Record<string, string> = {
    scheduled: 'Upcoming',
    finished:  'Full Time',
    cancelled: 'Cancelled',
  }

  return (
    <span className={`text-xs font-semibold uppercase tracking-wide ${styles[status] ?? 'text-gray-400'}`}>
      {labels[status] ?? status}
    </span>
  )
}
