import { Link, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { teams, players } from "../data/mockData"

export default function PlayerProfile() {
  const { playerId } = useParams()
  const player = players.find((item) => item.id === playerId)

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">Player not found</h1>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const team = teams.find((item) => item.id === player.teamId)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6">
          <Link
            to={team ? `/teams/${team.id}` : "/"}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            ← Back to Team
          </Link>
        </div>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Player Profile</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">{player.name}</h1>
          <p className="mt-2 text-lg text-gray-600">
            #{player.number} • {player.position} • {team?.name ?? "Unknown Team"}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StatCard label="Games Played" value={player.stats.gamesPlayed} />
            <StatCard
              label="Points"
              value={"points" in player.stats && typeof player.stats.points === "number" ? player.stats.points : 0}
            />
            <StatCard
              label="Rebounds"
              value={
                "rebounds" in player.stats && typeof player.stats.rebounds === "number"
                  ? player.stats.rebounds
                  : 0
              }
            />
            <StatCard
              label="Assists"
              value={"assists" in player.stats && typeof player.stats.assists === "number" ? player.stats.assists : 0}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
