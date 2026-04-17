import { useEffect, useMemo, useState } from "react";
import { useCallback } from "react"
import Navbar from "../components/Navbar";
import ClubCard from "../components/ClubCard";
import { getTeams } from "../api/teams";
import type { TeamResponse } from "../api/teams";
import homeHero from "../assets/wcsHero.avif"
import { CircleArrowDown } from "lucide-react"
import { scrollToElementOfId } from "../utils/inPageRoutingScroll"

export default function Home() {
  const scrollToFeaturedTeams = useCallback(() => { scrollToElementOfId("featured-teams") }, [])

  const [searchTerm, setSearchTerm] = useState("");
  const [clubs, setClubs] = useState<TeamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTeams()
      .then((data) => {
        console.log("teams returned from backend:", data);
        setClubs(data);
      })
      .catch((err) => {
        console.error("getTeams error:", err);
        setError(err.message || "Failed to load teams");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredClubs = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return clubs;

    return clubs.filter((club) => {
      return (
        club.name.toLowerCase().includes(query) ||
        (club.description ?? "").toLowerCase().includes(query) ||
        club.sport.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, clubs]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-start gap-6 pb-20 bg-gray-50">
      <Navbar />
      <section className="relative w-full h-max min-h-svh flex flex-col items-start justify-end gap-6 pt-80 pb-30 px-25 overflow-hidden">
        <img 
          src={homeHero}
          alt="RPI Club Sports"
          className="absolute inset-0 z-0 w-full object-cover pointer-events-none blur-xs brightness-90 contrast-100"
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-transparent from-38% to-black/92 to-92%" />
        <div className="z-15 w-max flex flex-col items-start justify-end gap-4 text-xl text-left font-medium text-gray-200 text-shadow-lg">
          <h1 className="w-max max-w-full">
            The Home of <br/>
            <span className="text-8xl font-extrabold text-white text-shadow-black/90">
            <span className="text-red-700">RPI </span> 
            Club Sports</span>
          </h1>
          
          <div className="w-max h-max flex flex-row items-center justify-start gap-4 pt-4">
            <p className="z-15 w-max max-w-full">
              Discover the vibrant club sports community at RPI
            </p>
            <button
              type="button"
              onClick={scrollToFeaturedTeams}
              aria-label="Jump to featured teams"
              className="cursor-pointer hover:text-red-700 transition-opacity-colors duration-300"
            >
              <CircleArrowDown className="size-max hero-pulse-arrow " />
            </button>
          </div>
        </div>
      </section>


        <section className="mb-10 text-center">
          <h1 className="mb-3 text-5xl font-extrabold text-gray-900">
            Featured Clubs
          </h1>
          
          <div className="w-max h-max flex flex-row items-center justify-start gap-4 pt-4">
            <p className="z-15 w-max max-w-full">
              Discover the vibrant club sports community at RPI
            </p>
            <button
              type="button"
              onClick={scrollToFeaturedTeams}
              aria-label="Jump to featured teams"
              className="cursor-pointer hover:text-red-700 transition-opacity-colors duration-300"
            >
              <CircleArrowDown className="size-max hero-pulse-arrow " />
            </button>
          </div>
      </section>

       {/* Featured Teams */}
       <section id="featured-teams" className="max-w-full mb-10 text-center py-10 px-14 scroll-mt-20">
        <h1 className="mb-3 text-5xl font-extrabold text-gray-900">
          Featured Teams
        </h1>
        <p className="text-lg text-gray-600">
          Check out the most popular club teams at RPI:
        </p>
    
        {/* Featured Teams Grid */}
        {/* Content */}
        {loading ? (
          <section className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">Loading clubs...</p>
          </section>
        ) : error ? (
          <section className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Could not load clubs
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </section>
        ) : filteredClubs.length > 0 ? (
          <section className="max-w-full grid gap-8 md:grid-cols-2 xl:grid-cols-3 mt-10 text-left">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </section>
        ) : (
          <section className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              No clubs found
            </h2>
            <p className="mt-2 text-gray-600">
              Try searching with a different club name, sport, or keyword.
            </p>
          </section>
        )}
      </section>
    </div>
  );
}