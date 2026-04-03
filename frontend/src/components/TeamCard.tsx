import { Link } from "react-router-dom"
import type { TeamProfile } from "../types/teamProfile"

type TeamCardProps = {
  team: TeamProfile
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <img
        src={team.image || team.bannerImage}
        alt={team.name}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">{team.name}</h2>
        <p className="mb-4 text-gray-600">{team.description}</p>
        <p className="mb-4 text-sm text-gray-500">{team.members} members</p>

        <Link
          to={`/teams/${team.id}`}
          className="block w-full rounded-xl bg-red-700 px-4 py-3 text-center font-semibold text-white hover:bg-red-800"
        >
          View Team
        </Link>
      </div>
    </div>
  )
}

