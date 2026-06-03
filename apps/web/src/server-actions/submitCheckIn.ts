'use server'
import { createClient } from '@/lib/supabase/server'
import { pickSuggestion } from '@sport-fan/shared-logic'
import type { CheckInPhase, EmotionType, GameOutcome, SubmitCheckInResponse } from '@sport-fan/types'

export async function submitCheckIn(
  gameId: string,
  teamId: string,
  phase: CheckInPhase,
  emotion: EmotionType,
  notes?: string
): Promise<SubmitCheckInResponse> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')

  // Get game outcome for post-game suggestion matching
  let outcome: GameOutcome | null = null
  if (phase === 'post_game') {
    const { data: game } = await supabase
      .from('games')
      .select('outcome')
      .eq('id', gameId)
      .single()
    outcome = game?.outcome ?? null
  }

  // Find matching suggestion templates
  let templateQuery = supabase
    .from('suggestion_templates')
    .select('id, text, tone')
    .eq('phase', phase)
    .eq('emotion', emotion)
    .eq('is_active', true)

  if (outcome) {
    templateQuery = templateQuery.eq('outcome', outcome)
  } else {
    templateQuery = templateQuery.is('outcome', null)
  }

  const { data: templates } = await templateQuery
  const chosen = pickSuggestion(templates ?? [])

  // Insert check-in
  const { data: checkIn, error: insertError } = await supabase
    .from('check_ins')
    .insert({
      user_id: user.id,
      game_id: gameId,
      team_id: teamId,
      phase,
      emotion,
      notes: notes ?? null,
      suggestion_id: chosen?.id ?? null,
    })
    .select('id')
    .single()

  if (insertError) throw new Error(insertError.message)

  return {
    checkInId: checkIn.id,
    suggestion: chosen ? { id: chosen.id, text: chosen.text, tone: chosen.tone } : null,
  }
}
