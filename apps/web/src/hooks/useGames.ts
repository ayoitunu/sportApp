'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getWeekStart, getWeekEnd, toDateString } from '@sport-fan/shared-logic'
import type { Game } from '@sport-fan/types'

export function useCurrentWeekGames(sportId?: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['games', 'week', sportId],
    queryFn: async (): Promise<Game[]> => {
      const weekStart = toDateString(getWeekStart(new Date()))
      const weekEnd = toDateString(getWeekEnd(getWeekStart(new Date())))
      let query = supabase
        .from('games')
        .select(`*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)`)
        .gte('week_start', weekStart)
        .lte('week_start', weekEnd)
        .in('status', ['scheduled', 'live', 'finished'])
        .order('scheduled_at', { ascending: true })

      if (sportId) query = query.eq('sport_id', sportId)

      const { data, error } = await query
      if (error) throw error
      return (data as Game[]) ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useGame(gameId: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: async (): Promise<Game | null> => {
      const { data, error } = await supabase
        .from('games')
        .select(`*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*), sport:sports(*)`)
        .eq('id', gameId)
        .single()
      if (error) throw error
      return data as Game
    },
    staleTime: 2 * 60 * 1000,
  })
}
