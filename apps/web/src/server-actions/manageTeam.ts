'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface TeamInput {
  sport_id: string
  name: string
  short_name: string
  country: string
  league: string
  logo_url: string
}

export async function createTeam(input: TeamInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('teams').insert({
    ...input,
    short_name: input.short_name || null,
    logo_url: input.logo_url || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/teams')
}

export async function updateTeam(id: string, input: TeamInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('teams').update({
    ...input,
    short_name: input.short_name || null,
    logo_url: input.logo_url || null,
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/teams')
}
