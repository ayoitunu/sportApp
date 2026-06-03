interface Props {
  text: string
  tone?: string | null
  phase: 'pre_game' | 'post_game'
  fanOutcome?: 'win' | 'loss' | 'draw' | null
}

const OUTCOME_HEADER: Record<string, string> = {
  win:  '🏆 Your team won!',
  loss: '💙 Tough result.',
  draw: '🤝 A point each.',
}

export function SuggestionCard({ text, tone, phase, fanOutcome }: Props) {
  const header = fanOutcome ? OUTCOME_HEADER[fanOutcome] : (phase === 'pre_game' ? '✨ Before the game' : '💬 After the game')

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-sky-50 border border-brand-100 p-6 space-y-3">
      <p className="text-sm font-semibold text-brand-700">{header}</p>
      <p className="text-gray-800 text-base leading-relaxed">{text}</p>
      {tone && (
        <p className="text-xs text-gray-400 italic capitalize">{tone}</p>
      )}
      <p className="text-xs text-gray-400 pt-1 border-t border-brand-100">
        This is a friendly suggestion, not medical or clinical advice.
      </p>
    </div>
  )
}
