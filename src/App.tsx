import { useCallback, useState } from 'react'
import { FlipBook } from './components/FlipBook'
import { Landing } from './components/Landing'
import { TopBar } from './components/TopBar'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  return (
    <div className={`app${opened ? ' is-open' : ''}`}>
      {opened ? (
        <>
          <TopBar onBack={() => setOpened(false)} onMore={() => showToast('示例手册 · 编辑功能即将到来')} />
          <main className="app__main">
            <FlipBook onClose={() => setOpened(false)} />
          </main>
        </>
      ) : (
        <Landing onOpen={() => setOpened(true)} />
      )}
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  )
}
