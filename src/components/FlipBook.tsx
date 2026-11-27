import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import HTMLFlipBook from 'react-pageflip'
import { entries, yearToPageIndex } from '../data/entries'
import { BackPage, CoverPage, MemoryPage } from './BookPages'
import { RingMechanism } from './RingMechanism'
import { YearTabs } from './YearTabs'

type FlipApi = {
  pageFlip: () => {
    flip: (page: number, corner?: string) => void
    turnToPage: (page: number) => void
    getCurrentPageIndex: () => number
  }
}

type Props = {
  onClose: () => void
}

function useBookSize() {
  const [size, setSize] = useState({ width: 460, height: 640 })

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      // Dominant binder — fill most of the viewport while keeping portrait ratio
      const maxW = Math.min(520, vw - 56)
      const maxH = Math.min(720, vh - 120)
      const ratio = 460 / 640
      let width = maxW
      let height = width / ratio
      if (height > maxH) {
        height = maxH
        width = height * ratio
      }
      setSize({
        width: Math.max(300, Math.round(width)),
        height: Math.max(420, Math.round(height)),
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}

export function FlipBook({ onClose: _onClose }: Props) {
  const bookRef = useRef<FlipApi | null>(null)
  const size = useBookSize()
  const [pageIndex, setPageIndex] = useState(0)
  const [activeYear, setActiveYear] = useState(2026)

  const totalPages = entries.length + 2

  const onFlip = useCallback((e: { data: number }) => {
    const idx = e.data
    setPageIndex(idx)
    if (idx === 0) {
      setActiveYear(2026)
      return
    }
    const entry = entries[idx - 1]
    if (entry) setActiveYear(entry.year)
  }, [])

  const jumpYear = useCallback((year: number) => {
    setActiveYear(year)
    const target = yearToPageIndex(year)
    const api = bookRef.current?.pageFlip()
    if (!api) return
    // Instant jump then soft visual via flip when close; turnToPage for year tabs
    api.turnToPage(target)
    setPageIndex(target)
  }, [])

  return (
    <div className="binder-stage">
      <div
        className="binder"
        style={{ width: size.width + 40, height: size.height + 32 }}
      >
        <div className="binder__spine" />
        <RingMechanism />
        <div className="binder__strap" aria-hidden />
        <div className="binder__book">
          <HTMLFlipBook
            ref={bookRef as RefObject<never>}
            width={size.width}
            height={size.height}
            size="fixed"
            minWidth={300}
            maxWidth={560}
            minHeight={420}
            maxHeight={760}
            drawShadow
            flippingTime={850}
            usePortrait
            startPage={0}
            autoSize={false}
            maxShadowOpacity={0.4}
            showCover
            mobileScrollSupport={false}
            clickEventForward={false}
            useMouseEvents
            swipeDistance={25}
            showPageCorners={false}
            disableFlipByClick={false}
            className="html-flipbook"
            style={{}}
            startZIndex={1}
            onFlip={onFlip}
          >
            <CoverPage key="cover" />
            {entries.map((entry, i) => (
              <MemoryPage key={entry.id} entry={entry} pageNumber={i + 1} />
            ))}
            <BackPage key="back" />
          </HTMLFlipBook>
        </div>
        <YearTabs activeYear={activeYear} onSelect={jumpYear} />
      </div>
      <p className="flip-hint" aria-live="polite">
        {pageIndex === 0
          ? '轻点右页或拖动翻开'
          : pageIndex >= totalPages - 1
            ? '已到最后一页'
            : `第 ${Math.min(pageIndex, entries.length)} / ${entries.length} 篇`}
      </p>
    </div>
  )
}
