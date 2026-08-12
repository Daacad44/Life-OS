/**
 * Audible alarm engine (Global Requirement A).
 *
 * Two sound sources:
 *  1. A **custom ringtone** the user uploaded (an MP3 URL) — played through an
 *     HTMLAudioElement on loop, exactly like a phone alarm.
 *  2. Built-in **preset chimes** synthesized with the Web Audio API — no binary
 *     asset to ship, each a distinct pattern the user can pick in Settings.
 *
 * A real alarm keeps ringing until you stop it. `playAlarm` therefore loops the
 * chosen sound for up to ~60 seconds (RING_DURATION_MS) or until `stop()` is
 * called — not a single short beep. Browsers block audio until the user
 * interacts with the page, so the context is created lazily and `unlockAudio()`
 * resumes it on the first gesture.
 */

export type AlarmSoundName = 'chime' | 'bell' | 'digital' | 'pulse' | 'marimba'

export const ALARM_SOUNDS: { value: AlarmSoundName; label: string }[] = [
  { value: 'chime', label: 'Chime' },
  { value: 'bell', label: 'Bell' },
  { value: 'digital', label: 'Digital' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'marimba', label: 'Marimba' },
]

/** How long an alarm rings before auto-stopping if the user never dismisses it. */
export const RING_DURATION_MS = 60_000

let ctx: AudioContext | null = null
let unlocked = false

type AudioCtor = typeof AudioContext

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor: AudioCtor | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  return ctx
}

/** Resume the audio context after a user gesture so alarms can play later. */
export function unlockAudio(): void {
  const c = getContext()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  unlocked = true
}

export function isAudioUnlocked(): boolean {
  return unlocked && !!ctx && ctx.state === 'running'
}

interface Note {
  freq: number
  /** Start offset from the pattern start, in seconds. */
  at: number
  /** Note length in seconds. */
  dur: number
  type?: OscillatorType
  /** Peak gain multiplier for this note (0-1). */
  gain?: number
}

// One cycle of each sound, described as a set of notes. `length` is the whole
// pattern duration used to space repeats.
const PATTERNS: Record<AlarmSoundName, { notes: Note[]; length: number }> = {
  chime: {
    notes: [
      { freq: 880, at: 0, dur: 0.28, type: 'sine' },
      { freq: 1108.7, at: 0.16, dur: 0.28, type: 'sine' },
      { freq: 1318.5, at: 0.32, dur: 0.45, type: 'sine' },
    ],
    length: 1.1,
  },
  bell: {
    notes: [
      { freq: 660, at: 0, dur: 0.9, type: 'sine', gain: 1 },
      { freq: 1320, at: 0, dur: 0.9, type: 'sine', gain: 0.35 },
      { freq: 1980, at: 0, dur: 0.6, type: 'sine', gain: 0.15 },
    ],
    length: 1.3,
  },
  digital: {
    notes: [
      { freq: 1046.5, at: 0, dur: 0.12, type: 'square', gain: 0.5 },
      { freq: 1046.5, at: 0.2, dur: 0.12, type: 'square', gain: 0.5 },
      { freq: 1046.5, at: 0.4, dur: 0.12, type: 'square', gain: 0.5 },
    ],
    length: 0.95,
  },
  pulse: {
    notes: [
      { freq: 784, at: 0, dur: 0.18, type: 'triangle', gain: 0.6 },
      { freq: 784, at: 0.3, dur: 0.18, type: 'triangle', gain: 0.6 },
    ],
    length: 0.85,
  },
  marimba: {
    notes: [
      { freq: 587.3, at: 0, dur: 0.22, type: 'triangle' },
      { freq: 880, at: 0.14, dur: 0.22, type: 'triangle' },
      { freq: 1174.7, at: 0.28, dur: 0.3, type: 'triangle' },
      { freq: 880, at: 0.46, dur: 0.3, type: 'triangle' },
    ],
    length: 1.15,
  },
}

function scheduleNote(
  c: AudioContext,
  note: Note,
  startAt: number,
  master: number,
  sink: OscillatorNode[],
) {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = note.type ?? 'sine'
  osc.frequency.value = note.freq
  const peak = master * (note.gain ?? 0.8)
  // Quick attack, exponential decay — reads as a struck/plucked tone.
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), startAt + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + note.dur)
  osc.connect(gain).connect(c.destination)
  osc.start(startAt)
  osc.stop(startAt + note.dur + 0.02)
  sink.push(osc)
}

export interface AlarmHandle {
  stop: () => void
}

const DEAD_HANDLE: AlarmHandle = { stop: () => {} }

export interface PlayAlarmOptions {
  sound?: AlarmSoundName
  /** 0-100. */
  volume?: number
  /** User's uploaded MP3. When set it plays instead of the synth preset. */
  ringtoneUrl?: string | null
  /** Total time to keep ringing before auto-stop. Defaults to RING_DURATION_MS. */
  durationMs?: number
}

/** Play the user's custom MP3 on loop until stopped or the duration elapses. */
function playRingtone(url: string, volume: number, durationMs: number): AlarmHandle {
  const audio = new Audio(url)
  audio.loop = true
  audio.volume = Math.min(Math.max(volume, 0), 100) / 100
  const autoStop = window.setTimeout(() => handle.stop(), durationMs)
  const handle: AlarmHandle = {
    stop: () => {
      window.clearTimeout(autoStop)
      audio.pause()
      audio.currentTime = 0
    },
  }
  void audio.play().catch(() => {
    // Autoplay blocked / audio unavailable — caller still shows the visual alarm.
    window.clearTimeout(autoStop)
  })
  return handle
}

/** Loop a synthesized preset chime until stopped or the duration elapses. */
function playSynth(
  sound: AlarmSoundName,
  volume: number,
  durationMs: number,
): AlarmHandle {
  const c = getContext()
  const master = Math.min(Math.max(volume, 0), 100) / 100
  if (!c || master === 0) return DEAD_HANDLE
  if (c.state === 'suspended') void c.resume()

  const pattern = PATTERNS[sound] ?? PATTERNS.chime
  const active: OscillatorNode[] = []
  let stopped = false

  const emitCycle = () => {
    if (stopped || !c) return
    const start = c.currentTime + 0.02
    for (const note of pattern.notes)
      scheduleNote(c, note, start + note.at, master, active)
  }

  emitCycle()
  const interval = window.setInterval(emitCycle, pattern.length * 1000)
  const autoStop = window.setTimeout(() => handle.stop(), durationMs)

  const handle: AlarmHandle = {
    stop: () => {
      stopped = true
      window.clearInterval(interval)
      window.clearTimeout(autoStop)
      for (const osc of active) {
        try {
          osc.stop()
        } catch {
          /* already stopped */
        }
      }
      active.length = 0
    },
  }
  return handle
}

/**
 * Play the chosen alarm — the user's uploaded MP3 if provided, else a preset
 * chime — looping for up to ~1 minute or until `stop()` is called. Returns a
 * handle whose `stop()` ends the sound immediately.
 */
export function playAlarm(options: PlayAlarmOptions = {}): AlarmHandle {
  const {
    sound = 'chime',
    volume = 70,
    ringtoneUrl = null,
    durationMs = RING_DURATION_MS,
  } = options
  if (volume <= 0) return DEAD_HANDLE
  if (ringtoneUrl) return playRingtone(ringtoneUrl, volume, durationMs)
  return playSynth(sound, volume, durationMs)
}

/** Fire-and-forget preview used by the Settings "Test" button (~2.5s). */
export function previewAlarm(
  sound: AlarmSoundName,
  volume: number,
  ringtoneUrl?: string | null,
): AlarmHandle {
  unlockAudio()
  return playAlarm({ sound, volume, ringtoneUrl, durationMs: 2500 })
}
