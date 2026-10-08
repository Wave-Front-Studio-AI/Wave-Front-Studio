export default ({ stroke, circle, rect, C, ink, ink2, brand, cyan }) => ({
  // A logo mark drawn last, sitting on top of three stacked layers (name, promise, voice).
  'brand-is-more-than-a-logo': () => [
    rect(C - 150, C + 70, 300, 60, { r: 14, color: brand, opacity: 0.45 }),
    rect(C - 120, C, 240, 60, { r: 14, color: brand, opacity: 0.7 }),
    rect(C - 90, C - 70, 180, 60, { r: 14, color: brand }),
    circle(C, C - 130, 40, { color: cyan }),
  ],

  // Two swatches overlapping and two letter-like strokes beneath.
  'colours-and-fonts-guide': () => [
    circle(C - 50, C - 50, 85, { color: brand }),
    circle(C + 50, C - 50, 85, { color: cyan, opacity: 0.8 }),
    stroke(`M ${C - 130} ${C + 130} l 40 -80 l 40 80`, { w: 14, color: cyan }),
    stroke(`M ${C + 30} ${C + 130} V ${C + 50} H ${C + 100}`, { w: 14, color: brand }),
  ],

  // One large ring with a single bright dot, three faded rings beside it.
  'pick-one-social-platform': () => [
    circle(C - 40, C, 110, { color: cyan, fill: false, w: 14 }),
    circle(C - 40, C, 36, { color: cyan }),
    circle(C + 140, C - 100, 28, { color: brand, fill: false, w: 8, opacity: 0.35 }),
    circle(C + 140, C, 28, { color: brand, fill: false, w: 8, opacity: 0.35 }),
    circle(C + 140, C + 100, 28, { color: brand, fill: false, w: 8, opacity: 0.35 }),
  ],

  // An envelope outline with a small tick circle at its corner.
  'start-an-email-list': () => [
    rect(C - 150, C - 90, 300, 190, { r: 16, color: cyan, fill: false, sw: 12 }),
    stroke(`M ${C - 140} ${C - 80} L ${C} ${C + 20} L ${C + 140} ${C - 80}`, { w: 12, color: brand }),
    circle(C + 130, C + 110, 40, { color: brand }),
    stroke(`M ${C + 113} ${C + 110} l 12 12 l 22 -26`, { w: 10, color: ink, cap: 'round' }),
  ],

  // A rising dashed curve against a flat solid bar: speed versus durability.
  'google-ads-or-seo': () => [
    stroke(`M ${C - 150} ${C + 100} H ${C + 150}`, { w: 10, color: brand, opacity: 0.4 }),
    rect(C - 150, C - 10, 90, 110, { r: 10, color: cyan }),
    stroke(`M ${C - 20} ${C + 90} C ${C + 20} ${C + 80} ${C + 60} ${C} ${C + 150} ${C - 120}`, { w: 14, color: brand }),
    circle(C + 150, C - 120, 18, { color: brand }),
  ],

  // A document with a pen-line, a padlock shape clasped to its corner.
  'red-flags-in-an-agency-contract': () => [
    rect(C - 130, C - 150, 220, 290, { r: 16, color: brand, fill: false, sw: 12, opacity: 0.8 }),
    stroke(`M ${C - 90} ${C - 90} H ${C + 50} M ${C - 90} ${C - 40} H ${C + 50} M ${C - 90} ${C + 10} H ${C - 10}`, { w: 12, color: cyan }),
    rect(C + 40, C + 40, 120, 100, { r: 14, color: cyan }),
    stroke(`M ${C + 65} ${C + 40} V ${C + 10} a 35 35 0 0 1 70 0 V ${C + 40}`, { w: 12, color: cyan }),
  ],
})
