import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Calendar, CheckCircle2, Clock3, Edit, Plus, Trash2, XCircle } from "lucide-react"
import Navbar from "../components/Navbar"
import { teams, players, games, teamStats } from "../data/mockData.ts"
import { scheduleService } from "../services/ScheduleService"
import { teamStatsService } from "../services/TeamStatsService"

// Temporary mock user until auth is connected
const mockUser = {
  id: "u1",
  name: "Alyssa Okosua",
  role: "officer",
  teamId: "mens-basketball",
}

// Temporary mock approval data
const mockPendingStats = [
  {
    id: "s1",
    playerName: "Jordan Banks",
    game: "vs Union College",
    submittedBy: "Chris Miles",
    submittedAt: "2026-03-10 8:30 PM",
    points: 18,
    rebounds: 7,
    assists: 4,
    status: "pending",
  },
  {
    id: "s2",
    playerName: "Marcus Lee",
    game: "vs Siena Club Team",
    submittedBy: "Jordan Banks",
    submittedAt: "2026-03-11 9:10 PM",
    points: 12,
    rebounds: 5,
    assists: 6,
    status: "pending",
  },
]

type TabKey = "overview" | "schedule" | "roster" | "team-stats" | "approval-queue"

export default function TeamDashboardPage() {
  const { teamId } = useParams()
  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const [showAddGameModal, setShowAddGameModal] = useState(false)
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false)
  const [pendingStats, setPendingStats] = useState(mockPendingStats)

  const team = teams.find((t) => t.id === teamId)
  const teamPlayers = players.filter((p) => p.teamId === teamId)
  const teamGames = useMemo(() => scheduleService.getTeamGames(games, teamId), [teamId])
  const teamScheduleItems = useMemo(
    () => scheduleService.buildTeamScheduleItems(team?.name ?? "Team", teamGames),
    [team?.name, teamGames]
  )
  const stats = useMemo(() => teamStatsService.getTeamStats(teamStats, teamId), [teamId])
  const recordLabel = useMemo(() => teamStatsService.getRecordLabel(stats), [stats])
  const winRateLabel = useMemo(() => teamStatsService.getWinRateLabel(stats), [stats])

  const isOfficer = mockUser.role === "officer" && mockUser.teamId === teamId

  const upcomingGamesCount = useMemo(
    () => scheduleService.getUpcomingGamesCount(teamGames),
    [teamGames]
  )

  const handleApprove = (id: string) => {
    setPendingStats((prev) => prev.filter((submission) => submission.id !== id))
  }

  const handleReject = (id: string) => {
    setPendingStats((prev) => prev.filter((submission) => submission.id !== id))
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <p className="text-lg text-gray-600">Team not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="relative h-64 overflow-hidden">
        <img
          src={team.bannerImage}
          alt={team.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {team.name} Dashboard
              </h1>
              <p className="text-gray-600">{team.description}</p>

              <div className="mt-3 flex flex-wrap gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {team.sport}
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                  {team.members} members
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
          <StatCard title="Active Roster" value={teamPlayers.length} />
          <StatCard title="Record" value={recordLabel} />
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
          <SectionCard title="Team Overview">
            <div className="space-y-3 text-gray-600">
              <p>
                Welcome to the internal dashboard for{" "}
                <span className="font-semibold text-gray-900">{team.name}</span>.
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
              {teamScheduleItems.map((scheduleItem) => (
                <div
                  key={scheduleItem.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">{scheduleItem.matchupLabel}</span>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>{scheduleItem.formattedDate}</p>
                      <p>{scheduleItem.timeAndLocation}</p>
                    </div>
                  </div>

                  <div>
                    {scheduleItem.scoreLine ? (
                      <div className="text-right">
                        <p className="text-xl font-bold">{scheduleItem.scoreLine}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium text-white ${
                            scheduleItem.resultBadgeClass ?? "bg-gray-600"
                          }`}
                        >
                          {scheduleItem.resultLabel}
                        </span>
                      </div>
                    ) : (
                      <span className="rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              ))}
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
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Games</th>
                    {isOfficer && <th className="px-4 py-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {teamPlayers.map((player) => (
                    <tr key={player.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{player.name}</td>
                      <td className="px-4 py-3">#{player.number}</td>
                      <td className="px-4 py-3">{player.position}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium text-white ${
                            player.status === "active" ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {player.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{player.stats.gamesPlayed}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {activeTab === "team-stats" && (
          <SectionCard title="Team Stats">
            {stats ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <MiniCard label="Win Rate" value={winRateLabel} />
                <MiniCard label="Record" value={recordLabel} />
                <MiniCard label="Active Roster" value={stats.activeRoster} />
                <MiniCard label="Avg PPG" value={stats.avgPointsFor} />
              </div>
            ) : (
              <p className="text-gray-500">No team stats available.</p>
            )}
          </SectionCard>
        )}

        {activeTab === "approval-queue" && (
          <SectionCard title="Approval Queue">
            {!isOfficer ? (
              <p className="text-gray-500">
                You do not have permission to review stat submissions.
              </p>
            ) : pendingStats.length === 0 ? (
              <p className="text-gray-500">No pending submissions.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="border-b border-gray-200 text-sm text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Player</th>
                      <th className="px-4 py-3">Game</th>
                      <th className="px-4 py-3">Submitted By</th>
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
                          {submission.playerName}
                        </td>
                        <td className="px-4 py-3">{submission.game}</td>
                        <td className="px-4 py-3">{submission.submittedBy}</td>
                        <td className="px-4 py-3">{submission.submittedAt}</td>
                        <td className="px-4 py-3">
                          {submission.points} PTS / {submission.rebounds} REB /{" "}
                          {submission.assists} AST
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700">
                            <Clock3 className="h-3 w-3" />
                            Pending
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
          description="Schedule a new game for your team"
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
            <FormField label="Full Name" id="playerName" placeholder="Player name" />
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
