import Navbar from "../components/Navbar"
import ClubCard from "../components/ClubCard"
import { clubs } from "../data/mockData"

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