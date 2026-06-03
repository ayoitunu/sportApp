import { describe, expect, it } from 'vitest'
import { getWeekEnd, getWeekStart, toDateString } from '../utils/dateUtils'

describe('getWeekStart', () => {
  it('returns Monday for a Wednesday', () => {
    const wed = new Date('2026-06-03T12:00:00Z') // Wednesday
    const monday = getWeekStart(wed)
    expect(toDateString(monday)).toBe('2026-06-01')
  })

  it('returns Monday for a Monday', () => {
    const mon = new Date('2026-06-01T00:00:00Z')
    expect(toDateString(getWeekStart(mon))).toBe('2026-06-01')
  })

  it('returns the previous Monday for a Sunday', () => {
    const sun = new Date('2026-06-07T10:00:00Z') // Sunday
    expect(toDateString(getWeekStart(sun))).toBe('2026-06-01')
  })
})

describe('getWeekEnd', () => {
  it('returns Sunday 6 days after Monday', () => {
    const mon = new Date('2026-06-01T00:00:00Z')
    const end = getWeekEnd(mon)
    expect(toDateString(end)).toBe('2026-06-07')
  })
})
