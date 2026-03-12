export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700 font-bold text-white">
          F
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Fission Play</h1>
        <a href="#" className="text-gray-600 hover:text-gray-900">
          Clubs
        </a>
      </div>

      <div className="flex items-center gap-4">
        <a href="#" className="text-gray-700 hover:text-gray-900">
          Sign In
        </a>
        <button className="rounded-xl bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800">
          Explore Clubs
        </button>
      </div>
    </header>
  )
}