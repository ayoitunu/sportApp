import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TeamForm } from '@/components/admin/TeamForm'
import type { Sport } from '@sport-fan/types'

export default async function EditTeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params
  const supabase = await createClient()

  const [{ data: rawTeam }, { data: rawSports }] = await Promise.all([
    supabase.from('teams').select('*').eq('id', teamId).single(),
    supabase.from('sports').select('*').eq('is_active', true).order('display'),
  ])

  if (!rawTeam) notFound()

  const team = rawTeam as {
    id: string; sport_id: string; name: string; short_name: string | null
    country: string; league: string; logo_url: string | null
  }
  const sports = (rawSports ?? []) as Sport[]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/teams" className="text-sm text-gray-400 hover:text-gray-700">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit team</h1>
      </div>
      <TeamForm sports={sports} existing={team} />
    </div>
  )
}
