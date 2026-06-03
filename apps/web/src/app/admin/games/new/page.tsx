import { createClient } from '@/lib/supabase/server'
import { GameForm } from '@/components/admin/GameForm'

export default async function NewGamePage() {
  const supabase = await createClient()
  const { data: sports } = await supabase.from('sports').select('*').eq('is_active', true)
  const { data: teams } = await supabase.from('teams').select('*, sport:sports(name)').order('name')

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Schedule a game</h1>
      <GameForm sports={sports ?? []} teams={teams ?? []} />
    </div>
  )
}
