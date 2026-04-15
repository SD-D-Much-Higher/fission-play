import { useMemo, useState, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { teams, players, games, teamStats } from "../data/mockData"
import { scheduleService } from "../services/ScheduleService"
import { teamStatsService } from "../services/TeamStatsService"

type TabKey = "schedule" | "roster" | "player-stats" | "team-stats"

export default function TeamProfilePage() {
  const { teamId } = useParams()
  const [activeTab, setActiveTab] = useState<TabKey>("schedule")

  const team = teams.find((t) => t.id === teamId)
  const teamPlayers = players.filter((p) => p.teamId === teamId)
  const teamGames = useMemo(() => scheduleService.getTeamGames(games, teamId), [teamId])
  const teamScheduleItems = useMemo(
    () => scheduleService.buildTeamScheduleItems(team?.name ?? "Team", teamGames),
    [team?.name, teamGames]
  )
  const stats = useMemo(() => teamStatsService.getTeamStats(teamStats, teamId), [teamId])
  const recordLabel = useMemo(() => teamStatsService.getRecordLabel(stats), [stats])
  const winRate = useMemo(() => teamStatsService.getWinRateLabel(stats), [stats])

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-700">Team not found</p>
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
          src={team.bannerImage}
          alt={team.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-gray-600">{team.description}</p>

              <div className="mt-3 flex flex-wrap gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {team.sport}
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                  {team.members} members
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/teams/${team.id}/submit-stats`}
                className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Submit Stats
              </Link>

              <Link
                to={`/dashboard/team/${team.id}`}
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Officer Dashboard
              </Link>
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
              {teamScheduleItems.map((scheduleItem) => (
                <div
                  key={scheduleItem.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="mb-1 text-lg font-semibold text-gray-900">
                      {scheduleItem.matchupLabel}
                    </p>
                    <div className=" text-sm text-gray-500">
                      <p>{scheduleItem.formattedDate}</p>
                      <p>{scheduleItem.timeAndLocation}</p>
                    </div>
                  </div>

                  <div>
                    {scheduleItem.scoreLine ? (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{scheduleItem.scoreLine}</p>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {activeTab === "player-stats" && (
          <SectionCard title="Player Stats">
            <div className="grid gap-4 md:grid-cols-2">
              {teamPlayers.map((player) => (
                <div
                  key={player.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-500">
                        #{player.number} • {player.position}
                      </p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {player.stats.gamesPlayed} GP
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <MiniStat
                      label="Points"
                      value={
                        "points" in player.stats && typeof player.stats.points === "number"
                          ? player.stats.points
                          : 0
                      }
                    />
                    <MiniStat
                      label="Rebounds"
                      value={
                        "rebounds" in player.stats &&
                        typeof player.stats.rebounds === "number"
                          ? player.stats.rebounds
                          : 0
                      }
                    />
                    <MiniStat
                      label="Assists"
                      value={
                        "assists" in player.stats && typeof player.stats.assists === "number"
                          ? player.stats.assists
                          : 0
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {activeTab === "team-stats" && (
          <SectionCard title="Team Stats">
            {stats ? (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <BigStat label="Win Rate" value={winRate} />
                  <BigStat label="Record" value={recordLabel} />
                  <BigStat label="Active Roster" value={stats.activeRoster} />
                  <BigStat label="Avg PPG" value={stats.avgPointsFor} />
                </div>

                <div className="mt-6 rounded-2xl border border-gray-200 p-6">
                  <h3 className="mb-4 text-xl font-bold text-gray-900">Win/Loss Breakdown</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-red-50 p-4">
                      <p className="text-sm text-gray-500">Wins</p>
                      <p className="text-3xl font-bold text-red-700">{stats.wins}</p>
                    </div>
                    <div className="rounded-xl bg-gray-100 p-4">
                      <p className="text-sm text-gray-500">Losses</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.losses}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No team stats available.</p>
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

function BigStat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function MiniStat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}