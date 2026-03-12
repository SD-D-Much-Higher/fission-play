import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">

      <Link to="/" className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700 font-bold text-white">
          F
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Fission Play</h1>
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/signin" className="text-gray-700 hover:text-gray-900">
          Sign In
        </Link>
        <Link to="/signup" className="text-gray-700 hover:text-gray-900">
          Sign Up
        </Link>
      </div>

    </header>
  )
}