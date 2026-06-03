import type { GameOutcome, SportType } from '@sport-fan/types'

export function getSportDisplayName(sport: SportType): string {
  return sport === 'soccer' ? 'Soccer / Football' : 'Basketball'
}

export function deriveOutcome(homeScore: number, awayScore: number): GameOutcome {
  if (homeScore > awayScore) return 'home_win'
  if (awayScore > homeScore) return 'away_win'
  return 'draw'
}

export function getOutcomeLabel(outcome: GameOutcome, homeTeamName: string, awayTeamName: string): string {
  if (outcome === 'home_win') return `${homeTeamName} won`
  if (outcome === 'away_win') return `${awayTeamName} won`
  return 'Match drawn'
}

/**
 * Given the outcome and which team a fan supports, returns whether the fan's
 * team won, lost, or drew.
 */
export function getFanOutcome(
  outcome: GameOutcome,
  fanTeamId: string,
  homeTeamId: string,
  awayTeamId: string
): 'win' | 'loss' | 'draw' {
  if (outcome === 'draw') return 'draw'
  if (outcome === 'home_win' && fanTeamId === homeTeamId) return 'win'
  if (outcome === 'away_win' && fanTeamId === awayTeamId) return 'win'
  return 'loss'
}
