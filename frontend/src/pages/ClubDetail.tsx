import { useEffect, useState, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getTeamById, getTeamPlayers, getTeamGames } from "../api/teams"
import {
  getApprovedStats,
  type StatSubmissionResponse,
} from "../api/stats"

type TabKey = "schedule" | "roster" | "player-stats" | "team-stats"

interface StatColumn { key: string; label: string }

function getStatColumns(clubName: string): StatColumn[] {
  const name = clubName.toLowerCase()
  if (name.includes("basketball")) return [
    { key: "points", label: "PTS" }, { key: "rebounds", label: "REB" },
    { key: "assists", label: "AST" }, { key: "steals", label: "STL" }, { key: "blocks", label: "BLK" },
  ]
  if (name.includes("soccer")) return [
    { key: "goals", label: "Goals" }, { key: "assists", label: "Assists" },
    { key: "shots_on_goal", label: "Shots" }, { key: "saves", label: "Saves" },
  ]
  if (name.includes("volleyball")) return [
    { key: "kills", label: "Kills" }, { key: "assists", label: "Assists" },
    { key: "digs", label: "Digs" }, { key: "blocks", label: "Blocks" }, { key: "aces", label: "Aces" },
  ]
  if (name.includes("hockey")) return [
    { key: "goals", label: "Goals" }, { key: "assists", label: "Assists" },
    { key: "shots", label: "Shots" }, { key: "saves", label: "Saves" }, { key: "penalty_minutes", label: "PIM" },
  ]
  if (name.includes("rugby")) return [
    { key: "tries", label: "Tries" }, { key: "conversions", label: "Conv." },
    { key: "tackles", label: "Tackles" }, { key: "carries", label: "Carries" },
  ]
  if (name.includes("baseball")) return [
    { key: "hits", label: "H" }, { key: "runs", label: "R" },
    { key: "rbis", label: "RBI" }, { key: "strikeouts", label: "K" }, { key: "era", label: "ERA" },
  ]
  if (name.includes("swim")) return [
    { key: "event", label: "Event" }, { key: "time_seconds", label: "Time (s)" },
  ]
  if (name.includes("water polo")) return [
    { key: "goals", label: "Goals" }, { key: "assists", label: "Assists" },
    { key: "saves", label: "Saves" }, { key: "steals", label: "Steals" },
  ]
  if (name.includes("ultimate") || name.includes("frisbee")) return [
    { key: "goals", label: "Goals" }, { key: "assists", label: "Assists" },
    { key: "blocks", label: "Blocks" }, { key: "turnovers", label: "TO" },
  ]
  if (name.includes("wrestling") || name.includes("judo") || name.includes("boxing") ||
      name.includes("tae kwon") || name.includes("kendo") || name.includes("fencing") ||
      name.includes("badminton") || name.includes("racquetball")) return [
    { key: "wins", label: "Wins" }, { key: "losses", label: "Losses" }, { key: "points_scored", label: "Pts" },
  ]
  return [{ key: "points", label: "Points" }, { key: "assists", label: "Assists" }]
}

type AggregatedPlayerStat = {
  player_id: string; player_name: string; games: number; [key: string]: string | number
}

function getBannerUrl(sport: string): string {
  const s = sport.toLowerCase()
  if (s.includes("soccer") || s.includes("football")) return "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600&q=80"
  if (s.includes("basketball")) return "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&q=80"
  if (s.includes("volleyball")) return "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1600&q=80"
  if (s.includes("ice hockey") || s.includes("hockey")) return "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=1600&q=80"
  if (s.includes("baseball")) return "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=1600&q=80"
  if (s.includes("swimming") || s.includes("swim")) return "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=1600&q=80"
  if (s.includes("rowing") || s.includes("crew")) return "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80"
  if (s.includes("rugby")) return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
  if (s.includes("tennis") || s.includes("badminton") || s.includes("racquet")) return "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1600&q=80"
  if (s.includes("cycling")) return "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1600&q=80"
  if (s.includes("skiing") || s.includes("snowboard")) return "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1600&q=80"
  if (s.includes("wrestling") || s.includes("judo") || s.includes("boxing") ||
      s.includes("taekwondo") || s.includes("tae kwon") || s.includes("martial")) return "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1600&q=80"
  if (s.includes("fencing")) return "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=1600&q=80"
  if (s.includes("water polo")) return "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=1600&q=80"
  if (s.includes("frisbee") || s.includes("ultimate")) return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80"
  if (s.includes("dance")) return "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1600&q=80"
  if (s.includes("equestrian") || s.includes("horse")) return "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1600&q=80"
  if (s.includes("weightlift") || s.includes("weight")) return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
  if (s.includes("esport") || s.includes("gaming")) return "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80"
  if (s.includes("outdoor") || s.includes("hiking") || s.includes("outing")) return "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1600&q=80"
  if (s.includes("bhangra") || s.includes("cultural")) return "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1600&q=80"
  // default
  return "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&q=80"
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

  const statColumns = club ? getStatColumns(club.name) : []

  const playerStatsMap = approvedStats.reduce(
    (acc, submission) => {
      const existing = acc[submission.player_id] ?? {
        player_id: submission.player_id,
        player_name: submission.player_name,
        games: 0,
      }
      existing.games += 1
      for (const col of statColumns) {
        const val = submission.stats[col.key]
        if (col.key === "event") { existing[col.key] = val ?? "-" }
        else { existing[col.key] = Number(existing[col.key] ?? 0) + Number(val ?? 0) }
      }
      acc[submission.player_id] = existing
      return acc
    },
    {} as Record<string, AggregatedPlayerStat>
  )

  const playerStatsList = Object.values(playerStatsMap)

  const teamStats = approvedStats.reduce(
    (acc: Record<string, number>, submission) => {
      acc.games = (acc.games ?? 0) + 1
      for (const col of statColumns) {
        if (col.key !== "event") {
          acc[col.key] = (acc[col.key] ?? 0) + Number(submission.stats[col.key] ?? 0)
        }
      }
      return acc
    },
    { games: 0 }
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
        <img
          src={club ? getBannerUrl(club.sport) : ""}
          alt={club?.name ?? "Club banner"}
          className="h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
        />
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
                      {statColumns.map((col) => (
                        <th key={col.key} className="px-4 py-3">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {playerStatsList.map((player) => (
                      <tr key={player.player_id} className="border-b border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {player.player_name}
                        </td>
                        <td className="px-4 py-3">{player.games}</td>
                        {statColumns.map((col) => (
                          <td key={col.key} className="px-4 py-3">{player[col.key] ?? "-"}</td>
                        ))}
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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {statColumns.filter((col) => col.key !== "event").map((col) => (
                  <div key={col.key} className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total {col.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats[col.key] ?? 0}</p>
                  </div>
                ))}
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