import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import { getTeamById, getTeamPlayers, getTeamGames } from "../api/teams"
import { submitStats } from "../api/stats"

// Stat field definition
interface StatField {
  key: string
  label: string
  type: "number" | "text"
  placeholder?: string
}

// Sport → stat fields mapping
const SPORT_STATS: Record<string, StatField[]> = {
  basketball: [
    { key: "points", label: "Points", type: "number" },
    { key: "rebounds", label: "Rebounds", type: "number" },
    { key: "assists", label: "Assists", type: "number" },
    { key: "steals", label: "Steals", type: "number" },
    { key: "blocks", label: "Blocks", type: "number" },
  ],
  soccer: [
    { key: "goals", label: "Goals", type: "number" },
    { key: "assists", label: "Assists", type: "number" },
    { key: "shots_on_goal", label: "Shots on Goal", type: "number" },
    { key: "saves", label: "Saves (GK)", type: "number" },
  ],
  volleyball: [
    { key: "kills", label: "Kills", type: "number" },
    { key: "assists", label: "Assists", type: "number" },
    { key: "digs", label: "Digs", type: "number" },
    { key: "blocks", label: "Blocks", type: "number" },
    { key: "aces", label: "Aces", type: "number" },
  ],
  hockey: [
    { key: "goals", label: "Goals", type: "number" },
    { key: "assists", label: "Assists", type: "number" },
    { key: "shots", label: "Shots", type: "number" },
    { key: "saves", label: "Saves (G)", type: "number" },
    { key: "penalty_minutes", label: "Penalty Minutes", type: "number" },
  ],
  rugby: [
    { key: "tries", label: "Tries", type: "number" },
    { key: "conversions", label: "Conversions", type: "number" },
    { key: "tackles", label: "Tackles", type: "number" },
    { key: "carries", label: "Carries", type: "number" },
  ],
  baseball: [
    { key: "hits", label: "Hits", type: "number" },
    { key: "runs", label: "Runs", type: "number" },
    { key: "rbis", label: "RBIs", type: "number" },
    { key: "strikeouts", label: "Strikeouts (P)", type: "number" },
    { key: "era", label: "ERA (P)", type: "number" },
  ],
  swimming: [
    { key: "event", label: "Event", type: "text", placeholder: "e.g. 100m Freestyle" },
    { key: "time_seconds", label: "Time (seconds)", type: "number" },
  ],
  water_polo: [
    { key: "goals", label: "Goals", type: "number" },
    { key: "assists", label: "Assists", type: "number" },
    { key: "saves", label: "Saves", type: "number" },
    { key: "steals", label: "Steals", type: "number" },
  ],
  ultimate: [
    { key: "goals", label: "Goals", type: "number" },
    { key: "assists", label: "Assists", type: "number" },
    { key: "blocks", label: "Blocks", type: "number" },
    { key: "turnovers", label: "Turnovers", type: "number" },
  ],
  combat: [
    { key: "wins", label: "Wins", type: "number" },
    { key: "losses", label: "Losses", type: "number" },
    { key: "points_scored", label: "Points Scored", type: "number" },
  ],
  racquet: [
    { key: "wins", label: "Wins", type: "number" },
    { key: "losses", label: "Losses", type: "number" },
    { key: "points_scored", label: "Points Scored", type: "number" },
  ],
}

// Map club name → stat category
function getStatFields(clubName: string): StatField[] | null {
  const name = clubName.toLowerCase()
  if (name.includes("basketball")) return SPORT_STATS.basketball
  if (name.includes("soccer")) return SPORT_STATS.soccer
  if (name.includes("volleyball")) return SPORT_STATS.volleyball
  if (name.includes("hockey")) return SPORT_STATS.hockey
  if (name.includes("rugby")) return SPORT_STATS.rugby
  if (name.includes("baseball")) return SPORT_STATS.baseball
  if (name.includes("swim")) return SPORT_STATS.swimming
  if (name.includes("water polo")) return SPORT_STATS.water_polo
  if (name.includes("ultimate") || name.includes("frisbee")) return SPORT_STATS.ultimate
  if (
    name.includes("wrestling") ||
    name.includes("judo") ||
    name.includes("boxing") ||
    name.includes("tae kwon") ||
    name.includes("kendo") ||
    name.includes("fencing")
  )
    return SPORT_STATS.combat
  if (name.includes("badminton") || name.includes("racquetball"))
    return SPORT_STATS.racquet
  return null // not supported
}

export default function SubmitStats() {
  const { clubId } = useParams()
  const navigate = useNavigate()

  const [club, setClub] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [playerId, setPlayerId] = useState("")
  const [gameId, setGameId] = useState("")
  const [statValues, setStatValues] = useState<Record<string, string>>({})

  const isOfficer = localStorage.getItem("is_officer") === "true"
  const currentUserId = localStorage.getItem("userId")
  const currentUserEmail = localStorage.getItem("email")

  useEffect(() => {
    if (!clubId) return
    setLoading(true)
    setError("")
    Promise.all([getTeamById(clubId), getTeamPlayers(clubId), getTeamGames(clubId)])
      .then(([team, players, games]) => {
        setClub(team)
        setPlayers(players)
        setGames(games)
      })
      .catch((err) => {
        console.error("Failed to load submit stats page:", err)
        setClub(null)
        setPlayers([])
        setGames([])
        setError("Failed to load submit stats page.")
      })
      .finally(() => setLoading(false))
  }, [clubId])

  const statFields = club ? getStatFields(club.name) : null

  const availablePlayers = useMemo(() => {
    if (isOfficer) return players
    return players.filter((p) => {
      const playerUserId = p.user_id ?? p.user?.id ?? null
      const playerUserEmail = p.user_email ?? p.user?.email ?? null
      if (currentUserId && playerUserId)
        return String(playerUserId) === String(currentUserId)
      if (currentUserEmail && playerUserEmail)
        return String(playerUserEmail).toLowerCase() === String(currentUserEmail).toLowerCase()
      return false
    })
  }, [players, isOfficer, currentUserId, currentUserEmail])

  useEffect(() => {
    if (isOfficer) return
    if (availablePlayers.length === 1) setPlayerId(availablePlayers[0].id)
    else if (availablePlayers.length === 0) setPlayerId("")
  }, [availablePlayers, isOfficer])

  // Reset stat values when club changes
  useEffect(() => {
    setStatValues({})
  }, [clubId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!clubId || !playerId || !gameId) {
      setError("Please select a player and a game.")
      return
    }
    if (!statFields) return

    const stats: Record<string, number | string> = {}
    for (const field of statFields) {
      const raw = statValues[field.key] ?? ""
      stats[field.key] = field.type === "number" ? Number(raw || 0) : raw
    }

    try {
      setSubmitting(true)
      await submitStats({
        team_id: clubId,
        game_id: gameId,
        player_id: playerId,
        sport: club.name,
        stats,
      })
      navigate(`/clubs/${clubId}`)
    } catch (err: any) {
      console.error("Failed to submit stats:", err)
      setError(err.message || "Failed to submit stats.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-gray-600">Loading...</p>
        </main>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-gray-600">Club not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6">
          <Link
            to={`/clubs/${clubId}`}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            ← Back to Club Page
          </Link>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Submit Stats</h1>
            <p className="mt-3 text-lg text-gray-500">
              Submit stats for review. These will only appear after officer approval.
            </p>
          </div>

          {!statFields ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
              <p className="text-lg font-medium text-gray-900">
                Stat submission is not yet supported for this club.
              </p>
              <p className="mt-2 text-gray-500">
                This club does not currently use the player stat submission workflow.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Player */}
              <div>
                <label className="mb-2 block text-base font-semibold text-gray-900">
                  Player
                </label>
                <select
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  disabled={!isOfficer}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 disabled:opacity-70"
                >
                  <option value="">
                    {isOfficer ? "Select player" : "Your player profile"}
                  </option>
                  {availablePlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name}
                    </option>
                  ))}
                </select>
                {!isOfficer && availablePlayers.length === 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    No player profile linked to your account yet.
                  </p>
                )}
              </div>

              {/* Game */}
              <div>
                <label className="mb-2 block text-base font-semibold text-gray-900">
                  Game
                </label>
                <select
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <option value="">Select game</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.away_team ? g.away_team.name : g.opponent_name} —{" "}
                      {new Date(g.game_date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sport-specific stat fields */}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {statFields.map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-base font-semibold text-gray-900">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      min={field.type === "number" ? 0 : undefined}
                      step={field.type === "number" ? "any" : undefined}
                      placeholder={field.placeholder ?? (field.type === "number" ? "0" : "")}
                      value={statValues[field.key] ?? ""}
                      onChange={(e) =>
                        setStatValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || (!isOfficer && availablePlayers.length === 0)}
                className="w-full rounded-xl bg-red-700 px-4 py-3 text-lg font-semibold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit for Approval"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}