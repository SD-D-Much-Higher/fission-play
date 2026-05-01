import { Link } from "react-router-dom";
import type { TeamResponse } from "../api/teams";

type ClubCardProps = {
  club: TeamResponse;
};

function getCardImageUrl(sport: string): string {
  const s = sport.toLowerCase()
  if (s.includes("soccer") || s.includes("football")) return "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80"
  if (s.includes("basketball")) return "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80"
  if (s.includes("volleyball")) return "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80"
  if (s.includes("ice hockey") || s.includes("hockey")) return "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=600&q=80"
  if (s.includes("baseball")) return "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=600&q=80"
  if (s.includes("swimming") || s.includes("swim")) return "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80"
  if (s.includes("rowing") || s.includes("crew")) return "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80"
  if (s.includes("rugby")) return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
  if (s.includes("badminton") || s.includes("racquetball") || s.includes("tennis")) return "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80"
  if (s.includes("cycling")) return "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80"
  if (s.includes("skiing") || s.includes("snowboard")) return "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80"
  if (s.includes("wrestling") || s.includes("judo") || s.includes("boxing") ||
      s.includes("taekwondo") || s.includes("tae kwon")) return "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80"
  if (s.includes("fencing") || s.includes("kendo")) return "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=600&q=80"
  if (s.includes("water polo")) return "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80"
  if (s.includes("frisbee") || s.includes("ultimate") || s.includes("quadball")) return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80"
  if (s.includes("dance") || s.includes("bhangra")) return "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80"
  if (s.includes("equestrian") || s.includes("horse")) return "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80"
  if (s.includes("weightlift") || s.includes("weight")) return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"
  if (s.includes("esport") || s.includes("gaming")) return "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80"
  if (s.includes("outdoor") || s.includes("hiking") || s.includes("outing")) return "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80"
  if (s.includes("circus") || s.includes("juggling")) return "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&q=80"
  if (s.includes("fishing")) return "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80"
  if (s.includes("disc golf")) return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80"
  if (s.includes("ballroom")) return "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80"
  return "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80"
}

export default function ClubCard({ club }: ClubCardProps) {
  const role = localStorage.getItem("role");
  const isOfficer = localStorage.getItem("is_officer") === "true";
  const isSuperuser = localStorage.getItem("is_superuser") === "true";
  const assignedClubId = localStorage.getItem("clubId");

  const canViewDashboard =
    isSuperuser || (isOfficer && assignedClubId === club.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={getCardImageUrl(club.sport)}
          alt={club.name}
          className="h-full w-full object-cover transition hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            target.parentElement!.classList.add("bg-gray-200")
          }}
        />
      </div>

      <div className="p-5">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">{club.name}</h2>

        <p className="mb-3 text-gray-600">
          {club.description ?? "No description available."}
        </p>

        <p className="mb-4 text-sm text-gray-500">{club.sport}</p>

        <div className="flex flex-col gap-2">
          <Link
            to={`/clubs/${club.id}`}
            className="block w-full rounded-xl bg-red-700 px-4 py-3 text-center font-semibold text-white hover:bg-red-800"
          >
            View Club
          </Link>

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