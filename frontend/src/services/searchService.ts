export type TeamSearchItem = {
  id: string
  name: string
  sport: string
  description: string
}

export type PlayerSearchItem = {
  id: string
  name: string
  position: string
} & ({ teamId: string } | { clubId: string })

export type PlayerSearchResult<T extends PlayerSearchItem = PlayerSearchItem> = T & {
  teamName: string
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

export function searchTeams<T extends TeamSearchItem>(teams: T[], query: string): T[] {
  const normalizedQuery = normalizeQuery(query)
  if (!normalizedQuery) return teams
  return teams.filter((team) =>
    team.name.toLowerCase().includes(normalizedQuery) ||
    team.sport.toLowerCase().includes(normalizedQuery) ||
    team.description.toLowerCase().includes(normalizedQuery)
  )
}

export function searchPlayers<
  TPlayer extends PlayerSearchItem,
  TTeam extends TeamSearchItem,
>(
  players: TPlayer[],
  teams: TTeam[],
  query: string
): Array<PlayerSearchResult<TPlayer>> {
  const normalizedQuery = normalizeQuery(query)
  if (!normalizedQuery) return []
  return players
    .filter((player) => {
      const teamId = "teamId" in player ? player.teamId : player.clubId
      const teamName = teams.find((team) => team.id === teamId)?.name ?? ""
      return (
        player.name.toLowerCase().includes(normalizedQuery) ||
        player.position.toLowerCase().includes(normalizedQuery) ||
        teamName.toLowerCase().includes(normalizedQuery)
      )
    })
    .map((player) => {
      const teamId = "teamId" in player ? player.teamId : player.clubId
      const team = teams.find((item) => item.id === teamId)
      return { ...player, teamName: team?.name ?? "Unknown Team" }
    })
}