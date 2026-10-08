export default ({ stroke, circle, rect, C, ink, ink2, brand, cyan }) => ({
  // A phone-shaped first screen with four stacked blocks and one lit button.
  'homepage-first-screen': () => [
    rect(C - 110, C - 160, 220, 320, { r: 24, fill: false, sw: 10, color: brand }),
    rect(C - 80, C - 125, 160, 36, { r: 8, opacity: 0.55 }),
    rect(C - 80, C - 70, 100, 20, { r: 8, opacity: 0.3, color: brand }),
    rect(C - 80, C - 30, 160, 70, { r: 12, fill: false, sw: 6, opacity: 0.45 }),
    rect(C - 80, C + 70, 160, 50, { r: 25, opacity: 1 }),
  ],

  // A door ajar with a person-shaped head and shoulders in the gap.
  'about-page-is-not-about-you': () => [
    rect(C - 130, C - 150, 150, 300, { r: 14, fill: false, sw: 10, color: brand, opacity: 0.6 }),
    stroke(`M ${C + 20} ${C - 150} L ${C + 110} ${C - 120} V ${C + 120} L ${C + 20} ${C + 150}`, { w: 10, color: brand, opacity: 0.35 }),
    circle(C - 55, C - 40, 36, { opacity: 1 }),
    stroke(`M ${C - 120} ${C + 110} a 65 55 0 0 1 130 0`, { w: 14 }),
    circle(C + 70, C + 20, 8, { color: cyan, opacity: 0.8 }),
  ],

  // A hand-sized rounded phone with a thumb arc and a row of tap dots.
  'test-your-site-on-a-phone': () => [
    rect(C - 70, C - 150, 140, 250, { r: 22, fill: false, sw: 10 }),
    circle(C, C + 75, 10, { color: brand, opacity: 1 }),
    stroke(`M ${C + 150} ${C + 130} C ${C + 130} ${C + 40} ${C + 60} ${C + 10} ${C + 30} ${C - 20}`, { w: 14, color: brand, opacity: 0.7 }),
    circle(C + 30, C - 30, 16, { opacity: 1 }),
    circle(C - 120, C - 20, 6, { opacity: 0.4, color: brand }),
    circle(C - 120, C + 20, 6, { opacity: 0.4, color: brand }),
    circle(C - 120, C + 60, 6, { opacity: 0.4, color: brand }),
  ],

  // A ring with its right half lit: contrast between light and dark.
  'five-accessibility-fixes': () => [
    circle(C, C, 140, { fill: false, w: 10, color: brand, opacity: 0.8 }),
    stroke(`M ${C} ${C - 100} A 100 100 0 0 1 ${C} ${C + 100}`, { w: 90, color: cyan, opacity: 0.9, cap: 'butt' }),
    stroke(`M ${C} ${C - 140} V ${C + 140}`, { w: 6, color: brand, opacity: 0.6 }),
    circle(C - 60, C, 18, { opacity: 0.35, color: brand }),
  ],

  // A big photo frame being squeezed into a smaller one by two arrows.
  'heavy-images-slow-your-site': () => [
    rect(C - 160, C - 150, 210, 160, { r: 14, fill: false, sw: 8, color: brand, opacity: 0.35 }),
    stroke(`M ${C - 140} ${C - 20} l 50 -50 l 40 40 l 30 -30 l 50 50`, { w: 10, color: brand, opacity: 0.35 }),
    stroke(`M ${C + 60} ${C - 60} L ${C + 60} ${C + 30} M ${C + 30} ${C} l 30 30 l 30 -30`, { w: 14 }),
    rect(C - 20, C + 60, 130, 90, { r: 12, opacity: 0.9 }),
    stroke(`M ${C} ${C + 130} l 25 -25 l 20 20 l 20 -20 l 30 30`, { w: 8, color: ink, opacity: 0.8 }),
  ],

  // Three tools of different shapes in a row: grid, brackets, a chisel line.
  'wordpress-builder-or-custom': () => [
    rect(C - 170, C - 80, 100, 100, { r: 12, fill: false, sw: 10, color: brand }),
    stroke(`M ${C - 170} ${C - 30} H ${C - 70} M ${C - 120} ${C - 80} V ${C + 20}`, { w: 6, color: brand, opacity: 0.6 }),
    circle(C, C - 30, 55, { fill: false, w: 10 }),
    stroke(`M ${C - 25} ${C - 30} H ${C + 25} M ${C} ${C - 55} V ${C - 5}`, { w: 8, opacity: 0.8 }),
    stroke(`M ${C + 100} ${C - 70} l -35 40 l 35 40 M ${C + 140} ${C - 70} l 35 40 l -35 40`, { w: 12 }),
    stroke(`M ${C - 150} ${C + 100} H ${C + 150}`, { w: 8, opacity: 0.25, color: brand }),
    circle(C, C + 100, 12, { opacity: 1 }),
  ],
})
