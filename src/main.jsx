import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { rememberAttribution } from './formSubmission.js'
import './styles.css'

// Scroll reveals only hide content once JavaScript is running, so the
// prerendered HTML stays readable if the bundle never loads.
document.documentElement.classList.add('js')

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
