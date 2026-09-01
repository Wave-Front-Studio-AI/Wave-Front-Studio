import { createContext, useContext } from 'react'

// The active pathname. The browser reads it from the address bar; the
// prerenderer supplies it explicitly so static output marks the right nav item.
export const RouteContext = createContext('/')

export function useCurrentPath() {
  const fromContext = useContext(RouteContext)
  if (fromContext) return fromContext.replace(/\/+$/, '') || '/'
  if (typeof window === 'undefined') return '/'
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

// Set during server rendering so the prerenderer can read each page's document
// head values without a second pass.
export const ssrSeo = { current: null }
