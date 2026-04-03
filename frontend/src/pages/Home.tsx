import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import ClubCard from "../components/ClubCard"
import SearchBar from "../components/SearchBar"
import { clubs, players } from "../data/mockData"

export default function Home() {
  const [query, setQuery] = useState("")

  const normalizedQuery = query.trim().toLowerCase()

  const filteredClubs = useMemo(() => {
    if (!normalizedQuery) return clubs
    return clubs.filter((club) => {
      return (
        club.name.toLowerCase().includes(normalizedQuery) ||
        club.sport.toLowerCase().includes(normalizedQuery) ||
        club.description.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [normalizedQuery])

  const filteredPlayers = useMemo(() => {
    if (!normalizedQuery) return []
    return players
      .filter((player) => {
        const clubName = clubs.find((club) => club.id === player.clubId)?.name ?? ""
        return (
          player.name.toLowerCase().includes(normalizedQuery) ||
          player.position.toLowerCase().includes(normalizedQuery) ||
          clubName.toLowerCase().includes(normalizedQuery)
        )
      })
      .map((player) => {
        const club = clubs.find((item) => item.id === player.clubId)
        return {
          ...player,
          clubName: club?.name ?? "Unknown Club",
        }
      })
  }, [normalizedQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-10 text-center">
          <h1 className="mb-3 text-5xl font-extrabold text-gray-900">
            Featured Clubs
          </h1>
          <p className="text-lg text-gray-600">
            Discover the vibrant club sports community at RPI
          </p>
        </section>

        <SearchBar
          value={query}
          onChange={setQuery}
          summaryText={
            normalizedQuery
              ? `${filteredClubs.length} team match(es), ${filteredPlayers.length} player match(es)`
              : undefined
          }
        />

        {normalizedQuery && (
          <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Team Matches</h2>
            {filteredClubs.length === 0 ? (
              <p className="text-gray-500">No team matches found.</p>
            ) : (
              <div className="space-y-3">
                {filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{club.name}</p>
                      <p className="text-sm text-gray-500">{club.sport}</p>
                    </div>
                    <Link
                      to={`/clubs/${club.id}`}
                      className="inline-block rounded-lg bg-red-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-red-800"
                    >
                      View Team Profile
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {normalizedQuery && (
          <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Player Matches</h2>
            {filteredPlayers.length === 0 ? (
              <p className="text-gray-500">No player matches found.</p>
            ) : (
              <div className="space-y-3">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{player.name}</p>
                      <p className="text-sm text-gray-500">
                        {player.position} - {player.clubName}
                      </p>
                    </div>
                    <Link
                      to={`/players/${player.id}`}
                      className="inline-block rounded-lg bg-red-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-red-800"
                    >
                      View Player Profile
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {normalizedQuery && filteredClubs.length === 0 && filteredPlayers.length === 0 && (
          <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-700">No results found.</p>
            <p className="mt-2 text-gray-500">Try another team name, sport, or player.</p>
          </section>
        )}

        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </section>
      </main>
    </div>
  )
}