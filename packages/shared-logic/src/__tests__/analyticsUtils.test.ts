import { describe, expect, it } from 'vitest'
import { buildEmotionDistribution, buildTeamComparisonData, toPieData } from '../utils/analyticsUtils'

describe('buildEmotionDistribution', () => {
  it('returns empty array for no check-ins', () => {
    expect(buildEmotionDistribution([])).toEqual([])
  })

  it('counts emotions correctly', () => {
    const input = [
      { emotion: 'excited' as const },
      { emotion: 'excited' as const },
      { emotion: 'calm' as const },
    ]
    const result = buildEmotionDistribution(input)
    expect(result[0]).toEqual({ emotion: 'excited', count: 2 })
    expect(result[1]).toEqual({ emotion: 'calm', count: 1 })
  })

  it('sorts by count descending', () => {
    const input = [
      { emotion: 'calm' as const },
      { emotion: 'excited' as const },
      { emotion: 'excited' as const },
      { emotion: 'excited' as const },
    ]
    const result = buildEmotionDistribution(input)
    expect(result[0]!.emotion).toBe('excited')
    expect(result[0]!.count).toBe(3)
  })
})

describe('buildTeamComparisonData', () => {
  it('merges home and away correctly', () => {
    const home = [{ emotion: 'excited' as const }, { emotion: 'hopeful' as const }]
    const away = [{ emotion: 'nervous' as const }, { emotion: 'excited' as const }]
    const result = buildTeamComparisonData(home, away)
    const excited = result.find((r) => r.emotion === 'excited')
    expect(excited).toEqual({ emotion: 'excited', home: 1, away: 1 })
  })
})

describe('toPieData', () => {
  it('converts correctly', () => {
    const input = [{ emotion: 'excited' as const, count: 5 }]
    expect(toPieData(input)).toEqual([{ name: 'excited', value: 5 }])
  })
})
