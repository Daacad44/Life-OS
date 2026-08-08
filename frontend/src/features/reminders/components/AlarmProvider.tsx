import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { BellRing, Check, Clock, X } from 'lucide-react'

import { Button } from '@/components/ui-kit'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { formatTime } from '@/lib/datetime'
import { playAlarm, unlockAudio, type AlarmSoundName } from '@/lib/alarm'
import type { PendingAlarm } from '@life-os/shared'
import {
  useAcknowledgeReminder,
  usePendingAlarms,
  useSnoozeReminder,
} from '../hooks/useReminders'

const SNOOZE_OPTIONS = [5, 10, 15]

const ENTITY_LABEL: Record<PendingAlarm['entityType'], string> = {
  task: 'Task',
  event: 'Event',
  habit: 'Habit',
  goal: 'Goal',
  subgoal: 'Sub-goal',
}

/**
 * System-wide reminder alarm (Global Requirement A). Mounted once inside the
 * authenticated shell. Polls for fired reminders, plays the user's chosen
 * audible alarm, and shows a dismissible alert per reminder with Snooze/Done.
 * Falls back to the Notifications API + vibration when the tab is hidden.
 */
export function AlarmProvider() {
  const { data: user } = useCurrentUser()
  const enabled = !!user
  const { data: alarms } = usePendingAlarms(enabled)
  const timezone = useUserTimezone()
  const acknowledge = useAcknowledgeReminder()
  const snooze = useSnoozeReminder()

  const soundEnabled = user?.soundEnabled ?? true
  const alarmSound = (user?.alarmSound ?? 'chime') as AlarmSoundName
  const alarmVolume = user?.alarmVolume ?? 70

  // IDs we've already sounded/notified for, so re-polls don't re-trigger.
  const announced = useRef<Set<string>>(new Set())

  // Unlock audio on the first user interaction (browser autoplay policy) and
  // ask for Notifications permission so hidden-tab fallback works.
  useEffect(() => {
    if (!enabled) return
    function onFirstInteraction() {
      unlockAudio()
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
    window.addEventListener('pointerdown', onFirstInteraction)
    window.addEventListener('keydown', onFirstInteraction)
    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission()
    }
    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
  }, [enabled])

  // When a new alarm appears, sound it + raise OS notification/vibration once.
  useEffect(() => {
    if (!alarms || alarms.length === 0) return
    for (const alarm of alarms) {
      if (announced.current.has(alarm.id)) continue
      announced.current.add(alarm.id)

      const label = `Reminder: ${alarm.entityTitle}`
      const at = formatTime(alarm.remindAt, timezone)
      const body = alarm.message || (at ? `Scheduled for ${at}` : 'It’s time.')

      if (soundEnabled) playAlarm(alarmSound, alarmVolume)

      // Visual/OS fallback — especially when the tab is hidden.
      if (
        typeof document !== 'undefined' &&
        document.visibilityState === 'hidden' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          new Notification(label, { body, tag: alarm.id })
        } catch {
          /* ignore — the in-app card still shows */
        }
      }
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([200, 100, 200])
        } catch {
          /* not supported */
        }
      }
    }
    // Forget IDs no longer pending so a future re-arm (snooze) re-announces.
    const live = new Set(alarms.map((a) => a.id))
    for (const id of announced.current) {
      if (!live.has(id)) announced.current.delete(id)
    }
  }, [alarms, soundEnabled, alarmSound, alarmVolume, timezone])

  if (!enabled || !alarms || alarms.length === 0) return null

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-3 p-4 sm:inset-x-auto sm:right-4 sm:items-end"
      role="alert"
      aria-live="assertive"
    >
      {alarms.map((alarm) => (
        <div
          key={alarm.id}
          className="w-full max-w-sm rounded-2xl border border-amber-500/60 bg-app-surface p-4 font-display text-app-ink shadow-[0_24px_48px_-16px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-500/15 text-amber-500">
              <BellRing size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-amber-500">
                {ENTITY_LABEL[alarm.entityType]} reminder
                {alarm.offsetLabel ? ` · ${alarm.offsetLabel}` : ''}
              </p>
              <p className="truncate text-sm font-extrabold">{alarm.entityTitle}</p>
              <p className="mt-0.5 text-xs font-medium text-app-ink-muted">
                {alarm.message || `Scheduled for ${formatTime(alarm.remindAt, timezone)}`}
              </p>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => acknowledge.mutate(alarm.id)}
              className="shrink-0 rounded-lg p-1 text-app-ink-muted hover:text-app-ink"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-semibold text-app-ink-muted">
              <Clock size={13} aria-hidden="true" /> Snooze
            </span>
            {SNOOZE_OPTIONS.map((m) => (
              <Button
                key={m}
                variant="surface"
                size="sm"
                disabled={snooze.isPending}
                onClick={() => snooze.mutate({ id: alarm.id, minutes: m })}
              >
                {m}m
              </Button>
            ))}
            <Button
              variant="navy"
              size="sm"
              className="ml-auto"
              disabled={acknowledge.isPending}
              onClick={() => acknowledge.mutate(alarm.id)}
            >
              <Check size={15} aria-hidden="true" /> Done
            </Button>
          </div>
        </div>
      ))}
    </div>,
    document.body,
  )
}
