export interface SuggestionCandidate {
  id: string
  text: string
  tone: string | null
}

/**
 * Picks one suggestion at random from the provided candidates.
 * The caller queries Supabase for templates matching (phase, outcome, emotion)
 * and passes the results here. Pure function — no side effects.
 */
export function pickSuggestion(
  candidates: SuggestionCandidate[]
): SuggestionCandidate | null {
  if (candidates.length === 0) return null
  const idx = Math.floor(Math.random() * candidates.length)
  return candidates[idx] ?? null
}
