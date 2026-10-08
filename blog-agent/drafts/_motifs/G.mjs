export default ({ stroke, circle, rect, C, ink, ink2, brand, cyan }) => ({
  // Many faint lines funnelling into one bright target.
  'landing-page-one-goal': () => [
    stroke(`M ${C - 150} ${C - 140} L ${C + 20} ${C - 10}`, { w: 8, opacity: 0.25, color: brand }),
    stroke(`M ${C - 150} ${C - 40} L ${C + 20} ${C}`, { w: 8, opacity: 0.25, color: brand }),
    stroke(`M ${C - 150} ${C + 60} L ${C + 20} ${C + 10}`, { w: 8, opacity: 0.25, color: brand }),
    stroke(`M ${C - 150} ${C + 150} L ${C + 20} ${C + 20}`, { w: 8, opacity: 0.25, color: brand }),
    circle(C + 90, C, 70, { fill: false, w: 12 }),
    circle(C + 90, C, 26),
  ],

  // Three bars of different height under a single marker: three numbers.
  'three-numbers-in-analytics': () => [
    rect(C - 130, C + 10, 70, 140, { r: 10, color: brand, opacity: 0.55 }),
    rect(C - 35, C - 70, 70, 220, { r: 10 }),
    rect(C + 60, C - 20, 70, 170, { r: 10, color: brand, opacity: 0.55 }),
    stroke(`M ${C - 150} ${C + 160} H ${C + 150}`, { w: 8, opacity: 0.3, color: brand }),
  ],

  // A calendar page with a year-end tick.
  'year-end-website-checklist': () => [
    rect(C - 140, C - 120, 280, 250, { r: 20, fill: false, sw: 10, color: brand, opacity: 0.8 }),
    stroke(`M ${C - 140} ${C - 50} H ${C + 140}`, { w: 10, color: brand, opacity: 0.8 }),
    stroke(`M ${C - 60} ${C - 150} V ${C - 100} M ${C + 60} ${C - 150} V ${C - 100}`, { w: 12 }),
    stroke(`M ${C - 70} ${C + 40} l 40 44 l 90 -90`, { w: 16 }),
  ],

  // A balance beam: a coin on one side, stacked blocks on the other.
  'a-marketing-budget-without-a-percentage': () => [
    stroke(`M ${C} ${C - 20} V ${C + 150} M ${C - 70} ${C + 150} H ${C + 70}`, { w: 10, color: brand, opacity: 0.6 }),
    stroke(`M ${C - 150} ${C - 40} L ${C + 150} ${C - 20}`, { w: 12 }),
    circle(C - 105, C - 90, 38),
    rect(C + 80, C - 100, 55, 35, { r: 8, color: brand, opacity: 0.9 }),
    rect(C + 80, C - 135, 55, 30, { r: 8, color: brand, opacity: 0.55 }),
  ],

  // A magnifier held over a row of three candidate squares, one lit.
  'questions-to-ask-a-web-agency': () => [
    rect(C - 150, C + 70, 80, 80, { r: 14, fill: false, sw: 8, color: brand, opacity: 0.6 }),
    rect(C - 40, C + 70, 80, 80, { r: 14 }),
    rect(C + 70, C + 70, 80, 80, { r: 14, fill: false, sw: 8, color: brand, opacity: 0.6 }),
    circle(C - 10, C - 40, 70, { fill: false, w: 12, color: brand }),
    stroke(`M ${C + 40} ${C + 10} l 50 50`, { w: 14, color: brand }),
  ],

  // A link chain with a branching tag on the end.
  'utm-links-for-small-business': () => [
    rect(C - 150, C - 30, 120, 60, { r: 30, fill: false, sw: 12 }),
    rect(C - 60, C - 30, 120, 60, { r: 30, fill: false, sw: 12, color: brand }),
    stroke(`M ${C + 60} ${C} H ${C + 100} L ${C + 150} ${C - 70} M ${C + 100} ${C} H ${C + 150} M ${C + 100} ${C} L ${C + 150} ${C + 70}`, { w: 10 }),
    circle(C + 158, C - 70, 14),
    circle(C + 158, C, 14),
    circle(C + 158, C + 70, 14),
  ],

  // A stepped path of four quarters climbing to a flag.
  'plan-your-marketing-year-in-january': () => [
    rect(C - 150, C + 70, 70, 80, { r: 8, color: brand, opacity: 0.4 }),
    rect(C - 75, C + 20, 70, 130, { r: 8, color: brand, opacity: 0.55 }),
    rect(C, C - 30, 70, 180, { r: 8, color: brand, opacity: 0.75 }),
    rect(C + 75, C - 80, 70, 230, { r: 8 }),
    stroke(`M ${C + 110} ${C - 85} V ${C - 160} L ${C + 160} ${C - 140} L ${C + 110} ${C - 120}`, { w: 10 }),
  ],
})
