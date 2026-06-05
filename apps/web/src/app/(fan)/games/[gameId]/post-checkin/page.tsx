'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/hooks/useGames'
import { EmotionPicker } from '@/components/fan/EmotionPicker'
import { SuggestionCard } from '@/components/fan/SuggestionCard'
import { submitCheckIn } from '@/server-actions/submitCheckIn'
import { getFanOutcome, getOutcomeLabel } from '@sport-fan/shared-logic'
import type { EmotionType, SubmitCheckInResponse } from '@sport-fan/types'

export default function PostCheckinPage({ params }: { params: Promise<{ gameId: string }> }) {
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

  if (game.status !== 'finished') {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="font-display text-5xl text-gray-600">⏳</p>
        <p className="text-gray-400 font-semibold">The match hasn&apos;t finished yet.</p>
        <button onClick={() => router.push(`/games/${gameId}`)} className="text-sm text-live-500 hover:text-live-400">
          Back to game →
        </button>
      </div>
    )
  }

  const fanOutcome = supportedTeamId && game.outcome
    ? getFanOutcome(game.outcome, supportedTeamId, game.home_team_id, game.away_team_id)
    : null

  const step = !supportedTeamId ? 1 : !emotion ? 2 : 3

  async function handleSubmit() {
    if (!emotion || !supportedTeamId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await submitCheckIn(gameId, supportedTeamId, 'post_game', emotion)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
    setSubmitting(false)
  }

  if (result) {
    const outcomeEmoji = fanOutcome === 'win' ? '🏆' : fanOutcome === 'draw' ? '🤝' : '💙'
    return (
      <div className="space-y-6 max-w-lg mx-auto animate-fade-in">
        <div className="text-center space-y-2">
          <p className="text-5xl">{outcomeEmoji}</p>
          <h2 className="font-display text-3xl font-bold uppercase text-white">Checked in!</h2>
        </div>
        {result.suggestion && (
          <SuggestionCard
            text={result.suggestion.text}
            tone={result.suggestion.tone}
            phase="post_game"
            fanOutcome={fanOutcome}
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
      {/* Game result header */}
      <div className="rounded-2xl bg-pitch-900 border border-pitch-700 p-5">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Post-game check-in</p>
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-xl font-bold uppercase text-white leading-tight flex-1">{game.home_team.name}</p>
          {game.home_score !== null ? (
            <p className="font-display text-3xl font-bold text-white tabular-nums">
              {game.home_score}<span className="text-gray-600 mx-1">–</span>{game.away_score}
            </p>
          ) : (
            <span className="font-display text-gray-600 font-bold text-lg">FT</span>
          )}
          <p className="font-display text-xl font-bold uppercase text-white leading-tight flex-1 text-right">{game.away_team.name}</p>
        </div>
        {game.outcome && (
          <p className="text-xs text-center text-gray-500 mt-2">
            {getOutcomeLabel(game.outcome, game.home_team.name, game.away_team.name)}
          </p>
        )}
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} total={3} labels={['Your team', 'Your mood', 'Submit']} />

      {/* Step 1 — team selection */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-300">Which team were you supporting?</p>
        <div className="grid grid-cols-2 gap-3">
          {[game.home_team, game.away_team].map((team) => {
            const teamOutcome = game.outcome
              ? getFanOutcome(game.outcome, team.id, game.home_team_id, game.away_team_id)
              : null
            const outcomeIcon = teamOutcome === 'win' ? '🏆' : teamOutcome === 'draw' ? '🤝' : teamOutcome === 'loss' ? '💙' : null

            return (
              <button
                key={team.id}
                onClick={() => setSupportedTeamId(team.id)}
                className={[
                  'rounded-xl border-2 p-4 text-center transition-all',
                  supportedTeamId === team.id
                    ? 'border-live-500 bg-live-500/10 scale-[1.02]'
                    : 'border-pitch-600 bg-pitch-800 hover:border-pitch-500',
                ].join(' ')}
              >
                <p className="font-display text-lg font-bold uppercase tracking-tight text-white">
                  {team.short_name ?? team.name}
                </p>
                {outcomeIcon && (
                  <p className="text-xs text-gray-400 mt-0.5">{outcomeIcon} {teamOutcome === 'win' ? 'Won' : teamOutcome === 'draw' ? 'Drew' : 'Lost'}</p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2 — emotion picker */}
      {supportedTeamId && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-sm font-semibold text-gray-300">How are you feeling after the match?</p>
          <EmotionPicker selected={emotion} onSelect={setEmotion} />
        </div>
      )}

      {error && <p className="text-sm text-red-400 bg-red-950/40 rounded-lg px-3 py-2">{error}</p>}

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
