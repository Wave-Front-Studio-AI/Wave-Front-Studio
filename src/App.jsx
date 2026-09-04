import { lazy, Suspense, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import { matchRoute } from './routes.js'
import { RouteContext } from './routeContext.js'

const AboutPage = lazy(() => import('./pages/CompanyPages.jsx').then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() => import('./pages/CompanyPages.jsx').then((module) => ({ default: module.ContactPage })))
const FaqsPage = lazy(() => import('./pages/CompanyPages.jsx').then((module) => ({ default: module.FaqsPage })))
const PortfolioPage = lazy(() => import('./pages/CompanyPages.jsx').then((module) => ({ default: module.PortfolioPage })))
const LostLeadCalculator = lazy(() => import('./pages/LostLeadCalculator.jsx'))
const FreeSetup = lazy(() => import('./pages/FreeSetup.jsx'))
const BuildYourPackage = lazy(() => import('./pages/BuildYourPackage.jsx'))
const ServicesHubPage = lazy(() => import('./pages/HubPages.jsx').then((module) => ({ default: module.ServicesHubPage })))
const CustomWorksHubPage = lazy(() => import('./pages/HubPages.jsx').then((module) => ({ default: module.CustomWorksHubPage })))
const ServiceRoute = lazy(() => import('./pages/ServiceRoute.jsx'))
const CustomWorkRoute = lazy(() => import('./pages/CustomWorkRoute.jsx'))
const LongformRoute = lazy(() => import('./pages/LongformRoute.jsx'))
const PlatformPage = lazy(() => import('./pages/PlatformPage.jsx'))
const DoNotSell = lazy(() => import('./pages/DoNotSell.jsx'))
const DataDeletion = lazy(() => import('./pages/DataDeletion.jsx'))

// `path` is supplied by the prerenderer; in the browser the route comes from the
// address bar.
export default function App({ path }) {
  const pathname = path || (typeof window === 'undefined' ? '/' : window.location.pathname)
  const route = matchRoute(pathname)

  // Deep links with a hash need the target to exist before scrolling, so the
  // jump waits two frames for the route's first paint.
  useEffect(() => {
    if (!window.location.hash) return undefined
    const id = decodeURIComponent(window.location.hash.slice(1))
    let second
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'auto' })
      })
    })
    return () => {
      window.cancelAnimationFrame(first)
      if (second) window.cancelAnimationFrame(second)
    }
  }, [pathname])

  const page = renderRoute(route)
  return (
    <>
      <RouteContext.Provider value={pathname}>
        <Suspense fallback={null}>{page}</Suspense>
      </RouteContext.Provider>
      <Analytics />
    </>
  )
}

function renderRoute(route) {
  if (!route) return <NotFound />

  switch (route.kind) {
    case 'home':
      return <Home />
    case 'about':
      return <AboutPage />
    case 'portfolio':
      return <PortfolioPage />
    case 'contact':
      return <ContactPage />
    case 'faqs':
      return <FaqsPage />
    case 'blog':
      return <LongformRoute kind={route.kind} />
    case 'calculator':
      return <LostLeadCalculator />
    case 'free-setup':
      return <FreeSetup />
    case 'packages':
      return <BuildYourPackage />
    case 'locations':
      return <LongformRoute kind={route.kind} />
    case 'platform':
      return <PlatformPage />
    case 'do-not-sell':
      return <DoNotSell />
    case 'data-deletion':
      return <DataDeletion />
    case 'services-hub':
      return <ServicesHubPage />
    case 'custom-works-hub':
      return <CustomWorksHubPage />
    case 'service':
      return <ServiceRoute slug={route.slug} />
    case 'custom-work':
      return <CustomWorkRoute slug={route.slug} />
    case 'location':
      return <LongformRoute kind={route.kind} slug={route.slug} />
    case 'legal':
      return <LongformRoute kind={route.kind} slug={route.slug} />
    case 'post':
      return <LongformRoute kind={route.kind} slug={route.slug} />
    default:
      return <NotFound />
  }
}
