// Motifs for batch D (SEO cluster). Each is built from plain shapes inside the 400x400 box.
export default ({ stroke, circle, rect, C, ink, ink2, brand, cyan }) => ({
  // A browser tab and a result row: headline bar over two shorter lines, no text.
  'title-tags-and-meta-descriptions': () => [
    rect(C - 160, C - 140, 320, 70, { r: 14, fill: false, sw: 10, color: brand, opacity: 0.9 }),
    stroke(`M ${C - 130} ${C - 105} H ${C + 40}`, { w: 16 }),
    stroke(`M ${C - 140} ${C - 20} H ${C + 130}`, { w: 10, opacity: 0.55, color: brand }),
    stroke(`M ${C - 140} ${C + 25} H ${C + 80}`, { w: 10, opacity: 0.4, color: brand }),
    stroke(`M ${C - 140} ${C + 70} H ${C + 110}`, { w: 10, opacity: 0.3, color: brand }),
    circle(C + 120, C + 130, 22, { opacity: 1 }),
  ],

  // Nodes joined by links, with one node left unconnected.
  'internal-links-for-small-sites': () => [
    stroke(`M ${C - 100} ${C - 90} L ${C + 20} ${C - 20} L ${C - 80} ${C + 80}`, { w: 10, color: brand, opacity: 0.8 }),
    stroke(`M ${C + 20} ${C - 20} L ${C + 120} ${C - 110}`, { w: 10, color: brand, opacity: 0.8 }),
    circle(C - 100, C - 90, 34, { opacity: 1 }),
    circle(C + 20, C - 20, 42, { opacity: 1 }),
    circle(C - 80, C + 80, 30, { opacity: 0.6 }),
    circle(C + 120, C - 110, 26, { opacity: 0.6 }),
    circle(C + 125, C + 110, 30, { fill: false, w: 8, color: brand, opacity: 0.55 }),
  ],

  // A label tag attached to a page outline, with a small tick: described, not ranked.
  'schema-markup-what-it-does': () => [
    rect(C - 130, C - 150, 200, 280, { r: 16, fill: false, sw: 10, color: brand, opacity: 0.85 }),
    stroke(`M ${C - 95} ${C - 100} H ${C + 35} M ${C - 95} ${C - 60} H ${C + 5}`, { w: 10, color: brand, opacity: 0.45 }),
    stroke(`M ${C + 40} ${C - 10} L ${C + 140} ${C - 10} L ${C + 170} ${C + 30} L ${C + 140} ${C + 70} L ${C + 40} ${C + 70} Z`, { w: 10 }),
    circle(C + 60, C + 30, 10, { opacity: 1 }),
  ],

  // A single notebook page with a pencil, plus a calendar-like row of dots for cadence.
  'is-a-business-blog-worth-it': () => [
    rect(C - 120, C - 150, 220, 250, { r: 14, opacity: 0.18, color: brand }),
    stroke(`M ${C - 85} ${C - 100} H ${C + 65} M ${C - 85} ${C - 55} H ${C + 65} M ${C - 85} ${C - 10} H ${C + 15}`, { w: 10, color: brand, opacity: 0.9 }),
    stroke(`M ${C + 60} ${C + 110} L ${C + 150} ${C - 10}`, { w: 18 }),
    stroke(`M ${C + 150} ${C - 10} l 16 -22`, { w: 18, color: brand }),
    circle(C - 110, C + 150, 10, { opacity: 1 }),
    circle(C - 70, C + 150, 10, { opacity: 0.7 }),
    circle(C - 30, C + 150, 10, { opacity: 0.45 }),
  ],

  // Two stacks of boxes with arrows from old to new, each box finding a home.
  'redesign-without-losing-rankings': () => [
    rect(C - 160, C - 130, 100, 60, { r: 10, fill: false, sw: 8, color: brand, opacity: 0.6 }),
    rect(C - 160, C - 30, 100, 60, { r: 10, fill: false, sw: 8, color: brand, opacity: 0.6 }),
    rect(C - 160, C + 70, 100, 60, { r: 10, fill: false, sw: 8, color: brand, opacity: 0.6 }),
    rect(C + 60, C - 130, 100, 60, { r: 10, opacity: 1 }),
    rect(C + 60, C - 30, 100, 60, { r: 10, opacity: 1 }),
    rect(C + 60, C + 70, 100, 60, { r: 10, opacity: 1 }),
    stroke(`M ${C - 50} ${C - 100} H ${C + 45} M ${C - 50} ${C} H ${C + 45} M ${C - 50} ${C + 100} H ${C + 45}`, { w: 10, color: brand }),
  ],

  // A page-sized ghost outline with a dashed border and a keyhole-like circle: present but not listed.
  'why-a-page-is-not-on-google': () => [
    rect(C - 110, C - 150, 220, 300, { r: 18, fill: false, sw: 10, color: brand, opacity: 0.35 }),
    stroke(`M ${C - 70} ${C - 90} H ${C + 70} M ${C - 70} ${C - 50} H ${C + 20}`, { w: 10, color: brand, opacity: 0.3 }),
    circle(C + 55, C + 55, 70, { fill: false, w: 14, opacity: 1 }),
    stroke(`M ${C + 105} ${C + 105} l 50 50`, { w: 16 }),
    stroke(`M ${C + 15} ${C + 15} L ${C + 95} ${C + 95}`, { w: 10, color: brand, opacity: 0.9 }),
  ],
})
