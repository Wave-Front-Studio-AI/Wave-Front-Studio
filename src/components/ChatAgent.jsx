import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ArrowIcon, ChatIcon, CloseIcon, MailIcon, PhoneIcon, SendIcon, WaveGlyph } from './Icons.jsx'
import { contact, customWorkLinks, serviceLinks } from '../data/site.js'
import { deliverLead } from '../formSubmission.js'
import { CHIPS, HANDOFF_PHRASES, SUPPORTED_LANGUAGES, strings } from '../chatLocale.js'
import { Honeypot } from './shared.jsx'

const STORAGE_KEY = 'wavefront-chat-session'
const MAX_TRANSCRIPT_LENGTH = 5_000

// A visitor whose browser is set to Spanish should be greeted in Spanish before
// they have typed anything; what they actually type then decides the rest.
function browserLanguage() {
  if (typeof navigator === 'undefined') return 'en'
  for (const tag of navigator.languages ?? [navigator.language ?? 'en']) {
    const base = String(tag).slice(0, 2).toLowerCase()
    if (SUPPORTED_LANGUAGES.includes(base)) return base
  }
  return 'en'
}

function greetingFor(language) {
  return { id: 'greeting', role: 'agent', text: strings(language).greeting }
}

// The published services, so the request form can never offer something the
// site does not sell.
const HELP_TOPICS = [
  ...serviceLinks.map(([label]) => label),
  ...customWorkLinks.map(([label]) => label),
  'Something else',
]

let knowledgePromise = null
function loadKnowledge() {
  knowledgePromise ??= import('../chatKnowledge.js')
  return knowledgePromise
}

function readStoredMessages() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (Array.isArray(parsed) && parsed.length) return { messages: parsed }
    if (!parsed || !Array.isArray(parsed.messages) || !parsed.messages.length) return null
    return parsed
  } catch {
    return null
  }
}

// Answers stay in the browser. A free-form remote reply cannot be proven to come
// from the published site and would also disclose the visitor's conversation.
async function respond(question, language) {
  const knowledge = await loadKnowledge()
  return knowledge.answerQuestion(question, language)
}

function transcriptOf(messages) {
  const transcript = messages
    .filter((message) => message.id !== 'greeting')
    .map((message) => `${message.role === 'visitor' ? 'Visitor' : 'Assistant'}: ${message.text}`)
    .join('\n')
  if (transcript.length <= MAX_TRANSCRIPT_LENGTH) return transcript
  return `[Earlier messages omitted to keep the request within the delivery limit.]\n${transcript.slice(-MAX_TRANSCRIPT_LENGTH)}`
}

export default function ChatAgent() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState('chat')
  const [language, setLanguage] = useState('en')
  const [messages, setMessages] = useState([greetingFor('en')])
  const [chips, setChips] = useState(CHIPS.en)
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [status, setStatus] = useState('idle')
  const [ready, setReady] = useState(false)

  const panelId = useId()
  const inputRef = useRef(null)
  const logRef = useRef(null)
  const launcherRef = useRef(null)
  const closeRef = useRef(null)
  const doneRef = useRef(null)
  const chatTabRef = useRef(null)
  const formTabRef = useRef(null)
  const messagesRef = useRef(messages)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // The site is prerendered; a launcher in the static HTML would do nothing
  // until the bundle ran, so it appears with the JavaScript that powers it.
  useEffect(() => {
    setMounted(true)
    const initial = browserLanguage()
    const stored = readStoredMessages()
    const restoredLanguage = stored?.language ?? initial
    setLanguage(restoredLanguage)
    setMessages(stored?.messages ?? [greetingFor(initial)])
    setChips(stored?.chips ?? CHIPS[restoredLanguage] ?? CHIPS.en)
  }, [])

  // The index is a few hundred kilobytes of site content: it is fetched when
  // the visitor opens the panel, not on every page load.
  useEffect(() => {
    if (!open) return
    loadKnowledge().then(() => setReady(true))
  }, [open])

  useEffect(() => {
    if (!mounted) return
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        messages: messages.slice(-40),
        chips,
        language,
      }))
    } catch {
      // A blocked storage quota must never break the conversation.
    }
  }, [messages, chips, language, mounted])

  // Closing by any route returns focus to the launcher, so a keyboard visitor is
  // put back where they were rather than at the top of the document. It waits
  // for the render: on a phone the launcher is hidden until the sheet closes.
  const returnFocus = useRef(false)
  const close = useCallback(() => {
    returnFocus.current = true
    setOpen(false)
  }, [])

  useEffect(() => {
    if (open || !returnFocus.current) return
    returnFocus.current = false
    launcherRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  // On a phone the on-screen keyboard covers the bottom of the window without
  // changing 100vh, which would hide the composer the visitor is typing into.
  // visualViewport reports the height that is actually visible.
  useEffect(() => {
    if (!open) return undefined
    const viewport = window.visualViewport
    const root = document.documentElement
    const apply = () => {
      const height = viewport?.height ?? window.innerHeight
      const hidden = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0
      root.style.setProperty('--chat-viewport', `${Math.round(height)}px`)
      root.style.setProperty('--chat-offset', `${Math.round(hidden)}px`)
      setKeyboardOpen(hidden > 120)
    }
    apply()
    viewport?.addEventListener('resize', apply)
    viewport?.addEventListener('scroll', apply)
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    return () => {
      viewport?.removeEventListener('resize', apply)
      viewport?.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
      root.style.removeProperty('--chat-viewport')
      root.style.removeProperty('--chat-offset')
      setKeyboardOpen(false)
    }
  }, [open])

  // Stop the page behind the sheet from scrolling while it is open. The class
  // only locks scrolling inside the phone breakpoint, where the sheet covers
  // the page, so there the page is also taken out of reach of the keyboard and
  // screen readers, as it is for the menu.
  useEffect(() => {
    if (!open) return undefined
    document.body.classList.add('chat-open')
    const sheet = window.matchMedia('(max-width: 560px), (max-height: 480px) and (max-width: 900px)').matches
    const behind = sheet ? [...document.querySelectorAll('.skip-link, .site-header, main, .site-footer')] : []
    behind.forEach((node) => node.setAttribute('inert', ''))
    return () => {
      behind.forEach((node) => node.removeAttribute('inert'))
      document.body.classList.remove('chat-open')
    }
  }, [open])

  useEffect(() => {
    if (!open || view !== 'chat') return
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) inputRef.current?.focus()
  }, [open, view])

  // Touch screens skip the input (it would pop up the keyboard), and on a
  // phone the launcher hides behind the sheet, so focus goes to the close
  // button rather than dropping to the top of the page.
  useEffect(() => {
    if (open && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) closeRef.current?.focus()
  }, [open])

  // The thank-you replaces the form and its button, so focus moves to it.
  useEffect(() => {
    if (status === 'submitted') doneRef.current?.focus()
  }, [status])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const log = logRef.current
      if (log) log.scrollTop = log.scrollHeight
    })
    return () => window.cancelAnimationFrame(frame)
  }, [messages, thinking, view])

  const ask = useCallback(async (question) => {
    const text = question.trim()
    if (!text || thinking) return

    const visitorMessage = { id: `v-${Date.now()}`, role: 'visitor', text }
    const history = [...messagesRef.current, visitorMessage]
    setMessages(history)
    setDraft('')
    setChips([])
    setThinking(true)

    let answer
    try {
      answer = await respond(text, language)
      setReady(true)
    } catch {
      answer = {
        text: `I could not load the site content just then. Call ${contact.phone} or email ${contact.email} and someone will answer directly.`,
        links: [
          { label: `Call ${contact.phone}`, href: contact.phoneHref },
          { label: `Email ${contact.email}`, href: contact.emailHref },
        ],
        chips: [],
      }
    }

    setThinking(false)
    if (answer.language) setLanguage(answer.language)
    setMessages((current) => [...current, {
      id: `a-${Date.now()}`,
      role: 'agent',
      text: answer.text,
      links: answer.links ?? [],
    }])
    setChips(answer.chips ?? [])
    if (answer.action === 'form') setView('form')
  }, [thinking, language])

  const selectTab = useCallback((nextView, focus = false) => {
    setView(nextView)
    if (focus) {
      window.requestAnimationFrame(() => {
        (nextView === 'chat' ? chatTabRef : formTabRef).current?.focus()
      })
    }
  }, [])

  const onTabKeyDown = useCallback((event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    selectTab(event.key === 'ArrowLeft' || event.key === 'Home' ? 'chat' : 'form', true)
  }, [selectTab])

  // The chips are removed once one is used, taking focus with them, so a
  // keyboard visitor is moved on to the form tab or the composer.
  const onChip = useCallback((chip, viaKeyboard) => {
    if (HANDOFF_PHRASES.some((phrase) => chip.toLowerCase().includes(phrase))) {
      selectTab('form', viaKeyboard)
      return
    }
    ask(chip)
    if (viaKeyboard) inputRef.current?.focus()
  }, [ask, selectTab])

  async function submitRequest(event) {
    event.preventDefault()
    // The button stays focusable while sending, so a second press is ignored here.
    if (status === 'sending') return
    const form = event.currentTarget
    setStatus('sending')
    try {
      await deliverLead(form, {
        subject: `Website chat request: ${new FormData(form).get('topic')}`,
        source: 'chat',
        fields: [
          ['Name', 'name'],
          ['Company', 'company'],
          ['Email', 'email'],
          ['Phone', 'phone'],
          ['What they need help with', 'topic'],
          ['Message', 'message'],
          ['Page', 'page'],
          ['Visitor language', 'language'],
          ['Chat transcript', 'transcript'],
        ],
      })
      setStatus('submitted')
    } catch {
      setStatus('error')
    }
  }

  const copy = strings(language)
  if (!mounted) return null

  return (
    // The assistant answers in the visitor's language, so screen readers are
    // told which one to read it in.
    <div className={`chat-agent ${open ? 'is-open' : ''} ${keyboardOpen ? 'keyboard-open' : ''}`} lang={language}>
      <button
        type="button"
        className="chat-launcher"
        ref={launcherRef}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="chat-launcher-icon" aria-hidden="true">{open ? <CloseIcon /> : <ChatIcon />}</span>
        <span className="chat-launcher-label">{open ? copy.closeLabel : copy.open}</span>
      </button>

      <section
        id={panelId}
        className="chat-panel"
        role="dialog"
        aria-modal="false"
        aria-label={copy.title}
        hidden={!open}
      >
        <header className="chat-panel-head">
          <span className="chat-mark" aria-hidden="true">
            <WaveGlyph />
          </span>
          <div>
            <strong>{copy.title}</strong>
            <small>{ready ? copy.status : copy.loading}</small>
          </div>
          <button type="button" className="chat-close" ref={closeRef} onClick={close} aria-label={copy.close}>
            <CloseIcon />
          </button>
        </header>

        {/* Only the chosen panel is rendered, so only its tab points at it. */}
        <div className="chat-tabs" role="tablist" aria-label={copy.title} onKeyDown={onTabKeyDown}>
          <button id={`${panelId}-chat-tab`} ref={chatTabRef} type="button" role="tab" aria-controls={view === 'chat' ? `${panelId}-chat-panel` : undefined} aria-selected={view === 'chat'} tabIndex={view === 'chat' ? 0 : -1} className={view === 'chat' ? 'is-active' : ''} onClick={() => selectTab('chat')}>
            {copy.tabChat}
          </button>
          <button id={`${panelId}-form-tab`} ref={formTabRef} type="button" role="tab" aria-controls={view === 'form' ? `${panelId}-form-panel` : undefined} aria-selected={view === 'form'} tabIndex={view === 'form' ? 0 : -1} className={view === 'form' ? 'is-active' : ''} onClick={() => selectTab('form')}>
            {copy.tabForm}
          </button>
        </div>

        {view === 'chat' ? (
          <div id={`${panelId}-chat-panel`} className="chat-tab-panel" role="tabpanel" aria-labelledby={`${panelId}-chat-tab`}>
            <div className="chat-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions" aria-atomic="false" aria-label={copy.tabChat}>
              {messages.map((message) => (
                <article key={message.id} className={`chat-message chat-message-${message.role}`}>
                  <p>{message.text}</p>
                  {message.links?.length ? (
                    <div className="chat-links">
                      {message.links.map((link) => (
                        <a key={`${message.id}-${link.href}-${link.label}`} href={link.href}>
                          <span>{link.label}</span>
                          <ArrowIcon />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
              {thinking ? (
                <article className="chat-message chat-message-agent chat-typing" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </article>
              ) : null}
            </div>

            {chips.length ? (
              <div className="chat-chips">
                {chips.map((chip) => (
                  <button type="button" key={chip} onClick={(event) => onChip(chip, event.detail === 0)}>
                    {chip}
                  </button>
                ))}
              </div>
            ) : null}

            <form
              className="chat-composer"
              onSubmit={(event) => {
                event.preventDefault()
                ask(draft)
              }}
            >
              <label className="sr-only" htmlFor={`${panelId}-input`}>
                {copy.tabChat}
              </label>
              <input
                id={`${panelId}-input`}
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={copy.placeholder}
                autoComplete="off"
                maxLength={800}
              />
              {/* aria-disabled, not disabled: sending clears the draft, which
                  would otherwise disable the focused button and drop focus. */}
              <button type="submit" aria-disabled={!draft.trim() || thinking || undefined} aria-label={copy.send}>
                <SendIcon />
              </button>
            </form>
          </div>
        ) : (
          <div id={`${panelId}-form-panel`} className="chat-form-view" role="tabpanel" aria-labelledby={`${panelId}-form-tab`}>
            {status === 'submitted' ? (
              <div className="chat-form-done">
                <strong ref={doneRef} tabIndex={-1}>{copy.done}</strong>
                <p>{copy.doneBody}</p>
                <button
                  type="button"
                  className="chat-text-link"
                  onClick={() => {
                    setStatus('idle')
                    selectTab('chat', true)
                  }}
                >
                  {copy.back}
                </button>
              </div>
            ) : (
              <form className="chat-form" onSubmit={submitRequest}>
                <Honeypot />
                <p className="chat-form-intro">{copy.formIntro}</p>
                <label>
                  <span>{copy.name}</span>
                  <input required name="name" autoComplete="name" maxLength={150} />
                </label>
                <label>
                  <span>{copy.company}</span>
                  <input required name="company" autoComplete="organization" maxLength={200} />
                </label>
                <label>
                  <span>{copy.email}</span>
                  <input required type="email" name="email" autoComplete="email" maxLength={254} />
                </label>
                <label>
                  <span>{copy.phone}</span>
                  <input
                    required
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    pattern="(?:[^\d]*\d){7,}[^\d]*"
                    title="Enter a phone number with at least 7 digits."
                    maxLength={40}
                  />
                </label>
                <label className="chat-form-wide">
                  <span>{copy.topic}</span>
                  <select required name="topic" defaultValue="">
                    <option value="" disabled>
                      {copy.topicPlaceholder}
                    </option>
                    {HELP_TOPICS.map((topic) => (
                      <option key={topic}>{topic}</option>
                    ))}
                  </select>
                </label>
                <label className="chat-form-wide">
                  <span>{copy.message}</span>
                  <textarea required name="message" rows="3" placeholder={copy.messagePlaceholder} maxLength={1200} />
                </label>
                <input type="hidden" name="page" value={typeof window === 'undefined' ? '' : window.location.pathname} />
                <input type="hidden" name="language" value={language} />
                <input type="hidden" name="transcript" value={transcriptOf(messages) || 'No chat before this request.'} />
                <button className="kinetic-button group" type="submit" aria-disabled={status === 'sending' || undefined}>
                  <span>{status === 'sending' ? copy.sending : copy.submit}</span>
                  <span className="button-island">
                    <ArrowIcon className="size-4" />
                  </span>
                </button>
                <p className="form-status" role="status" aria-live="polite">
                  {status === 'error' ? copy.error : ''}
                </p>
              </form>
            )}

            <div className="chat-direct">
              <a href={contact.phoneHref}>
                <PhoneIcon />
                <span>{contact.phone}</span>
              </a>
              <a href={contact.emailHref}>
                <MailIcon />
                <span>{contact.email}</span>
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
