'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CheckInPhase, EmotionType, GameOutcome } from '@sport-fan/types'

interface SuggestionInput {
  phase: CheckInPhase
  emotion: EmotionType
  outcome: GameOutcome | null
  text: string
  tone: string
  is_active: boolean
}

export async function createSuggestion(input: SuggestionInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('suggestion_templates').insert(input)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/suggestions')
}

export async function updateSuggestion(id: string, input: SuggestionInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('suggestion_templates').update(input).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/suggestions')
}

export async function toggleSuggestionActive(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('suggestion_templates').update({ is_active }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/suggestions')
}

export async function deleteSuggestion(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('suggestion_templates').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/suggestions')
}
