import { jsPDF } from 'jspdf'
import { contact } from './data/site.js'
import { money } from './packageQuote.js'

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
const BOTTOM = 700
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
  if (quote.errors?.length) throw new Error('Complete the custom quote details before downloading.')
  const pendingPages = quote.pendingPageRate !== undefined

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
    y = 180
    if (quote.clientName?.trim()) {
      const client = lines(`Prepared for: ${quote.clientName.trim().slice(0, 100)}`, WIDTH, 11, true)
      text(client, MARGIN, y, { size: 11, bold: true, lineHeightFactor: 15 / 11 })
      y += client.length * 15 + 6
    }
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
    const height = Math.max(label.length, amount.length) * 14 + 14
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
    if (row.description) {
      const scope = lines(row.description, WIDTH - 12 - indent, 9)
      let offset = 0
      while (offset < scope.length) {
        if (ensureSpace(30)) {
          tableHeader()
          text('Details, continued', MARGIN + 12, y + 16, { size: 9, bold: true, color: COLORS.muted })
          y += 28
        }
        const capacity = Math.max(1, Math.floor((BOTTOM - y - 12) / 13))
        const chunk = scope.slice(offset, offset + capacity)
        text(chunk, MARGIN + indent, y + 13, { size: 9, color: COLORS.muted, lineHeightFactor: 13 / 9 })
        y += chunk.length * 13 + 8
        offset += chunk.length
      }
    }
    doc.setDrawColor(COLORS.line)
    doc.line(MARGIN, y, RIGHT, y)
  })

  y += 16
  const savings = quote.bundleAmount + quote.firstMonthsFree
  const pendingNote = pendingPages ? lines(`Plus ${money(quote.pendingPageRateAfter)} per page${quote.pct ? ` after the ${quote.pct}% bundle discount` : ''}. Page count and final total to be confirmed.`, WIDTH, 9) : []
  ensureSpace(148 + (quote.monthly > 0 && quote.firstMonthsFree > 0 ? 22 : 0) + (quote.pct > 0 ? 22 : 0) + (quote.credit > 0 ? 22 : 0) + (savings > 0 ? 22 : 0) + pendingNote.length * 13 + (pendingPages ? 12 : 0))
  text('YOUR INVESTMENT', MARGIN, y + 9, { size: 9, bold: true, color: COLORS.blue })
  y += 29
  text(pendingPages ? 'Fixed fees subtotal (excludes page charges)' : 'One-time subtotal', MARGIN, y)
  text(money(quote.one), RIGHT, y, { bold: true, align: 'right' })
  if (quote.pct > 0) {
    y += 22
    text(`Bundle discount (${quote.pct}%)`, MARGIN, y)
    text(`-${money(quote.bundleAmount)}`, RIGHT, y, { bold: true, color: COLORS.blue, align: 'right' })
  }
  if (quote.credit > 0) {
    y += 22
    text(quote.creditLabel ? `Credit - ${quote.creditLabel}` : 'Credit applied', MARGIN, y)
    text(`-${money(quote.credit)}`, RIGHT, y, { bold: true, color: COLORS.blue, align: 'right' })
  }
  y += 17
  doc.setFillColor(COLORS.ink)
  doc.roundedRect(MARGIN, y, WIDTH, 82, 8, 8, 'F')
  doc.setFillColor(COLORS.cyan)
  doc.rect(MARGIN + 20, y + 65, 35, 3, 'F')
  text(pendingPages ? 'FIXED ONE-TIME FEES' : 'ONE-TIME TOTAL', MARGIN + 20, y + 22, { size: 9, color: COLORS.cyan })
  const totalText = money(quote.oneAfter)
  doc.setFont('Outfit', 'bold')
  doc.setFontSize(29)
  const totalSize = Math.min(29, 29 * 255 / doc.getTextWidth(totalText))
  text(totalText, MARGIN + 20, y + 54, { size: totalSize, bold: true, color: COLORS.white })
  text('ONGOING', MARGIN + 300, y + 22, { size: 9, color: COLORS.cyan })
  text(`${money(quote.monthly)} /mo`, MARGIN + 300, y + 54, { size: 24, bold: true, color: COLORS.white })
  y += 96
  if (pendingPages) {
    text(pendingNote, MARGIN, y, { size: 9, color: COLORS.muted, lineHeightFactor: 13 / 9 })
    y += pendingNote.length * 13 + 12
  }
  if (quote.monthly > 0 && quote.firstMonthsFree > 0) {
    text('Free-month savings', MARGIN, y)
    text(money(quote.firstMonthsFree), RIGHT, y, { bold: true, align: 'right' })
    y += 22
  }
  if (savings > 0) {
    text(pendingPages ? 'Savings on fixed fees and first month' : 'Total savings', MARGIN, y, { bold: true })
    text(money(savings), RIGHT, y, { bold: true, color: COLORS.blue, align: 'right' })
    y += 12
  }

  const quoteNotes = String(quote.notes ?? '').trim().slice(0, 4000)
  if (quoteNotes) {
    const noteLines = lines(quoteNotes, WIDTH, 10)
    y += 14
    ensureSpace(Math.min(noteLines.length, 4) * 14 + 40)
    text('NOTES', MARGIN, y + 9, { size: 9, bold: true, color: COLORS.blue })
    y += 29
    let offset = 0
    while (offset < noteLines.length) {
      if (ensureSpace(24)) {
        text('NOTES, CONTINUED', MARGIN, y + 9, { size: 9, bold: true, color: COLORS.blue })
        y += 29
      }
      const capacity = Math.max(1, Math.floor((BOTTOM - y) / 14))
      const chunk = noteLines.slice(offset, offset + capacity)
      text(chunk, MARGIN, y, { size: 10, lineHeightFactor: 1.4 })
      y += chunk.length * 14
      offset += chunk.length
    }
    y += 6
  }

  const notes = lines('Final scope and pricing are confirmed before work begins. One-time work is typically billed 50% to start and 50% on delivery. Monthly services have a recommended three-month minimum. Ad spend is separate.', WIDTH, 9)
  y += 8
  ensureSpace(notes.length * 13 + 43)
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
