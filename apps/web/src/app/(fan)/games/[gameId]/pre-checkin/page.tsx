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

  if (isLoading) return <div className="animate-pulse h-64 bg-pitch-800 rounded-2xl" />
  if (!game) return <p className="text-red-400">Game not found.</p>

  const step = !supportedTeamId ? 1 : !emotion ? 2 : 3

  async function handleSubmit() {
    if (!emotion || !supportedTeamId) return
    setSubmitting(true)
    setError(null)
    const res = await submitCheckIn(gameId, supportedTeamId, 'pre_game', emotion)
    if (res.error) {
      setError(res.error)
    } else {
      setResult(res)
    }
    setSubmitting(false)
  }

  if (result) {
    return (
      <div className="space-y-6 max-w-lg mx-auto animate-fade-in">
        <div className="text-center space-y-2">
          <p className="text-5xl">✅</p>
          <h2 className="font-display text-3xl font-bold uppercase text-white">Checked in!</h2>
          <p className="text-gray-500 text-sm">Here&apos;s a thought for you before the match:</p>
        </div>
        {result.suggestion && (
          <SuggestionCard
            text={result.suggestion.text}
            tone={result.suggestion.tone}
            phase="pre_game"
            emotion={emotion}
          />
        )}
        <button
          onClick={() => router.push(`/games/${gameId}`)}
          className="w-full rounded-xl bg-live-500 py-3 text-sm font-bold text-pitch-950 hover:bg-live-400 transition-colors"
        >
          Back to game
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Game header */}
      <div className="rounded-2xl bg-pitch-900 border border-pitch-700 p-5">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Pre-game check-in</p>
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-xl font-bold uppercase text-white leading-tight flex-1">{game.home_team.name}</p>
          <span className="font-display text-gray-600 font-bold text-lg">VS</span>
          <p className="font-display text-xl font-bold uppercase text-white leading-tight flex-1 text-right">{game.away_team.name}</p>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} total={3} labels={['Your team', 'Your mood', 'Submit']} />

      {/* Step 1 — team selection */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-300">Which team are you supporting?</p>
        <div className="grid grid-cols-2 gap-3">
          {[game.home_team, game.away_team].map((team) => (
            <button
              key={team.id}
              onClick={() => setSupportedTeamId(team.id)}
              className={[
                'rounded-xl border-2 p-4 text-center font-display text-lg font-bold uppercase tracking-tight transition-all',
                supportedTeamId === team.id
                  ? 'border-live-500 bg-live-500/10 text-live-400 scale-[1.02]'
                  : 'border-pitch-600 bg-pitch-800 text-gray-300 hover:border-pitch-500',
              ].join(' ')}
            >
              {team.short_name ?? team.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — emotion picker */}
      {supportedTeamId && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-sm font-semibold text-gray-300">How are you feeling right now?</p>
          <EmotionPicker selected={emotion} onSelect={setEmotion} />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-400 bg-red-950/40 rounded-lg px-3 py-2">{error}</p>}

      {/* Submit */}
      {supportedTeamId && (
        <button
          onClick={handleSubmit}
          disabled={!emotion || submitting}
          className="w-full rounded-xl bg-live-500 py-3.5 text-sm font-bold text-pitch-950 hover:bg-live-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? 'Saving…' : 'Submit check-in'}
        </button>
      )}
    </div>
  )
}

function StepIndicator({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={n} className="flex items-center flex-1">
            <div className={[
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0',
              done   ? 'bg-live-500 text-pitch-950' :
              active ? 'bg-pitch-700 border-2 border-live-500 text-live-400' :
                       'bg-pitch-800 border border-pitch-600 text-gray-600',
            ].join(' ')}>
              {done ? '✓' : n}
            </div>
            {n < total && (
              <div className={`h-px flex-1 mx-1 ${done ? 'bg-live-500' : 'bg-pitch-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
