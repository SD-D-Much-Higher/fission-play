import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import Navbar from "../components/Navbar"

export default function SubmitStats() {
  const { clubId } = useParams()
  const navigate = useNavigate()

  const [playerName, setPlayerName] = useState("")
  const [game, setGame] = useState("")
  const [points, setPoints] = useState("")
  const [rebounds, setRebounds] = useState("")
  const [assists, setAssists] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/clubs/${clubId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6">
          <Link
            to={`/clubs/${clubId}`}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            ← Back to Club Page
          </Link>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Submit Stats</h1>
            <p className="mt-3 text-lg text-gray-500">
              Submit team or player stats for review. Stats will not appear publicly until
              a club officer approves them.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="playerName"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Player Name
              </label>
              <input
                id="playerName"
                type="text"
                placeholder="Jordan Banks"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="game"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Game
              </label>
              <input
                id="game"
                type="text"
                placeholder="vs Union College"
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label
                  htmlFor="points"
                  className="mb-2 block text-base font-semibold text-gray-900"
                >
                  Points
                </label>
                <input
                  id="points"
                  type="number"
                  placeholder="0"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="rebounds"
                  className="mb-2 block text-base font-semibold text-gray-900"
                >
                  Rebounds
                </label>
                <input
                  id="rebounds"
                  type="number"
                  placeholder="0"
                  value={rebounds}
                  onChange={(e) => setRebounds(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="assists"
                  className="mb-2 block text-base font-semibold text-gray-900"
                >
                  Assists
                </label>
                <input
                  id="assists"
                  type="number"
                  placeholder="0"
                  value={assists}
                  onChange={(e) => setAssists(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-700 px-4 py-3 text-lg font-semibold text-white transition hover:bg-red-800"
            >
              Submit for Approval
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}