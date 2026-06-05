'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { GameCard } from '@/components/fan/GameCard'
import { useCurrentWeekGames } from '@/hooks/useGames'
import type { Sport } from '@sport-fan/types'

export default function GamesPage() {
  const [selectedSportId, setSelectedSportId] = useState<string | undefined>()
  const supabase = createClient()

  const { data: sports } = useQuery({
    queryKey: ['sports'],
    queryFn: async (): Promise<Sport[]> => {
      const { data } = await supabase.from('sports').select('*').eq('is_active', true)
      return data ?? []
    },
  })

  const { data: games, isLoading, error } = useCurrentWeekGames(selectedSportId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white">
          This Week
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Select a game to check in before or after the match.</p>
      </div>

      {/* Sport filter pills */}
      {sports && sports.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <FilterPill active={!selectedSportId} onClick={() => setSelectedSportId(undefined)}>
            All sports
          </FilterPill>
          {sports.map((s) => (
            <FilterPill
              key={s.id}
              active={selectedSportId === s.id}
              onClick={() => setSelectedSportId(s.id)}
            >
              {s.display}
            </FilterPill>
          ))}
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-pitch-800 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-950/50 border border-red-800/50 p-4 text-sm text-red-400">
          Failed to load games. Please try again.
        </div>
      )}

      {/* Empty state */}
      {games && games.length === 0 && !isLoading && (
        <div className="text-center py-16 text-gray-600">
          <p className="font-display text-5xl mb-3 text-gray-700">—</p>
          <p className="font-semibold text-gray-500">No games scheduled this week.</p>
          <p className="text-sm mt-1">Check back soon.</p>
        </div>
      )}

      {/* Game cards */}
      {games && games.length > 0 && (
        <div className="space-y-3">
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
        active
          ? 'bg-live-500 text-pitch-950 font-bold'
          : 'bg-pitch-800 border border-pitch-600 text-gray-400 hover:border-live-500/40 hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}
