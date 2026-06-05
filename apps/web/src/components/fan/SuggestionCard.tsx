import type { EmotionType } from '@sport-fan/types'

interface Props {
  text: string
  tone?: string | null
  phase: 'pre_game' | 'post_game'
  fanOutcome?: 'win' | 'loss' | 'draw' | null
  emotion?: EmotionType | null
}

const OUTCOME_CONFIG: Record<string, { label: string; gradient: string; accent: string }> = {
  win:  { label: 'Your team won',   gradient: 'from-green-950 via-emerald-900 to-pitch-900', accent: 'text-emerald-400' },
  loss: { label: 'Tough result',    gradient: 'from-slate-900 via-pitch-900 to-pitch-950',   accent: 'text-slate-400'   },
  draw: { label: 'A point each',    gradient: 'from-yellow-950 via-amber-900/50 to-pitch-900', accent: 'text-amber-400' },
}

const EMOTION_GRADIENT: Record<EmotionType, string> = {
  excited:      'from-amber-950 via-orange-900/40 to-pitch-900',
  hopeful:      'from-sky-950 via-blue-900/40 to-pitch-900',
  calm:         'from-teal-950 via-teal-900/40 to-pitch-900',
  happy:        'from-green-950 via-green-900/40 to-pitch-900',
  proud:        'from-violet-950 via-purple-900/40 to-pitch-900',
  relieved:     'from-emerald-950 via-emerald-900/40 to-pitch-900',
  nervous:      'from-yellow-950 via-yellow-900/30 to-pitch-900',
  anxious:      'from-orange-950 via-orange-900/40 to-pitch-900',
  stressed:     'from-red-950 via-red-900/30 to-pitch-900',
  frustrated:   'from-red-950 via-red-900/50 to-pitch-900',
  disappointed: 'from-slate-900 via-slate-800/50 to-pitch-900',
  devastated:   'from-rose-950 via-rose-900/40 to-pitch-900',
}

export function SuggestionCard({ text, tone, phase, fanOutcome, emotion }: Props) {
  const outcomeConfig = fanOutcome ? OUTCOME_CONFIG[fanOutcome] : null
  const gradient = outcomeConfig?.gradient
    ?? (emotion ? EMOTION_GRADIENT[emotion] : null)
    ?? 'from-pitch-800 to-pitch-900'

  const header = outcomeConfig?.label
    ?? (phase === 'pre_game' ? 'Before the game' : 'After the game')

  const accentClass = outcomeConfig?.accent ?? 'text-live-400'

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} border border-white/5 p-6 space-y-4`}>
      {/* Header */}
      <p className={`text-xs font-bold uppercase tracking-widest ${accentClass}`}>
        {header}
      </p>

      {/* Quote text */}
      <blockquote className="relative">
        <span className="absolute -top-2 -left-1 text-4xl text-white/10 font-display leading-none select-none" aria-hidden>
          &ldquo;
        </span>
        <p className="text-white/90 text-base leading-relaxed pl-4">
          {text}
        </p>
      </blockquote>

      {/* Tone tag */}
      {tone && (
        <p className="text-xs text-white/30 italic capitalize">{tone}</p>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-white/20 pt-2 border-t border-white/5">
        Friendly encouragement only — not medical or clinical advice.
      </p>
    </div>
  )
}
