import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { CommandBar } from './CommandBar'

interface CommandBarContextValue {
  open: () => void
}

const CommandBarContext = createContext<CommandBarContextValue | null>(null)

/** Access the global command bar (e.g. the topbar button opens it). */
export function useCommandBar() {
  const ctx = useContext(CommandBarContext)
  if (!ctx) throw new Error('useCommandBar must be used within CommandBarProvider')
  return ctx
}

export function CommandBarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  // Cmd/Ctrl+K opens the bar from anywhere in the app.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <CommandBarContext.Provider value={{ open }}>
      {children}
      <CommandBar open={isOpen} onClose={close} />
    </CommandBarContext.Provider>
  )
}
