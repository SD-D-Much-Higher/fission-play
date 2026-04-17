import { useEffect, useMemo, useState } from "react"
import { Calendar, CheckCircle2, Clock3, Edit, Plus, Trash2, XCircle } from "lucide-react"
import Navbar from "../components/Navbar"
import { getTeamById, getTeamPlayers, getTeamGames } from "../api/teams"
import {
  getPendingStats,
  approveStatSubmission,
  rejectStatSubmission,
  type StatSubmissionResponse,
} from "../api/stats"
import { useParams } from "react-router-dom"

const mockUser = {
  id: "u1",
  name: "Alyssa Okosua",
  role: "officer",
}

type TabKey = "overview" | "schedule" | "roster" | "team-stats" | "approval-queue"

export default function ClubDashboardPage() {
  const { clubId } = useParams()
  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const [showAddGameModal, setShowAddGameModal] = useState(false)
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false)

  const [club, setClub] = useState<any>(null)
  const [clubPlayers, setClubPlayers] = useState<any[]>([])
  const [clubGames, setClubGames] = useState<any[]>([])
  const [pendingStats, setPendingStats] = useState<StatSubmissionResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clubId) return

    setLoading(true)

    Promise.all([
      getTeamById(clubId),
      getTeamPlayers(clubId),
      getTeamGames(clubId),
      getPendingStats(clubId),
    ])
      .then(([team, players, games, pending]) => {
        setClub(team)
        setClubPlayers(players)
        setClubGames(games)
        setPendingStats(pending)
      })
      .catch((err) => {
        console.error("Failed to load club dashboard:", err)
        setClub(null)
        setClubPlayers([])
        setClubGames([])
        setPendingStats([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [clubId])

  const isOfficer = mockUser.role === "officer"

  const upcomingGamesCount = useMemo(
    () =>
      clubGames.filter(
        (game) => game.home_score === null || game.away_score === null
      ).length,
    [clubGames]
  )

  const completedGames = useMemo(
    () =>
      clubGames.filter(
        (game) => game.home_score !== null && game.away_score !== null
      ),
    [clubGames]
  )

  const record = useMemo(() => {
    let wins = 0
    let losses = 0

    completedGames.forEach((game) => {
      if (game.home_score > game.away_score) wins += 1
      else if (game.home_score < game.away_score) losses += 1
    })

    return `${wins}-${losses}`
  }, [completedGames])

  const formatStats = (stats: Record<string, number | string>) => {
    return Object.entries(stats)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" / ")
  }

  const handleApprove = async (id: string) => {
    try {
      await approveStatSubmission(id)
      setPendingStats((prev) => prev.filter((submission) => submission.id !== id))
    } catch (err) {
      console.error("Failed to approve submission:", err)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectStatSubmission(id)
      setPendingStats((prev) => prev.filter((submission) => submission.id !== id))
    } catch (err) {
      console.error("Failed to reject submission:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <p className="text-lg text-gray-600">Club not found</p>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {club.name} Dashboard
              </h1>
              <p className="text-gray-600">{club.description ?? "No description available."}</p>

              <div className="mt-3 flex flex-wrap gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {club.sport}
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                  {clubPlayers.length} members
                </span>
                {isOfficer && (
                  <span className="rounded-full bg-red-700 px-3 py-1 text-sm font-medium text-white">
                    Officer Access
                  </span>
                )}
              </div>
            </div>

            {isOfficer && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowAddGameModal(true)}
                  className="inline-flex items-center rounded-xl bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Game
                </button>

                <button
                  onClick={() => setShowAddPlayerModal(true)}
                  className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Player
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard title="Pending Approvals" value={pendingStats.length} />
          <StatCard title="Upcoming Games" value={upcomingGamesCount} />
          <StatCard title="Active Roster" value={clubPlayers.length} />
          <StatCard title="Record" value={record} />
        </div>

        <div className="mb-6 rounded-2xl bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            <TabButton
              label="Overview"
              isActive={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
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
              label="Team Stats"
              isActive={activeTab === "team-stats"}
              onClick={() => setActiveTab("team-stats")}
            />
            <TabButton
              label="Approval Queue"
              isActive={activeTab === "approval-queue"}
              onClick={() => setActiveTab("approval-queue")}
            />
          </div>
        </div>

        {activeTab === "overview" && (
          <SectionCard title="Club Overview">
            <div className="space-y-3 text-gray-600">
              <p>
                Welcome to the internal dashboard for{" "}
                <span className="font-semibold text-gray-900">{club.name}</span>.
              </p>
              <p>
                Use this space to manage roster activity, update schedules, review team
                performance, and approve submitted player statistics.
              </p>
              <p>
                Official stats should only reflect approved submissions to maintain
                accuracy and prevent falsified reporting.
              </p>
            </div>
          </SectionCard>
        )}

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
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">
                          {club.name} vs{" "}
                          {game.away_team ? game.away_team.name : game.opponent_name}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
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
                          <p className="text-xl font-bold">
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
                    {isOfficer && <th className="px-4 py-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {clubPlayers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isOfficer ? 5 : 4}
                        className="px-4 py-6 text-center text-gray-500"
                      >
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
                        {isOfficer && (
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button className="rounded-lg p-2 hover:bg-gray-100">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="rounded-lg p-2 hover:bg-gray-100">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {activeTab === "team-stats" && (
          <SectionCard title="Team Stats">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <MiniCard label="Completed Games" value={completedGames.length} />
              <MiniCard label="Upcoming Games" value={upcomingGamesCount} />
              <MiniCard label="Active Roster" value={clubPlayers.length} />
              <MiniCard label="Record" value={record} />
            </div>
          </SectionCard>
        )}

        {activeTab === "approval-queue" && (
          <SectionCard title="Approval Queue">
            {pendingStats.length === 0 ? (
              <p className="text-gray-500">No pending submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="border-b border-gray-200 text-sm text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Player</th>
                      <th className="px-4 py-3">Sport</th>
                      <th className="px-4 py-3">Submitted At</th>
                      <th className="px-4 py-3">Stats</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingStats.map((submission) => (
                      <tr key={submission.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {submission.player_name}
                        </td>
                        <td className="px-4 py-3">{submission.sport}</td>
                        <td className="px-4 py-3">
                          {new Date(submission.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">{formatStats(submission.stats)}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700">
                            <Clock3 className="h-3 w-3" />
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(submission.id)}
                              className="inline-flex items-center rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(submission.id)}
                              className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )}
      </div>

      {showAddGameModal && (
        <SimpleModal
          title="Add New Game"
          description="Schedule a new game for your club"
          onClose={() => setShowAddGameModal(false)}
        >
          <div className="space-y-4">
            <FormField label="Opponent" id="opponent" placeholder="Team name" />
            <FormField label="Date" id="date" type="date" />
            <FormField label="Time" id="time" type="time" />
            <FormField label="Location" id="location" placeholder="Venue" />
            <button
              onClick={() => setShowAddGameModal(false)}
              className="w-full rounded-xl bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800"
            >
              Add Game
            </button>
          </div>
        </SimpleModal>
      )}

      {showAddPlayerModal && (
        <SimpleModal
          title="Add Player"
          description="Add a new player to the active roster"
          onClose={() => setShowAddPlayerModal(false)}
        >
          <div className="space-y-4">
            <FormField label="First Name" id="firstName" placeholder="First name" />
            <FormField label="Last Name" id="lastName" placeholder="Last name" />
            <FormField label="Jersey Number" id="number" type="number" placeholder="12" />
            <FormField
              label="Position"
              id="position"
              placeholder="Guard / Forward / Center"
            />
            <button
              onClick={() => setShowAddPlayerModal(false)}
              className="w-full rounded-xl bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800"
            >
              Add Player
            </button>
          </div>
        </SimpleModal>
      )}
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function MiniCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">{title}</h2>
      {children}
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

function SimpleModal({
  title,
  description,
  children,
  onClose,
}: {
  title: string
  description: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FormField({
  label,
  id,
  placeholder,
  type = "text",
}: {
  label: string
  id: string
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-gray-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
      />
    </div>
  )
}