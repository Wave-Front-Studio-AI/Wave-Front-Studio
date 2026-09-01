import CustomWorkPage from './CustomWorkPage.jsx'
import { customWorkBySlug } from '../data/customWorks.js'

export default function CustomWorkRoute({ slug }) {
  return <CustomWorkPage work={customWorkBySlug[slug]} />
}
