import { useState } from "react"
import Navbar from "../components/Navbar"

const initialRequests = [
  {
    id: "r1",
    name: "Chris Miles",
    club: "Men's Basketball",
    requestedRole: "Club Officer",
    submittedAt: "March 24, 2026",
  },
  {
    id: "r2",
    name: "Avery Thomas",
    club: "Women's Volleyball",
    requestedRole: "Stat Approver",
    submittedAt: "March 25, 2026",
  },
]

export default function AdminDashboard() {
  const [requests, setRequests] = useState(initialRequests)

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== id))
  }

  const handleReject = (id: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Universal Admin Dashboard</h1>
          <p className="mt-3 text-lg text-gray-500">
            Review role requests from club members who want officer or stat approval access.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Pending Role Requests</h2>

          {requests.length === 0 ? (
            <p className="text-gray-500">No pending role requests.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                    <p className="text-sm text-gray-500">{request.club}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Requested: {request.requestedRole}
                    </p>
                    <p className="text-sm text-gray-400">
                      Submitted: {request.submittedAt}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
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