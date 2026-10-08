export default ({ stroke, circle, rect, C, ink, ink2, brand, cyan }) => ({
  // A speech bubble holding a star, with a link chain beside it.
  'how-to-ask-for-google-reviews': () => [
    rect(C - 160, C - 130, 220, 170, { r: 28, fill: false, sw: 12 }),
    stroke(`M ${C - 90} ${C + 40} l -10 60 l 70 -60`, { w: 12 }),
    stroke(`M ${C - 50} ${C - 80} l 14 32 l 34 4 l -26 22 l 8 34 l -30 -18 l -30 18 l 8 -34 l -26 -22 l 34 -4 z`, { w: 10, color: brand }),
    circle(C + 120, C + 70, 34, { fill: false, w: 12, color: brand }),
    circle(C + 150, C + 70, 34, { fill: false, w: 12, opacity: 0.8 }),
  ],

  // A bubble and a smaller bubble answering it, with a calm horizontal line.
  'reply-to-a-bad-review': () => [
    rect(C - 160, C - 150, 230, 100, { r: 24, color: brand, opacity: 0.3 }),
    stroke(`M ${C - 120} ${C - 100} H ${C + 30}`, { w: 10, color: brand }),
    rect(C - 40, C - 10, 200, 100, { r: 24, opacity: 0.9 }),
    stroke(`M ${C + 80} ${C + 90} l 30 40 l -10 -40`, { w: 12 }),
    circle(C - 120, C + 120, 16, { opacity: 0.8 }),
    circle(C - 80, C + 120, 16, { opacity: 0.5 }),
    circle(C - 40, C + 120, 16, { opacity: 0.25 }),
  ],

  // A house with its address hidden, ringed by dashed service areas.
  'service-area-business-profile': () => [
    circle(C, C, 170, { fill: false, opacity: 0.3, w: 8, color: brand }),
    circle(C, C, 105, { fill: false, opacity: 0.5, w: 8 }),
    stroke(`M ${C - 55} ${C + 10} L ${C} ${C - 45} L ${C + 55} ${C + 10} V ${C + 60} H ${C - 55} Z`, { w: 12 }),
    circle(C + 150, C - 80, 18, { color: brand }),
    circle(C - 140, C + 90, 18, { color: brand }),
    circle(C + 90, C + 140, 18, { color: brand }),
  ],

  // A grid of picture frames, one with a mountain and sun.
  'profile-photos-that-help': () => [
    rect(C - 150, C - 130, 150, 120, { r: 14, fill: false, sw: 10, opacity: 0.35, color: brand }),
    rect(C + 20, C - 130, 130, 120, { r: 14, fill: false, sw: 10, opacity: 0.35, color: brand }),
    rect(C - 150, C + 20, 300, 120, { r: 14, fill: false, sw: 12 }),
    stroke(`M ${C - 120} ${C + 120} l 60 -60 l 40 40 l 50 -70 l 80 90`, { w: 12 }),
    circle(C + 90, C + 55, 16),
  ],

  // Three stacked cards joined by a vertical line with matching tick marks.
  'name-address-phone-consistency': () => [
    stroke(`M ${C - 130} ${C - 120} V ${C + 120}`, { w: 10, opacity: 0.4, color: brand }),
    rect(C - 90, C - 150, 230, 70, { r: 12, fill: false, sw: 10 }),
    rect(C - 90, C - 35, 230, 70, { r: 12, fill: false, sw: 10 }),
    rect(C - 90, C + 80, 230, 70, { r: 12, fill: false, sw: 10 }),
    circle(C - 130, C - 115, 14, { color: brand }),
    circle(C - 130, C, 14, { color: brand }),
    circle(C - 130, C + 115, 14, { color: brand }),
    stroke(`M ${C - 55} ${C - 115} H ${C + 95} M ${C - 55} ${C} H ${C + 95} M ${C - 55} ${C + 115} H ${C + 95}`, { w: 8, opacity: 0.6 }),
  ],

  // A search box with a cursor and suggestion lines dropping beneath it.
  'free-keyword-research-for-local-business': () => [
    rect(C - 160, C - 140, 320, 70, { r: 35, fill: false, sw: 12 }),
    stroke(`M ${C - 110} ${C - 120} V ${C - 90}`, { w: 10, color: brand }),
    circle(C + 120, C - 105, 14, { fill: false, w: 8 }),
    stroke(`M ${C - 120} ${C - 20} H ${C + 90}`, { w: 12, opacity: 0.9 }),
    stroke(`M ${C - 120} ${C + 40} H ${C + 20}`, { w: 12, opacity: 0.6, color: brand }),
    stroke(`M ${C - 120} ${C + 100} H ${C + 60}`, { w: 12, opacity: 0.35 }),
  ],

  // A cluster of identical small squares collapsing to a few with a bold one.
  'how-many-town-pages-is-too-many': () => [
    ...[0, 1, 2, 3].flatMap((i) => [0, 1, 2].map((j) =>
      rect(C - 160 + i * 52, C - 150 + j * 52, 38, 38, { r: 8, color: brand, opacity: 0.25 }))),
    stroke(`M ${C + 60} ${C - 70} H ${C + 110} m -16 -16 l 16 16 l -16 16`, { w: 10 }),
    rect(C + 30, C + 20, 120, 120, { r: 16, fill: false, sw: 12 }),
    circle(C + 90, C + 80, 20),
  ],
})
