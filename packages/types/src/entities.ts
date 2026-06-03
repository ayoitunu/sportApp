import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Sport = Database['public']['Tables']['sports']['Row']
export type Team = Database['public']['Tables']['teams']['Row']
export type Player = Database['public']['Tables']['players']['Row']
export type CheckIn = Database['public']['Tables']['check_ins']['Row']
export type SuggestionTemplate = Database['public']['Tables']['suggestion_templates']['Row']
export type TeamHistoricalStats = Database['public']['Tables']['team_historical_stats']['Row']
export type UserFavoriteTeam = Database['public']['Tables']['user_favorite_teams']['Row']

export type GameEmotionSummary = Database['public']['Views']['game_emotion_summary']['Row']
export type GameTeamParticipants = Database['public']['Views']['game_team_participants']['Row']

// Game with joined teams (most common usage)
export type Game = Database['public']['Tables']['games']['Row'] & {
  home_team: Team
  away_team: Team
  sport?: Sport
}

// Team with featured players
export type TeamWithPlayers = Team & {
  players: Player[]
  stats?: TeamHistoricalStats
}

// Check-in with joined game and suggestion
export type CheckInWithDetails = CheckIn & {
  game: Game
  suggestion?: SuggestionTemplate | null
}
