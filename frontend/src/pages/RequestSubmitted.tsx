import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function RequestSubmitted() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <span className="text-3xl">✓</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900">Request Submitted</h1>

          <p className="mt-4 text-lg text-gray-600">
            Your account request has been received.
          </p>

          <p className="mt-3 text-base text-gray-500">
            Club member accounts can be created for stat submission access. Officer or
            approver privileges require review by the universal admin before they are
            granted.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/signin"
              className="rounded-xl bg-red-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-red-800"
            >
              Go to Sign In
            </Link>

            <Link
              to="/"
              className="rounded-xl border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}