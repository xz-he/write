import { useState } from 'react'
import { AdminPanel } from './components/AdminPanel'
import { FlipBook3D } from './components/FlipBook3D'
import { Landing } from './components/Landing'
import { TopBar } from './components/TopBar'
import { useHandbook } from './data/HandbookContext'

export default function App() {
  const { meta, wordCount } = useHandbook()
  const [opened, setOpened] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  return (
    <div className={`app${opened ? ' is-open' : ''}`}>
      {opened ? (
        <>
          <TopBar
            subtitle={meta.subtitle}
            wordCount={wordCount}
            onBack={() => setOpened(false)}
            onAdmin={() => setAdminOpen(true)}
          />
          <main className="app__main">
            <FlipBook3D onClose={() => setOpened(false)} />
          </main>
        </>
      ) : (
        <Landing
          title={meta.title}
          subtitle={meta.subtitle}
          eyebrow={meta.coverEyebrow}
          onOpen={() => setOpened(true)}
          onAdmin={() => setAdminOpen(true)}
        />
      )}
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  )
}
