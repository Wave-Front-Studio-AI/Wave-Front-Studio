import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { rememberAttribution } from './formSubmission.js'
import './styles.css'

// Scroll reveals only hide content once JavaScript is running, so the
// prerendered HTML stays readable if the bundle never loads.
document.documentElement.classList.add('js')

// A page left open across a deploy still points at the old build's hashed
// files, which no longer exist: the next lazy page or the chat's content then
// fails to load. Reloading fetches the new build. Once per minute at most, so a
// genuinely missing file cannot cause a reload loop.
window.addEventListener('vite:preloadError', (event) => {
  try {
    const last = Number(window.sessionStorage.getItem('wf-stale-reload') || 0)
    // Not reloading: leave the error alone, so the caller sees the failure.
    // Calling preventDefault() makes Vite resolve the import with nothing.
    if (Date.now() - last < 60000) return
    window.sessionStorage.setItem('wf-stale-reload', String(Date.now()))
  } catch {
    return
  }
  event.preventDefault()
  window.location.reload()
})

// Note which ad or site brought the visitor, before anything can change the URL.
rememberAttribution()

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
