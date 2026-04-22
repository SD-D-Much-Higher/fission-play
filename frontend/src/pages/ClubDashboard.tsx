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
import { apiFetch } from "../lib/api"
import { useParams } from "react-router-dom"

type TabKey = "overview" | "schedule" | "roster" | "team-stats" | "approval-queue"

interface EditPlayerForm {
  id: string
  first_name: string
  last_name: string
  jersey_number: string
  position: string
  year: string
}

const emptyEditForm: EditPlayerForm = {
  id: "",
  first_name: "",
  last_name: "",
  jersey_number: "",
  position: "",
  year: "",
}

export default function ClubDashboardPage() {
  const { clubId } = useParams()
  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const [showAddGameModal, setShowAddGameModal] = useState(false)
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false)

  // Add game state
  const [addGameForm, setAddGameForm] = useState({
    opponent_name: "",
    date: "",
    time: "",
    location: "",
  })
  const [addGameSaving, setAddGameSaving] = useState(false)
  const [addGameError, setAddGameError] = useState("")

  // Add player state
  const [addPlayerForm, setAddPlayerForm] = useState({
    first_name: "",
    last_name: "",
    jersey_number: "",
    position: "",
    year: "",
  })
  const [addPlayerSaving, setAddPlayerSaving] = useState(false)
  const [addPlayerError, setAddPlayerError] = useState("")

  // Edit player state
  const [editingPlayer, setEditingPlayer] = useState<EditPlayerForm | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState("")

  const [club, setClub] = useState<any>(null)
  const [clubPlayers, setClubPlayers] = useState<any[]>([])
  const [clubGames, setClubGames] = useState<any[]>([])
  const [pendingStats, setPendingStats] = useState<StatSubmissionResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clubId) return

    setLoading(true)

    Promise.allSettled([
      getTeamById(clubId),
      getTeamPlayers(clubId),
      getTeamGames(clubId),
      getPendingStats(clubId),
    ])
      .then((results) => {
        const [teamResult, playersResult, gamesResult, pendingResult] = results

        if (teamResult.status === "rejected") {
          console.error("Failed to load club dashboard:", teamResult.reason)
          setClub(null)
          setClubPlayers([])
          setClubGames([])
          setPendingStats([])
          return
        }

        setClub(teamResult.value)

        setClubPlayers(
          playersResult.status === "fulfilled" ? playersResult.value : []
        )

        setClubGames(
          gamesResult.status === "fulfilled" ? gamesResult.value : []
        )

        setPendingStats(
          pendingResult.status === "fulfilled" ? pendingResult.value : []
        )

        if (playersResult.status === "rejected") {
          console.error("Failed to load players:", playersResult.reason)
        }

        if (gamesResult.status === "rejected") {
          console.error("Failed to load games:", gamesResult.reason)
        }

        if (pendingResult.status === "rejected") {
          console.error("Failed to load pending stats:", pendingResult.reason)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [clubId])

  const isOfficer = localStorage.getItem("is_officer") === "true"

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

  const handleAddGame = async () => {
    if (!clubId) return
    if (!addGameForm.opponent_name.trim()) {
      setAddGameError("Opponent name is required.")
      return
    }
    if (!addGameForm.date) {
      setAddGameError("Date is required.")
      return
    }
    setAddGameSaving(true)
    setAddGameError("")
    try {
      const gameDate = addGameForm.time
        ? new Date(`${addGameForm.date}T${addGameForm.time}:00`).toISOString()
        : new Date(`${addGameForm.date}T00:00:00`).toISOString()

      const payload = {
        home_team_id: clubId,
        opponent_name: addGameForm.opponent_name.trim(),
        game_date: gameDate,
        location: addGameForm.location.trim() || null,
        status: "scheduled",
      }

      const created = await apiFetch<any>("/games/", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      setClubGames((prev) => [...prev, created])
      setAddGameForm({ opponent_name: "", date: "", time: "", location: "" })
      setShowAddGameModal(false)
    } catch (err: any) {
      setAddGameError(err.message ?? "Failed to add game.")
    } finally {
      setAddGameSaving(false)
    }
  }

  const handleAddPlayer = async () => {
    if (!clubId) return
    if (!addPlayerForm.first_name.trim() || !addPlayerForm.last_name.trim()) {
      setAddPlayerError("First and last name are required.")
      return
    }
    setAddPlayerSaving(true)
    setAddPlayerError("")
    try {
      const payload: Record<string, any> = {
        first_name: addPlayerForm.first_name.trim(),
        last_name: addPlayerForm.last_name.trim(),
        team_id: clubId,
        position: addPlayerForm.position.trim() || null,
        year: addPlayerForm.year.trim() || null,
        jersey_number: addPlayerForm.jersey_number
          ? parseInt(addPlayerForm.jersey_number)
          : null,
      }
      const created = await apiFetch<any>("/players/", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      setClubPlayers((prev) => [...prev, created])
      setAddPlayerForm({ first_name: "", last_name: "", jersey_number: "", position: "", year: "" })
      setShowAddPlayerModal(false)
    } catch (err: any) {
      setAddPlayerError(err.message ?? "Failed to add player.")
    } finally {
      setAddPlayerSaving(false)
    }
  }

  // Open the edit modal pre-filled with the player's current data
  const openEditModal = (player: any) => {
    setEditError("")
    setEditingPlayer({
      id: player.id,
      first_name: player.first_name ?? "",
      last_name: player.last_name ?? "",
      jersey_number: player.jersey_number != null ? String(player.jersey_number) : "",
      position: player.position ?? "",
      year: player.year ?? "",
    })
  }

  const handleEditSave = async () => {
    if (!editingPlayer) return
    setEditSaving(true)
    setEditError("")

    try {
      const payload: Record<string, any> = {
        first_name: editingPlayer.first_name,
        last_name: editingPlayer.last_name,
        position: editingPlayer.position || null,
        year: editingPlayer.year || null,
        jersey_number: editingPlayer.jersey_number
          ? parseInt(editingPlayer.jersey_number)
          : null,
      }

      const updated = await apiFetch<any>(`/players/${editingPlayer.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })

      // Update local state so the table reflects the change immediately
      setClubPlayers((prev) =>
        prev.map((p) => (p.id === editingPlayer.id ? { ...p, ...updated } : p))
      )

      setEditingPlayer(null)
    } catch (err: any) {
      setEditError(err.message ?? "Failed to save changes.")
    } finally {
      setEditSaving(false)
    }
  }

  const handleDeletePlayer = async (playerId: string, playerName: string) => {
    if (!window.confirm(`Remove ${playerName} from the roster?`)) return

    try {
      await apiFetch(`/players/${playerId}`, { method: "DELETE" })
      setClubPlayers((prev) => prev.filter((p) => p.id !== playerId))
    } catch (err: any) {
      console.error("Failed to delete player:", err)
      alert(err.message ?? "Failed to delete player.")
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
                              <button
                                onClick={() => openEditModal(player)}
                                className="rounded-lg p-2 hover:bg-gray-100"
                                title="Edit player"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeletePlayer(
                                    player.id,
                                    `${player.first_name} ${player.last_name}`
                                  )
                                }
                                className="rounded-lg p-2 hover:bg-gray-100"
                                title="Remove player"
                              >
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

      {/* ── Add Game Modal ── */}
      {showAddGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Add New Game</h3>
                <p className="mt-1 text-sm text-gray-500">Schedule a new game for your club</p>
              </div>
              <button
                onClick={() => { setShowAddGameModal(false); setAddGameError("") }}
                className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Opponent</label>
                <input
                  value={addGameForm.opponent_name}
                  onChange={(e) => setAddGameForm((p) => ({ ...p, opponent_name: e.target.value }))}
                  placeholder="e.g. Union Club Soccer"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Date</label>
                  <input
                    type="date"
                    value={addGameForm.date}
                    onChange={(e) => setAddGameForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Time</label>
                  <input
                    type="time"
                    value={addGameForm.time}
                    onChange={(e) => setAddGameForm((p) => ({ ...p, time: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Location</label>
                <input
                  value={addGameForm.location}
                  onChange={(e) => setAddGameForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. RPI Harkness Field"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              {addGameError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {addGameError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowAddGameModal(false); setAddGameError("") }}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGame}
                  disabled={addGameSaving}
                  className="flex-1 rounded-xl bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
                >
                  {addGameSaving ? "Adding…" : "Add Game"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Player Modal ── */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Add Player</h3>
                <p className="mt-1 text-sm text-gray-500">Add a new player to the active roster</p>
              </div>
              <button
                onClick={() => { setShowAddPlayerModal(false); setAddPlayerError("") }}
                className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">First Name</label>
                  <input
                    value={addPlayerForm.first_name}
                    onChange={(e) => setAddPlayerForm((p) => ({ ...p, first_name: e.target.value }))}
                    placeholder="First name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Last Name</label>
                  <input
                    value={addPlayerForm.last_name}
                    onChange={(e) => setAddPlayerForm((p) => ({ ...p, last_name: e.target.value }))}
                    placeholder="Last name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Jersey Number</label>
                <input
                  type="number"
                  value={addPlayerForm.jersey_number}
                  onChange={(e) => setAddPlayerForm((p) => ({ ...p, jersey_number: e.target.value }))}
                  placeholder="e.g. 12"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Position</label>
                <input
                  value={addPlayerForm.position}
                  onChange={(e) => setAddPlayerForm((p) => ({ ...p, position: e.target.value }))}
                  placeholder="e.g. Forward"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Year</label>
                <input
                  value={addPlayerForm.year}
                  onChange={(e) => setAddPlayerForm((p) => ({ ...p, year: e.target.value }))}
                  placeholder="e.g. Junior"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              {addPlayerError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {addPlayerError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowAddPlayerModal(false); setAddPlayerError("") }}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPlayer}
                  disabled={addPlayerSaving}
                  className="flex-1 rounded-xl bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
                >
                  {addPlayerSaving ? "Adding…" : "Add Player"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Player Modal ── */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Edit Player</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update roster details for this player
                </p>
              </div>
              <button
                onClick={() => setEditingPlayer(null)}
                className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    First Name
                  </label>
                  <input
                    value={editingPlayer.first_name}
                    onChange={(e) =>
                      setEditingPlayer((p) => p && { ...p, first_name: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Last Name
                  </label>
                  <input
                    value={editingPlayer.last_name}
                    onChange={(e) =>
                      setEditingPlayer((p) => p && { ...p, last_name: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Jersey Number
                </label>
                <input
                  type="number"
                  value={editingPlayer.jersey_number}
                  onChange={(e) =>
                    setEditingPlayer((p) => p && { ...p, jersey_number: e.target.value })
                  }
                  placeholder="e.g. 12"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Position
                </label>
                <input
                  value={editingPlayer.position}
                  onChange={(e) =>
                    setEditingPlayer((p) => p && { ...p, position: e.target.value })
                  }
                  placeholder="e.g. Forward"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Year
                </label>
                <input
                  value={editingPlayer.year}
                  onChange={(e) =>
                    setEditingPlayer((p) => p && { ...p, year: e.target.value })
                  }
                  placeholder="e.g. Junior"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              {editError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {editError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingPlayer(null)}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editSaving}
                  className="flex-1 rounded-xl bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
                >
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
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