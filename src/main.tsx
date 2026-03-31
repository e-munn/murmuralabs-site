import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Logos from './Logos.tsx'
import Theme from './Theme.tsx'

const path = window.location.pathname

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {path === '/logos' ? <Logos /> : path === '/theme' ? <Theme /> : <App />}
  </StrictMode>,
)
