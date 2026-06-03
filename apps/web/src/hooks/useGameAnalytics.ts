'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { buildEmotionDistribution, buildTeamComparisonData } from '@sport-fan/shared-logic'
import type { CheckInPhase, EmotionType } from '@sport-fan/types'

interface PhaseAnalytics {
  home: { emotion: EmotionType; count: number }[]
  away: { emotion: EmotionType; count: number }[]
  comparison: { emotion: EmotionType; home: number; away: number }[]
  homeTotal: number
  awayTotal: number
}

export interface GameAnalytics {
  pre: PhaseAnalytics | null
  post: PhaseAnalytics | null
}

export function useGameAnalytics(gameId: string, homeTeamId: string, awayTeamId: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['game-analytics', gameId],
    queryFn: async (): Promise<GameAnalytics> => {
      const { data, error } = await supabase
        .from('game_emotion_summary')
        .select('*')
        .eq('game_id', gameId)

      if (error) throw error

      function buildPhase(phase: CheckInPhase): PhaseAnalytics | null {
        const phaseRows = (data ?? []).filter((r) => r.phase === phase)
        if (phaseRows.length === 0) return null

        const homeRaw = phaseRows
          .filter((r) => r.team_id === homeTeamId)
          .flatMap((r) => Array(r.fan_count ?? 0).fill({ emotion: r.emotion as EmotionType }))
        const awayRaw = phaseRows
          .filter((r) => r.team_id === awayTeamId)
          .flatMap((r) => Array(r.fan_count ?? 0).fill({ emotion: r.emotion as EmotionType }))

        return {
          home: buildEmotionDistribution(homeRaw),
          away: buildEmotionDistribution(awayRaw),
          comparison: buildTeamComparisonData(homeRaw, awayRaw),
          homeTotal: homeRaw.length,
          awayTotal: awayRaw.length,
        }
      }

      return { pre: buildPhase('pre_game'), post: buildPhase('post_game') }
    },
    staleTime: 60 * 1000,
  })
}
