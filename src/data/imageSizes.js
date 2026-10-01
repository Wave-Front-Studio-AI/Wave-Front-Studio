// Intrinsic sizes of the images the page templates take from data files, so
// every <img> carries width and height and the layout is reserved before the
// file arrives (no jump as it loads). Add an entry when a data file starts
// using a new image; an image missing here simply renders without the two
// attributes, as before.
const sizes = {
  '/images/After-Visuilize.webp': [1200, 800],
  '/images/Before-Visuilize.webp': [1200, 746],
  '/images/calc.webp': [1036, 528],
  '/images/work/resinrock-site.webp': [1440, 900],
  '/images/work/resinrockleads-site.webp': [1440, 900],
  '/images/work/resinrock-search-results.webp': [1200, 754],
  '/wave-logo.webp': [480, 150],
}

export function sizeOf(src) {
  const size = sizes[src]
  return size ? { width: size[0], height: size[1] } : {}
}
