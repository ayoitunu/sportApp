import { createClient } from '@/lib/supabase/server'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [{ count: userCount }, { count: checkInCount }, { count: gameCount }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'fan'),
    supabase.from('check_ins').select('*', { count: 'exact', head: true }),
    supabase.from('games').select('*', { count: 'exact', head: true }).in('status', ['scheduled', 'live']),
  ])

  const stats = [
    { label: 'Registered fans', value: userCount ?? 0, color: 'bg-brand-500' },
    { label: 'Total check-ins', value: checkInCount ?? 0, color: 'bg-green-500' },
    { label: 'Active games', value: gameCount ?? 0, color: 'bg-amber-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of FanPulse activity.</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className={`w-10 h-1.5 rounded-full ${s.color} mb-4`} />
            <p className="text-3xl font-black text-gray-900">{s.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/games/new" className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors">
            + Schedule game
          </a>
          <a href="/admin/teams" className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
            Manage teams
          </a>
          <a href="/admin/suggestions" className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
            Manage suggestions
          </a>
        </div>
      </div>
    </div>
  )
}
