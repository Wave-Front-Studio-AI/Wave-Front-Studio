export default ({ stroke, circle, rect, C, ink, ink2, brand, cyan }) => ({
  // A row of milestone dots on a line, the last one ringed: a timeline.
  'how-long-a-website-takes': () => [
    stroke(`M ${C - 160} ${C} H ${C + 160}`, { w: 10, color: brand, opacity: 0.5 }),
    circle(C - 160, C, 20, { color: cyan }),
    circle(C - 55, C, 20, { color: cyan }),
    circle(C + 50, C, 20, { color: cyan, opacity: 0.6 }),
    circle(C + 160, C, 34, { fill: false, w: 12, color: cyan }),
    rect(C - 90, C - 110, 180, 50, { r: 12, fill: false, color: brand, sw: 8, opacity: 0.6 }),
  ],

  // An envelope with a small badge: email on your own domain.
  'business-email-on-your-own-domain': () => [
    rect(C - 140, C - 90, 280, 180, { r: 18, fill: false, sw: 12 }),
    stroke(`M ${C - 140} ${C - 80} L ${C} ${C + 20} L ${C + 140} ${C - 80}`, { w: 12 }),
    circle(C + 120, C + 90, 44, { color: brand }),
    stroke(`M ${C + 100} ${C + 90} l 14 14 l 28 -30`, { w: 10, color: '#ffffff' }),
  ],

  // A padlock with an open shackle beside a closed one: secure versus not.
  'not-secure-warning': () => [
    rect(C - 130, C - 10, 110, 100, { r: 14, color: brand, opacity: 0.55 }),
    stroke(`M ${C - 110} ${C - 10} v -40 a 35 35 0 0 1 70 0 v 10`, { w: 12, color: brand, opacity: 0.55 }),
    rect(C + 20, C - 10, 110, 100, { r: 14, color: cyan }),
    stroke(`M ${C + 40} ${C - 10} v -40 a 35 35 0 0 1 70 0 v 40`, { w: 12, color: cyan }),
    circle(C + 75, C + 40, 12, { color: ink }),
  ],

  // A wrench crossing a calendar grid: routine upkeep.
  'website-maintenance-basics': () => [
    rect(C - 150, C - 130, 220, 220, { r: 16, fill: false, color: brand, sw: 10, opacity: 0.7 }),
    stroke(`M ${C - 150} ${C - 70} H ${C + 70} M ${C - 77} ${C - 70} V ${C + 90} M ${C - 150} ${C} H ${C + 70}`, { w: 6, color: brand, opacity: 0.4 }),
    stroke(`M ${C + 20} ${C + 150} L ${C + 140} ${C + 20}`, { w: 26, color: cyan }),
    circle(C + 146, C + 12, 34, { fill: false, w: 14, color: cyan }),
  ],

  // A broken chain link: two arcs with a gap, and a cross.
  'broken-links-and-404-pages': () => [
    stroke(`M ${C - 30} ${C - 60} h -60 a 50 50 0 0 0 0 100 h 40`, { w: 16 }),
    stroke(`M ${C + 30} ${C + 60} h 60 a 50 50 0 0 0 0 -100 h -40`, { w: 16 }),
    stroke(`M ${C - 25} ${C - 120} l 50 -40 M ${C + 25} ${C + 120} l -50 40`, { w: 10, color: brand, opacity: 0.6 }),
    stroke(`M ${C - 20} ${C - 20} l 40 40 M ${C + 20} ${C - 20} l -40 40`, { w: 12, color: brand }),
  ],
})
