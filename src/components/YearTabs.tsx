type Props = {
  activeYear: number
  years: number[]
  onSelect: (year: number) => void
}

export function YearTabs({ activeYear, years, onSelect }: Props) {
  const list = years.length > 0 ? years : [activeYear]
  return (
    <nav className="year-tabs" aria-label="年份标签">
      {list.map((year, i) => (
        <button
          key={year}
          type="button"
          className={`year-tab${activeYear === year ? ' is-active' : ''}`}
          style={{ ['--tab-offset' as string]: `${i * 18}px` }}
          onClick={() => onSelect(year)}
          aria-current={activeYear === year ? 'page' : undefined}
        >
          <span>{year}</span>
        </button>
      ))}
    </nav>
  )
}
