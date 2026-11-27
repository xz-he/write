import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { HandbookProvider } from './data/HandbookContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HandbookProvider>
      <App />
    </HandbookProvider>
  </StrictMode>,
)
