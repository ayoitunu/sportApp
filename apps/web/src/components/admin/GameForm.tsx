'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getWeekStart, toDateString } from '@sport-fan/shared-logic'
import type { Sport, Team } from '@sport-fan/types'

interface Props {
  sports: Sport[]
  teams: (Team & { sport: { name: string } | null })[]
}

export function GameForm({ sports, teams }: Props) {
  const router = useRouter()
  const [sportId, setSportId] = useState('')
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [venue, setVenue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filteredTeams = sportId ? teams.filter((t) => t.sport_id === sportId) : []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (homeTeamId === awayTeamId) { setError('Home and away team must be different.'); return }
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const weekStart = toDateString(getWeekStart(new Date(scheduledAt)))
    const { error: insertError } = await supabase.from('games').insert({
      sport_id: sportId,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      scheduled_at: new Date(scheduledAt).toISOString(),
      week_start: weekStart,
      status: 'scheduled',
    })
    setLoading(false)
    if (insertError) { setError(insertError.message); return }
    router.push('/admin/games')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
        <select value={sportId} onChange={(e) => { setSportId(e.target.value); setHomeTeamId(''); setAwayTeamId('') }}
          required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">Select sport…</option>
          {sports.map((s) => <option key={s.id} value={s.id}>{s.display}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Home team</label>
        <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)}
          required disabled={!sportId} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50">
          <option value="">Select home team…</option>
          {filteredTeams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Away team</label>
        <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)}
          required disabled={!sportId} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50">
          <option value="">Select away team…</option>
          {filteredTeams.filter((t) => t.id !== homeTeamId).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date &amp; time</label>
        <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
          required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Venue (optional)</label>
        <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)}
          placeholder="e.g. Emirates Stadium" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition-colors">
        {loading ? 'Saving…' : 'Schedule game'}
      </button>
    </form>
  )
}
