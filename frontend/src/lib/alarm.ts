/**
 * Audible alarm engine (Global Requirement A).
 *
 * Alarm chimes are synthesized with the Web Audio API — no binary asset to ship,
 * and each sound is a distinct, recognisable pattern the user can pick in
 * Settings. Browsers block audio until the user interacts with the page, so the
 * context is created lazily and `unlockAudio()` resumes it on the first gesture.
 */

export type AlarmSoundName = 'chime' | 'bell' | 'digital' | 'pulse' | 'marimba'

export const ALARM_SOUNDS: { value: AlarmSoundName; label: string }[] = [
  { value: 'chime', label: 'Chime' },
  { value: 'bell', label: 'Bell' },
  { value: 'digital', label: 'Digital' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'marimba', label: 'Marimba' },
]

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

function scheduleNote(c: AudioContext, note: Note, startAt: number, master: number) {
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
}

export interface AlarmHandle {
  stop: () => void
}

/**
 * Play the chosen alarm sound, repeating a few times so it's hard to miss.
 * Returns a handle whose `stop()` cancels any not-yet-played repeats.
 * `volume` is 0-100. No-op (returns a dead handle) if audio isn't available.
 */
export function playAlarm(
  sound: AlarmSoundName = 'chime',
  volume = 70,
  repeats = 3,
): AlarmHandle {
  const c = getContext()
  const master = Math.min(Math.max(volume, 0), 100) / 100
  if (!c || master === 0) return { stop: () => {} }
  if (c.state === 'suspended') void c.resume()

  const pattern = PATTERNS[sound] ?? PATTERNS.chime
  const timeouts: ReturnType<typeof setTimeout>[] = []
  const base = c.currentTime + 0.02

  for (let r = 0; r < repeats; r++) {
    const cycleStart = base + r * pattern.length
    for (const note of pattern.notes) {
      scheduleNote(c, note, cycleStart + note.at, master)
    }
  }

  return {
    stop: () => {
      for (const t of timeouts) clearTimeout(t)
      // Notes already scheduled are short; nothing else to tear down.
    },
  }
}

/** Fire-and-forget preview used by the Settings "Test" button. */
export function previewAlarm(sound: AlarmSoundName, volume: number): void {
  unlockAudio()
  playAlarm(sound, volume, 1)
}
