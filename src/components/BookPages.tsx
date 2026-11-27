import { forwardRef } from 'react'
import { Illustration } from './Illustrations'
import { BOOK_SUBTITLE, BOOK_TITLE, type MemoryEntry } from '../data/entries'

type PageProps = {
  children?: React.ReactNode
  className?: string
}

export const FlipPage = forwardRef<HTMLDivElement, PageProps>(function FlipPage(
  { children, className = '' },
  ref,
) {
  return (
    <div className={`flip-page ${className}`.trim()} ref={ref}>
      {children}
    </div>
  )
})

export const CoverPage = forwardRef<HTMLDivElement>(function CoverPage(_, ref) {
  return (
    <FlipPage ref={ref} className="flip-page--cover">
      <div className="cover-inner">
        <p className="cover-inner__gift">A gift for</p>
        <h1 className="cover-inner__brand">{BOOK_TITLE}</h1>
        <p className="cover-inner__sub">{BOOK_SUBTITLE}</p>
        <div className="cover-inner__ornament" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <p className="cover-inner__hint">向右轻翻 · 打开记忆</p>
      </div>
    </FlipPage>
  )
})

export const MemoryPage = forwardRef<
  HTMLDivElement,
  { entry: MemoryEntry; pageNumber: number }
>(function MemoryPage({ entry, pageNumber }, ref) {
  return (
    <FlipPage ref={ref} className="flip-page--memory">
      <article className="memory">
        <header className="memory__head">
          <p className="memory__date">
            {entry.weekday}，{entry.dateLabel}
          </p>
          <span className="memory__year">{entry.year}</span>
        </header>
        <h2 className="memory__title">{entry.title}</h2>
        <div className="memory__art">
          <Illustration kind={entry.illustration} />
          {entry.favorite ? (
            <span className="memory__star" aria-label="珍藏">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3.5l2.4 5.2 5.6.6-4.2 3.8 1.2 5.5L12 16.2 6.9 18.6l1.2-5.5L4 9.3l5.6-.6L12 3.5z"
                  stroke="#9B7BB8"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ) : null}
        </div>
        <p className="memory__body">{entry.body}</p>
        <footer className="memory__foot">
          <span className="memory__num">{pageNumber}</span>
        </footer>
      </article>
    </FlipPage>
  )
})

export const BackPage = forwardRef<HTMLDivElement>(function BackPage(_, ref) {
  return (
    <FlipPage ref={ref} className="flip-page--back">
      <div className="back-inner">
        <p className="back-inner__line">愿每一页，都有光。</p>
        <p className="back-inner__brand">{BOOK_TITLE}</p>
      </div>
    </FlipPage>
  )
})
