import Link from 'next/link'
import { EMOTION_META } from '@sport-fan/shared-logic'
import type { CheckInWithDetails } from '@sport-fan/types'

interface Props { checkIns: CheckInWithDetails[] }

export function CheckInHistoryList({ checkIns }: Props) {
  return (
    <div className="space-y-3">
      {checkIns.map((c) => {
        const meta = EMOTION_META[c.emotion]
        const game = c.game
        const date = new Date(c.created_at)
        return (
          <Link
            key={c.id}
            href={`/games/${c.game_id}`}
            className="block bg-pitch-900 rounded-2xl border border-pitch-700 p-4 hover:border-live-500/50 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{meta.emoji}</span>
                <div>
                  <p className="font-display text-base font-bold uppercase tracking-tight text-white leading-tight">
                    {game.home_team.name} vs {game.away_team.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {meta.label} · {c.phase === 'pre_game' ? 'Before game' : 'After game'}
                  </p>
                  {c.suggestion && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 italic">
                      &ldquo;{c.suggestion.text}&rdquo;
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap">
                {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
