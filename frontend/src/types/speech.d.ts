// Minimal Web Speech API surface — not part of TypeScript's standard DOM lib.
// Only the members Voice Assistant actually uses are declared.
interface SpeechRecognitionResultItem {
  transcript: string
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionResultItem
  isFinal: boolean
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResult>
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

interface Window {
  SpeechRecognition?: new () => SpeechRecognition
  webkitSpeechRecognition?: new () => SpeechRecognition
}
