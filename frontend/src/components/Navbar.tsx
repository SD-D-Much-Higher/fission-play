import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { clubs, players } from "../data/mockData"
import { searchPlayers, searchTeams } from "../services/searchService"

export default function Navbar() {
  const location = useLocation()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement | null>(null)

  const shouldHideSearch =
    location.pathname === "/" || location.pathname === "/signin" || location.pathname === "/signup"
  const hasQuery = query.trim().length > 0

  const matchedTeams = useMemo(() => {
    return searchTeams(clubs, query)
  }, [query])

  const matchedPlayers = useMemo(() => {
    return searchPlayers(players, clubs, query)
  }, [query])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchContainerRef.current) return
      if (!searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-8 py-4">
      <Link to="/" className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700 font-bold text-white">
          F
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Fission Play</h1>
      </Link>

      <div className="flex items-center w-max gap-5">
        {!shouldHideSearch && (
          <div ref={searchContainerRef} className="relative w-max min-w-60 max-w-lg">
            <input
              type="text"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value)
                setIsOpen(true)
              }}
              placeholder="Search teams or players..."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-red-600"
            />

            {isOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                {!hasQuery ? (
                  <p className="text-sm text-gray-500">Start typing to search teams and players.</p>
                ) : matchedTeams.length === 0 && matchedPlayers.length === 0 ? (
                  <p className="text-sm text-gray-500">No results found.</p>
                ) : (
                  <div className="space-y-4">
                    <section>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Teams
                      </h3>
                      {matchedTeams.length === 0 ? (
                        <p className="text-sm text-gray-500">No team matches.</p>
                      ) : (
                        <div className="space-y-2">
                          {matchedTeams.slice(0, 4).map((team) => (
                            <Link
                              key={team.id}
                              to={`/clubs/${team.id}`}
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
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Players
                      </h3>
                      {matchedPlayers.length === 0 ? (
                        <p className="text-sm text-gray-500">No player matches.</p>
                      ) : (
                        <div className="space-y-2">
                          {matchedPlayers.slice(0, 6).map((player) => (
                            <Link
                              key={player.id}
                              to={`/players/${player.id}`}
                              className="block rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                            >
                              {player.name}
                              <span className="ml-2 text-gray-500">
                                ({player.position} - {player.teamName})
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <Link to="/signin" className="w-max text-gray-700 hover:text-gray-900">
          Sign In
        </Link>
        <Link to="/signup" className="w-max text-gray-700 hover:text-gray-900">
          Sign Up
        </Link>
      </div>

    </header>
  )
}