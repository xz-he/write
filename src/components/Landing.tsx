type Props = {
  title: string
  subtitle: string
  eyebrow: string
  onOpen: () => void
  onAdmin: () => void
}

export function Landing({ title, subtitle, eyebrow, onOpen, onAdmin }: Props) {
  return (
    <section className="landing">
      <div className="landing__glow" aria-hidden />
      <button type="button" className="landing__binder" onClick={onOpen} aria-label="打开成长手册">
        <div className="landing__cover">
          <div className="landing__rings" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="landing__ring" />
            ))}
          </div>
          <div className="landing__cover-face">
            <p className="landing__eyebrow">{eyebrow}</p>
            <h1 className="landing__brand">{title}</h1>
            <p className="landing__sub">{subtitle}</p>
            <div className="landing__seal" aria-hidden>
              <span>安宝</span>
            </div>
          </div>
          <div className="landing__strap" aria-hidden />
          <div className="landing__tabs" aria-hidden>
            <span>2026</span>
            <span>2027</span>
            <span>2028</span>
          </div>
        </div>
      </button>
      <p className="landing__cta">轻触封面，翻开记忆</p>
      <button type="button" className="landing__admin" onClick={onAdmin}>
        管理编辑
      </button>
    </section>
  )
}
