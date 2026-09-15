import { jsPDF } from 'jspdf'
import { contact } from './data/site.js'

const COLORS = {
  ink: '#0d1b2a',
  blue: '#4284cb',
  cyan: '#36f0ee',
  muted: '#5c6f80',
  paper: '#f5f9fb',
  line: '#dce7ed',
  white: '#ffffff',
}
const MARGIN = 44
const RIGHT = 568
const WIDTH = RIGHT - MARGIN
const BOTTOM = 682
const money = (value) => `$${Math.round(value).toLocaleString('en-US')}`
const plain = (value) => String(value).replace(/[\u2010-\u2015]/g, '-').replace(/\u00a0/g, ' ')

function base64(bytes) {
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
  }
  return btoa(binary)
}

let brandAssets

export async function loadQuoteBrandAssets() {
  if (!brandAssets) {
    brandAssets = Promise.all([
      '/wp-content/uploads/2026/04/Wavefront-studio.jpg',
      '/fonts/outfit-quote-regular.ttf',
      '/fonts/outfit-quote-semibold.ttf',
    ].map(async (url) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Could not load the quote branding.')
      return new Uint8Array(await response.arrayBuffer())
    })).then(([logo, regular, semibold]) => ({ logo, regular, semibold }))
      .catch((error) => {
        brandAssets = undefined
        throw error
      })
  }
  return brandAssets
}

// The quote object is the same snapshot rendered by the package builder.
// Generating the file never sends the visitor's selections to a server.
export function createQuotePdf(quote, assets, createdAt = new Date()) {
  if (!quote.count || !quote.rows.length) throw new Error('Select a service before downloading a quote.')

  const doc = new jsPDF({ unit: 'pt', format: 'letter', compress: true, putOnlyUsedFonts: true })
  doc.addFileToVFS('Outfit-Regular.ttf', base64(assets.regular))
  doc.addFont('Outfit-Regular.ttf', 'Outfit', 'normal')
  doc.addFileToVFS('Outfit-Semibold.ttf', base64(assets.semibold))
  doc.addFont('Outfit-Semibold.ttf', 'Outfit', 'bold')
  doc.setProperties({
    title: 'Wavefront Studio - Package Quote',
    subject: 'Selected services, pricing, and bundle savings',
    author: 'Wavefront Studio LLC',
    creator: 'Wavefront Studio Package Builder',
  })
  doc.setCreationDate(createdAt)

  const date = createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  let y

  function text(value, x, top, { size = 10, bold = false, color = COLORS.ink, ...options } = {}) {
    doc.setFont('Outfit', bold ? 'bold' : 'normal')
    doc.setFontSize(size)
    doc.setTextColor(color)
    doc.text(Array.isArray(value) ? value.map(plain) : plain(value), x, top, options)
  }

  function lines(value, width, size = 10, bold = false) {
    doc.setFont('Outfit', bold ? 'bold' : 'normal')
    doc.setFontSize(size)
    return doc.splitTextToSize(plain(value), width)
  }

  function header(continued = false) {
    doc.setFillColor(COLORS.cyan)
    doc.rect(0, 0, 612, 5, 'F')
    doc.addImage(assets.logo, 'JPEG', MARGIN, 33, 178, 178 * 498 / 1591, 'wf-logo')
    text('PACKAGE QUOTE', RIGHT, 49, { bold: true, size: 10, color: COLORS.blue, align: 'right' })
    text(date, RIGHT, 66, { size: 9, color: COLORS.muted, align: 'right' })
    doc.setDrawColor(COLORS.line)
    doc.line(MARGIN, 107, RIGHT, 107)
    text(continued ? 'Your package, continued' : 'Your Wavefront package', MARGIN, 142, { size: 25, bold: true })
    text(`${quote.count} service${quote.count === 1 ? '' : 's'} selected  /  All prices in USD`, MARGIN, 163, { color: COLORS.muted })
    y = 185
  }

  function ensureSpace(height) {
    if (y + height <= BOTTOM) return false
    doc.addPage()
    header(true)
    return true
  }

  function tableHeader() {
    doc.setFillColor(COLORS.ink)
    doc.roundedRect(MARGIN, y, WIDTH, 28, 4, 4, 'F')
    text('SELECTED SERVICES', MARGIN + 12, y + 18, { size: 9, bold: true, color: COLORS.white })
    text('PRICE', RIGHT - 12, y + 18, { size: 9, bold: true, color: COLORS.white, align: 'right' })
    y += 28
  }

  header()
  tableHeader()
  let parentLabel = ''
  quote.rows.forEach((row, index) => {
    const indent = row.sub ? 24 : 12
    const label = lines(`${row.sub ? '+ ' : ''}${row.label}`, 322 - indent, 10.5, !row.sub)
    const amount = lines(row.amount, 165, 10.5, true)
    const height = Math.max(label.length, amount.length) * 14 + 20
    if (ensureSpace(height + (row.sub ? 34 : 0))) {
      tableHeader()
      if (row.sub) {
        const continuation = lines(`${parentLabel} (continued)`, WIDTH - 24, 9)
        text(continuation, MARGIN + 12, y + 16, { size: 9, color: COLORS.muted, lineHeightFactor: 1.4 })
        y += continuation.length * 13 + 10
      }
    }
    if (!row.sub) parentLabel = row.label
    if (index % 2 === 0) {
      doc.setFillColor(COLORS.paper)
      doc.rect(MARGIN, y, WIDTH, height, 'F')
    }
    text(label, MARGIN + indent, y + 21, { size: 10.5, bold: !row.sub, color: row.sub ? COLORS.muted : COLORS.ink, lineHeightFactor: 14 / 10.5 })
    text(amount, RIGHT - 12, y + 21, { size: 10.5, bold: true, align: 'right', lineHeightFactor: 14 / 10.5 })
    y += height
    doc.setDrawColor(COLORS.line)
    doc.line(MARGIN, y, RIGHT, y)
  })

  y += 24
  const savings = quote.bundleAmount + quote.firstMonthsFree
  ensureSpace(148 + (quote.pct > 0 ? 22 : 0) + (quote.monthly > 0 ? 44 : 0) + (savings > 0 ? 22 : 0))
  text('YOUR INVESTMENT', MARGIN, y + 9, { size: 9, bold: true, color: COLORS.blue })
  y += 33
  text('One-time subtotal', MARGIN, y)
  text(money(quote.one), RIGHT, y, { bold: true, align: 'right' })
  if (quote.pct > 0) {
    y += 22
    text(`Bundle discount (${quote.pct}%)`, MARGIN, y)
    text(`-${money(quote.bundleAmount)}`, RIGHT, y, { bold: true, color: COLORS.blue, align: 'right' })
  }
  y += 17
  doc.setFillColor(COLORS.ink)
  doc.roundedRect(MARGIN, y, WIDTH, 82, 8, 8, 'F')
  doc.setFillColor(COLORS.cyan)
  doc.rect(MARGIN + 20, y + 65, 35, 3, 'F')
  text('ONE-TIME TOTAL', MARGIN + 20, y + 22, { size: 9, color: COLORS.cyan })
  text(money(quote.oneAfter), MARGIN + 20, y + 54, { size: 29, bold: true, color: COLORS.white })
  text('ONGOING', MARGIN + 300, y + 22, { size: 9, color: COLORS.cyan })
  text(`${money(quote.monthly)} /mo`, MARGIN + 300, y + 54, { size: 24, bold: true, color: COLORS.white })
  y += 104
  if (quote.monthly > 0) {
    if (quote.firstMonthsFree > 0) {
      text('Free-month savings', MARGIN, y)
      text(money(quote.firstMonthsFree), RIGHT, y, { bold: true, align: 'right' })
      y += 22
    }
    text('Estimated first-year total (after savings)', MARGIN, y)
    text(money(quote.oneAfter + quote.monthly * 12 - quote.firstMonthsFree), RIGHT, y, { bold: true, align: 'right' })
    y += 22
  }
  if (savings > 0) {
    text('Total savings', MARGIN, y, { bold: true })
    text(money(savings), RIGHT, y, { bold: true, color: COLORS.blue, align: 'right' })
    y += 22
  }

  const notes = lines('Estimates for standard scopes. Final scope and quote are confirmed on a quick call. One-time builds are typically billed 50% to start and 50% on delivery. Monthly services have a recommended three-month minimum. Ad spend is billed separately by the ad platform.', WIDTH, 9)
  y += 12
  ensureSpace(notes.length * 13 + 67)
  text('NEXT STEPS', MARGIN, y + 9, { size: 9, bold: true, color: COLORS.blue })
  text(`Share this quote with ${contact.email} to confirm your package.`, MARGIN, y + 29, { size: 10 })
  text(notes, MARGIN, y + 52, { size: 9, color: COLORS.muted, lineHeightFactor: 13 / 9 })

  const pages = doc.getNumberOfPages()
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page)
    doc.setDrawColor(COLORS.line)
    doc.line(MARGIN, 716, RIGHT, 716)
    text('Wavefront Studio LLC', MARGIN, 734, { bold: true, size: 9 })
    text(`${contact.supportPhone}  |  ${contact.email}`, MARGIN, 750, { size: 8.5, color: COLORS.muted })
    text('wavefrontstudiollc.com', RIGHT, 734, { size: 8.5, align: 'right' })
    text(`${contact.address}  |  ${page} / ${pages}`, RIGHT, 766, { size: 8, color: COLORS.muted, align: 'right' })
  }
  return doc
}

export async function downloadQuotePdf(quote) {
  const assets = await loadQuoteBrandAssets()
  const createdAt = new Date()
  const date = [createdAt.getFullYear(), String(createdAt.getMonth() + 1).padStart(2, '0'), String(createdAt.getDate()).padStart(2, '0')].join('-')
  const doc = createQuotePdf(quote, assets, createdAt)
  await doc.save(`Wavefront-Studio-Quote-${date}.pdf`, { returnPromise: true })
}
