'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/hooks/useGames'
import { EmotionPicker } from '@/components/fan/EmotionPicker'
import { SuggestionCard } from '@/components/fan/SuggestionCard'
import { submitCheckIn } from '@/server-actions/submitCheckIn'
import type { EmotionType, SubmitCheckInResponse } from '@sport-fan/types'

export default function PreCheckinPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params)
  const router = useRouter()
  const { data: game, isLoading } = useGame(gameId)
  const [supportedTeamId, setSupportedTeamId] = useState<string | null>(null)
  const [emotion, setEmotion] = useState<EmotionType | null>(null)
  const [result, setResult] = useState<SubmitCheckInResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded-2xl" />
  if (!game) return <p className="text-red-600">Game not found.</p>

  async function handleSubmit() {
    if (!emotion || !supportedTeamId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await submitCheckIn(gameId, supportedTeamId, 'pre_game', emotion)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
    setSubmitting(false)
  }

  if (result) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="text-center space-y-1">
          <p className="text-4xl">✅</p>
          <h2 className="text-xl font-bold text-gray-900">Check-in saved!</h2>
          <p className="text-gray-500 text-sm">Here&#39;s a thought for you before the match:</p>
        </div>
        {result.suggestion && (
          <SuggestionCard text={result.suggestion.text} tone={result.suggestion.tone} phase="pre_game" />
        )}
        <button
          onClick={() => router.push(`/games/${gameId}`)}
          className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          Back to game
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <p className="text-sm text-gray-500 mb-1">Pre-game check-in</p>
        <h1 className="text-xl font-bold text-gray-900">
          {game.home_team.name} vs {game.away_team.name}
        </h1>
      </div>

      {/* Team support selection */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Which team are you supporting?</p>
        <div className="grid grid-cols-2 gap-3">
          {[game.home_team, game.away_team].map((team) => (
            <button
              key={team.id}
              onClick={() => setSupportedTeamId(team.id)}
              className={`rounded-xl border-2 p-3 text-sm font-semibold transition-all ${
                supportedTeamId === team.id
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {team.name}
            </button>
          ))}
        </div>
      </div>

      {/* Emotion picker */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">How are you feeling right now?</p>
        <EmotionPicker selected={emotion} onSelect={setEmotion} />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!emotion || !supportedTeamId || submitting}
        className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition-colors"
      >
        {submitting ? 'Saving…' : 'Submit check-in'}
      </button>
    </div>
  )
}
