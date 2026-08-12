import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from './Modal'
import { ProgressBar } from './ProgressBar'
import { Tabs } from './Tabs'

describe('Tabs', () => {
  const items = [
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
  ] as const

  function Harness() {
    const [value, setValue] = useState<(typeof items)[number]['key']>('today')
    return (
      <Tabs items={items} value={value} onChange={setValue} ariaLabel="Task filters" />
    )
  }

  it('marks the active tab and switches on click', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.getByRole('tab', { name: 'Today' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await user.click(screen.getByRole('tab', { name: 'Completed' }))

    expect(screen.getByRole('tab', { name: 'Completed' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: 'Today' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('moves between tabs with the arrow keys and wraps at the ends', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.tab()
    expect(screen.getByRole('tab', { name: 'Today' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Upcoming' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Upcoming' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Completed' })).toHaveFocus()
  })
})

describe('ProgressBar', () => {
  it('exposes the clamped value to assistive tech', () => {
    render(<ProgressBar value={140} label="Run a Marathon" />)

    const bar = screen.getByRole('progressbar', { name: 'Run a Marathon' })
    expect(bar).toHaveAttribute('aria-valuenow', '100')
  })
})

describe('Modal', () => {
  it('closes on Escape and on a scrim click', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="New Goal">
        <input aria-label="Goal title" />
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'New Goal' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="New Goal">
        <p>hidden</p>
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Regression: a controlled input inside the modal must accept continuous
  // typing even when the parent passes a NEW onClose on every render (as the
  // Goals create form does). Previously the focus effect depended on onClose,
  // so each keystroke stole focus back and only the first letter registered.
  it('keeps input focus while typing when onClose is unstable', async () => {
    const user = userEvent.setup()

    function Harness() {
      const [title, setTitle] = useState('')
      return (
        // A fresh arrow fn each render == unstable onClose, like the real page.
        <Modal open onClose={() => {}} title="New goal">
          <input
            aria-label="Goal title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Modal>
      )
    }

    render(<Harness />)
    const input = screen.getByLabelText('Goal title') as HTMLInputElement

    await user.click(input)
    await user.keyboard('Learn Somali history')

    expect(input).toHaveValue('Learn Somali history')
    expect(input).toHaveFocus()
  })
})
