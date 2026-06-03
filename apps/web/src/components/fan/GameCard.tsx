import Link from 'next/link'
import type { Game } from '@sport-fan/types'

interface Props { game: Game }

const STATUS_BADGE: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  live:      'bg-red-100 text-red-700',
  finished:  'bg-gray-100 text-gray-600',
  cancelled: 'bg-yellow-100 text-yellow-700',
}

export function GameCard({ game }: Props) {
  const date = new Date(game.scheduled_at)
  const isFinished = game.status === 'finished'

  return (
    <Link
      href={`/games/${game.id}`}
      className="block bg-white rounded-2xl border border-gray-200 p-5 hover:border-brand-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[game.status] ?? ''}`}>
          {game.status === 'live' ? '🔴 LIVE' : game.status.charAt(0).toUpperCase() + game.status.slice(1)}
        </span>
        <span className="text-xs text-gray-400">
          {date.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}
          {' · '}
          {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <p className="font-bold text-gray-900 text-lg leading-tight">{game.home_team.name}</p>
          {game.home_team.short_name && (
            <p className="text-xs text-gray-400">{game.home_team.short_name}</p>
          )}
        </div>

        <div className="text-center min-w-[60px]">
          {isFinished && game.home_score !== null && game.away_score !== null ? (
            <p className="text-2xl font-black text-gray-900">
              {game.home_score} – {game.away_score}
            </p>
          ) : (
            <p className="text-sm font-semibold text-gray-400">vs</p>
          )}
        </div>

        <div className="flex-1 text-center">
          <p className="font-bold text-gray-900 text-lg leading-tight">{game.away_team.name}</p>
          {game.away_team.short_name && (
            <p className="text-xs text-gray-400">{game.away_team.short_name}</p>
          )}
        </div>
      </div>

      {game.venue && (
        <p className="mt-3 text-center text-xs text-gray-400">{game.venue}</p>
      )}
    </Link>
  )
}
