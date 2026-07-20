import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { ScrollToTop } from './components/ScrollToTop'
import { ArVrPage } from './pages/ArVrPage'
import { FormaCloudPage } from './pages/FormaCloudPage'
import { FormaEditorPage } from './pages/FormaEditorPage'
import { GenAIPage } from './pages/GenAIPage'
import { Home } from './pages/Home'
import { ReadmePage } from './pages/ReadmePage'
import { RenderStudioPage } from './pages/RenderStudioPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/readme" element={<ReadmePage />} />
        <Route path="/forma-editor" element={<FormaEditorPage />} />
        <Route path="/gen-ai" element={<GenAIPage />} />
        <Route path="/render-studio" element={<RenderStudioPage />} />
        <Route path="/forma-cloud" element={<FormaCloudPage />} />
        <Route path="/ar-vr" element={<ArVrPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
