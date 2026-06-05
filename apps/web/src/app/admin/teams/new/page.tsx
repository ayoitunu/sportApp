import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TeamForm } from '@/components/admin/TeamForm'
import type { Sport } from '@sport-fan/types'

export default async function NewTeamPage() {
  const supabase = await createClient()
  const { data: rawSports } = await supabase.from('sports').select('*').eq('is_active', true).order('display')
  const sports = (rawSports ?? []) as Sport[]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/teams" className="text-sm text-gray-400 hover:text-gray-700">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Add team</h1>
      </div>
      <TeamForm sports={sports} />
    </div>
  )
}
