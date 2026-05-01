import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"
import { searchPlayers, searchTeams } from "../services/searchService"
import type { TeamSearchItem, PlayerSearchItem } from "../services/searchService"
import { getTeams } from "../api/teams"
import { apiFetch } from "../lib/api"
import logo from "../assets/fp-low-qual.png"

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
  const [isAdmin, setIsAdmin] = useState(false) // ✅ NEW

  const [teams, setTeams] = useState<TeamSearchItem[]>([])
  const [players, setPlayers] = useState<PlayerSearchItem[]>([])
  const searchContainerRef = useRef<HTMLDivElement | null>(null)

  const shouldHideSearch =
    location.pathname === "/signin" || location.pathname === "/signup"

  const hasQuery = query.trim().length > 0

  // ✅ Update login + admin state
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"))
    setIsAdmin(localStorage.getItem("is_superuser") === "true")
  }, [location.pathname])

  useEffect(() => {
    getTeams()
      .then((data) =>
        setTeams(
          data.map((t) => ({
            id: t.id,
            name: t.name,
            sport: t.sport,
            description: t.description ?? "",
          }))
        )
      )
      .catch(() => {})

    apiFetch<RawPlayer[]>("/players/")
      .then((data) =>
        setPlayers(
          data.map((p) => ({
            id: p.id,
            name: `${p.first_name} ${p.last_name}`,
            position: p.position ?? "",
            teamId: p.team.id,
          }))
        )
      )
      .catch(() => {})
  }, [])

  const matchedTeams = useMemo(() => searchTeams(teams, query), [teams, query])
  const matchedPlayers = useMemo(
    () => searchPlayers(players, teams, query),
    [players, teams, query]
  )

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

  const handleLogout = () => {
    [
      "access_token",
      "email",
      "userId",
      "role",
      "clubId",
      "is_superuser",
      "is_officer",
    ].forEach((k) => localStorage.removeItem(k))

    setIsLoggedIn(false)
    setIsAdmin(false)
    navigate("/")
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4">
        <img src={logo} alt="Fission Play logo" className="h-10 w-10" />

        <h1 className="text-2xl font-bold text-gray-900">Fission Play</h1>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* ADMIN TAB */}
        {isAdmin && (
          <Link
            to="/admin"
            className="font-semibold text-gray-700 transition hover:text-red-700"
          >
            Admin
          </Link>
        )}

        {/* Search */}
        {!shouldHideSearch && (
          <div
            ref={searchContainerRef}
            className="relative flex items-center gap-2 min-w-60 max-w-lg px-5 py-2 text-base text-gray-500 rounded-xl bg-white shadow-md"
          >
            <input
              type="text"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value)
                setIsOpen(true)
              }}
              placeholder="Search teams or players..."
              className="w-full outline-none"
            />
            <Search className="size-5 opacity-60" />

            {isOpen && hasQuery && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-2 p-3 z-50">
                {matchedTeams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => navigate(`/clubs/${team.id}`)}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    {team.name}
                  </div>
                ))}

                {matchedPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => navigate(`/players/${player.id}`)}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Auth buttons */}
        {!isLoggedIn ? (
          <Link
            to="/signin"
            className="rounded-xl bg-red-700 px-4 py-2 text-white font-semibold hover:bg-red-800"
          >
            Sign In
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="rounded-xl border px-4 py-2 font-semibold hover:bg-gray-100"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}