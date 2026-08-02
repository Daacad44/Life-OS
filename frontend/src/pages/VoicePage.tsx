import { useEffect, useRef, useState } from 'react'
import { Mic, Square, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSendVoiceCommand } from '@/features/voice/hooks/useVoiceCommand'

interface HistoryItem {
  id: string
  text: string
  response: string
  actionTaken: string | null
}

function getRecognition(): SpeechRecognition | null {
  const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
  if (!Ctor) return null
  const recognition = new Ctor()
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = true
  return recognition
}

export function VoicePage() {
  const [supported] = useState(
    () =>
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  )
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const sendCommand = useSendVoiceCommand()

  function speak(text: string) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
  }

  function handleFinalTranscript(text: string) {
    sendCommand.mutate(text, {
      onSuccess: (result) => {
        setHistory((prev) => [
          {
            id: crypto.randomUUID(),
            text,
            response: result.response,
            actionTaken: result.actionTaken,
          },
          ...prev,
        ])
        speak(result.response)
        setTranscript('')
      },
    })
  }

  function handleStart() {
    const recognition = getRecognition()
    if (!recognition) return
    recognitionRef.current = recognition
    setTranscript('')
    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) finalText += result[0].transcript
        else interimText += result[0].transcript
      }
      if (finalText.trim()) {
        handleFinalTranscript(finalText.trim())
      } else {
        setTranscript(interimText)
      }
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.start()
    setListening(true)
  }

  function handleStop() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      window.speechSynthesis?.cancel()
    }
  }, [])

  if (!supported) {
    return (
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-2xl font-semibold text-text">Voice Assistant</h1>
        <p className="text-sm text-text-muted">
          Your browser doesn&apos;t support speech recognition. Try Chrome or Edge.
        </p>
      </div>
    )
  }

  return (
    <div className="flex max-w-2xl flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text">Voice Assistant</h1>
        <p className="text-text-muted">
          Add tasks, ask your coach, or check your day — hands-free.
        </p>
      </div>

      <Button
        size="lg"
        variant={listening ? 'destructive' : 'default'}
        onClick={listening ? handleStop : handleStart}
        className="size-20 rounded-full"
        aria-label={listening ? 'Stop listening' : 'Start listening'}
      >
        {listening ? <Square className="size-6" /> : <Mic className="size-6" />}
      </Button>

      {(listening || transcript) && (
        <p className="min-h-6 text-center text-sm text-text-muted">
          {transcript || 'Listening...'}
        </p>
      )}

      {sendCommand.isPending && <p className="text-sm text-text-muted">Thinking...</p>}

      <div className="flex w-full flex-col gap-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-1 rounded-md border border-border p-3"
          >
            <p className="text-xs text-text-muted">You said: &quot;{item.text}&quot;</p>
            <div className="flex items-start gap-2">
              <Volume2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm text-text">{item.response}</p>
            </div>
            {item.actionTaken && (
              <p className="text-xs text-success">✓ {item.actionTaken}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
