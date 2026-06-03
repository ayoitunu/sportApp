import type { EmotionType } from '@sport-fan/types'

export interface EmotionCount {
  emotion: EmotionType
  count: number
}

export interface TeamComparisonRow {
  emotion: EmotionType
  home: number
  away: number
}

/** Aggregates an array of emotion strings into sorted count objects. */
export function buildEmotionDistribution(
  checkIns: { emotion: EmotionType }[]
): EmotionCount[] {
  const counts = new Map<EmotionType, number>()
  for (const c of checkIns) {
    counts.set(c.emotion, (counts.get(c.emotion) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Merges home and away emotion distributions into a side-by-side
 * comparison array suitable for grouped bar charts.
 */
export function buildTeamComparisonData(
  homeCheckIns: { emotion: EmotionType }[],
  awayCheckIns: { emotion: EmotionType }[]
): TeamComparisonRow[] {
  const homeMap = new Map<EmotionType, number>()
  const awayMap = new Map<EmotionType, number>()

  for (const c of homeCheckIns) homeMap.set(c.emotion, (homeMap.get(c.emotion) ?? 0) + 1)
  for (const c of awayCheckIns) awayMap.set(c.emotion, (awayMap.get(c.emotion) ?? 0) + 1)

  const allEmotions = new Set<EmotionType>([...homeMap.keys(), ...awayMap.keys()])
  return Array.from(allEmotions).map((emotion) => ({
    emotion,
    home: homeMap.get(emotion) ?? 0,
    away: awayMap.get(emotion) ?? 0,
  }))
}

/** Converts EmotionCount[] to { name, value }[] for pie charts. */
export function toPieData(
  distribution: EmotionCount[]
): { name: EmotionType; value: number }[] {
  return distribution.map(({ emotion, count }) => ({ name: emotion, value: count }))
}
