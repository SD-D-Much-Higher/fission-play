import Navbar from "../components/Navbar"
import ClubCard from "../components/ClubCard"
import type { Club } from "../types/club"

const clubs: Club[] = [
  {
    id: "mens-basketball",
    name: "Men's Basketball",
    description: "Competitive club basketball team competing in regional tournaments.",
    members: 15,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mens-soccer",
    name: "Men's Soccer",
    description: "RPI's premier soccer club with a strong competitive history.",
    members: 22,
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "womens-volleyball",
    name: "Women's Volleyball",
    description: "High-energy volleyball team competing at the collegiate club level.",
    members: 18,
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-10 text-center">
          <h1 className="mb-3 text-5xl font-extrabold text-gray-900">
            Featured Clubs
          </h1>
          <p className="text-lg text-gray-600">
            Discover the vibrant club sports community at RPI
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </section>
      </main>
    </div>
  )
}