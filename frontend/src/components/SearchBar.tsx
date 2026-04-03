type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  summaryText?: string
}

export default function SearchBar({
  value,
  onChange,
  label = "Search teams or players",
  placeholder = "Try: basketball, soccer, Jordan Banks...",
  summaryText,
}: SearchBarProps) {
  return (
    <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <label htmlFor="homepage-search" className="mb-3 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id="homepage-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-red-600"
      />
      {summaryText && <p className="mt-3 text-sm text-gray-500">{summaryText}</p>}
    </section>
  )
}
