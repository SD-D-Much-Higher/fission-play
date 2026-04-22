import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

interface OfficerRequest {
  id: string
  full_name: string
  user_email: string
  club_name: string
  club_id: string
  status: string
  created_at: string
}

function getToken(): string | null {
  return localStorage.getItem("access_token")
}

async function fetchRequests(): Promise<OfficerRequest[]> {
  const res = await fetch(`${API_BASE}/officer-requests/`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) throw new Error("Failed to load requests")
  return res.json()
}

async function resolveRequest(id: string, action: "approve" | "reject"): Promise<void> {
  const res = await fetch(`${API_BASE}/officer-requests/${id}/${action}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) throw new Error(`Failed to ${action} request`)
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<OfficerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionError, setActionError] = useState("")

  useEffect(() => {
    fetchRequests()
      .then(setRequests)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionError("")
    try {
      await resolveRequest(id, action)
      setRequests((prev) => prev.filter((r) => r.id !== id))
    } catch (e: any) {
      setActionError(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-3 text-lg text-gray-500">
            Review officer role requests from club members.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Pending Role Requests</h2>

          {actionError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionError}
            </div>
          )}

          {loading ? (
            <p className="text-gray-500">Loading requests…</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500">No pending role requests.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{req.full_name}</h3>
                    <p className="text-sm text-gray-500">{req.user_email}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Club: <span className="font-medium">{req.club_name}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Requested: <span className="font-medium">Club Officer</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Submitted: {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(req.id, "approve")}
                      className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "reject")}
                      className="rounded-xl bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}