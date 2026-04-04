export interface TeamStats {
  wins: number
  losses: number
  winPercentage: number
  activeRoster: number
  avgPointsFor: number
}

export type TeamStatsMap = Record<string, TeamStats>

