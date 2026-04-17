import { Link } from "react-router-dom";
import type { TeamResponse } from "../api/teams";

type ClubCardProps = {
  club: TeamResponse;
};

export default function ClubCard({ club }: ClubCardProps) {
  const role = localStorage.getItem("role");
  const canViewDashboard = role === "officer" || role === "admin";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      
      {/* Placeholder image */}
      <div className="flex h-48 w-full items-center justify-center bg-gray-200 text-gray-400">
        No Image
      </div>

      <div className="p-5">
        {/* Club Name */}
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {club.name}
        </h2>

        {/* Description */}
        <p className="mb-3 text-gray-600">
          {club.description ?? "No description available."}
        </p>

        {/* Sport */}
        <p className="mb-4 text-sm text-gray-500">
          {club.sport}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {/* View Club (always available) */}
          <Link
            to={`/clubs/${club.id}`}
            className="block w-full rounded-xl bg-red-700 px-4 py-3 text-center font-semibold text-white hover:bg-red-800"
          >
            View Club
          </Link>

          {/* Officer Dashboard (only for officers/admins) */}
          {canViewDashboard && (
            <Link
              to={`/dashboard/club/${club.id}`}
              className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center font-semibold text-gray-900 hover:bg-gray-50"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}