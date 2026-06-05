'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleSportActive(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('sports').update({ is_active }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/sports')
}

export async function updateSportDisplay(id: string, display: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sports').update({ display }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/sports')
}
