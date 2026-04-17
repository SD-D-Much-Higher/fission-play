import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { getTeams, type TeamResponse } from "../api/teams"

export default function SignIn() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("club-member")
  const [clubs, setClubs] = useState<TeamResponse[]>([])
  const [teamId, setClubId] = useState("")
  const [loadingClubs, setLoadingClubs] = useState(true)

  useEffect(() => {
    getTeams()
      .then((data) => {
        setClubs(data)
        if (data.length > 0) {
          setClubId(data[0].id)
        }
      })
      .catch((err) => {
        console.error("Failed to load clubs for sign in:", err)
      })
      .finally(() => {
        setLoadingClubs(false)
      })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!teamId && role !== "admin") return

    if (role === "club-member") {
      navigate(`/clubs/${teamId}`)
      return
    }

    if (role === "officer") {
      navigate(`/dashboard/club/${teamId}`)
      return
    }

    if (role === "admin") {
      navigate("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Sign In</h1>
            <p className="mt-3 text-lg text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="student@rpi.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="club"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Club
              </label>
              <select
                id="club"
                value={teamId}
                onChange={(e) => setClubId(e.target.value)}
                disabled={loadingClubs}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-900 outline-none transition focus:border-red-600 focus:bg-white disabled:opacity-60"
              >
                {loadingClubs ? (
                  <option value="">Loading clubs...</option>
                ) : clubs.length === 0 ? (
                  <option value="">No clubs found</option>
                ) : (
                  clubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Sign in as
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-900 outline-none transition focus:border-red-600 focus:bg-white"
              >
                <option value="club-member">Club Member</option>
                <option value="officer">Club Officer</option>
                <option value="admin">Universal Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-700 px-4 py-3 text-lg font-semibold text-white transition hover:bg-red-800"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm uppercase tracking-wide text-gray-400">
              or continue with
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Sign in with RPI SSO
          </button>

          <div className="mt-8 space-y-4 text-center">
            <Link
              to="/forgot-password"
              className="block text-lg text-red-600 hover:text-red-700"
            >
              Forgot password?
            </Link>

            <p className="text-lg text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-red-600 hover:text-red-700"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}