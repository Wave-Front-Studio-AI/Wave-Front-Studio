// Every guide page, keyed by the slug on its route in src/routes.js. GuidePage,
// the assistant's index and the SEO layer all read this one list, so a new
// guide is a copy file, an entry in seo.js, a route and a line here.
import { aiSearchGuide } from './aiSearchGuide.js'
import { websiteCostGuide } from './websiteCostGuide.js'
import { aiSearchGuideSeo, websiteCostGuideSeo } from './seo.js'

export const guides = {
  [aiSearchGuide.slug]: { guide: aiSearchGuide, seo: aiSearchGuideSeo },
  [websiteCostGuide.slug]: { guide: websiteCostGuide, seo: websiteCostGuideSeo },
}
