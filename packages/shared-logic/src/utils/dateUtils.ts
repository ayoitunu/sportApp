/** Returns the Monday (start of ISO week) for a given date, at midnight UTC. */
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  // Monday = 1; if Sunday (0) treat as day 7 so offset is -6
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

/** Returns the Sunday (end of ISO week) for a given date, at 23:59:59 UTC. */
export function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart)
  d.setUTCDate(d.getUTCDate() + 6)
  d.setUTCHours(23, 59, 59, 999)
  return d
}

/** Formats a Date to a YYYY-MM-DD string (date only, no time). */
export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Returns true if the game's scheduled time is in the past. */
export function isGameStarted(scheduledAt: string): boolean {
  return new Date(scheduledAt) <= new Date()
}

/** Returns true if the game's scheduled time is more than 2 hours in the past
 *  (heuristic: game likely finished). */
export function isGameLikelyFinished(scheduledAt: string): boolean {
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000
  return Date.now() - new Date(scheduledAt).getTime() > TWO_HOURS_MS
}
