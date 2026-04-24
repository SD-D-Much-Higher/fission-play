type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  summaryText?: string
  className?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search clubs or players (e.g. basketball, soccer, Jordan Banks...)",
  summaryText,
  className,
}: SearchBarProps) {
  return (
    <section className={className}>
      <input
        id="homepage-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-3 border-black px-5 py-5 text-base font-medium text-black placeholder:text-black/50 outline-none shadow-sm transition focus:border-red-600"
      />
      {summaryText && (
        <p className="mt-3 text-sm font-medium text-gray-900">{summaryText}</p>
      )}
    </section>
  )
}