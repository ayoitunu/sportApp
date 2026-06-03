import { createClient } from '@/lib/supabase/server'
import { EMOTION_META } from '@sport-fan/shared-logic'
import type { EmotionType } from '@sport-fan/types'

export default async function AdminCheckInsPage() {
  const supabase = await createClient()
  const { data: checkIns } = await supabase
    .from('check_ins')
    .select(`
      *,
      game:games(home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)),
      profile:profiles(display_name, username)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Fan Check-ins</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Fan</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Game</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Phase</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Emotion</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(checkIns ?? []).map((c) => {
              const meta = EMOTION_META[c.emotion as EmotionType]
              const game = c.game as { home_team: { name: string }; away_team: { name: string } } | null
              const profile = c.profile as { display_name: string | null; username: string | null } | null
              return (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{profile?.display_name ?? profile?.username ?? 'Anonymous'}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {game ? `${game.home_team.name} vs ${game.away_team.name}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.phase === 'pre_game' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {c.phase === 'pre_game' ? 'Pre-game' : 'Post-game'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span>{meta.emoji}</span>
                      <span className="text-gray-700">{meta.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(checkIns ?? []).length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">No check-ins yet.</p>
        )}
      </div>
    </div>
  )
}
