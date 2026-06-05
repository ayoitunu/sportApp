'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EMOTION_META, ALL_EMOTIONS } from '@sport-fan/shared-logic'
import { createSuggestion, updateSuggestion, deleteSuggestion } from '@/server-actions/manageSuggestion'
import type { CheckInPhase, EmotionType, GameOutcome } from '@sport-fan/types'

const OUTCOMES: { value: GameOutcome | ''; label: string }[] = [
  { value: '',          label: 'Any (pre-game or no outcome)' },
  { value: 'home_win',  label: 'Home win' },
  { value: 'away_win',  label: 'Away win' },
  { value: 'draw',      label: 'Draw' },
]

const TONES = ['encouraging', 'celebratory', 'reassuring', 'hopeful', 'calming', 'positive']

interface ExistingTemplate {
  id: string
  phase: string
  emotion: string
  outcome: string | null
  text: string
  tone: string | null
  is_active: boolean
}

interface Props {
  existing?: ExistingTemplate
}

export function SuggestionForm({ existing }: Props) {
  const router = useRouter()
  const [phase, setPhase]       = useState<CheckInPhase>(existing?.phase as CheckInPhase ?? 'pre_game')
  const [emotion, setEmotion]   = useState<EmotionType>(existing?.emotion as EmotionType ?? 'excited')
  const [outcome, setOutcome]   = useState<GameOutcome | ''>(existing?.outcome as GameOutcome ?? '')
  const [text, setText]         = useState(existing?.text ?? '')
  const [tone, setTone]         = useState(existing?.tone ?? 'encouraging')
  const [isActive, setIsActive] = useState(existing?.is_active ?? true)
  const [loading, setLoading]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) { setError('Text is required.'); return }
    setLoading(true)
    setError(null)
    try {
      const input = {
        phase,
        emotion,
        outcome: outcome || null,
        text: text.trim(),
        tone,
        is_active: isActive,
      }
      if (existing) {
        await updateSuggestion(existing.id, input)
      } else {
        await createSuggestion(input)
      }
      router.push('/admin/suggestions')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
    setLoading(false)
  }

  async function handleDelete() {
    if (!existing || !confirm('Delete this suggestion template?')) return
    setDeleting(true)
    try {
      await deleteSuggestion(existing.id)
      router.push('/admin/suggestions')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 max-w-xl">
      {/* Phase */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
        <div className="flex gap-2">
          {(['pre_game', 'post_game'] as CheckInPhase[]).map((p) => (
            <button
              key={p} type="button"
              onClick={() => setPhase(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                phase === p ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p === 'pre_game' ? 'Pre-game' : 'Post-game'}
            </button>
          ))}
        </div>
      </div>

      {/* Emotion */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Emotion</label>
        <select
          value={emotion}
          onChange={(e) => setEmotion(e.target.value as EmotionType)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {ALL_EMOTIONS.map((em) => {
            const meta = EMOTION_META[em]
            return <option key={em} value={em}>{meta.emoji} {meta.label}</option>
          })}
        </select>
      </div>

      {/* Outcome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Outcome filter</label>
        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value as GameOutcome | '')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {OUTCOMES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Suggestion text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          required
          placeholder="Write an encouraging message for the fan…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{text.length} chars</p>
      </div>

      {/* Tone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {TONES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-brand-600' : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
        <span className="text-sm text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit" disabled={loading}
          className="flex-1 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : existing ? 'Save changes' : 'Create template'}
        </button>
        {existing && (
          <button
            type="button" onClick={handleDelete} disabled={deleting}
            className="px-4 rounded-lg bg-red-50 text-red-600 text-sm font-semibold border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>
    </form>
  )
}
