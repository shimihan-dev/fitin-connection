import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { LanguageProvider } from './app/contexts/LanguageContext'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
