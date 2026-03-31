import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Reset Password</h1>
            <p className="mt-3 text-lg text-gray-500">
              Enter your RPI email and we&apos;ll send you reset instructions
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                RPI Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="student@rpi.edu"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-700 px-4 py-3 text-lg font-semibold text-white transition hover:bg-red-800"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/signin"
              className="font-medium text-red-600 hover:text-red-700"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}