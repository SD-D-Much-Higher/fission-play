import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { apiFetch } from "../lib/api"

interface PlayerDetail {
  id: string
  first_name: string
  last_name: string
  position: string | null
  year: string | null
  jersey_number: number | null
  team: { id: string; name: string; sport: string }
}

interface StatSubmission {
  id: string
  stats: Record<string, number | string>
  sport: string
  status: string
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default function PlayerDetail() {
  const { playerId } = useParams()
  const [player, setPlayer] = useState<PlayerDetail | null>(null)
  const [approvedStats, setApprovedStats] = useState<StatSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!playerId) return
    Promise.all([
      apiFetch<PlayerDetail>(`/players/${playerId}`),
      apiFetch<StatSubmission[]>(`/stats/player/${playerId}/approved`).catch(() => []),
    ])
      .then(([playerData, statsData]) => {
        setPlayer(playerData)
        setApprovedStats(statsData ?? [])
      })
      .catch(() => setPlayer(null))
      .finally(() => setLoading(false))
  }, [playerId])

  // Aggregate all approved stats
  const aggregated = approvedStats.reduce(
    (acc: Record<string, number>, sub) => {
      acc.gamesPlayed = (acc.gamesPlayed ?? 0) + 1
      for (const [key, val] of Object.entries(sub.stats)) {
        if (typeof val === "number") {
          acc[key] = (acc[key] ?? 0) + val
        }
      }
      return acc
    },
    {}
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-gray-600">Loading player...</p>
        </main>
      </div>
    )
  }

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

  const statEntries = Object.entries(aggregated).filter(([key]) => key !== "gamesPlayed")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Player Profile
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            {player.first_name}{" "}
            <span className="text-red-700">{player.last_name}</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {player.jersey_number ? `#${player.jersey_number} • ` : ""}
            {player.position ?? "Player"}
            {player.year ? ` • ${player.year}` : ""}
            {" • "}
            <Link
              className="hover:underline"
              to={`/clubs/${player.team.id}`}
            >
              {player.team.name} ↗
            </Link>
          </p>

          {aggregated.gamesPlayed > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <StatCard label="Games Played" value={aggregated.gamesPlayed ?? 0} />
              {statEntries.slice(0, 3).map(([key, val]) => (
                <StatCard
                  key={key}
                  label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  value={val}
                />
              ))}
              {statEntries.slice(3).map(([key, val]) => (
                <StatCard
                  key={key}
                  label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  value={val}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-gray-500">No approved stats yet.</p>
          )}
        </section>
      </main>
    </div>
  )
}