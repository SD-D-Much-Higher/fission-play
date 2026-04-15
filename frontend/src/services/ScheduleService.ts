import type { GameEvent, GameResult } from "../types/gameEvent"

export type TeamScheduleItem = {
  id: string
  matchupLabel: string
  formattedDate: string
  timeAndLocation: string
  scoreLine?: string
  resultLabel?: string
  resultBadgeClass?: string
}

export class ScheduleService {
  getTeamGames(allGames: GameEvent[], teamId?: string): GameEvent[] {
    if (!teamId) return []
    return allGames.filter((game) => game.teamId === teamId)
  }

  getUpcomingGamesCount(teamGames: GameEvent[]): number {
    return teamGames.filter((game) => !game.score).length
  }

  buildTeamScheduleItems(teamName: string, teamGames: GameEvent[]): TeamScheduleItem[] {
    return teamGames.map((game) => ({
      id: game.id,
      matchupLabel: `vs. ${game.opponent}`,
      formattedDate: this.formatGameDate(game.date),
      timeAndLocation: `${game.time} • ${game.location}`,
      scoreLine: game.score ? `${game.score.rpi} - ${game.score.opponent}` : undefined,
      resultLabel: game.result?.toUpperCase(),
      resultBadgeClass: game.result ? this.getResultBadgeClass(game.result) : undefined,
    }))
  }

  private formatGameDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  private getResultBadgeClass(result: GameResult): string {
    if (result === "win") return "bg-green-600"
    if (result === "loss") return "bg-red-600"
    return "bg-gray-600"
  }
}

export const scheduleService = new ScheduleService()
