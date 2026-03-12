import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function SignUp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Create Club Account</h1>
            <p className="mt-3 text-lg text-gray-500">
              Register to submit stats and manage activity for your club
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

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

            <div>
              <label
                htmlFor="club"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Club
              </label>
              <select
                id="club"
                defaultValue=""
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-900 outline-none transition focus:border-red-600 focus:bg-white"
              >
                <option value="" disabled>
                  Select your club
                </option>
                <option value="mens-basketball">Men&apos;s Basketball</option>
                <option value="mens-soccer">Men&apos;s Soccer</option>
                <option value="womens-volleyball">Women&apos;s Volleyball</option>
                <option value="club-baseball">Club Baseball</option>
                <option value="badminton">Badminton Club</option>
                <option value="judo">Judo Club</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="roleRequest"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Request Access As
              </label>
              <select
                id="roleRequest"
                defaultValue="club-member"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-900 outline-none transition focus:border-red-600 focus:bg-white"
              >
                <option value="club-member">Club Member</option>
                <option value="officer-request">Officer Request</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Officer access requires approval and cannot be granted automatically.
              </p>
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
                placeholder="Create a password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-700 px-4 py-3 text-lg font-semibold text-white transition hover:bg-red-800"
            >
              Request Account
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
            Sign up with RPI SSO
          </button>

          <div className="mt-8 space-y-4 text-center">
            <p className="text-sm text-gray-500">
              Public users can browse clubs and schedules without creating an account.
            </p>

            <p className="text-lg text-gray-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-red-600 hover:text-red-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}