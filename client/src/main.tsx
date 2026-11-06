import { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import './styles/index.css'

const SentinelApp = lazy(() => import('./sentinel/SentinelApp'))

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="*"
        element={
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-ink font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Loading SentinelQA
              </div>
            }
          >
            <SentinelApp />
          </Suspense>
        }
      />
    </Routes>
  </BrowserRouter>,
)
