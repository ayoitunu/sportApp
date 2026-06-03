'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CheckInWithDetails } from '@sport-fan/types'

export function useUserHistory() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['user-history'],
    queryFn: async (): Promise<CheckInWithDetails[]> => {
      const { data, error } = await supabase
        .from('check_ins')
        .select(`
          *,
          game:games(*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)),
          suggestion:suggestion_templates(*)
        `)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return (data as CheckInWithDetails[]) ?? []
    },
  })
}
