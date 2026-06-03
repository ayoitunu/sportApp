import type { CheckInPhase, EmotionType, GameOutcome } from './enums'

export interface SubmitCheckInRequest {
  gameId: string
  teamId: string
  phase: CheckInPhase
  emotion: EmotionType
  notes?: string
}

export interface SubmitCheckInResponse {
  checkInId: string
  suggestion: {
    id: string
    text: string
    tone: string | null
  } | null
}

export interface UpdateGameResultRequest {
  gameId: string
  homeScore: number
  awayScore: number
}

export interface UpdateGameResultResponse {
  outcome: GameOutcome
}

export interface GameAnalyticsData {
  gameId: string
  homeTeamId: string
  awayTeamId: string
  pre: {
    home: { emotion: EmotionType; count: number }[]
    away: { emotion: EmotionType; count: number }[]
    homeTotal: number
    awayTotal: number
  }
  post: {
    home: { emotion: EmotionType; count: number }[]
    away: { emotion: EmotionType; count: number }[]
    homeTotal: number
    awayTotal: number
  } | null
}
