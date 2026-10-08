// Motifs for batch E. Each stands for the subject of the post in 3 to 6 plain shapes.
export default ({ stroke, circle, rect, C, ink, ink2, brand, cyan }) => ({
  // An envelope with speed lines trailing behind it: the first reply, fast.
  'answer-leads-within-minutes': () => [
    stroke(`M 20 ${C - 50} H 100`, { w: 12, opacity: 0.3, color: brand }),
    stroke(`M 0 ${C} H 90`, { w: 12, opacity: 0.5, color: brand }),
    stroke(`M 30 ${C + 50} H 100`, { w: 12, opacity: 0.3, color: brand }),
    rect(C - 70, C - 80, 220, 160, { r: 20, fill: false, sw: 14 }),
    stroke(`M ${C - 60} ${C - 65} L ${C + 40} ${C + 15} L ${C + 140} ${C - 65}`, { w: 14 }),
  ],

  // A speech bubble with a bar across it: some things are not to be said.
  'what-a-chatbot-should-never-say': () => [
    rect(C - 130, C - 120, 260, 190, { r: 36, fill: false, sw: 14, opacity: 0.9 }),
    stroke(`M ${C - 60} ${C + 70} L ${C - 90} ${C + 140} L ${C - 10} ${C + 70}`, { w: 14 }),
    circle(C, C - 25, 52, { fill: false, w: 14, color: brand, opacity: 1 }),
    stroke(`M ${C - 37} ${C - 62} L ${C + 37} ${C + 12}`, { w: 14, color: brand }),
  ],

  // A short stack of form fields, three lit and the rest faded away.
  'contact-form-fields': () => [
    rect(C - 130, C - 140, 260, 56, { r: 14, fill: false, sw: 12 }),
    rect(C - 130, C - 60, 260, 56, { r: 14, fill: false, sw: 12 }),
    rect(C - 130, C + 20, 260, 56, { r: 14, fill: false, sw: 12 }),
    rect(C - 130, C + 100, 260, 44, { r: 14, fill: false, sw: 8, opacity: 0.18, color: brand }),
    rect(C - 130, C + 160, 260, 30, { r: 12, fill: false, sw: 6, opacity: 0.1, color: brand }),
    rect(C - 110, C - 124, 80, 24, { r: 8, color: brand, opacity: 0.7 }),
  ],

  // A handset with a ripple of signal and a small reply bubble coming back.
  'missed-call-text-back': () => [
    stroke(`M ${C - 120} ${C - 60} c 0 90 70 150 150 150 l 30 -50 l -55 -35 l -30 20 c -25 -20 -40 -45 -45 -75 l 25 -25 l -30 -55 z`, { w: 14 }),
    stroke(`M ${C + 40} ${C - 110} a 90 90 0 0 1 80 80`, { w: 12, color: brand, opacity: 0.9 }),
    stroke(`M ${C + 40} ${C - 160} a 140 140 0 0 1 130 130`, { w: 12, color: brand, opacity: 0.4 }),
    rect(C + 50, C + 30, 100, 64, { r: 18, color: cyan, opacity: 0.9 }),
    circle(C + 100, C + 62, 7, { color: ink, opacity: 1 }),
  ],

  // A camera over a page: the photo that saves a site visit.
  'quote-request-questions': () => [
    rect(C - 150, C - 120, 300, 230, { r: 28, fill: false, sw: 14, opacity: 0.9 }),
    rect(C - 40, C - 150, 80, 40, { r: 10, color: brand, opacity: 0.8 }),
    circle(C, C - 5, 62, { fill: false, w: 14 }),
    circle(C, C - 5, 22, { color: brand, opacity: 0.9 }),
    rect(C - 125, C + 130, 160, 18, { r: 9, color: brand, opacity: 0.3 }),
  ],

  // Ruled rows of a sheet, one row marked with a dot and a date block.
  'a-spreadsheet-is-a-fine-crm': () => [
    stroke(`M ${C - 160} ${C - 130} H ${C + 160}`, { w: 14, opacity: 0.9 }),
    stroke(`M ${C - 160} ${C - 60} H ${C + 160}`, { w: 8, opacity: 0.3, color: brand }),
    stroke(`M ${C - 160} ${C + 10} H ${C + 160}`, { w: 8, opacity: 0.3, color: brand }),
    stroke(`M ${C - 160} ${C + 80} H ${C + 160}`, { w: 8, opacity: 0.3, color: brand }),
    circle(C - 120, C + 10, 18, { color: cyan, opacity: 1 }),
    rect(C + 50, C - 8, 100, 36, { r: 10, color: brand, opacity: 0.7 }),
  ],

  // A thumb-reach arc sweeping to a round call button in the lower corner.
  'click-to-call-buttons': () => [
    stroke(`M ${C - 160} ${C - 120} A 300 300 0 0 0 ${C + 90} ${C + 100}`, { w: 8, opacity: 0.25, color: brand }),
    stroke(`M ${C - 160} ${C - 20} A 200 200 0 0 0 ${C + 40} ${C + 100}`, { w: 8, opacity: 0.35, color: brand }),
    circle(C + 100, C + 100, 70, { opacity: 1 }),
    stroke(`M ${C + 78} ${C + 78} c 0 25 15 40 40 40 l 8 -14 l -16 -10 l -8 6 c -8 -6 -12 -14 -14 -22 l 8 -8 l -10 -16 z`, { w: 7, color: ink, opacity: 1 }),
  ],

  // A calendar page beside a message bubble: pick a time, or describe the job.
  'booking-link-or-contact-form': () => [
    rect(C - 160, C - 100, 150, 180, { r: 20, fill: false, sw: 12 }),
    rect(C - 160, C - 100, 150, 46, { r: 20, color: brand, opacity: 0.6 }),
    circle(C - 120, C - 10, 10, { color: cyan, opacity: 0.4 }),
    circle(C - 80, C - 10, 10, { color: cyan, opacity: 1 }),
    rect(C + 20, C - 60, 150, 100, { r: 26, fill: false, sw: 12, color: brand, opacity: 0.9 }),
    stroke(`M ${C + 55} ${C - 25} H ${C + 135} M ${C + 55} ${C + 5} H ${C + 105}`, { w: 8, opacity: 0.8 }),
  ],
})
