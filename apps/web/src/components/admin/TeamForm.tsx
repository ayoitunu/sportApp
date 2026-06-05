'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTeam, updateTeam } from '@/server-actions/manageTeam'
import type { Sport } from '@sport-fan/types'

type ExistingTeam = {
  id: string
  sport_id: string
  name: string
  short_name: string | null
  country: string
  league: string
  logo_url: string | null
}

interface Props {
  sports: Sport[]
  existing?: ExistingTeam
}

export function TeamForm({ sports, existing }: Props) {
  const router = useRouter()
  const [sportId, setSportId]     = useState(existing?.sport_id ?? '')
  const [name, setName]           = useState(existing?.name ?? '')
  const [shortName, setShortName] = useState(existing?.short_name ?? '')
  const [country, setCountry]     = useState(existing?.country ?? '')
  const [league, setLeague]       = useState(existing?.league ?? '')
  const [logoUrl, setLogoUrl]     = useState(existing?.logo_url ?? '')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const input = { sport_id: sportId, name, short_name: shortName, country, league, logo_url: logoUrl }
      if (existing) {
        await updateTeam(existing.id, input)
      } else {
        await createTeam(input)
      }
      router.push('/admin/teams')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
        <select value={sportId} onChange={(e) => setSportId(e.target.value)} required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">Select sport…</option>
          {sports.map((s) => <option key={s.id} value={s.id}>{s.display}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Team name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
          placeholder="e.g. Arsenal" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short name</label>
          <input type="text" value={shortName} onChange={(e) => setShortName(e.target.value)}
            placeholder="e.g. ARS" maxLength={5}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required
            placeholder="e.g. England" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">League</label>
        <input type="text" value={league} onChange={(e) => setLeague(e.target.value)} required
          placeholder="e.g. Premier League" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (optional)</label>
        <input type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://…" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition-colors">
        {loading ? 'Saving…' : existing ? 'Save changes' : 'Create team'}
      </button>
    </form>
  )
}
