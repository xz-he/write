import { BOOK_SUBTITLE, WORD_COUNT } from '../data/entries'

type Props = {
  onBack: () => void
  onMore: () => void
}

export function TopBar({ onBack, onMore }: Props) {
  return (
    <header className="topbar">
      <button type="button" className="topbar__btn" onClick={onBack} aria-label="返回封面">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M15 6L9 12l6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <p className="topbar__title">
        {BOOK_SUBTITLE}
        <span className="topbar__sep">|</span>
        <span className="topbar__meta">{WORD_COUNT} 字</span>
      </p>
      <button type="button" className="topbar__btn" onClick={onMore} aria-label="更多">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="6" cy="12" r="1.6" fill="currentColor" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <circle cx="18" cy="12" r="1.6" fill="currentColor" />
        </svg>
      </button>
    </header>
  )
}
