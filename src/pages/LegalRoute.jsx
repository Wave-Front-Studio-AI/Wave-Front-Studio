import { LegalPage } from './LegalPage.jsx'
import { legalBySlug } from '../data/generated/legal.js'

export default function LegalRoute({ slug }) {
  return <LegalPage page={legalBySlug[slug]} />
}
