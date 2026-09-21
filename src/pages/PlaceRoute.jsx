import { LocationsPage } from './LocationsPage.jsx'
import { LocationPage, StatePage } from './PlacePage.jsx'
import { locationBySlug } from '../data/generated/locations.js'
import { stateBySlug } from '../data/states.js'

export default function PlaceRoute({ kind, slug }) {
  if (kind === 'locations') return <LocationsPage />
  if (kind === 'location') return <LocationPage location={locationBySlug[slug]} />
  return <StatePage page={stateBySlug[slug]} />
}
