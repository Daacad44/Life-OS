import { useRef, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

export interface TabItem<T extends string = string> {
  key: T
  label: string
}

export interface TabsProps<T extends string = string> {
  items: ReadonlyArray<TabItem<T>>
  value: T
  onChange: (key: T) => void
  /** Names the tablist for screen readers, e.g. "Task filters". */
  ariaLabel: string
  /** When the tabs control a panel, pass its id prefix to wire aria-controls. */
  panelIdPrefix?: string
  className?: string
}

/**
 * The segmented control used by Tasks, Goals, Habits, Calendar, Notifications,
 * and Settings: a slate track with a white raised pill on the active tab.
 *
 * Arrow keys / Home / End move between tabs with a roving tabindex, per the
 * WAI-ARIA tabs pattern.
 */
export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  ariaLabel,
  panelIdPrefix,
  className,
}: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null)

  function focusTabAt(index: number) {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    buttons?.[index]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = items.findIndex((item) => item.key === value)
    if (currentIndex < 0) return

    let nextIndex: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % items.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + items.length) % items.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = items.length - 1
    }

    if (nextIndex === null) return
    event.preventDefault()
    onChange(items[nextIndex].key)
    focusTabAt(nextIndex)
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn('flex w-fit gap-1.5 rounded-[11px] bg-app-raised p-1', className)}
    >
      {items.map((item) => {
        const active = item.key === value
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelIdPrefix ? `${panelIdPrefix}-${item.key}` : undefined}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.key)}
            className={cn(
              'cursor-pointer rounded-[9px] px-4 py-2 font-display text-[13px] transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
              'pointer-coarse:min-h-11',
              active
                ? 'bg-app-surface font-bold text-app-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                : 'font-semibold text-app-ink-muted hover:text-app-ink',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
