import ServicePage from './ServicePage.jsx'
import { serviceBySlug } from '../data/services.js'

export default function ServiceRoute({ slug }) {
  return <ServicePage service={serviceBySlug[slug]} />
}
