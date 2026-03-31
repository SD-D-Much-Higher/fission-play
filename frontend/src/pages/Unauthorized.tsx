import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-4 text-lg text-gray-600">
            You do not have permission to view this page.
          </p>
          <p className="mt-2 text-gray-500">
            This area is restricted to approved club officers or the universal admin.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/signin"
              className="rounded-xl bg-red-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-red-800"
            >
              Sign In
            </Link>
            <Link
              to="/"
              className="rounded-xl border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}