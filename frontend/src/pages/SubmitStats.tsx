import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { getTeamById, getTeamPlayers, getTeamGames } from "../api/teams"
import { submitStats } from "../api/stats"

const supportedStatClubs = [
  "Men's Club Basketball",
  "Women's Club Basketball (WCBB)",
  "Men's Club Volleyball",
  "RPI Women's Club Soccer",
  "Men's Club Soccer",
  "Club Baseball",
  "ACHA Men's Ice Hockey",
  "RPI Water Polo",
  "Rugby",
  "Ultimate Frisbee",
  "Badminton club",
  "Club Racquetball",
  "RPI Boxing Club",
  "RPI Wrestling",
  "Judo Club",
  "RPI Tae Kwon Do Club",
  "RPI Meitokukan Kendo Dojo",
  "RPI Fencing Club",
]

export default function SubmitStats() {
  const { clubId } = useParams()
  const navigate = useNavigate()

  const [club, setClub] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [playerId, setPlayerId] = useState("")
  const [gameId, setGameId] = useState("")
  const [points, setPoints] = useState("")
  const [rebounds, setRebounds] = useState("")
  const [assists, setAssists] = useState("")

  useEffect(() => {
    if (!clubId) return

    setLoading(true)

    Promise.all([
      getTeamById(clubId),
      getTeamPlayers(clubId),
      getTeamGames(clubId),
    ])
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
      })
      .finally(() => {
        setLoading(false)
      })
  }, [clubId])

  const statsSupported = club ? supportedStatClubs.includes(club.name) : false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!clubId || !playerId || !gameId) return

    await submitStats({
      team_id: clubId,
      game_id: gameId,
      player_id: playerId,
      sport: club.name,
      stats: {
        points: Number(points),
        rebounds: Number(rebounds),
        assists: Number(assists),
      },
    })

    navigate(`/clubs/${clubId}`)
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

          {!statsSupported ? (
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
              <div>
                <label className="mb-2 block text-base font-semibold text-gray-900">
                  Player
                </label>
                <select
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <option value="">Select player</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name}
                    </option>
                  ))}
                </select>
              </div>

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
                      {g.away_team ? g.away_team.name : g.opponent_name} -{" "}
                      {new Date(g.game_date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-900">
                    Points
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-900">
                    Rebounds
                  </label>
                  <input
                    type="number"
                    value={rebounds}
                    onChange={(e) => setRebounds(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-900">
                    Assists
                  </label>
                  <input
                    type="number"
                    value={assists}
                    onChange={(e) => setAssists(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-red-700 px-4 py-3 text-lg font-semibold text-white hover:bg-red-800"
              >
                Submit for Approval
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}