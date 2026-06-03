import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminGamesPage() {
  const supabase = await createClient()
  const { data: games } = await supabase
    .from('games')
    .select('*, home_team:teams!home_team_id(name, short_name), away_team:teams!away_team_id(name, short_name), sport:sports(display)')
    .order('scheduled_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Games</h1>
        <Link href="/admin/games/new" className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors">
          + Schedule game
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Game</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Sport</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Score</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(games ?? []).map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {(g.home_team as {name:string}).name} vs {(g.away_team as {name:string}).name}
                </td>
                <td className="px-4 py-3 text-gray-500">{(g.sport as {display:string}).display}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(g.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    g.status === 'finished' ? 'bg-gray-100 text-gray-600' :
                    g.status === 'live'     ? 'bg-red-100 text-red-700' :
                    g.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {g.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {g.home_score !== null ? `${g.home_score} – ${g.away_score}` : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/games/${g.id}/result`} className="text-xs text-brand-600 hover:underline">
                    {g.status === 'finished' ? 'View' : 'Enter result'}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(games ?? []).length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">No games yet.</p>
        )}
      </div>
    </div>
  )
}
