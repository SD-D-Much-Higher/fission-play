import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { searchPlayers, searchTeams } from "../services/searchService"
import type { TeamSearchItem, PlayerSearchItem } from "../services/searchService"
import { getTeams } from "../api/teams"
import { apiFetch } from "../lib/api"

interface RawPlayer {
  id: string
  first_name: string
  last_name: string
  position: string | null
  team: { id: string; name: string; sport: string }
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [teams, setTeams] = useState<TeamSearchItem[]>([])
  const [players, setPlayers] = useState<PlayerSearchItem[]>([])
  const searchContainerRef = useRef<HTMLDivElement | null>(null)

  const shouldHideSearch =
    location.pathname === "/signin" || location.pathname === "/signup"
  const hasQuery = query.trim().length > 0

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"))
  }, [location.pathname])

  useEffect(() => {
    getTeams()
      .then((data) =>
        setTeams(data.map((t) => ({ id: t.id, name: t.name, sport: t.sport, description: t.description ?? "" })))
      )
      .catch(() => {})

    apiFetch<RawPlayer[]>("/players/")
      .then((data) =>
        setPlayers(data.map((p) => ({ id: p.id, name: `${p.first_name} ${p.last_name}`, position: p.position ?? "", teamId: p.team.id })))
      )
      .catch(() => {})
  }, [])

  const matchedTeams = useMemo(() => searchTeams(teams, query), [teams, query])
  const matchedPlayers = useMemo(() => searchPlayers(players, teams, query), [players, teams, query])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchContainerRef.current) return
      if (!searchContainerRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const handleLogout = () => {
    ["access_token","email","userId","role","clubId","is_superuser","is_officer"].forEach((k) => localStorage.removeItem(k))
    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full max-w-full flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-8 py-4">
      <Link to="/" className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700 font-bold text-white">F</div>
        <h1 className="text-2xl font-bold text-gray-900">Fission Play</h1>
      </Link>

      <div className="flex items-center w-max gap-5">
        {!shouldHideSearch && (
          <div
            ref={searchContainerRef}
            className="relative flex flex-row-reverse items-center gap-2 w-max min-w-60 max-w-lg px-5 py-2 text-base text-gray-500 rounded-xl bg-white shadow-md transition-all duration-300 focus-within:text-black focus-within:shadow-black/40"
          >
            <input
              type="text"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
              placeholder="Search teams or players..."
              className="peer w-full text-left min-w-50 text-base outline-none transition-colors duration-300"
            />
            <Search className="size-5 opacity-60 transition-opacity duration-300 peer-focus:opacity-100 peer-focus:text-black" />

            {isOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                {!hasQuery ? (
                  <p className="text-sm text-gray-500">Start typing to search teams and players.</p>
                ) : matchedTeams.length === 0 && matchedPlayers.length === 0 ? (
                  <p className="text-sm text-gray-500">No results found.</p>
                ) : (
                  <div className="space-y-4">
                    <section>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Teams</h3>
                      {matchedTeams.length === 0 ? (
                        <p className="text-sm text-gray-500">No team matches.</p>
                      ) : (
                        <div className="space-y-2">
                          {matchedTeams.slice(0, 4).map((team) => (
                            <Link
                              key={team.id}
                              to={`/clubs/${team.id}`}
                              onClick={() => { setIsOpen(false); setQuery("") }}
                              className="block rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                            >
                              {team.name}
                              <span className="ml-2 text-gray-500">({team.sport})</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </section>

                    <section>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Players</h3>
                      {matchedPlayers.length === 0 ? (
                        <p className="text-sm text-gray-500">No player matches.</p>
                      ) : (
                        <div className="space-y-2">
                          {matchedPlayers.slice(0, 6).map((player) => {
                            const teamId = "teamId" in player ? player.teamId : player.clubId
                            return (
                              <Link
                                key={player.id}
                                to={`/clubs/${teamId}`}
                                onClick={() => { setIsOpen(false); setQuery("") }}
                                className="block rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                              >
                                {player.name}
                                <span className="ml-2 text-gray-500">
                                  ({player.position || "Player"} — {player.teamName})
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </section>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-max rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Log Out
          </button>
        ) : (
          <>
            <Link to="/signin" className="w-max text-base font-medium text-gray-700 hover:text-gray-900">Sign In</Link>
            <Link to="/signup" className="w-max rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  )
}