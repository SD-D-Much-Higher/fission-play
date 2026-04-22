import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("email")
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
    localStorage.removeItem("clubId")
    localStorage.removeItem("is_superuser")
    localStorage.removeItem("is_officer")
    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">

      <Link to="/" className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700 font-bold text-white">
          F
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Fission Play</h1>
      </Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Log Out
          </button>
        ) : (
          <>
            <Link to="/signin" className="text-gray-700 hover:text-gray-900">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

    </header>
  )
}