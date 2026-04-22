import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Navbar from "../components/Navbar"
import { apiFetch } from "../lib/api"

type CurrentUser = {
  id: string
  email: string
  is_superuser: boolean
  full_name?: string | null
  requested_role?: string | null
  club_id?: string | null
}

export default function SignIn() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    setSubmitting(true)

    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const response = await fetch("http://127.0.0.1:8000/auth/jwt/login", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let message = "Sign in failed."
        try {
          const data = await response.json()
          message = data.detail || message
        } catch {
          //
        }
        throw new Error(message)
      }

      const data = await response.json()
      localStorage.setItem("access_token", data.access_token)

      const me = await apiFetch<CurrentUser>("/users/me")

      localStorage.setItem("email", me.email)
      localStorage.setItem("userId", me.id)
      localStorage.setItem("role", me.requested_role ?? "club-member")
      localStorage.setItem("is_superuser", String(me.is_superuser))

      if (me.club_id) {
        localStorage.setItem("clubId", me.club_id)
      } else {
        localStorage.removeItem("clubId")
      }

      // Superusers are always officers. For regular officer accounts, verify
      // the admin has approved their request (i.e. they're in team.officers).
      let isActualOfficer = me.is_superuser
      if (!isActualOfficer && me.requested_role === "officer" && me.club_id) {
        try {
          const check = await apiFetch<{ is_officer: boolean }>(
            `/teams/${me.club_id}/am-officer`
          )
          isActualOfficer = check.is_officer
        } catch {
          isActualOfficer = false
        }
      }
      localStorage.setItem("is_officer", String(isActualOfficer))

      if (me.is_superuser || me.requested_role === "admin") {
        navigate("/admin")
        return
      }

      if (isActualOfficer && me.club_id) {
        navigate(`/dashboard/club/${me.club_id}`)
        return
      }

      if (me.club_id) {
        navigate(`/clubs/${me.club_id}`)
        return
      }

      navigate("/")
    } catch (err: any) {
      setError(err.message || "Sign in failed.")
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
            <h1 className="text-4xl font-bold text-gray-900">Sign In</h1>
            <p className="mt-3 text-lg text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-base font-semibold text-gray-900">
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
              <label htmlFor="password" className="mb-2 block text-base font-semibold text-gray-900">
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
              {submitting ? "Signing In..." : "Sign In"}
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
              <Link to="/signup" className="font-medium text-red-600 hover:text-red-700">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}