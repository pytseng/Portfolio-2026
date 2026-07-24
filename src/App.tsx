import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { ScrollToTop } from './components/ScrollToTop'
import { ArVrPage } from './pages/ArVrPage'
import { FordPage } from './pages/FordPage'
import { FormaCloudPage } from './pages/FormaCloudPage'
import { FormaEditorPage } from './pages/FormaEditorPage'
import { GenAIPage } from './pages/GenAIPage'
import { Home } from './pages/Home'
import { JunyiPage } from './pages/JunyiPage'
import { ReadmePage } from './pages/ReadmePage'
import { RenderStudioPage } from './pages/RenderStudioPage'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function AppShell() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    if (!import.meta.env.PROD) return
    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname])

  return (
    <>
      <ScrollToTop />
      {/* Keep Home (and the WebGL hero) mounted so leaving a project doesn't rebuild the scene */}
      <div
        className={isHome ? 'app-view' : 'app-view app-view--parked'}
        aria-hidden={!isHome}
      >
        <Home live={isHome} />
      </div>
      <Routes>
        <Route path="/" element={null} />
        <Route path="/readme" element={<ReadmePage />} />
        <Route path="/forma-editor" element={<FormaEditorPage />} />
        <Route path="/gen-ai" element={<GenAIPage />} />
        <Route path="/render-studio" element={<RenderStudioPage />} />
        <Route path="/forma-cloud" element={<FormaCloudPage />} />
        <Route path="/ar-vr" element={<ArVrPage />} />
        <Route path="/junyi" element={<JunyiPage />} />
        <Route path="/ford" element={<FordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
