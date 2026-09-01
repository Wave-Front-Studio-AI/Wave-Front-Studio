import { renderToReadableStream } from 'react-dom/server'
import App from './App.jsx'
import { ssrSeo } from './routeContext.js'

// Called once per route by scripts/prerender.mjs.
export async function render(path) {
  ssrSeo.current = null
  const stream = await renderToReadableStream(<App path={path} />)
  await stream.allReady
  const html = await new Response(stream).text()
  return { html, seo: ssrSeo.current || {} }
}
