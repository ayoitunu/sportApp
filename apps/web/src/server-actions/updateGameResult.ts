'use server'
import { createClient } from '@/lib/supabase/server'
import { deriveOutcome } from '@sport-fan/shared-logic'
import type { UpdateGameResultResponse } from '@sport-fan/types'

export async function updateGameResult(
  gameId: string,
  homeScore: number,
  awayScore: number
): Promise<UpdateGameResultResponse> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.app_metadata?.['role'] as string | undefined
  if (role !== 'admin') throw new Error('Forbidden')

  const outcome = deriveOutcome(homeScore, awayScore)

  const { error } = await supabase
    .from('games')
    .update({ home_score: homeScore, away_score: awayScore, outcome, status: 'finished' })
    .eq('id', gameId)

  if (error) throw new Error(error.message)
  return { outcome }
}
