import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { ONE_DOLLAR_AD } from '../data/oneDollarPage.js'
import { track } from '../oneDollarTrack.js'

// The 12 second ad. The prerendered page holds only a link and a poster, so
// no video file loads until someone taps. Before the page wakes up, the tap
// follows the link and the browser plays the file itself.
export default function AdVideo() {
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)

  function play(event) {
    event.preventDefault()
    // Mount the video inside the tap, then start it in the same tap, so phones allow sound.
    flushSync(() => setPlaying(true))
    ref.current?.focus({ preventScroll: true })
    ref.current?.play().catch(() => {})
    track('od_video_play')
  }

  return (
    <div className="od-video">
      {playing ? (
        <video ref={ref} controls playsInline preload="none" poster={ONE_DOLLAR_AD.poster} aria-label={ONE_DOLLAR_AD.alt} onEnded={() => track('od_video_complete')}>
          <source src={ONE_DOLLAR_AD.video} type="video/mp4" />
        </video>
      ) : (
        <a className="od-video-link" href={ONE_DOLLAR_AD.video} onClick={play} aria-label="Play the video">
          <img src={ONE_DOLLAR_AD.poster} alt={ONE_DOLLAR_AD.alt} width={ONE_DOLLAR_AD.width} height={ONE_DOLLAR_AD.height} fetchPriority="high" decoding="async" />
          <span className="od-video-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
          </span>
        </a>
      )}
    </div>
  )
}
