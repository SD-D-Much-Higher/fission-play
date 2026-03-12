import type { Club } from "../types/club"

type ClubCardProps = {
  club: Club
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <img
        src={club.image}
        alt={club.name}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">{club.name}</h2>
        <p className="mb-4 text-gray-600">{club.description}</p>
        <p className="mb-4 text-sm text-gray-500">{club.members} members</p>

        <button className="w-full rounded-xl bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800">
          View Club
        </button>
      </div>
    </div>
  )
}