import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import ClubCard from "../components/ClubCard";
import { getTeams } from "../api/teams";
import type { TeamResponse } from "../api/teams";

export default function Home() {
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <section className="mb-10 text-center">
          <h1 className="mb-3 text-5xl font-extrabold text-gray-900">
            Featured Clubs
          </h1>
          <p className="text-lg text-gray-600">
            Discover the vibrant club sports community at RPI
          </p>
        </section>

        {/* Search */}
        <section className="mb-10">
          <div className="mx-auto max-w-2xl">
            <input
              type="text"
              placeholder="Search clubs by name, sport, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-base text-gray-900 shadow-sm outline-none transition focus:border-red-600"
            />
          </div>
        </section>

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
          <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredClubs.map((club) => (
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
      </main>
    </div>
  );
}