type Props = {
  subtitle: string
  wordCount: number
  onBack: () => void
  onAdmin: () => void
}

export function TopBar({ subtitle, wordCount, onBack, onAdmin }: Props) {
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
        {subtitle}
        <span className="topbar__sep">|</span>
        <span className="topbar__meta">{wordCount} 字</span>
      </p>
      <button type="button" className="topbar__btn" onClick={onAdmin} aria-label="管理编辑">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 19h3.2L17.6 9.6l-3.2-3.2L5 15.8V19z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 7.3l3.2 3.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </header>
  )
}
