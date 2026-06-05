import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type Team = {
  id: string
  name: string
  short_name: string | null
  country: string
  league: string
  logo_url: string | null
  sport: { display: string } | null
}

export default async function AdminTeamsPage() {
  const supabase = await createClient()
  const { data: rawTeams } = await supabase
    .from('teams')
    .select('*, sport:sports(display)')
    .order('name')

  const teams = (rawTeams ?? []) as Team[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
        <Link
          href="/admin/teams/new"
          className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + Add team
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Sport</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">League</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Country</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teams.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {t.logo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.logo_url} alt="" className="w-6 h-6 object-contain" />
                    )}
                    <span className="font-medium text-gray-900">{t.name}</span>
                    {t.short_name && <span className="text-xs text-gray-400">({t.short_name})</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{t.sport?.display ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{t.league}</td>
                <td className="px-4 py-3 text-gray-500">{t.country}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/teams/${t.id}`} className="text-xs text-brand-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teams.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">No teams yet.</p>
        )}
      </div>
    </div>
  )
}
