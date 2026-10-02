import { videoTranscripts } from '../data/videoTranscripts.js'

// A closed "Read the transcript" line under a video: what is said and what is
// shown, for anyone who cannot hear or see it. Nothing renders for a video
// without a transcript.
export default function VideoTranscript({ video }) {
  const lines = videoTranscripts[video]
  if (!lines) return null
  return (
    <details className="video-transcript">
      <summary>Read the transcript</summary>
      {lines.map(([who, text]) => (
        <p key={`${who}-${text.slice(0, 24)}`}>
          <strong>{who}:</strong> {text}
        </p>
      ))}
    </details>
  )
}
