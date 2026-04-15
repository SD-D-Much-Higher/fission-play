import type { TeamStats, TeamStatsMap } from "../types/teamStats"

export class TeamStatsService {
  getTeamStats(allTeamStats: TeamStatsMap, teamId?: string): TeamStats | undefined {
    if (!teamId) return undefined
    return allTeamStats[teamId]
  }

  getRecordLabel(stats?: TeamStats): string {
    if (!stats) return "N/A"
    return `${stats.wins}-${stats.losses}`
  }

  getWinRateLabel(stats?: TeamStats): string {
    if (!stats) return "N/A"
    return `${stats.winPercentage}%`
  }
}

export const teamStatsService = new TeamStatsService()
