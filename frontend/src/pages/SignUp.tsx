import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { getTeams, type TeamResponse } from "../api/teams"

export default function SignUp() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("club-member")
  const [clubs, setClubs] = useState<TeamResponse[]>([])
  const [clubId, setClubId] = useState("")
  const [loadingClubs, setLoadingClubs] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getTeams()
      .then((data) => {
        setClubs(data)
        if (data.length > 0) {
          setClubId(data[0].id)
        }
      })
      .catch((err) => {
        console.error("Failed to load clubs for sign up:", err)
      })
      .finally(() => {
        setLoadingClubs(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill out all required fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if ((role === "club-member" || role === "officer") && !clubId) {
      setError("Please select a club.")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          full_name: name,
          requested_role: role,
          club_id: role === "admin" ? null : clubId,
        }),
      })

      if (!response.ok) {
        let message = "Account creation failed."
        try {
          const data = await response.json()
          message = data.detail || JSON.stringify(data)
        } catch {
          //
        }
        throw new Error(message)
      }

      navigate("/signin")
    } catch (err: any) {
      setError(err.message || "Account creation failed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Create Account</h1>
            <p className="mt-3 text-lg text-gray-500">
              Join your club to submit stats and access team information
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="mb-2 block text-base font-semibold text-gray-900">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Appleseed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-base font-semibold text-gray-900">
                RPI Email
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
              <label htmlFor="password" className="mb-2 block text-base font-semibold text-gray-900">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-base font-semibold text-gray-900">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-2 block text-base font-semibold text-gray-900">
                Request account type
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

            {role !== "admin" && (
              <div>
                <label htmlFor="club" className="mb-2 block text-base font-semibold text-gray-900">
                  Club
                </label>
                <select
                  id="club"
                  value={clubId}
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
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-red-700 px-4 py-3 text-lg font-semibold text-white transition hover:bg-red-800 disabled:opacity-60"
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-500">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-red-600 hover:text-red-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}