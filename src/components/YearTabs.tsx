import { YEARS } from '../data/entries'

type Props = {
  activeYear: number
  onSelect: (year: number) => void
}

export function YearTabs({ activeYear, onSelect }: Props) {
  return (
    <nav className="year-tabs" aria-label="年份标签">
      {YEARS.map((year, i) => (
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
