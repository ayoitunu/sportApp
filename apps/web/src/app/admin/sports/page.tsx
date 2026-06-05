import { createClient } from '@/lib/supabase/server'
import { SportRow } from '@/components/admin/SportRow'

type Sport = { id: string; name: string; display: string; is_active: boolean }

export default async function AdminSportsPage() {
  const supabase = await createClient()
  const { data: rawSports } = await supabase.from('sports').select('*').order('name')
  const sports = (rawSports ?? []) as Sport[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sports</h1>
        <p className="text-sm text-gray-500 mt-1">Toggle sports on/off and edit display names. Changes affect fan onboarding immediately.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Sport</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Display name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Active</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sports.map((s) => <SportRow key={s.id} sport={s} />)}
          </tbody>
        </table>
        {sports.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">No sports configured.</p>
        )}
      </div>
    </div>
  )
}
