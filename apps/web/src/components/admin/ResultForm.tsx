'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateGameResult } from '@/server-actions/updateGameResult'

interface Props {
  gameId: string
  homeTeamName: string
  awayTeamName: string
  currentHomeScore: number | null
  currentAwayScore: number | null
}

export function ResultForm({ gameId, homeTeamName, awayTeamName, currentHomeScore, currentAwayScore }: Props) {
  const router = useRouter()
  const [homeScore, setHomeScore] = useState(currentHomeScore?.toString() ?? '')
  const [awayScore, setAwayScore] = useState(currentAwayScore?.toString() ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await updateGameResult(gameId, parseInt(homeScore), parseInt(awayScore))
      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-2">
        <p className="text-2xl">✅</p>
        <p className="font-semibold text-green-800">Result saved!</p>
        <p className="text-sm text-green-700">
          {homeTeamName} {homeScore} – {awayScore} {awayTeamName}
        </p>
        <a href="/admin/games" className="block mt-2 text-sm text-brand-600 hover:underline">Back to games</a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
      <div className="grid grid-cols-3 items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700 mb-2">{homeTeamName}</p>
          <input
            type="number" min="0" max="99" required
            value={homeScore} onChange={(e) => setHomeScore(e.target.value)}
            className="w-full text-center text-2xl font-black rounded-lg border border-gray-300 px-2 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <p className="text-center text-xl font-bold text-gray-400">–</p>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700 mb-2">{awayTeamName}</p>
          <input
            type="number" min="0" max="99" required
            value={awayScore} onChange={(e) => setAwayScore(e.target.value)}
            className="w-full text-center text-2xl font-black rounded-lg border border-gray-300 px-2 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
        {loading ? 'Saving…' : 'Save result'}
      </button>
    </form>
  )
}
