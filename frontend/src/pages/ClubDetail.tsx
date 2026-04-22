import { useEffect, useState, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getTeamById, getTeamPlayers, getTeamGames } from "../api/teams"
import {
  getApprovedStats,
  type StatSubmissionResponse,
} from "../api/stats"

type TabKey = "schedule" | "roster" | "player-stats" | "team-stats"

type AggregatedPlayerStat = {
  player_id: string
  player_name: string
  games: number
  points: number
  rebounds: number
  assists: number
}

export default function ClubDetailPage() {
  const { clubId } = useParams()
  const [activeTab, setActiveTab] = useState<TabKey>("schedule")
  const [club, setClub] = useState<any>(null)
  const [clubPlayers, setClubPlayers] = useState<any[]>([])
  const [clubGames, setClubGames] = useState<any[]>([])
  const [approvedStats, setApprovedStats] = useState<StatSubmissionResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clubId) return

    setLoading(true)

    Promise.all([
      getTeamById(clubId),
      getTeamPlayers(clubId),
      getTeamGames(clubId),
      getApprovedStats(clubId),
    ])
      .then(([team, players, games, approved]) => {
        setClub(team)
        setClubPlayers(players)
        setClubGames(games)
        setApprovedStats(approved ?? [])
      })
      .catch((err) => {
        console.error("Failed to load club detail:", err)
        setClub(null)
        setClubPlayers([])
        setClubGames([])
        setApprovedStats([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [clubId])

  const role = localStorage.getItem("role")
  const isSuperuser = localStorage.getItem("is_superuser") === "true"
  const isOfficer = localStorage.getItem("is_officer") === "true"
  const userClubId = localStorage.getItem("clubId")

  // Only show club-specific actions if the user belongs to THIS club
  const isThisClubMember = isSuperuser || userClubId === clubId
  const canViewDashboard = isThisClubMember && (isOfficer || isSuperuser)

  const playerStatsMap = approvedStats.reduce(
    (acc, submission) => {
      const existing = acc[submission.player_id] ?? {
        player_id: submission.player_id,
        player_name: submission.player_name,
        games: 0,
        points: 0,
        rebounds: 0,
        assists: 0,
      }

      existing.games += 1
      existing.points += Number(submission.stats.points ?? 0)
      existing.rebounds += Number(submission.stats.rebounds ?? 0)
      existing.assists += Number(submission.stats.assists ?? 0)

      acc[submission.player_id] = existing
      return acc
    },
    {} as Record<string, AggregatedPlayerStat>
  )

  const playerStatsList = Object.values(playerStatsMap)

  const teamStats = approvedStats.reduce(
    (acc, submission) => {
      acc.games += 1
      acc.points += Number(submission.stats.points ?? 0)
      acc.rebounds += Number(submission.stats.rebounds ?? 0)
      acc.assists += Number(submission.stats.assists ?? 0)
      return acc
    },
    {
      games: 0,
      points: 0,
      rebounds: 0,
      assists: 0,
    }
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <p className="text-lg text-gray-600">Loading club...</p>
        </div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-700">Club not found</p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="relative h-64 overflow-hidden">
        <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-500">
          No Image
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{club.name}</h1>
              <p className="text-gray-600">{club.description ?? "No description available."}</p>

              <div className="mt-3 flex flex-wrap gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {club.sport}
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                  {clubPlayers.length} members
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {isThisClubMember && (
                <Link
                  to={`/clubs/${club.id}/submit-stats`}
                  className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
                >
                  Submit Stats
                </Link>
              )}

              {canViewDashboard && (
                <Link
                  to={`/dashboard/club/${club.id}`}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  Officer Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <TabButton
              label="Schedule"
              isActive={activeTab === "schedule"}
              onClick={() => setActiveTab("schedule")}
            />
            <TabButton
              label="Roster"
              isActive={activeTab === "roster"}
              onClick={() => setActiveTab("roster")}
            />
            <TabButton
              label="Player Stats"
              isActive={activeTab === "player-stats"}
              onClick={() => setActiveTab("player-stats")}
            />
            <TabButton
              label="Team Stats"
              isActive={activeTab === "team-stats"}
              onClick={() => setActiveTab("team-stats")}
            />
          </div>
        </div>

        {activeTab === "schedule" && (
          <SectionCard title="Schedule">
            <div className="space-y-4">
              {clubGames.length === 0 ? (
                <p className="text-gray-500">No scheduled games yet.</p>
              ) : (
                clubGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {club.name} vs{" "}
                        {game.away_team ? game.away_team.name : game.opponent_name}
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>
                          {new Date(game.game_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>
                          {new Date(game.game_date).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          • {game.location ?? "TBD"}
                        </p>
                      </div>
                    </div>

                    <div>
                      {game.home_score !== null && game.away_score !== null ? (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {game.home_score} - {game.away_score}
                          </p>
                        </div>
                      ) : (
                        <span className="rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        )}

        {activeTab === "roster" && (
          <SectionCard title="Roster">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-200 text-sm text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Player</th>
                    <th className="px-4 py-3">Number</th>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Games</th>
                  </tr>
                </thead>
                <tbody>
                  {clubPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        No players found.
                      </td>
                    </tr>
                  ) : (
                    clubPlayers.map((player) => (
                      <tr key={player.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {player.first_name} {player.last_name}
                        </td>
                        <td className="px-4 py-3">
                          {player.jersey_number ? `#${player.jersey_number}` : "-"}
                        </td>
                        <td className="px-4 py-3">{player.position ?? "-"}</td>
                        <td className="px-4 py-3">{player.year ?? "-"}</td>
                        <td className="px-4 py-3">
                          {playerStatsMap[player.id]?.games ?? 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {activeTab === "player-stats" && (
          <SectionCard title="Player Stats">
            {playerStatsList.length === 0 ? (
              <p className="text-gray-500">No approved player stats yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="border-b border-gray-200 text-sm text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Player</th>
                      <th className="px-4 py-3">Games</th>
                      <th className="px-4 py-3">Points</th>
                      <th className="px-4 py-3">Rebounds</th>
                      <th className="px-4 py-3">Assists</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStatsList.map((player) => (
                      <tr key={player.player_id} className="border-b border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {player.player_name}
                        </td>
                        <td className="px-4 py-3">{player.games}</td>
                        <td className="px-4 py-3">{player.points}</td>
                        <td className="px-4 py-3">{player.rebounds}</td>
                        <td className="px-4 py-3">{player.assists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === "team-stats" && (
          <SectionCard title="Team Stats">
            {approvedStats.length === 0 ? (
              <p className="text-gray-500">No approved team stats yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Approved Entries</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.games}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.points}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Total Rebounds</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.rebounds}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Total Assists</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.assists}</p>
                </div>
              </div>
            )}
          </SectionCard>
        )}
      </div>
    </div>
  )
}

function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? "bg-red-700 text-white"
          : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">{title}</h2>
      {children}
    </div>
  )
}