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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">This Week&#39;s Games</h1>
        <p className="text-gray-500 mt-1">Select a game to check in before or after the match.</p>
      </div>

      {/* Sport filter */}
      {sports && sports.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedSportId(undefined)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedSportId ? 'bg-brand-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-brand-400'
            }`}
          >
            All sports
          </button>
          {sports.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSportId(s.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedSportId === s.id ? 'bg-brand-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-brand-400'
              }`}
            >
              {s.display}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          Failed to load games. Please try again.
        </div>
      )}

      {games && games.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium">No games scheduled this week.</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      )}

      {games && games.length > 0 && (
        <div className="space-y-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
