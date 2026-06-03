'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

interface Props { teamId: string; teamName: string }

export function TeamHistoryStats({ teamId, teamName }: Props) {
  const supabase = createClient()

  const { data: stats } = useQuery({
    queryKey: ['team-stats', teamId],
    queryFn: async () => {
      const { data } = await supabase
        .from('team_historical_stats')
        .select('*')
        .eq('team_id', teamId)
        .single()
      return data
    },
  })

  const { data: featuredPlayers } = useQuery({
    queryKey: ['team-players-featured', teamId],
    queryFn: async () => {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .eq('is_featured', true)
        .limit(3)
      return data ?? []
    },
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h3 className="text-sm font-bold text-gray-900">{teamName}</h3>

      {stats ? (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-black text-gray-900">{stats.total_games}</p>
            <p className="text-xs text-gray-400">Games</p>
          </div>
          <div>
            <p className="text-xl font-black text-green-600">{stats.wins}</p>
            <p className="text-xs text-gray-400">Wins</p>
          </div>
          <div>
            <p className="text-xl font-black text-gray-400">{stats.draws}</p>
            <p className="text-xs text-gray-400">Draws</p>
          </div>
          {stats.avg_possession && (
            <div className="col-span-3">
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${Math.min(Number(stats.avg_possession), 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{stats.avg_possession}% avg possession</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400">No historical stats available yet.</p>
      )}

      {featuredPlayers && featuredPlayers.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Top Players</p>
          <div className="space-y-1">
            {featuredPlayers.map((p) => (
              <div key={p.id} className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-800">{p.name}</span>
                {p.position && (
                  <span className="text-xs text-gray-400">· {p.position}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
